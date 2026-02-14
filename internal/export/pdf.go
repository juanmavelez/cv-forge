package export

import (
	"bytes"
	"fmt"
	"strings"

	"github.com/cv-forge/cv-forge/internal/export/fonts"
	"github.com/cv-forge/cv-forge/internal/models"
	"github.com/go-pdf/fpdf"
)

const fontFamily = "DejaVu"

// registerUTF8Fonts loads the embedded DejaVu Sans TTF files so that the
// PDF supports the full Unicode range (accented chars, bullets, dashes, etc).
func registerUTF8Fonts(pdf *fpdf.Fpdf) {
	for _, f := range []struct {
		style string
		file  string
	}{
		{"", "DejaVuSans.ttf"},
		{"B", "DejaVuSans-Bold.ttf"},
		{"I", "DejaVuSans-Oblique.ttf"},
		{"BI", "DejaVuSans-BoldOblique.ttf"},
	} {
		data, _ := fonts.FS.ReadFile(f.file)
		pdf.AddUTF8FontFromBytes(fontFamily, f.style, data)
	}
}

var (
	defaultTitle1 = models.FontStyle{Size: 18, Color: []int{20, 20, 20}}
	defaultTitle2 = models.FontStyle{Size: 13, Color: []int{78, 107, 138}, Bold: true}
	defaultText1  = models.FontStyle{Size: 11, Color: []int{30, 30, 30}, Bold: true}
	defaultText2  = models.FontStyle{Size: 10, Color: []int{40, 40, 40}}
	defaultSub    = models.FontStyle{Size: 10, Color: []int{80, 80, 80}}
)

func setStyle(pdf *fpdf.Fpdf, s models.FontStyle) {
	style := ""
	if s.Bold {
		style += "B"
	}
	if s.Italic {
		style += "I"
	}
	pdf.SetFont(fontFamily, style, s.Size)
	if len(s.Color) == 3 {
		pdf.SetTextColor(s.Color[0], s.Color[1], s.Color[2])
	}
}

// GeneratePDF creates a clean one-column PDF from CV data.
func GeneratePDF(cv *models.CV) ([]byte, error) {
	pdf := fpdf.New("P", "mm", "A4", "")
	pdf.SetMargins(25, 25, 25)
	pdf.SetAutoPageBreak(true, 25)

	registerUTF8Fonts(pdf)

	pdf.AddPage()

	d := cv.Data
	pageWidth, _ := pdf.GetPageSize()
	usableWidth := pageWidth - 50 // 25mm margins on each side

	// Initialize styles with defaults, then override if present in CV data
	title1 := defaultTitle1
	title2 := defaultTitle2
	text1 := defaultText1
	text2 := defaultText2
	sub := defaultSub

	if d.Style != nil {
		if d.Style.Title1.Size > 0 {
			title1 = d.Style.Title1
		}
		if d.Style.Title2.Size > 0 {
			title2 = d.Style.Title2
		}
		if d.Style.Text1.Size > 0 {
			text1 = d.Style.Text1
		}
		if d.Style.Text2.Size > 0 {
			text2 = d.Style.Text2
		}
		if d.Style.Sub.Size > 0 {
			sub = d.Style.Sub
		}
	}

	// --- Name ---
	setStyle(pdf, title1)
	name := strings.TrimSpace(d.Personal.FirstName + " " + d.Personal.LastName)
	if name == "" {
		name = cv.Title
	}
	pdf.CellFormat(0, 9, name, "", 1, "C", false, 0, "")
	pdf.Ln(3)

	// --- Professional Title ---
	if d.Personal.Title != "" {
		setStyle(pdf, models.FontStyle{Size: 14, Color: title1.Color, Bold: true})
		pdf.CellFormat(0, 8, d.Personal.Title, "", 1, "C", false, 0, "")
		pdf.Ln(3)
	}

	// --- Contact info ---
	contactParts := []string{}
	if d.Personal.Email != "" {
		contactParts = append(contactParts, d.Personal.Email)
	}
	if d.Personal.Phone != "" {
		contactParts = append(contactParts, d.Personal.Phone)
	}
	if d.Personal.LinkedIn != "" {
		contactParts = append(contactParts, d.Personal.LinkedIn)
	}
	if d.Personal.Website != "" {
		contactParts = append(contactParts, d.Personal.Website)
	}
	if d.Personal.Location != "" {
		contactParts = append(contactParts, d.Personal.Location)
	}
	if len(contactParts) > 0 {
		setStyle(pdf, sub)
		pdf.CellFormat(0, 5, strings.Join(contactParts, "  |  "), "", 1, "C", false, 0, "")
	}
	pdf.Ln(6)

	// --- Summary ---
	if d.Summary != "" {
		renderSectionHeading(pdf, "Summary", title2)
		setStyle(pdf, text2)
		pdf.MultiCell(0, 5, d.Summary, "", "L", false)
		pdf.Ln(5)
	}

	// --- Skills ---
	if len(d.Skills) > 0 {
		renderSectionHeading(pdf, "Skills", title2)
		for _, sg := range d.Skills {
			renderBulletText(pdf, sg.Category+": "+strings.Join(sg.Items, ", "), usableWidth, text2)
			pdf.Ln(1)
		}
		pdf.Ln(4)
	}

	// --- Experience ---
	if len(d.Experience) > 0 {
		renderSectionHeading(pdf, "Professional Experience", title2)
		for _, exp := range d.Experience {
			header := exp.Title
			if exp.Company != "" {
				header += " | " + exp.Company
			}
			if exp.Location != "" {
				header += " (" + exp.Location + ")"
			}
			setStyle(pdf, text1)
			pdf.CellFormat(0, 6, header, "", 1, "L", false, 0, "")

			dateStr := formatDateRange(exp.StartDate, exp.EndDate, exp.Current)
			if dateStr != "" {
				setStyle(pdf, models.FontStyle{Size: sub.Size, Color: sub.Color, Italic: true})
				pdf.CellFormat(0, 5, " "+dateStr, "", 1, "L", false, 0, "")
			}
			pdf.Ln(2)

			if exp.Description != "" {
				lines := splitDescriptionLines(exp.Description)
				for _, line := range lines {
					renderBulletText(pdf, line, usableWidth, text2)
					pdf.Ln(1)
				}
			}
			pdf.Ln(3)
		}
		pdf.Ln(2)
	}

	// --- Education ---
	if len(d.Education) > 0 {
		renderSectionHeading(pdf, "Education", title2)
		for _, edu := range d.Education {
			degreeField := edu.Degree
			if edu.Field != "" {
				degreeField += " in " + edu.Field
			}
			header := degreeField
			if edu.Institution != "" {
				header += " | " + edu.Institution
			}
			setStyle(pdf, text1)
			pdf.CellFormat(0, 6, header, "", 1, "L", false, 0, "")

			dateStr := formatDateRange(edu.StartDate, edu.EndDate, false)
			if dateStr != "" {
				setStyle(pdf, models.FontStyle{Size: sub.Size, Color: sub.Color, Italic: true})
				pdf.CellFormat(0, 5, " "+dateStr, "", 1, "L", false, 0, "")
			}

			if edu.Description != "" {
				pdf.Ln(2)
				setStyle(pdf, text2)
				pdf.MultiCell(0, 5, edu.Description, "", "L", false)
			}
			pdf.Ln(3)
		}
		pdf.Ln(2)
	}

	// --- Languages ---
	if len(d.Languages) > 0 {
		renderSectionHeading(pdf, "Languages", title2)
		for _, lang := range d.Languages {
			text := lang.Language
			if lang.Proficiency != "" {
				text += ": " + lang.Proficiency
			}
			renderBulletText(pdf, text, usableWidth, text2)
			pdf.Ln(1)
		}
		pdf.Ln(4)
	}

	// --- Certifications ---
	if len(d.Certifications) > 0 {
		renderSectionHeading(pdf, "Certifications", title2)
		for _, cert := range d.Certifications {
			header := cert.Name
			if cert.Issuer != "" {
				header += " | " + cert.Issuer
			}
			setStyle(pdf, text1)
			pdf.CellFormat(0, 5, header, "", 1, "L", false, 0, "")

			if cert.Date != "" {
				setStyle(pdf, models.FontStyle{Size: sub.Size, Color: sub.Color, Italic: true})
				pdf.CellFormat(0, 5, cert.Date, "", 1, "L", false, 0, "")
			}
			pdf.Ln(2)
		}
	}

	var buf bytes.Buffer
	if err := pdf.Output(&buf); err != nil {
		return nil, fmt.Errorf("pdf output: %w", err)
	}
	return buf.Bytes(), nil
}

// renderSectionHeading renders a section title using the provided style.
func renderSectionHeading(pdf *fpdf.Fpdf, title string, style models.FontStyle) {
	setStyle(pdf, style)
	pdf.CellFormat(0, 7, title, "", 1, "L", false, 0, "")
	pdf.Ln(2)
}

// renderBulletText renders a bullet-pointed line using the provided style.
func renderBulletText(pdf *fpdf.Fpdf, text string, usableWidth float64, style models.FontStyle) {
	setStyle(pdf, style)
	bullet := "    •   "
	bulletW := pdf.GetStringWidth(bullet)
	pdf.CellFormat(bulletW, 5, bullet, "", 0, "L", false, 0, "")
	pdf.MultiCell(usableWidth-bulletW, 5, text, "", "L", false)
}

// splitDescriptionLines splits a description into individual lines,
// treating each non-empty line as a separate bullet point.
func splitDescriptionLines(desc string) []string {
	raw := strings.Split(desc, "\n")
	var lines []string
	for _, l := range raw {
		l = strings.TrimSpace(l)
		// Strip leading bullet characters that the user may have typed
		l = strings.TrimLeft(l, "•·–—-*● ")
		l = strings.TrimSpace(l)
		if l != "" {
			lines = append(lines, l)
		}
	}
	// If no newlines were found, return the whole description as one item
	if len(lines) == 0 && strings.TrimSpace(desc) != "" {
		lines = append(lines, strings.TrimSpace(desc))
	}
	return lines
}

func formatDateRange(start, end string, current bool) string {
	if start == "" && end == "" && !current {
		return ""
	}

	formatDate := func(s string) string {
		if s == "" {
			return ""
		}
		parts := strings.Split(s, "-")
		if len(parts) != 2 {
			return s
		}
		year := parts[0]
		month := parts[1]
		months := []string{"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"}
		m := 0
		fmt.Sscanf(month, "%d", &m)
		if m >= 1 && m <= 12 {
			return months[m-1] + " " + year
		}
		return year
	}

	sFormatted := formatDate(start)
	if current {
		return sFormatted + " – Present"
	}

	eFormatted := formatDate(end)
	if sFormatted != "" && eFormatted != "" {
		return sFormatted + " – " + eFormatted
	}
	if sFormatted != "" {
		return sFormatted
	}
	return eFormatted
}

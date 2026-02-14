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

// GeneratePDF creates a clean one-column PDF from CV data, styled to match
// the reference CV layout: centered header, slate-blue section titles in
// Title Case without underlines, bullet-pointed lists, and generous spacing.
func GeneratePDF(cv *models.CV) ([]byte, error) {
	pdf := fpdf.New("P", "mm", "A4", "")
	pdf.SetMargins(25, 25, 25)
	pdf.SetAutoPageBreak(true, 25)

	registerUTF8Fonts(pdf)

	pdf.AddPage()

	d := cv.Data
	pageWidth, _ := pdf.GetPageSize()
	usableWidth := pageWidth - 50 // 25mm margins on each side

	// --- Name ---
	pdf.SetFont(fontFamily, "", 18)
	pdf.SetTextColor(20, 20, 20)
	name := strings.TrimSpace(d.Personal.FirstName + " " + d.Personal.LastName)
	if name == "" {
		name = cv.Title
	}
	pdf.CellFormat(0, 9, name, "", 1, "C", false, 0, "")
	pdf.Ln(3)

	// --- Professional Title ---
	if d.Personal.Title != "" {
		pdf.SetFont(fontFamily, "B", 14)
		pdf.SetTextColor(20, 20, 20)
		pdf.CellFormat(0, 8, d.Personal.Title, "", 1, "C", false, 0, "")
		pdf.Ln(3)
	}

	// --- Contact info (single centred line) ---
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
		pdf.SetFont(fontFamily, "", 10)
		pdf.SetTextColor(80, 80, 80)
		pdf.CellFormat(0, 5, strings.Join(contactParts, "  |  "), "", 1, "C", false, 0, "")
	}
	pdf.Ln(6)

	// --- Summary ---
	if d.Summary != "" {
		sectionHeading(pdf, "Summary")
		pdf.SetFont(fontFamily, "", 10)
		pdf.SetTextColor(40, 40, 40)
		pdf.MultiCell(0, 5, d.Summary, "", "L", false)
		pdf.Ln(5)
	}

	// --- Skills ---
	if len(d.Skills) > 0 {
		sectionHeading(pdf, "Skills")
		for _, sg := range d.Skills {
			bulletText(pdf, sg.Category+": "+strings.Join(sg.Items, ", "), usableWidth)
			pdf.Ln(1)
		}
		pdf.Ln(4)
	}

	// --- Experience ---
	if len(d.Experience) > 0 {
		sectionHeading(pdf, "Professional Experience")
		for _, exp := range d.Experience {
			// Title | Company (Location) — bold line
			header := exp.Title
			if exp.Company != "" {
				header += " | " + exp.Company
			}
			if exp.Location != "" {
				header += " (" + exp.Location + ")"
			}
			pdf.SetFont(fontFamily, "B", 11)
			pdf.SetTextColor(30, 30, 30)
			pdf.CellFormat(0, 6, header, "", 1, "L", false, 0, "")

			// Dates — italic
			dateStr := formatDateRange(exp.StartDate, exp.EndDate, exp.Current)
			if dateStr != "" {
				pdf.SetFont(fontFamily, "I", 10)
				pdf.SetTextColor(80, 80, 80)
				pdf.CellFormat(0, 5, " "+dateStr, "", 1, "L", false, 0, "")
			}
			pdf.Ln(2)

			// Description — bullet points (split by newlines)
			if exp.Description != "" {
				lines := splitDescriptionLines(exp.Description)
				for _, line := range lines {
					bulletText(pdf, line, usableWidth)
					pdf.Ln(1)
				}
			}
			pdf.Ln(3)
		}
		pdf.Ln(2)
	}

	// --- Education ---
	if len(d.Education) > 0 {
		sectionHeading(pdf, "Education")
		for _, edu := range d.Education {
			degreeField := edu.Degree
			if edu.Field != "" {
				degreeField += " in " + edu.Field
			}
			header := degreeField
			if edu.Institution != "" {
				header += " | " + edu.Institution
			}
			pdf.SetFont(fontFamily, "B", 11)
			pdf.SetTextColor(30, 30, 30)
			pdf.CellFormat(0, 6, header, "", 1, "L", false, 0, "")

			dateStr := formatDateRange(edu.StartDate, edu.EndDate, false)
			if dateStr != "" {
				pdf.SetFont(fontFamily, "I", 10)
				pdf.SetTextColor(80, 80, 80)
				pdf.CellFormat(0, 5, " "+dateStr, "", 1, "L", false, 0, "")
			}

			if edu.Description != "" {
				pdf.Ln(2)
				pdf.SetFont(fontFamily, "", 10)
				pdf.SetTextColor(40, 40, 40)
				pdf.MultiCell(0, 5, edu.Description, "", "L", false)
			}
			pdf.Ln(3)
		}
		pdf.Ln(2)
	}

	// --- Languages ---
	if len(d.Languages) > 0 {
		sectionHeading(pdf, "Languages")
		for _, lang := range d.Languages {
			text := lang.Language
			if lang.Proficiency != "" {
				text += ": " + lang.Proficiency
			}
			bulletText(pdf, text, usableWidth)
			pdf.Ln(1)
		}
		pdf.Ln(4)
	}

	// --- Certifications ---
	if len(d.Certifications) > 0 {
		sectionHeading(pdf, "Certifications")
		for _, cert := range d.Certifications {
			header := cert.Name
			if cert.Issuer != "" {
				header += " | " + cert.Issuer
			}
			pdf.SetFont(fontFamily, "B", 10)
			pdf.SetTextColor(30, 30, 30)
			pdf.CellFormat(0, 5, header, "", 1, "L", false, 0, "")

			if cert.Date != "" {
				pdf.SetFont(fontFamily, "I", 10)
				pdf.SetTextColor(80, 80, 80)
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

// sectionHeading renders a slate-blue Title Case heading with no underline.
func sectionHeading(pdf *fpdf.Fpdf, title string) {
	pdf.SetFont(fontFamily, "B", 13)
	// Slate blue matching the target PDF
	pdf.SetTextColor(78, 107, 138)
	pdf.CellFormat(0, 7, title, "", 1, "L", false, 0, "")
	pdf.Ln(2)
}

// bulletText renders a bullet-pointed line: "• text".
func bulletText(pdf *fpdf.Fpdf, text string, usableWidth float64) {
	pdf.SetFont(fontFamily, "", 10)
	pdf.SetTextColor(40, 40, 40)
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

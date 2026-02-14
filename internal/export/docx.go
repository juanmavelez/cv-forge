package export

import (
	"archive/zip"
	"bytes"
	"encoding/xml"
	"fmt"
	"strings"

	"github.com/cv-forge/cv-forge/internal/models"
)

// GenerateDOCX creates a DOCX file from CV data by building the Open XML structure.
func GenerateDOCX(cv *models.CV) ([]byte, error) {
	var buf bytes.Buffer
	zw := zip.NewWriter(&buf)

	// [Content_Types].xml
	if err := addZipFile(zw, "[Content_Types].xml", contentTypesXML()); err != nil {
		return nil, err
	}

	// _rels/.rels
	if err := addZipFile(zw, "_rels/.rels", relsXML()); err != nil {
		return nil, err
	}

	// word/_rels/document.xml.rels
	if err := addZipFile(zw, "word/_rels/document.xml.rels", documentRelsXML()); err != nil {
		return nil, err
	}

	// word/styles.xml
	if err := addZipFile(zw, "word/styles.xml", stylesXML()); err != nil {
		return nil, err
	}

	// word/document.xml
	docXML, err := documentXML(cv)
	if err != nil {
		return nil, fmt.Errorf("generate document.xml: %w", err)
	}
	if err := addZipFile(zw, "word/document.xml", docXML); err != nil {
		return nil, err
	}

	if err := zw.Close(); err != nil {
		return nil, err
	}
	return buf.Bytes(), nil
}

func addZipFile(zw *zip.Writer, name, content string) error {
	w, err := zw.Create(name)
	if err != nil {
		return err
	}
	_, err = w.Write([]byte(content))
	return err
}

func contentTypesXML() string {
	return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>`
}

func relsXML() string {
	return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`
}

func documentRelsXML() string {
	return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`
}

func stylesXML() string {
	return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal">
    <w:name w:val="Normal"/>
    <w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:sz w:val="22"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading1">
    <w:name w:val="heading 1"/>
    <w:pPr><w:spacing w:before="240" w:after="60"/></w:pPr>
    <w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:b/><w:sz w:val="26"/><w:color w:val="4E6B8A"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading2">
    <w:name w:val="heading 2"/>
    <w:pPr><w:spacing w:before="120" w:after="40"/></w:pPr>
    <w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:b/><w:sz w:val="22"/><w:color w:val="1E1E1E"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Title">
    <w:name w:val="Title"/>
    <w:pPr><w:jc w:val="center"/><w:spacing w:after="60"/></w:pPr>
    <w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:sz w:val="36"/><w:color w:val="141414"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="ProTitle">
    <w:name w:val="ProTitle"/>
    <w:pPr><w:jc w:val="center"/><w:spacing w:after="60"/></w:pPr>
    <w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:b/><w:sz w:val="28"/><w:color w:val="141414"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Subtitle">
    <w:name w:val="Subtitle"/>
    <w:pPr><w:jc w:val="center"/><w:spacing w:after="120"/></w:pPr>
    <w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:sz w:val="20"/><w:color w:val="505050"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Meta">
    <w:name w:val="Meta"/>
    <w:pPr><w:spacing w:after="40"/></w:pPr>
    <w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:i/><w:sz w:val="20"/><w:color w:val="505050"/></w:rPr>
  </w:style>
</w:styles>`
}

func documentXML(cv *models.CV) (string, error) {
	var b strings.Builder
	b.WriteString(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:body>`)

	d := cv.Data

	// Name
	name := strings.TrimSpace(d.Personal.FirstName + " " + d.Personal.LastName)
	if name == "" {
		name = cv.Title
	}
	b.WriteString(paragraph("Title", name))

	// Professional Title
	if d.Personal.Title != "" {
		b.WriteString(paragraph("ProTitle", d.Personal.Title))
	}

	// Contact line (single centred line)
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
		b.WriteString(paragraph("Subtitle", strings.Join(contactParts, "  |  ")))
	}

	// Summary
	if d.Summary != "" {
		label := "Summary"
		if d.Labels != nil && d.Labels.Summary != "" {
			label = d.Labels.Summary
		}
		b.WriteString(paragraph("Heading1", label))
		b.WriteString(paragraph("Normal", d.Summary))
	}

	// Skills
	if len(d.Skills) > 0 {
		label := "Skills"
		if d.Labels != nil && d.Labels.Skills != "" {
			label = d.Labels.Skills
		}
		b.WriteString(paragraph("Heading1", label))
		for _, sg := range d.Skills {
			b.WriteString(paragraphBoldNormal("•  "+sg.Category+": ", strings.Join(sg.Items, ", ")))
		}
	}

	// Experience
	if len(d.Experience) > 0 {
		label := "Professional Experience"
		if d.Labels != nil && d.Labels.Experience != "" {
			label = d.Labels.Experience
		}
		b.WriteString(paragraph("Heading1", label))
		for _, exp := range d.Experience {
			header := exp.Title
			if exp.Company != "" {
				header += " | " + exp.Company
			}
			if exp.Location != "" {
				header += " (" + exp.Location + ")"
			}
			b.WriteString(paragraph("Heading2", header))

			presentLabel := "Present"
			if d.Labels != nil && d.Labels.Present != "" {
				presentLabel = d.Labels.Present
			}
			dateStr := formatDateRange(exp.StartDate, exp.EndDate, exp.Current, presentLabel)
			if dateStr != "" {
				b.WriteString(paragraph("Meta", dateStr))
			}
			if exp.Description != "" {
				lines := splitDescriptionLines(exp.Description)
				for _, line := range lines {
					b.WriteString(paragraph("Normal", "•  "+line))
				}
			}
		}
	}

	// Education
	if len(d.Education) > 0 {
		label := "Education"
		if d.Labels != nil && d.Labels.Education != "" {
			label = d.Labels.Education
		}
		b.WriteString(paragraph("Heading1", label))
		for _, edu := range d.Education {
			degreeField := edu.Degree
			if edu.Field != "" {
				degreeField += " in " + edu.Field
			}
			header := degreeField
			if edu.Institution != "" {
				header += " | " + edu.Institution
			}
			b.WriteString(paragraph("Heading2", header))
			dateStr := formatDateRange(edu.StartDate, edu.EndDate, false, "")
			if dateStr != "" {
				b.WriteString(paragraph("Meta", dateStr))
			}
			if edu.Description != "" {
				b.WriteString(paragraph("Normal", edu.Description))
			}
		}
	}

	// Languages
	if len(d.Languages) > 0 {
		label := "Languages"
		if d.Labels != nil && d.Labels.Languages != "" {
			label = d.Labels.Languages
		}
		b.WriteString(paragraph("Heading1", label))
		for _, lang := range d.Languages {
			text := lang.Language
			if lang.Proficiency != "" {
				text += ": " + lang.Proficiency
			}
			b.WriteString(paragraph("Normal", "•  "+text))
		}
	}

	// Certifications
	if len(d.Certifications) > 0 {
		label := "Certifications"
		if d.Labels != nil && d.Labels.Certifications != "" {
			label = d.Labels.Certifications
		}
		b.WriteString(paragraph("Heading1", label))
		for _, cert := range d.Certifications {
			header := cert.Name
			if cert.Issuer != "" {
				header += " | " + cert.Issuer
			}
			b.WriteString(paragraph("Heading2", header))
			if cert.Date != "" {
				b.WriteString(paragraph("Meta", cert.Date))
			}
		}
	}

	b.WriteString(`</w:body></w:document>`)
	return b.String(), nil
}

func paragraph(style, text string) string {
	escaped := xmlEscape(text)
	return fmt.Sprintf(`<w:p><w:pPr><w:pStyle w:val="%s"/></w:pPr><w:r><w:t xml:space="preserve">%s</w:t></w:r></w:p>`, style, escaped)
}

func paragraphBoldNormal(boldText, normalText string) string {
	escapedBold := xmlEscape(boldText)
	escapedNormal := xmlEscape(normalText)
	return fmt.Sprintf(`<w:p><w:r><w:rPr><w:b/></w:rPr><w:t xml:space="preserve">%s</w:t></w:r><w:r><w:t xml:space="preserve">%s</w:t></w:r></w:p>`, escapedBold, escapedNormal)
}

func xmlEscape(s string) string {
	var b strings.Builder
	xml.EscapeText(&b, []byte(s))
	return b.String()
}

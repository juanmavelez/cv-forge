import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';
import type { CVData, Education, Experience, Certification } from '../types';
import { defaultLabels } from '../types';

export const generateDOCX = async (data: CVData): Promise<Blob> => {
    const p = data.personal;
    const l = data.labels || defaultLabels();
    const fullName = [p.firstName, p.lastName].filter(Boolean).join(' ');

    const sections = [];

    // Header
    sections.push(
        new Paragraph({
            text: fullName,
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
        })
    );

    if (p.title) {
        sections.push(
            new Paragraph({
                text: p.title,
                heading: HeadingLevel.HEADING_2,
                alignment: AlignmentType.CENTER,
                spacing: { after: 240 },
            })
        );
    }

    // Contact Info
    const contactParts = [
        p.email,
        p.phone,
        p.location,
        p.linkedin,
        p.website,
    ].filter(Boolean);

    if (contactParts.length > 0) {
        sections.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: contactParts.join(' | '),
                        size: 20, // 10pt
                    }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 400 },
                border: {
                    bottom: {
                        color: "E2E8F0",
                        space: 1,
                        style: BorderStyle.SINGLE,
                        size: 6,
                    },
                },
            })
        );
    }

    // Summary
    if (data.summary) {
        sections.push(createSectionTitle(l.summary));
        sections.push(
            new Paragraph({
                children: [new TextRun(data.summary)],
                spacing: { after: 300 },
            })
        );
    }

    // Experience
    if (data.experience.length > 0) {
        sections.push(createSectionTitle(l.experience));
        data.experience.forEach(exp => {
            sections.push(...createExperienceEntry(exp, l.present));
        });
    }

    // Education
    if (data.education.length > 0) {
        sections.push(createSectionTitle(l.education));
        data.education.forEach(edu => {
            sections.push(...createEducationEntry(edu));
        });
    }

    // Skills
    if (data.skills.length > 0) {
        sections.push(createSectionTitle(l.skills));
        data.skills.forEach(sg => {
            sections.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: sg.category + ": ",
                            bold: true,
                        }),
                        new TextRun(sg.items.join(', ')),
                    ],
                    bullet: {
                        level: 0,
                    },
                })
            );
        });
        sections.push(new Paragraph({ spacing: { after: 300 } }));
    }

    // Languages
    if (data.languages.length > 0) {
        sections.push(createSectionTitle(l.languages));
        data.languages.forEach(lang => {
            sections.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: lang.language,
                            bold: true,
                        }),
                        lang.proficiency ? new TextRun(`: ${lang.proficiency}`) : new TextRun(""),
                    ],
                    bullet: {
                        level: 0,
                    },
                })
            );
        });
        sections.push(new Paragraph({ spacing: { after: 300 } }));
    }

    // Certifications
    if (data.certifications.length > 0) {
        sections.push(createSectionTitle(l.certifications));
        data.certifications.forEach(cert => {
            sections.push(...createCertificationEntry(cert));
        });
    }

    const doc = new Document({
        styles: {
            default: {
                document: {
                    run: {
                        font: "Calibri",
                        size: 22, // 11pt
                        color: "0F172A", // Slate 900
                    },
                },
            },
            paragraphStyles: [
                {
                    id: "Heading1",
                    name: "Heading 1",
                    basedOn: "Normal",
                    next: "Normal",
                    quickFormat: true,
                    run: {
                        size: 28, // 14pt
                        bold: true,
                        color: "6366F1", // Indigo 500
                    },
                    paragraph: {
                        spacing: { before: 240, after: 120 },
                    },
                },
                {
                    id: "Heading2",
                    name: "Heading 2",
                    basedOn: "Normal",
                    next: "Normal",
                    quickFormat: true,
                    run: {
                        size: 24, // 12pt
                        bold: false,
                        color: "64748B", // Slate 500
                    },
                    paragraph: {
                        spacing: { before: 0, after: 120 },
                    },
                },
            ],
        },
        sections: [
            {
                properties: {},
                children: sections,
            },
        ],
    });

    return Packer.toBlob(doc);
};

function createSectionTitle(title: string): Paragraph {
    return new Paragraph({
        text: title,
        heading: HeadingLevel.HEADING_1,
        border: {
            bottom: {
                color: "E2E8F0",
                space: 1,
                style: BorderStyle.SINGLE,
                size: 6,
            },
        },
        spacing: { after: 200 },
    });
}

function createExperienceEntry(exp: Experience, presentLabel: string): Paragraph[] {
    const paragraphs = [];

    // Title line: Role | Company (Right aligned: Dates)
    // Docx tab stops are tricky, keeping it simple: Title on one line, dates on next or same using tabs if complex.
    // Let's use a cleaner stacked approach for reliability.

    paragraphs.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: exp.title,
                    bold: true,
                    size: 24, // 12pt
                }),
                new TextRun({
                    text: ` | ${exp.company}`,
                    bold: true,
                    color: "64748B",
                    size: 24,
                }),
            ],
            spacing: { before: 120 },
        })
    );

    const dateStr = formatDateRange(exp.startDate, exp.endDate, exp.current, presentLabel);
    const metaParts = [dateStr, exp.location].filter(Boolean).join(' • ');

    if (metaParts) {
        paragraphs.push(
            new Paragraph({
                text: metaParts,
                style: "Heading2", // Recycled for gray meta text
                spacing: { after: 120 },
            })
        );
    }

    if (exp.description) {
        exp.description.split('\n').forEach(line => {
            if (line.trim()) {
                paragraphs.push(
                    new Paragraph({
                        text: line.trim().replace(/^[\-•*]\s*/, ''), // Remove existing bullets if any
                        bullet: {
                            level: 0,
                        },
                    })
                );
            }
        });
    }

    paragraphs.push(new Paragraph({ spacing: { after: 200 } })); // Spacer
    return paragraphs;
}

function createEducationEntry(edu: Education): Paragraph[] {
    const paragraphs = [];

    const title = [edu.degree, edu.field].filter(Boolean).join(' in ');

    paragraphs.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: title || edu.institution, // Fallback
                    bold: true,
                    size: 24,
                }),
                new TextRun({
                    text: title ? ` | ${edu.institution}` : '',
                    bold: true,
                    color: "64748B",
                    size: 24,
                }),
            ],
            spacing: { before: 120 },
        })
    );

    const dateStr = formatDateRange(edu.startDate, edu.endDate, false, '');
    if (dateStr) {
        paragraphs.push(
            new Paragraph({
                text: dateStr,
                style: "Heading2",
                spacing: { after: 120 },
            })
        );
    }

    if (edu.description) {
        paragraphs.push(
            new Paragraph({
                text: edu.description,
            })
        );
    }

    paragraphs.push(new Paragraph({ spacing: { after: 200 } }));
    return paragraphs;
}

function createCertificationEntry(cert: Certification): Paragraph[] {
    return [
        new Paragraph({
            children: [
                new TextRun({
                    text: cert.name,
                    bold: true,
                }),
                new TextRun({
                    text: cert.issuer ? ` | ${cert.issuer}` : '',
                    color: "64748B",
                }),
                new TextRun({
                    text: cert.date ? ` (${cert.date})` : '',
                    italics: true,
                    color: "64748B",
                }),
            ],
            spacing: { after: 120 },
        }),
    ];
}

function formatDateRange(start: string, end: string, current: boolean, presentLabel: string): string {
    if (!start) return '';
    const s = formatDate(start);
    if (current) return `${s} – ${presentLabel}`;
    if (!end) return s;
    return `${s} – ${formatDate(end)}`;
}

function formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    if (!year) return dateStr;
    if (!month) return year;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const m = parseInt(month, 10);
    if (m >= 1 && m <= 12) return `${months[m - 1]} ${year}`;
    return year;
}

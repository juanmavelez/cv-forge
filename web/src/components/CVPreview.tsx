import type { CVData, FontStyle } from '../types';
import { defaultStyle } from '../types';

interface CVPreviewProps {
    data: CVData;
    title?: string;
}

export function CVPreview({ data }: CVPreviewProps) {
    const p = data.personal;
    const fullName = [p.firstName, p.lastName].filter(Boolean).join(' ');
    const s = data.style || defaultStyle();

    const getStyle = (style: FontStyle): React.CSSProperties => ({
        fontSize: `${style.size}pt`,
        color: `rgb(${style.color.join(',')})`,
        fontWeight: style.bold ? 'bold' : 'normal',
        fontStyle: style.italic ? 'italic' : 'normal',
    });

    const contactItems = [
        p.email && { icon: '✉', text: p.email, href: `mailto:${p.email}` },
        p.phone && { icon: '☎', text: p.phone, href: `tel:${p.phone}` },
        p.location && { icon: '📍', text: p.location },
        p.linkedin && { icon: '🔗', text: 'LinkedIn', href: p.linkedin.startsWith('http') ? p.linkedin : `https://${p.linkedin}` },
        p.website && { icon: '🌐', text: p.website, href: p.website.startsWith('http') ? p.website : `https://${p.website}` },
    ].filter(Boolean) as { icon: string; text: string; href?: string }[];

    const hasContent =
        fullName || p.title || data.summary ||
        data.experience.length > 0 || data.education.length > 0 ||
        data.skills.length > 0 || data.languages.length > 0 ||
        data.certifications.length > 0;

    if (!hasContent) {
        return (
            <div className="cv-preview">
                <div className="cv-preview__page cv-preview__empty">
                    <div className="cv-preview__empty-icon">📄</div>
                    <p>Start filling in the form to see your CV preview here</p>
                </div>
            </div>
        );
    }

    return (
        <div className="cv-preview">
            <div className="cv-preview__page">
                {/* Header */}
                <header className="cv-preview__header">
                    {fullName && (
                        <h1 className="cv-preview__name" style={getStyle(s.title1)}>
                            {fullName}
                        </h1>
                    )}
                    {p.title && (
                        <p className="cv-preview__title" style={getStyle({ ...s.title1, size: 14, bold: true })}>
                            {p.title}
                        </p>
                    )}
                    {contactItems.length > 0 && (
                        <div className="cv-preview__contact" style={getStyle(s.sub)}>
                            {contactItems.map((item, i) => (
                                <span key={i} className="cv-preview__contact-item">
                                    {item.href ? (
                                        <a href={item.href} target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>{item.text}</a>
                                    ) : (
                                        <span>{item.text}</span>
                                    )}
                                    {i < contactItems.length - 1 && <span className="cv-preview__contact-divider"> | </span>}
                                </span>
                            ))}
                        </div>
                    )}
                </header>

                {/* Summary */}
                {data.summary && (
                    <section className="cv-preview__section">
                        <h2 className="cv-preview__section-title" style={getStyle(s.title2)}>Summary</h2>
                        <p className="cv-preview__summary" style={getStyle(s.text2)}>{data.summary}</p>
                    </section>
                )}

                {/* Skills */}
                {data.skills.length > 0 && (
                    <section className="cv-preview__section">
                        <h2 className="cv-preview__section-title" style={getStyle(s.title2)}>Skills</h2>
                        {data.skills.map((sg, i) => (
                            <div key={i} className="cv-preview__entry">
                                <ul className="cv-preview__bullets">
                                    <li style={getStyle(s.text2)}>
                                        {sg.category}: {sg.items.join(', ')}
                                    </li>
                                </ul>
                            </div>
                        ))}
                    </section>
                )}

                {/* Experience */}
                {data.experience.length > 0 && (
                    <section className="cv-preview__section">
                        <h2 className="cv-preview__section-title" style={getStyle(s.title2)}>Professional Experience</h2>
                        {data.experience.map((exp, i) => (
                            <div key={i} className="cv-preview__entry">
                                <div className="cv-preview__entry-header">
                                    <strong className="cv-preview__entry-title" style={getStyle(s.text1)}>
                                        {exp.title || 'Untitled Role'}
                                        {exp.company && ` | ${exp.company}`}
                                        {exp.location && ` (${exp.location})`}
                                    </strong>
                                </div>
                                <div className="cv-preview__entry-dates" style={getStyle({ ...s.sub, italic: true })}>
                                    {formatDate(exp.startDate)}
                                    {(exp.startDate || exp.endDate || exp.current) && ' – '}
                                    {exp.current ? 'Present' : formatDate(exp.endDate)}
                                </div>
                                {exp.description && (
                                    <ul className="cv-preview__bullets">
                                        {exp.description.split('\n').filter(Boolean).map((line, j) => (
                                            <li key={j} style={getStyle(s.text2)}>
                                                {line.replace(/^[\-•\s*·–—\-]/, '').trim()}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </section>
                )}

                {/* Education */}
                {data.education.length > 0 && (
                    <section className="cv-preview__section">
                        <h2 className="cv-preview__section-title" style={getStyle(s.title2)}>Education</h2>
                        {data.education.map((edu, i) => (
                            <div key={i} className="cv-preview__entry">
                                <div className="cv-preview__entry-header">
                                    <strong className="cv-preview__entry-title" style={getStyle(s.text1)}>
                                        {[edu.degree, edu.field].filter(Boolean).join(' in ') || 'Untitled'}
                                        {edu.institution && ` | ${edu.institution}`}
                                    </strong>
                                </div>
                                <div className="cv-preview__entry-dates" style={getStyle({ ...s.sub, italic: true })}>
                                    {formatDate(edu.startDate)}
                                    {(edu.startDate || edu.endDate) && ' – '}
                                    {formatDate(edu.endDate)}
                                </div>
                                {edu.description && (
                                    <p className="cv-preview__entry-desc" style={getStyle(s.text2)}>
                                        {edu.description}
                                    </p>
                                )}
                            </div>
                        ))}
                    </section>
                )}

                {/* Languages */}
                {data.languages.length > 0 && (
                    <section className="cv-preview__section">
                        <h2 className="cv-preview__section-title" style={getStyle(s.title2)}>Languages</h2>
                        {data.languages.map((lang, i) => (
                            <div key={i} className="cv-preview__entry">
                                <ul className="cv-preview__bullets">
                                    <li style={getStyle(s.text2)}>
                                        {lang.language}
                                        {lang.proficiency && `: ${lang.proficiency}`}
                                    </li>
                                </ul>
                            </div>
                        ))}
                    </section>
                )}

                {/* Certifications */}
                {data.certifications.length > 0 && (
                    <section className="cv-preview__section">
                        <h2 className="cv-preview__section-title" style={getStyle(s.title2)}>Certifications</h2>
                        {data.certifications.map((cert, i) => (
                            <div key={i} className="cv-preview__entry cv-preview__entry--compact">
                                <div className="cv-preview__entry-header">
                                    <strong className="cv-preview__entry-title" style={getStyle(s.text1)}>
                                        {cert.url ? (
                                            <a href={cert.url.startsWith('http') ? cert.url : `https://${cert.url}`} target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>
                                                {cert.name || 'Untitled'}
                                            </a>
                                        ) : (
                                            cert.name || 'Untitled'
                                        )}
                                        {cert.issuer && ` | ${cert.issuer}`}
                                    </strong>
                                </div>
                                {cert.date && (
                                    <div className="cv-preview__entry-dates" style={getStyle(s.sub)}>
                                        {formatDate(cert.date)}
                                    </div>
                                )}
                            </div>
                        ))}
                    </section>
                )}
            </div>
        </div>
    );
}

function formatDate(dateStr: string): string {
    if (!dateStr) return '';
    // Input is YYYY-MM format from <input type="month">
    const [year, month] = dateStr.split('-');
    if (!year) return dateStr;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const m = parseInt(month, 10);
    if (m >= 1 && m <= 12) return `${months[m - 1]} ${year}`;
    return year;
}

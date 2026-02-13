import type { CVData } from '../types';

interface CVPreviewProps {
    data: CVData;
    title?: string;
}

export function CVPreview({ data }: CVPreviewProps) {
    const p = data.personal;
    const fullName = [p.firstName, p.lastName].filter(Boolean).join(' ');

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
                    {fullName && <h1 className="cv-preview__name">{fullName}</h1>}
                    {p.title && <p className="cv-preview__title">{p.title}</p>}
                    {contactItems.length > 0 && (
                        <div className="cv-preview__contact">
                            {contactItems.map((item, i) => (
                                <span key={i} className="cv-preview__contact-item">
                                    <span className="cv-preview__contact-icon">{item.icon}</span>
                                    {item.href ? (
                                        <a href={item.href} target="_blank" rel="noreferrer">{item.text}</a>
                                    ) : (
                                        <span>{item.text}</span>
                                    )}
                                </span>
                            ))}
                        </div>
                    )}
                </header>

                {/* Summary */}
                {data.summary && (
                    <section className="cv-preview__section">
                        <h2 className="cv-preview__section-title">Summary</h2>
                        <div className="cv-preview__divider" />
                        <p className="cv-preview__summary">{data.summary}</p>
                    </section>
                )}

                {/* Experience */}
                {data.experience.length > 0 && (
                    <section className="cv-preview__section">
                        <h2 className="cv-preview__section-title">Experience</h2>
                        <div className="cv-preview__divider" />
                        {data.experience.map((exp, i) => (
                            <div key={i} className="cv-preview__entry">
                                <div className="cv-preview__entry-header">
                                    <div>
                                        <strong className="cv-preview__entry-title">{exp.title || 'Untitled Role'}</strong>
                                        {exp.company && <span className="cv-preview__entry-org"> · {exp.company}</span>}
                                    </div>
                                    <span className="cv-preview__entry-dates">
                                        {formatDate(exp.startDate)}
                                        {(exp.startDate || exp.endDate || exp.current) && ' — '}
                                        {exp.current ? 'Present' : formatDate(exp.endDate)}
                                    </span>
                                </div>
                                {exp.location && <p className="cv-preview__entry-location">{exp.location}</p>}
                                {exp.description && (
                                    <ul className="cv-preview__bullets">
                                        {exp.description.split('\n').filter(Boolean).map((line, j) => (
                                            <li key={j}>{line.replace(/^[\-•]\s*/, '')}</li>
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
                        <h2 className="cv-preview__section-title">Education</h2>
                        <div className="cv-preview__divider" />
                        {data.education.map((edu, i) => (
                            <div key={i} className="cv-preview__entry">
                                <div className="cv-preview__entry-header">
                                    <div>
                                        <strong className="cv-preview__entry-title">
                                            {[edu.degree, edu.field].filter(Boolean).join(' in ') || 'Untitled'}
                                        </strong>
                                        {edu.institution && <span className="cv-preview__entry-org"> · {edu.institution}</span>}
                                    </div>
                                    <span className="cv-preview__entry-dates">
                                        {formatDate(edu.startDate)}
                                        {(edu.startDate || edu.endDate) && ' — '}
                                        {formatDate(edu.endDate)}
                                    </span>
                                </div>
                                {edu.description && <p className="cv-preview__entry-desc">{edu.description}</p>}
                            </div>
                        ))}
                    </section>
                )}

                {/* Skills */}
                {data.skills.length > 0 && (
                    <section className="cv-preview__section">
                        <h2 className="cv-preview__section-title">Skills</h2>
                        <div className="cv-preview__divider" />
                        {data.skills.map((sg, i) => (
                            <div key={i} className="cv-preview__skill-group">
                                {sg.category && <span className="cv-preview__skill-label">{sg.category}:</span>}
                                <div className="cv-preview__skill-chips">
                                    {sg.items.map((skill, j) => (
                                        <span key={j} className="cv-preview__chip">{skill}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </section>
                )}

                {/* Languages */}
                {data.languages.length > 0 && (
                    <section className="cv-preview__section">
                        <h2 className="cv-preview__section-title">Languages</h2>
                        <div className="cv-preview__divider" />
                        <div className="cv-preview__lang-grid">
                            {data.languages.map((lang, i) => (
                                <div key={i} className="cv-preview__lang-item">
                                    <span className="cv-preview__lang-name">{lang.language || 'Language'}</span>
                                    {lang.proficiency && (
                                        <span className="cv-preview__lang-level">{lang.proficiency}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Certifications */}
                {data.certifications.length > 0 && (
                    <section className="cv-preview__section">
                        <h2 className="cv-preview__section-title">Certifications</h2>
                        <div className="cv-preview__divider" />
                        {data.certifications.map((cert, i) => (
                            <div key={i} className="cv-preview__entry cv-preview__entry--compact">
                                <div className="cv-preview__entry-header">
                                    <div>
                                        <strong className="cv-preview__entry-title">
                                            {cert.url ? (
                                                <a href={cert.url.startsWith('http') ? cert.url : `https://${cert.url}`} target="_blank" rel="noreferrer">
                                                    {cert.name || 'Untitled'}
                                                </a>
                                            ) : (
                                                cert.name || 'Untitled'
                                            )}
                                        </strong>
                                        {cert.issuer && <span className="cv-preview__entry-org"> · {cert.issuer}</span>}
                                    </div>
                                    {cert.date && (
                                        <span className="cv-preview__entry-dates">{formatDate(cert.date)}</span>
                                    )}
                                </div>
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

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useToast } from '../components/Toast';
import { useModal } from '../components/Modal';
import type { CVData, Experience, Education, SkillGroup, Language, Certification } from '../types';

// Debounce timer ref
let saveTimer: ReturnType<typeof setTimeout> | null = null;

export function Editor() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const toast = useToast();
    const { prompt } = useModal();

    const [title, setTitle] = useState('');
    const [data, setData] = useState<CVData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showExport, setShowExport] = useState(false);

    // Track which sections are open
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        personal: true,
    });

    useEffect(() => {
        if (!id) return;
        api.getCV(id).then(cv => {
            setTitle(cv.title);
            setData(cv.data);
            setLoading(false);
        }).catch(() => {
            toast('CV not found', 'error');
            navigate('/');
        });
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

    const scheduleAutoSave = (newTitle: string, newData: CVData) => {
        if (!id) return;
        if (saveTimer) clearTimeout(saveTimer);
        saveTimer = setTimeout(async () => {
            setSaving(true);
            try {
                await api.updateCV(id, newTitle, newData);
            } catch (err) {
                toast(`Auto-save failed: ${err}`, 'error');
            } finally {
                setSaving(false);
            }
        }, 800);
    };

    const updateData = (updater: (prev: CVData) => CVData) => {
        setData(prev => {
            if (!prev) return prev;
            const next = updater(prev);
            scheduleAutoSave(title, next);
            return next;
        });
    };

    const updateTitle = (newTitle: string) => {
        setTitle(newTitle);
        if (data) scheduleAutoSave(newTitle, data);
    };

    const toggleSection = (key: string) => {
        setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSaveVersion = async () => {
        const message = await prompt('Save Version', 'Version Message', `Snapshot ${new Date().toLocaleDateString()}`);
        if (message === null || !id) return;
        try {
            await api.createVersion(id, message);
            toast('Version saved!', 'success');
        } catch (err) {
            toast(`Failed to save version: ${err}`, 'error');
        }
    };

    if (loading || !data) return <div className="container"><p>Loading…</p></div>;

    const p = data.personal;

    return (
        <>
            <div className="container">
                {/* Title input */}
                <div className="form-group">
                    <input
                        className="form-input"
                        style={{ fontSize: '1.5rem', fontWeight: 700, border: 'none', padding: '8px 0', background: 'transparent' }}
                        value={title}
                        onChange={e => updateTitle(e.target.value)}
                        placeholder="CV Title"
                    />
                </div>

                {/* Personal */}
                <SectionCard
                    title="Personal Information"
                    icon="👤"
                    isOpen={!!openSections.personal}
                    onToggle={() => toggleSection('personal')}
                >
                    <div className="form-row">
                        <FormInput label="First Name" value={p.firstName} onChange={v => updateData(d => ({ ...d, personal: { ...d.personal, firstName: v } }))} />
                        <FormInput label="Last Name" value={p.lastName} onChange={v => updateData(d => ({ ...d, personal: { ...d.personal, lastName: v } }))} />
                    </div>
                    <FormInput label="Professional Title" value={p.title} onChange={v => updateData(d => ({ ...d, personal: { ...d.personal, title: v } }))} placeholder="e.g. Frontend Engineer" />
                    <div className="form-row">
                        <FormInput label="Email" value={p.email} type="email" onChange={v => updateData(d => ({ ...d, personal: { ...d.personal, email: v } }))} />
                        <FormInput label="Phone" value={p.phone} type="tel" onChange={v => updateData(d => ({ ...d, personal: { ...d.personal, phone: v } }))} />
                    </div>
                    <FormInput label="Location" value={p.location} onChange={v => updateData(d => ({ ...d, personal: { ...d.personal, location: v } }))} />
                    <div className="form-row">
                        <FormInput label="LinkedIn" value={p.linkedin} onChange={v => updateData(d => ({ ...d, personal: { ...d.personal, linkedin: v } }))} />
                        <FormInput label="Website" value={p.website} onChange={v => updateData(d => ({ ...d, personal: { ...d.personal, website: v } }))} />
                    </div>
                </SectionCard>

                {/* Summary */}
                <SectionCard title="Summary" icon="📝" isOpen={!!openSections.summary} onToggle={() => toggleSection('summary')}>
                    <div className="form-group">
                        <textarea
                            className="form-textarea"
                            value={data.summary}
                            onChange={e => updateData(d => ({ ...d, summary: e.target.value }))}
                            rows={4}
                            placeholder="Brief professional summary…"
                        />
                    </div>
                </SectionCard>

                {/* Experience */}
                <SectionCard title="Experience" icon="💼" isOpen={!!openSections.experience} onToggle={() => toggleSection('experience')}>
                    {data.experience.map((exp, i) => (
                        <ExperienceEntry key={i} index={i} entry={exp}
                            onChange={entry => updateData(d => {
                                const experience = [...d.experience];
                                experience[i] = entry;
                                return { ...d, experience };
                            })}
                            onRemove={() => updateData(d => ({ ...d, experience: d.experience.filter((_, j) => j !== i) }))}
                        />
                    ))}
                    <button className="add-entry-btn" onClick={() => updateData(d => ({
                        ...d,
                        experience: [...d.experience, { company: '', title: '', location: '', startDate: '', endDate: '', current: false, description: '' }],
                    }))}>+ Add Experience</button>
                </SectionCard>

                {/* Education */}
                <SectionCard title="Education" icon="🎓" isOpen={!!openSections.education} onToggle={() => toggleSection('education')}>
                    {data.education.map((edu, i) => (
                        <EducationEntry key={i} index={i} entry={edu}
                            onChange={entry => updateData(d => {
                                const education = [...d.education];
                                education[i] = entry;
                                return { ...d, education };
                            })}
                            onRemove={() => updateData(d => ({ ...d, education: d.education.filter((_, j) => j !== i) }))}
                        />
                    ))}
                    <button className="add-entry-btn" onClick={() => updateData(d => ({
                        ...d,
                        education: [...d.education, { institution: '', degree: '', field: '', startDate: '', endDate: '', description: '' }],
                    }))}>+ Add Education</button>
                </SectionCard>

                {/* Skills */}
                <SectionCard title="Skills" icon="🛠" isOpen={!!openSections.skills} onToggle={() => toggleSection('skills')}>
                    {data.skills.map((sg, i) => (
                        <SkillGroupEntry key={i} index={i} entry={sg}
                            onChange={entry => updateData(d => {
                                const skills = [...d.skills];
                                skills[i] = entry;
                                return { ...d, skills };
                            })}
                            onRemove={() => updateData(d => ({ ...d, skills: d.skills.filter((_, j) => j !== i) }))}
                        />
                    ))}
                    <button className="add-entry-btn" onClick={() => updateData(d => ({
                        ...d,
                        skills: [...d.skills, { category: '', items: [] }],
                    }))}>+ Add Skill Group</button>
                </SectionCard>

                {/* Languages */}
                <SectionCard title="Languages" icon="🌐" isOpen={!!openSections.languages} onToggle={() => toggleSection('languages')}>
                    {data.languages.map((lang, i) => (
                        <LanguageEntry key={i} index={i} entry={lang}
                            onChange={entry => updateData(d => {
                                const languages = [...d.languages];
                                languages[i] = entry;
                                return { ...d, languages };
                            })}
                            onRemove={() => updateData(d => ({ ...d, languages: d.languages.filter((_, j) => j !== i) }))}
                        />
                    ))}
                    <button className="add-entry-btn" onClick={() => updateData(d => ({
                        ...d,
                        languages: [...d.languages, { language: '', proficiency: '' }],
                    }))}>+ Add Language</button>
                </SectionCard>

                {/* Certifications */}
                <SectionCard title="Certifications" icon="🏅" isOpen={!!openSections.certifications} onToggle={() => toggleSection('certifications')}>
                    {data.certifications.map((cert, i) => (
                        <CertificationEntry key={i} index={i} entry={cert}
                            onChange={entry => updateData(d => {
                                const certifications = [...d.certifications];
                                certifications[i] = entry;
                                return { ...d, certifications };
                            })}
                            onRemove={() => updateData(d => ({ ...d, certifications: d.certifications.filter((_, j) => j !== i) }))}
                        />
                    ))}
                    <button className="add-entry-btn" onClick={() => updateData(d => ({
                        ...d,
                        certifications: [...d.certifications, { name: '', issuer: '', date: '', url: '' }],
                    }))}>+ Add Certification</button>
                </SectionCard>
            </div>

            {/* Action bar */}
            <div className="action-bar">
                <div className="action-bar__left">
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                        {saving ? '⏳ Saving…' : '✓ Saved'}
                    </span>
                </div>
                <div className="action-bar__right">
                    <button className="btn btn--secondary btn--sm" onClick={() => navigate(`/cv/${id}/history`)}>
                        🕐 History
                    </button>
                    <button className="btn btn--secondary btn--sm" onClick={handleSaveVersion}>
                        📸 Save Version
                    </button>
                    <div className="dropdown">
                        <button className="btn btn--primary btn--sm" onClick={() => setShowExport(!showExport)}>
                            ↓ Export
                        </button>
                        {showExport && id && (
                            <div className="dropdown__menu" onClick={() => setShowExport(false)}>
                                <a className="dropdown__item" href={api.exportPDFUrl(id)} target="_blank" rel="noreferrer">📄 PDF</a>
                                <a className="dropdown__item" href={api.exportDOCXUrl(id)} target="_blank" rel="noreferrer">📝 DOCX</a>
                                <div className="dropdown__divider" />
                                <a className="dropdown__item" href={api.exportJSONUrl(id)} target="_blank" rel="noreferrer">📋 JSON</a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

// --- Reusable sub-components ---

function SectionCard({ title, icon, isOpen, onToggle, children }: {
    title: string; icon: string; isOpen: boolean; onToggle: () => void; children: React.ReactNode;
}) {
    return (
        <div className={`section-card${isOpen ? ' section-card--open' : ''}`}>
            <div className="section-card__header" onClick={onToggle}>
                <div className="section-card__title">
                    <span className="icon">{icon}</span>
                    {title}
                </div>
                <span className="section-card__chevron">▼</span>
            </div>
            {isOpen && <div className="section-card__body">{children}</div>}
        </div>
    );
}

function FormInput({ label, value, onChange, type = 'text', placeholder }: {
    label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
    return (
        <div className="form-group">
            <label>{label}</label>
            <input className="form-input" type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
        </div>
    );
}

function ExperienceEntry({ index, entry, onChange, onRemove }: {
    index: number; entry: Experience; onChange: (e: Experience) => void; onRemove: () => void;
}) {
    const up = (partial: Partial<Experience>) => onChange({ ...entry, ...partial });
    return (
        <div className="entry">
            <div className="entry__header">
                <span className="entry__number">Experience #{index + 1}</span>
                <button className="entry__remove" onClick={onRemove}>✕ Remove</button>
            </div>
            <div className="form-row">
                <FormInput label="Title" value={entry.title} onChange={v => up({ title: v })} />
                <FormInput label="Company" value={entry.company} onChange={v => up({ company: v })} />
            </div>
            <FormInput label="Location" value={entry.location} onChange={v => up({ location: v })} />
            <div className="form-row--3">
                <FormInput label="Start Date" value={entry.startDate} type="month" onChange={v => up({ startDate: v })} />
                <FormInput label="End Date" value={entry.endDate} type="month" onChange={v => up({ endDate: v })} />
                <div className="form-group">
                    <label>&nbsp;</label>
                    <label className="form-checkbox">
                        <input type="checkbox" checked={entry.current} onChange={e => up({ current: e.target.checked })} />
                        Current
                    </label>
                </div>
            </div>
            <div className="form-group">
                <label>Description</label>
                <textarea className="form-textarea" value={entry.description} onChange={e => up({ description: e.target.value })} rows={4} placeholder="One bullet point per line…" />
            </div>
        </div>
    );
}

function EducationEntry({ index, entry, onChange, onRemove }: {
    index: number; entry: Education; onChange: (e: Education) => void; onRemove: () => void;
}) {
    const up = (partial: Partial<Education>) => onChange({ ...entry, ...partial });
    return (
        <div className="entry">
            <div className="entry__header">
                <span className="entry__number">Education #{index + 1}</span>
                <button className="entry__remove" onClick={onRemove}>✕ Remove</button>
            </div>
            <FormInput label="Institution" value={entry.institution} onChange={v => up({ institution: v })} />
            <div className="form-row">
                <FormInput label="Degree" value={entry.degree} onChange={v => up({ degree: v })} />
                <FormInput label="Field of Study" value={entry.field} onChange={v => up({ field: v })} />
            </div>
            <div className="form-row">
                <FormInput label="Start Date" value={entry.startDate} type="month" onChange={v => up({ startDate: v })} />
                <FormInput label="End Date" value={entry.endDate} type="month" onChange={v => up({ endDate: v })} />
            </div>
            <div className="form-group">
                <label>Description</label>
                <textarea className="form-textarea" value={entry.description} onChange={e => up({ description: e.target.value })} rows={3} placeholder="Optional description…" />
            </div>
        </div>
    );
}

function SkillGroupEntry({ index, entry, onChange, onRemove }: {
    index: number; entry: SkillGroup; onChange: (e: SkillGroup) => void; onRemove: () => void;
}) {
    const [newSkill, setNewSkill] = useState('');

    const addSkill = () => {
        const trimmed = newSkill.trim();
        if (!trimmed) return;
        onChange({ ...entry, items: [...entry.items, trimmed] });
        setNewSkill('');
    };

    return (
        <div className="entry">
            <div className="entry__header">
                <span className="entry__number">Skill Group #{index + 1}</span>
                <button className="entry__remove" onClick={onRemove}>✕ Remove</button>
            </div>
            <FormInput label="Category" value={entry.category} onChange={v => onChange({ ...entry, category: v })} />
            <div className="skill-tags">
                {entry.items.map((skill, i) => (
                    <span key={i} className="skill-tag">
                        {skill}
                        <button className="skill-tag__remove" onClick={() => onChange({ ...entry, items: entry.items.filter((_, j) => j !== i) })}>✕</button>
                    </span>
                ))}
            </div>
            <div className="skill-input-row">
                <input
                    className="form-input"
                    value={newSkill}
                    onChange={e => setNewSkill(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    placeholder="Type a skill and press Enter"
                />
                <button className="btn btn--secondary btn--sm" onClick={addSkill}>Add</button>
            </div>
        </div>
    );
}

function LanguageEntry({ index, entry, onChange, onRemove }: {
    index: number; entry: Language; onChange: (e: Language) => void; onRemove: () => void;
}) {
    return (
        <div className="entry">
            <div className="entry__header">
                <span className="entry__number">Language #{index + 1}</span>
                <button className="entry__remove" onClick={onRemove}>✕ Remove</button>
            </div>
            <div className="form-row">
                <FormInput label="Language" value={entry.language} onChange={v => onChange({ ...entry, language: v })} />
                <div className="form-group">
                    <label>Proficiency</label>
                    <select className="form-select" value={entry.proficiency} onChange={e => onChange({ ...entry, proficiency: e.target.value })}>
                        <option value="">Select</option>
                        <option value="Native">Native</option>
                        <option value="Fluent">Fluent</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Basic">Basic</option>
                    </select>
                </div>
            </div>
        </div>
    );
}

function CertificationEntry({ index, entry, onChange, onRemove }: {
    index: number; entry: Certification; onChange: (e: Certification) => void; onRemove: () => void;
}) {
    const up = (partial: Partial<Certification>) => onChange({ ...entry, ...partial });
    return (
        <div className="entry">
            <div className="entry__header">
                <span className="entry__number">Certification #{index + 1}</span>
                <button className="entry__remove" onClick={onRemove}>✕ Remove</button>
            </div>
            <FormInput label="Name" value={entry.name} onChange={v => up({ name: v })} />
            <div className="form-row">
                <FormInput label="Issuer" value={entry.issuer} onChange={v => up({ issuer: v })} />
                <FormInput label="Date" value={entry.date} type="month" onChange={v => up({ date: v })} />
            </div>
            <FormInput label="URL" value={entry.url} onChange={v => up({ url: v })} />
        </div>
    );
}

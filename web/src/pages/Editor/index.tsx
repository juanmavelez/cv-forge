import { useEffect, useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../api';
import { useToast } from '../../components/Toast/index';
import { useModal } from '../../components/Modal/index';
import { CVPreview } from '../../components/CVPreview/index';
import { CVSettings } from '../../components/CVSettings/index';
import { SectionCard } from '../../components/SectionCard/index';
import { FormInput } from '../../components/FormInput/index';
import { ExperienceEntry, EducationEntry, SkillGroupEntry, LanguageEntry, CertificationEntry } from './components/EditorEntries';
import { saveAs } from 'file-saver';
import { generateDOCX } from '../../utils/docx';
import { PrintLayout } from '../../components/PrintLayout';
import type { CVData, Experience, Education, SkillGroup, Language, Certification } from '../../types';

// Debounce timer ref
let saveTimer: ReturnType<typeof setTimeout> | null = null;

export function Editor() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const toast = useToast();
    const { prompt } = useModal();
    const printRef = useRef<HTMLDivElement>(null);

    const [title, setTitle] = useState('');
    const [data, setData] = useState<CVData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showExport, setShowExport] = useState(false);
    const [showPreview, setShowPreview] = useState(true);
    const [editMode, setEditMode] = useState<'content' | 'settings'>('content');

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
        if (!id) return;
        const msg = await prompt('Save Version', 'Enter a label for this snapshot (e.g. "Draft 1")');
        if (msg === null) return;
        try {
            await api.createVersion(id, msg);
            toast('Version saved!', 'success');
        } catch (err) {
            toast(`Save failed: ${err}`, 'error');
        }
    };

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: title || 'CV',
    });

    const handleExportDOCX = async () => {
        if (!data) return;
        try {
            toast('Generating DOCX...', 'info');
            const blob = await generateDOCX(data);
            saveAs(blob, `${title || 'CV'}.docx`);
            toast('DOCX downloaded!', 'success');
        } catch (err) {
            console.error(err);
            toast('DOCX export failed', 'error');
        }
    };

    if (loading || !data) return <div className="container"><p>Loading…</p></div>;

    const p = data.personal;

    return (
        <>
            <div className="editor-layout">
                {/* Left: Form editor */}
                <div className="editor-layout__form">
                    {/* Title input */}
                    <div className="form-group">
                        <input
                            className="editor-cv-title"
                            value={title}
                            onChange={e => updateTitle(e.target.value)}
                            placeholder="CV Title"
                        />
                    </div>

                    {editMode === 'content' ? (
                        <>
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
                                {data.experience.map((exp: Experience, i: number) => (
                                    <ExperienceEntry key={i} index={i} entry={exp}
                                        onChange={(entry: Experience) => updateData((d: CVData) => {
                                            const experience = [...d.experience];
                                            experience[i] = entry;
                                            return { ...d, experience };
                                        })}
                                        onRemove={() => updateData((d: CVData) => ({ ...d, experience: d.experience.filter((_, j: number) => j !== i) }))}
                                    />
                                ))}
                                <button className="add-entry-btn" onClick={() => updateData(d => ({
                                    ...d,
                                    experience: [...d.experience, { company: '', title: '', location: '', startDate: '', endDate: '', current: false, description: '' }],
                                }))}>+ Add Experience</button>
                            </SectionCard>

                            {/* Education */}
                            <SectionCard title="Education" icon="🎓" isOpen={!!openSections.education} onToggle={() => toggleSection('education')}>
                                {data.education.map((edu: Education, i: number) => (
                                    <EducationEntry key={i} index={i} entry={edu}
                                        onChange={(entry: Education) => updateData((d: CVData) => {
                                            const education = [...d.education];
                                            education[i] = entry;
                                            return { ...d, education };
                                        })}
                                        onRemove={() => updateData((d: CVData) => ({ ...d, education: d.education.filter((_, j: number) => j !== i) }))}
                                    />
                                ))}
                                <button className="add-entry-btn" onClick={() => updateData(d => ({
                                    ...d,
                                    education: [...d.education, { institution: '', degree: '', field: '', startDate: '', endDate: '', description: '' }],
                                }))}>+ Add Education</button>
                            </SectionCard>

                            {/* Skills */}
                            <SectionCard title="Skills" icon="🛠" isOpen={!!openSections.skills} onToggle={() => toggleSection('skills')}>
                                {data.skills.map((sg: SkillGroup, i: number) => (
                                    <SkillGroupEntry key={i} index={i} entry={sg}
                                        onChange={(entry: SkillGroup) => updateData((d: CVData) => {
                                            const skills = [...d.skills];
                                            skills[i] = entry;
                                            return { ...d, skills };
                                        })}
                                        onRemove={() => updateData((d: CVData) => ({ ...d, skills: d.skills.filter((_, j: number) => j !== i) }))}
                                    />
                                ))}
                                <button className="add-entry-btn" onClick={() => updateData(d => ({
                                    ...d,
                                    skills: [...d.skills, { category: '', items: [] }],
                                }))}>+ Add Skill Group</button>
                            </SectionCard>

                            {/* Languages */}
                            <SectionCard title="Languages" icon="🌐" isOpen={!!openSections.languages} onToggle={() => toggleSection('languages')}>
                                {data.languages.map((lang: Language, i: number) => (
                                    <LanguageEntry key={i} index={i} entry={lang}
                                        onChange={(entry: Language) => updateData((d: CVData) => {
                                            const languages = [...d.languages];
                                            languages[i] = entry;
                                            return { ...d, languages };
                                        })}
                                        onRemove={() => updateData((d: CVData) => ({ ...d, languages: d.languages.filter((_, j: number) => j !== i) }))}
                                    />
                                ))}
                                <button className="add-entry-btn" onClick={() => updateData(d => ({
                                    ...d,
                                    languages: [...d.languages, { language: '', proficiency: '' }],
                                }))}>+ Add Language</button>
                            </SectionCard>

                            {/* Certifications */}
                            <SectionCard title="Certifications" icon="🏅" isOpen={!!openSections.certifications} onToggle={() => toggleSection('certifications')}>
                                {data.certifications.map((cert: Certification, i: number) => (
                                    <CertificationEntry key={i} index={i} entry={cert}
                                        onChange={(entry: Certification) => updateData((d: CVData) => {
                                            const certifications = [...d.certifications];
                                            certifications[i] = entry;
                                            return { ...d, certifications };
                                        })}
                                        onRemove={() => updateData((d: CVData) => ({ ...d, certifications: d.certifications.filter((_, j: number) => j !== i) }))}
                                    />
                                ))}
                                <button className="add-entry-btn" onClick={() => updateData(d => ({
                                    ...d,
                                    certifications: [...d.certifications, { name: '', issuer: '', date: '', url: '' }],
                                }))}>+ Add Certification</button>
                            </SectionCard>
                        </>
                    ) : (
                        <CVSettings data={data} updateData={updateData} />
                    )}
                </div>

                {/* Right: Live Preview */}
                <div className={`editor-layout__preview${showPreview ? '' : ' editor-layout__preview--hidden'}`}>
                    <CVPreview data={data} title={title} />
                </div>
            </div>

            {/* Action bar */}
            <div className="action-bar">
                <div className="action-bar__left">
                    <span className="save-status">
                        {saving ? '⏳ Saving…' : '✓ Saved'}
                    </span>
                </div>
                <div className="action-bar__right">
                    <button
                        className={`btn btn--sm ${editMode === 'settings' ? 'btn--primary' : 'btn--secondary'}`}
                        onClick={() => setEditMode(m => m === 'content' ? 'settings' : 'content')}
                    >
                        ⚙️ Settings
                    </button>
                    <button
                        className={`preview-toggle${showPreview ? ' preview-toggle--active' : ''}`}
                        onClick={() => setShowPreview(v => !v)}
                    >
                        👁 Preview
                    </button>
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
                                <button className="dropdown__item" onClick={() => handlePrint()}>🖨️ Print / Save PDF</button>
                                <button className="dropdown__item" onClick={handleExportDOCX}>📝 DOCX</button>
                                <div className="dropdown__divider" />
                                <a className="dropdown__item" href={api.exportJSONUrl(id)} target="_blank" rel="noreferrer">📋 JSON</a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* Hidden Print Layout */}
            {data && <PrintLayout ref={printRef} data={data} title={title} />}
        </>
    );
}

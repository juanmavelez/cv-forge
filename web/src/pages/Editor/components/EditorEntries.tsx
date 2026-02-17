import { useState } from 'react';
import { FormInput } from '../../../components/FormInput';
import type { Experience, Education, SkillGroup, Language, Certification } from '../../../types';

export function ExperienceEntry({ index, entry, onChange, onRemove }: {
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
                <div className="form-group form-group--align-end">
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

export function EducationEntry({ index, entry, onChange, onRemove }: {
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

export function SkillGroupEntry({ index, entry, onChange, onRemove }: {
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

export function LanguageEntry({ index, entry, onChange, onRemove }: {
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

export function CertificationEntry({ index, entry, onChange, onRemove }: {
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

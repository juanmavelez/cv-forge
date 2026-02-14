import { FormInput } from '../FormInput/index';
import type { CVData, StyleConfig } from '../../types';
import { defaultStyle } from '../../types';
import './CVSettings.css';

interface CVSettingsProps {
    data: CVData;
    updateData: (updater: (prev: CVData) => CVData) => void;
}

export function CVSettings({ data, updateData }: CVSettingsProps) {
    return (
        <div className="cv-settings">
            <h2 className="cv-settings__title">CV Configuration</h2>
            <p className="cv-settings__description">
                Customize the global look and feel of your CV, as well as the text labels used in various sections.
            </p>

            <div className="cv-settings__group">
                <h3>🎨 Global Styling</h3>
                <StyleConfigEntry
                    value={data.style || defaultStyle()}
                    onChange={style => updateData(d => ({ ...d, style }))}
                />
            </div>

        </div>
    );
}

function StyleConfigEntry({ value, onChange }: {
    value: StyleConfig;
    onChange: (s: StyleConfig) => void;
}) {
    // Helper to converting [r,g,b] to hex
    const toHex = (c: [number, number, number]) =>
        `#${c.map(x => x.toString(16).padStart(2, '0')).join('')}`;

    // Helper to convert hex to [r,g,b]
    const fromHex = (hex: string): [number, number, number] => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return [r, g, b];
    };

    const updateTitles = (color: [number, number, number]) => {
        onChange({
            ...value,
            title1: { ...value.title1, color },
            title2: { ...value.title2, color },
            title3: { ...value.title3, color },
        });
    };

    const updateText = (color: [number, number, number]) => {
        onChange({
            ...value,
            text1: { ...value.text1, color },
            text2: { ...value.text2, color },
            sub: { ...value.sub, color },
        });
    };

    return (
        <div className="style-config">
            <div className="form-group">
                <label>Titles Color</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                        className="form-input"
                        type="color"
                        style={{ width: '60px', padding: '2px', height: '40px' }}
                        value={toHex(value.title1.color)}
                        onChange={e => updateTitles(fromHex(e.target.value))}
                    />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        Applies to name, section headings, and job titles
                    </span>
                </div>
            </div>

            <div className="form-group">
                <label>Text Color</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                        className="form-input"
                        type="color"
                        style={{ width: '60px', padding: '2px', height: '40px' }}
                        value={toHex(value.text2.color)}
                        onChange={e => updateText(fromHex(e.target.value))}
                    />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        Applies to descriptions, details, and metadata
                    </span>
                </div>
            </div>

            <div className="form-group" style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>Typography (Sizes in pt)</h4>

                <h5 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}>Titles & Headings</h5>
                <div className="form-row--3">
                    <FormInput
                        label="Name"
                        type="number"
                        value={value.title1.size.toString()}
                        onChange={v => onChange({ ...value, title1: { ...value.title1, size: parseFloat(v) || 0 } })}
                    />
                    <FormInput
                        label="Prof. Title"
                        type="number"
                        value={value.title3.size.toString()}
                        onChange={v => onChange({ ...value, title3: { ...value.title3, size: parseFloat(v) || 0 } })}
                    />
                    <FormInput
                        label="Section Headers"
                        type="number"
                        value={value.title2.size.toString()}
                        onChange={v => onChange({ ...value, title2: { ...value.title2, size: parseFloat(v) || 0 } })}
                    />
                </div>

                <h5 style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '12px', marginBottom: '8px', color: 'var(--text-secondary)' }}>Content</h5>
                <div className="form-row--3">
                    <FormInput
                        label="Job/Degree"
                        type="number"
                        value={value.text1.size.toString()}
                        onChange={v => onChange({ ...value, text1: { ...value.text1, size: parseFloat(v) || 0 } })}
                    />
                    <FormInput
                        label="Body Text"
                        type="number"
                        value={value.text2.size.toString()}
                        onChange={v => onChange({ ...value, text2: { ...value.text2, size: parseFloat(v) || 0 } })}
                    />
                    <FormInput
                        label="Metadata"
                        type="number"
                        value={value.sub.size.toString()}
                        onChange={v => onChange({ ...value, sub: { ...value.sub, size: parseFloat(v) || 0 } })}
                    />
                </div>
            </div>

            <button className="btn btn--secondary btn--sm" onClick={() => onChange(defaultStyle())} style={{ marginTop: '16px' }}>
                Reset Styles to Defaults
            </button>
        </div >
    );
}


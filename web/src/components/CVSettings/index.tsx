import { FormInput } from '../FormInput/index';
import type { CVData, StyleConfig } from '../../types';
import { validateAndMergeStyle } from '../../validation';
import { defaultStyle } from '../../types';
import './CVSettings.scss';

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
                <h3 className="cv-settings__group-title">🎨 Global Styling</h3>
                <StyleConfigEntry
                    value={validateAndMergeStyle(data.style)}
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
    const toHex = (c: [number, number, number]) =>
        `#${c.map(x => x.toString(16).padStart(2, '0')).join('')}`;


    const fromHex = (hex: string): [number, number, number] => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return [r, g, b];
    };

    const updateStyle = (key: keyof StyleConfig, color: [number, number, number]) => {
        onChange({
            ...value,
            [key]: { ...value[key], color },
        });
    };

    const ColorPicker = ({ label, color, onChange }: { label: string, color: [number, number, number], onChange: (c: [number, number, number]) => void }) => (
        <div className="color-picker">
            <label className="color-picker__label">{label}</label>
            <div className="color-picker__input-wrapper">
                <input
                    className="form-input color-picker__input"
                    type="color"
                    value={toHex(color)}
                    onChange={e => onChange(fromHex(e.target.value))}
                />
            </div>
        </div>
    );

    return (
        <div className="style-config">
            <div className="form-group">
                <h4 className="style-config__section-title">Colors</h4>

                <h5 className="style-config__subsection-title">Titles & Headings</h5>
                <div className="form-grid" data-cols="3">
                    <ColorPicker label="Name" color={value.title1.color} onChange={c => updateStyle('title1', c)} />
                    <ColorPicker label="Prof. Title" color={value.title3.color} onChange={c => updateStyle('title3', c)} />
                    <ColorPicker label="Section Headers" color={value.title2.color} onChange={c => updateStyle('title2', c)} />
                </div>

                <h5 className="style-config__subsection-title style-config__subsection-title--mt">Content</h5>
                <div className="form-grid" data-cols="3">
                    <ColorPicker label="Job/Degree" color={value.text1.color} onChange={c => updateStyle('text1', c)} />
                    <ColorPicker label="Body Text" color={value.text2.color} onChange={c => updateStyle('text2', c)} />
                    <ColorPicker label="Metadata" color={value.sub.color} onChange={c => updateStyle('sub', c)} />
                </div>
            </div>

            <div className="form-group style-config__typography-group">
                <h4 className="style-config__section-title">Typography (Sizes in pt)</h4>

                <h5 className="style-config__subsection-title">Titles & Headings</h5>
                <div className="form-grid" data-cols="3">
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

                <h5 className="style-config__subsection-title style-config__subsection-title--mt">Content</h5>
                <div className="form-grid" data-cols="3">
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

            <button className="btn btn--secondary btn--sm btn--mt" onClick={() => onChange(defaultStyle())}>
                Reset Styles to Defaults
            </button>
        </div >
    );
}


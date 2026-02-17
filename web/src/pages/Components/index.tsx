import '../../styles/main.scss';
import '../../styles/forms.scss';
import '../../styles/components.scss';

export function ComponentsPage() {
    return (
        <div className="container container--wide">
            <div className="page-title">
                <h1>
                    <span>🎨</span> Components System
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Visual reference for the design system and UI components.
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>

                {/* Typography Section */}
                <section>
                    <h2 style={{ marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                        Typography
                    </h2>
                    <div style={{ display: 'grid', gap: '24px' }}>
                        <div>
                            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>Display (3rem)</div>
                            <h1 style={{ fontSize: 'var(--fs-display)', margin: 0 }}>The quick brown fox</h1>
                        </div>
                        <div>
                            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>H1 (2rem)</div>
                            <h1>Heading level 1</h1>
                        </div>
                        <div>
                            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>H2 (1.5rem)</div>
                            <h2>Heading level 2</h2>
                        </div>
                        <div>
                            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>H3 (1.25rem)</div>
                            <h3>Heading level 3</h3>
                        </div>
                        <div>
                            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>Body (1rem)</div>
                            <p>Body text. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Expedita, qui.</p>
                        </div>
                        <div>
                            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>Small (0.875rem)</div>
                            <p style={{ fontSize: 'var(--fs-sm)' }}>Small text for metadata and captions.</p>
                        </div>
                        <div>
                            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>XS (0.75rem)</div>
                            <p style={{ fontSize: 'var(--fs-xs)' }}>Extra small text for fine print.</p>
                        </div>
                    </div>
                </section>

                {/* Buttons Section */}
                <section>
                    <h2 style={{ marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                        Buttons
                    </h2>
                    <div style={{ display: 'grid', gap: '24px' }}>

                        {/* Variants */}
                        <div>
                            <h3 style={{ fontSize: '1rem', marginBottom: '16px', color: 'var(--text-secondary)' }}>Variants</h3>
                            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                                <button className="btn btn--primary">Primary Button</button>
                                <button className="btn btn--secondary">Secondary Button</button>
                                <button className="btn btn--ghost">Ghost Button</button>
                            </div>
                            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', marginTop: '16px' }}>
                                <button className="btn btn--danger">Danger Button</button>
                            </div>
                        </div>

                        {/* Sizes & Shapes */}
                        <div>
                            <h3 style={{ fontSize: '1rem', marginBottom: '16px', color: 'var(--text-secondary)' }}>Sizes & Shapes</h3>
                            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                                <button className="btn btn--primary btn--sm">Small Button</button>
                                <button className="btn btn--primary">Default Button</button>
                                <button className="btn btn--primary btn--rounded">Rounded Button</button>
                                <button className="btn btn--secondary btn--icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 5v14M5 12h14" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* States */}
                        <div>
                            <h3 style={{ fontSize: '1rem', marginBottom: '16px', color: 'var(--text-secondary)' }}>States (Disabled)</h3>
                            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                <button className="btn btn--primary" disabled>Primary</button>
                                <button className="btn btn--secondary" disabled>Secondary</button>
                            </div>
                        </div>

                    </div>
                </section>

                {/* Forms Section */}
                <section>
                    <h2 style={{ marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                        Form Elements
                    </h2>
                    <div className="form-grid" style={{ maxWidth: '600px' }}>
                        <div className="form-group">
                            <label>Text Input</label>
                            <input type="text" className="form-input" placeholder="Placeholder text..." />
                        </div>
                        <div className="form-group">
                            <label>Select Input</label>
                            <select className="form-select">
                                <option>Option 1</option>
                                <option>Option 2</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Textarea</label>
                            <textarea className="form-textarea" placeholder="Type pretty long text..."></textarea>
                        </div>
                        <div className="form-group">
                            <label className="form-checkbox">
                                <input type="checkbox" defaultChecked />
                                <span>Checkbox option</span>
                            </label>
                        </div>
                        <div className="form-group">
                            <label>Invalid State (Simulated)</label>
                            <input type="text" className="form-input" style={{ borderColor: 'var(--danger)' }} defaultValue="Invalid value" />
                            <span style={{ color: 'var(--danger)', fontSize: 'var(--fs-xs)', marginTop: '4px', display: 'block' }}>Error message here</span>
                        </div>
                    </div>
                </section>

                {/* Cards Section */}
                <section>
                    <h2 style={{ marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                        Cards
                    </h2>
                    <div className="cv-grid">

                        {/* CV Card Example */}
                        <div className="cv-card">
                            <h3 className="cv-card__title">Software Engineer</h3>
                            <div className="cv-card__name">V2 - Final Draft</div>
                            <div className="cv-card__meta">
                                <span>Edited 2 hours ago</span>
                            </div>
                        </div>

                        <div className="cv-card">
                            <h3 className="cv-card__title">Product Manager</h3>
                            <div className="cv-card__name">V1 - Draft</div>
                            <div className="cv-card__meta">
                                <span>Edited 1 day ago</span>
                            </div>
                        </div>

                    </div>

                    <div style={{ marginTop: '24px', maxWidth: '600px' }}>
                        {/* Section Card Example */}
                        <div className="section-card">
                            <div className="section-card__header">
                                <div className="section-card__title">
                                    <div className="icon">💼</div>
                                    Experience
                                </div>
                                <div className="section-card__chevron">▼</div>
                            </div>
                            <div className="section-card__body">
                                <p style={{ color: 'var(--text-secondary)' }}>Content goes here...</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Color Palette Section */}
                <section>
                    <h2 style={{ marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                        Colors
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px' }}>

                        <div style={{ padding: '16px', borderRadius: 'var(--radius)', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                            <div style={{ height: '40px', background: 'var(--accent)', borderRadius: 'var(--radius)', marginBottom: '8px' }}></div>
                            <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 600 }}>Accent</div>
                            <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>--accent</div>
                        </div>

                        <div style={{ padding: '16px', borderRadius: 'var(--radius)', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                            <div style={{ height: '40px', background: 'var(--text-primary)', borderRadius: 'var(--radius)', marginBottom: '8px' }}></div>
                            <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 600 }}>Text Primary</div>
                            <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>--text-primary</div>
                        </div>

                        <div style={{ padding: '16px', borderRadius: 'var(--radius)', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                            <div style={{ height: '40px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', marginBottom: '8px' }}></div>
                            <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 600 }}>Background Secondary</div>
                            <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>--bg-secondary</div>
                        </div>

                        <div style={{ padding: '16px', borderRadius: 'var(--radius)', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                            <div style={{ height: '40px', background: 'var(--danger)', borderRadius: 'var(--radius)', marginBottom: '8px' }}></div>
                            <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 600 }}>Danger</div>
                            <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>--danger</div>
                        </div>

                    </div>
                </section>

            </div>
        </div>
    );
}

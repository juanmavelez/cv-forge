import '../../styles/main.scss';
import '../../styles/forms.scss';
import '../../styles/components.scss';
import './Components.scss';

export function ComponentsPage() {
    return (
        <div className="container container--wide">
            <div className="page-title">
                <h1>
                    <span>🎨</span> Components System
                </h1>
                <p className="text-secondary">
                    Visual reference for the design system and UI components.
                </p>
            </div>

            <div className="components-sections">

                {/* Typography Section */}
                <section>
                    <h2 className="components-section__title">
                        Typography
                    </h2>
                    <div className="components-grid">
                        <div>
                            <div className="components-demo-item__label">Display (3rem)</div>
                            <h1 className="components-demo-item__content--h1">The quick brown fox</h1>

                        </div>
                        <div>
                            <div className="components-demo-item__label">H1 (2rem)</div>
                            <h1>Heading level 1</h1>
                        </div>
                        <div>
                            <div className="components-demo-item__label">H2 (1.5rem)</div>
                            <h2>Heading level 2</h2>
                        </div>
                        <div>
                            <div className="components-demo-item__label">H3 (1.25rem)</div>
                            <h3>Heading level 3</h3>
                        </div>
                        <div>
                            <div className="components-demo-item__label">Body (1rem)</div>
                            <p>Body text. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Expedita, qui.</p>
                        </div>
                        <div>
                            <div className="components-demo-item__label">Small (0.875rem)</div>
                            <p className="components-demo-item__content--small">Small text for metadata and captions.</p>
                        </div>
                        <div>
                            <div className="components-demo-item__label">XS (0.75rem)</div>
                            <p className="components-demo-item__content--xs">Extra small text for fine print.</p>
                        </div>
                    </div>
                </section>

                {/* Buttons Section */}
                <section>
                    <h2 className="components-section__title">
                        Buttons
                    </h2>
                    <div className="components-grid">

                        {/* Variants */}
                        <div>
                            <h3 className="components-subheading">Variants</h3>
                            <div className="components-flex-row">
                                <button className="btn btn--primary">Primary Button</button>
                                <button className="btn btn--secondary">Secondary Button</button>
                                <button className="btn btn--ghost">Ghost Button</button>
                            </div>
                            <div className="components-flex-row components-flex-row--margin-top">
                                <button className="btn btn--danger">Danger Button</button>
                            </div>
                        </div>

                        {/* Sizes & Shapes */}
                        <div>
                            <h3 className="components-subheading">Sizes & Shapes</h3>
                            <div className="components-flex-row">
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
                            <h3 className="components-subheading">States (Disabled)</h3>
                            <div className="components-flex-row">
                                <button className="btn btn--primary" disabled>Primary</button>
                                <button className="btn btn--secondary" disabled>Secondary</button>
                            </div>
                        </div>

                    </div>
                </section>

                {/* Forms Section */}
                <section>
                    <h2 className="components-section__title">
                        Form Elements
                    </h2>
                    <div className="form-grid components-grid--form">
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
                            <input type="text" className="form-input form-input--danger" defaultValue="Invalid value" />
                            <span className="text-danger fs-xs mt-1 block">Error message here</span>
                        </div>
                    </div>
                </section>

                {/* Cards Section */}
                <section>
                    <h2 className="components-section__title">
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

                    <div className="components-card-wrapper">
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
                                <p className="text-secondary">Content goes here...</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Color Palette Section */}
                <section>
                    <h2 className="components-section__title">
                        Colors
                    </h2>
                    <div className="components-color-grid">

                        <div className="components-color-card">
                            <div className="components-color-card__sample components-color-card__sample--accent"></div>
                            <div className="components-color-card__name">Accent</div>
                            <div className="components-color-card__value">--accent</div>
                        </div>

                        <div className="components-color-card">
                            <div className="components-color-card__sample components-color-card__sample--text-primary"></div>
                            <div className="components-color-card__name">Text Primary</div>
                            <div className="components-color-card__value">--text-primary</div>
                        </div>

                        <div className="components-color-card">
                            <div className="components-color-card__sample components-color-card__sample--bg-secondary"></div>
                            <div className="components-color-card__name">Background Secondary</div>
                            <div className="components-color-card__value">--bg-secondary</div>
                        </div>

                        <div className="components-color-card">
                            <div className="components-color-card__sample components-color-card__sample--danger"></div>
                            <div className="components-color-card__name">Danger</div>
                            <div className="components-color-card__value">--danger</div>
                        </div>

                    </div>
                </section>

            </div>
        </div>
    );
}

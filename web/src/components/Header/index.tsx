import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.scss';

function getInitialTheme(): 'light' | 'dark' {
    const saved = localStorage.getItem('cv-forge-theme');
    if (saved === 'dark' || saved === 'light') return saved;
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
}

export function Header() {
    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem('cv-forge-theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

    return (
        <header className="app-header">
            <Link to="/" className="app-header__brand">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                </svg>
                <span>CV Forge</span>
            </Link>

            <nav className="app-header__nav">
                <Link to="/" className="app-header__link">CVs</Link>
                <Link to="/tracker" className="app-header__link">Tracker</Link>
                <Link to="/components" className="app-header__link">UI Kit</Link>
            </nav>

            <div className="app-header__actions">
                <button className="theme-toggle" title="Toggle theme" onClick={toggleTheme}>
                    {theme === 'dark' ? '☀️' : '🌙'}
                </button>
            </div>
        </header >
    );
}

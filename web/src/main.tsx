import { createRoot } from 'react-dom/client';
import { App } from './App';

import '@fontsource/outfit/400.css';
import '@fontsource/outfit/500.css';
import '@fontsource/outfit/600.css';
import '@fontsource/outfit/700.css';

import './styles/main.scss';
import './styles/forms.scss';
import './styles/components.scss';
import './styles/layout.scss';

// Initialize theme before render
const saved = localStorage.getItem('cv-forge-theme');
if (saved === 'dark' || saved === 'light') {
    document.documentElement.dataset.theme = saved;
} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.dataset.theme = 'dark';
}

createRoot(document.getElementById('root')!).render(<App />);

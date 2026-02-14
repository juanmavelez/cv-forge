import { createRoot } from 'react-dom/client';
import { App } from './App';

import './styles/main.css';
import './styles/forms.css';
import './styles/components.css';
import './styles/layout.css';

// Initialize theme before render
const saved = localStorage.getItem('cv-forge-theme');
if (saved === 'dark' || saved === 'light') {
    document.documentElement.dataset.theme = saved;
} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.dataset.theme = 'dark';
}

createRoot(document.getElementById('root')!).render(<App />);

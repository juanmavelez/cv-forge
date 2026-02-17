import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api';
import { useToast } from '../../components/Toast/index';
import { useModal } from '../../components/Modal/index';
import { emptyCVData } from '../../types';
import type { CV, CVExport } from '../../types';

export function Dashboard() {
    const [cvs, setCvs] = useState<CV[]>([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();
    const { confirm, prompt } = useModal();
    const navigate = useNavigate();

    const loadCvs = async () => {
        try {
            const data = await api.listCVs();
            setCvs(data);
        } catch (err) {
            toast(`Failed to load CVs: ${err}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadCvs(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleNewCV = async () => {
        const title = await prompt('Create New CV', 'CV Title', 'My CV');
        if (title === null) return;
        try {
            const cv = await api.createCV(title || 'My CV', emptyCVData());
            toast('CV created!', 'success');
            navigate(`/cv/${cv.id}`);
        } catch (err) {
            toast(`Failed to create CV: ${err}`, 'error');
        }
    };

    const handleImport = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.addEventListener('change', async () => {
            const file = input.files?.[0];
            if (!file) return;
            try {
                const text = await file.text();
                const data: CVExport = JSON.parse(text);
                await api.importCV(data);
                toast('CV imported successfully!', 'success');
                loadCvs();
            } catch (err) {
                toast(`Import failed: ${err}`, 'error');
            }
        });
        input.click();
    };

    const handleDelete = async (e: React.MouseEvent, cv: CV) => {
        e.stopPropagation();
        const ok = await confirm('Delete CV', `Are you sure you want to delete "${cv.title}"? This cannot be undone.`);
        if (!ok) return;
        try {
            await api.deleteCV(cv.id);
            toast('CV deleted', 'success');
            loadCvs();
        } catch (err) {
            toast(`Failed to delete: ${err}`, 'error');
        }
    };

    if (loading) return <div className="container"><p>Loading…</p></div>;

    return (
        <div className="container container--wide">
            <div className="page-title">
                <h1>My CVs</h1>
                <div className="page-title__actions">
                    <button className="btn btn--primary btn--rounded" onClick={handleNewCV}>✨ New CV</button>
                    <button className="btn btn--secondary" onClick={handleImport}>↑ Import JSON</button>
                </div>
            </div>

            {cvs.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state__icon">📝</div>
                    <div className="empty-state__title">No CVs yet</div>
                    <div className="empty-state__desc">Create your first CV to get started</div>
                </div>
            ) : (
                <div className="cv-grid">
                    {cvs.map(cv => {
                        const name = [cv.data.personal.firstName, cv.data.personal.lastName].filter(Boolean).join(' ') || 'No name set';
                        const updated = new Date(cv.updatedAt).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric',
                        });
                        return (
                            <div key={cv.id} className="cv-card" onClick={() => navigate(`/cv/${cv.id}`)}>
                                <div className="cv-card__actions">
                                    <button className="btn btn--ghost btn--sm btn--icon delete-btn" title="Delete" onClick={e => handleDelete(e, cv)}>🗑</button>
                                </div>
                                <div className="cv-card__title">{cv.title}</div>
                                <div className="cv-card__name">{name}</div>
                                <div className="cv-card__meta">
                                    <span>Updated {updated}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

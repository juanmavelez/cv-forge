import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import { useToast } from '../components/Toast/index';
import { useModal } from '../components/Modal/index';
import type { CVVersion, CVData } from '../types';

export function History() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const toast = useToast();
    const { confirm } = useModal();

    const [versions, setVersions] = useState<CVVersion[]>([]);
    const [cvTitle, setCvTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [viewData, setViewData] = useState<{ message: string; data: CVData } | null>(null);

    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                const cv = await api.getCV(id);
                setCvTitle(cv.title);
                const v = await api.listVersions(id);
                setVersions(v);
            } catch {
                toast('CV not found', 'error');
                navigate('/');
            } finally {
                setLoading(false);
            }
        })();
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleRestore = async (versionId: string) => {
        if (!id) return;
        const ok = await confirm('Restore Version', 'This will overwrite the current CV data with this version. Continue?');
        if (!ok) return;
        try {
            await api.restoreVersion(id, versionId);
            toast('Version restored!', 'success');
            navigate(`/cv/${id}`);
        } catch (err) {
            toast(`Restore failed: ${err}`, 'error');
        }
    };

    const handleView = async (versionId: string, message: string) => {
        if (!id) return;
        try {
            const version = await api.getVersion(id, versionId);
            setViewData({ message: message || 'Snapshot', data: version.data });
        } catch (err) {
            toast(`Failed to load version: ${err}`, 'error');
        }
    };

    if (loading) return <div className="container"><p>Loading…</p></div>;

    return (
        <div className="container">
            <Link to={`/cv/${id}`} className="back-link">← Back to Editor</Link>

            <div className="page-title">
                <h1>🕐 Version History</h1>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>{cvTitle}</p>

            {versions.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state__icon">📸</div>
                    <div className="empty-state__title">No versions yet</div>
                    <div className="empty-state__desc">Save a version from the editor to create a snapshot</div>
                </div>
            ) : (
                <div className="timeline">
                    {versions.map(v => {
                        const date = new Date(v.createdAt).toLocaleString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                        });
                        return (
                            <div key={v.id} className="timeline-item">
                                <div className="timeline-item__message">{v.message || 'Snapshot'}</div>
                                <div className="timeline-item__date">{date}</div>
                                <div className="timeline-item__actions">
                                    <button className="btn btn--ghost btn--sm" onClick={() => handleView(v.id, v.message)}>👁 View</button>
                                    <button className="btn btn--secondary btn--sm" onClick={() => handleRestore(v.id)}>↩ Restore</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* View modal */}
            {viewData && (
                <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setViewData(null)}>
                    <div className="modal" style={{ maxWidth: 600 }}>
                        <h3 className="modal__title">Version: {viewData.message}</h3>
                        <pre style={{
                            maxHeight: 400, overflow: 'auto', fontSize: '0.75rem',
                            background: 'var(--bg-tertiary)', padding: 12, borderRadius: 'var(--radius-sm)',
                            whiteSpace: 'pre-wrap', wordBreak: 'break-all',
                        }}>
                            {JSON.stringify(viewData.data, null, 2)}
                        </pre>
                        <div className="modal__actions">
                            <button className="btn btn--secondary" onClick={() => setViewData(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

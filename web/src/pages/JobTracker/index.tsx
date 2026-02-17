import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { applicationsApi } from '../../api';
import { Application } from '../../types';
import { useToast } from '../../components/Toast';
import { useModal } from '../../components/Modal';
import { ApplicationList } from './components/ApplicationList';
import { ApplicationBoard } from './components/ApplicationBoard';
import './JobTracker.scss';

export function JobTracker() {
    const navigate = useNavigate();
    const [view, setView] = useState<'list' | 'board'>('board');
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);

    const toast = useToast();
    const { confirm } = useModal();

    const loadData = async () => {
        setLoading(true);
        try {
            const appsData = await applicationsApi.list();
            setApplications(appsData);
        } catch (err) {
            toast('Failed to load data', 'error');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleCreate = () => {
        navigate('/tracker/new');
    };

    const handleEdit = (app: Application) => {
        navigate(`/tracker/${app.id}`);
    };

    const handleDelete = async (app: Application) => {
        if (await confirm('Delete Application', `Are you sure you want to delete the application for ${app.role} at ${app.company}?`)) {
            try {
                await applicationsApi.delete(app.id);
                toast('Application deleted', 'success');
                loadData();
            } catch (err) {
                toast('Failed to delete application', 'error');
            }
        }
    };

    return (
        <div className="container job-tracker">
            <header className="page-header">
                <div>
                    <h1>Job Tracker</h1>
                    <p>Manage your job applications and link them to your CVs.</p>
                </div>
                <div className="header-actions">
                    <div className="view-toggle">
                        <button
                            className={`btn-icon ${view === 'list' ? 'active' : ''}`}
                            onClick={() => setView('list')}
                            title="List View"
                        >
                            📋
                        </button>
                        <button
                            className={`btn-icon ${view === 'board' ? 'active' : ''}`}
                            onClick={() => setView('board')}
                            title="Board View"
                        >
                            📊
                        </button>
                    </div>
                    <button className="btn btn--primary" onClick={handleCreate}>
                        + Add Application
                    </button>
                </div>
            </header>

            {loading ? (
                <div className="loading-state">Loading...</div>
            ) : view === 'list' ? (
                <ApplicationList
                    applications={applications}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            ) : (
                <ApplicationBoard
                    applications={applications}
                    onEdit={handleEdit}
                />
            )}
        </div>
    );
}

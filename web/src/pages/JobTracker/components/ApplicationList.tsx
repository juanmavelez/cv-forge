import { Application, ApplicationStatus } from '../../../types';

interface ApplicationListProps {
    applications: Application[];
    onEdit: (app: Application) => void;
    onDelete: (app: Application) => void;
}

export function ApplicationList({ applications, onEdit, onDelete }: ApplicationListProps) {
    if (applications.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-state__icon">📋</div>
                <h3 className="empty-state__title">No applications yet</h3>
                <p className="empty-state__desc">Track your first job application to get started.</p>
            </div>
        );
    }

    const getStatusBadge = (status: ApplicationStatus) => {
        const statusClass = status.toLowerCase().replace(/\s+/g, '-');

        return (
            <span className={`status-badge status-badge--${statusClass}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="table-container">
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Company</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Date Applied</th>
                        <th className="text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {applications.map(app => (
                        <tr key={app.id}>
                            <td>
                                <div className="font-medium">{app.company}</div>
                                {app.salary && <div className="text-sm text-gray-500">{app.salary}</div>}
                            </td>
                            <td>
                                <div>{app.role}</div>
                                {app.url && <a href={app.url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">View Job</a>}
                            </td>
                            <td>{getStatusBadge(app.status)}</td>
                            <td>{new Date(app.date).toLocaleDateString()}</td>
                            <td className="text-right">
                                <div className="action-buttons">
                                    <button
                                        onClick={() => onEdit(app)}
                                        className="btn-icon"
                                        title="Edit"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        onClick={() => onDelete(app)}
                                        className="btn-icon btn-icon--danger"
                                        title="Delete"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

import { Application, ApplicationStatus } from '../../../types';

interface ApplicationBoardProps {
    applications: Application[];
    onEdit: (app: Application) => void;
}

export function ApplicationBoard({ applications, onEdit }: ApplicationBoardProps) {
    const columns = Object.values(ApplicationStatus);

    return (
        <div className="board-grid">
            {columns.map(status => {
                const apps = applications.filter(a => a.status === status);
                return (
                    <div key={status} className="board-column">
                        <h3 className="board-column__title">
                            {status} <span className="board-column__count">{apps.length}</span>
                        </h3>
                        <div className="board-column__content">
                            {apps.map(app => (
                                <div
                                    key={app.id}
                                    className="board-card"
                                    onClick={() => onEdit(app)}
                                >
                                    <h4 className="board-card__role">{app.role}</h4>
                                    <div className="board-card__company">{app.company}</div>
                                    <div className="board-card__footer">
                                        <span className="board-card__date">
                                            {new Date(app.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </span>
                                        {app.cvId && <span className="board-card__cv">📄</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

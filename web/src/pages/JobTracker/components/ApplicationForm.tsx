import { useState, useEffect } from 'react';
import { Application, ApplicationStatus, CV, CVVersion } from '../../../types';
import { FormInput } from '../../../components/FormInput';
import { api } from '../../../api';

interface ApplicationFormProps {
    initialData?: Application;
    onSubmit: (data: any) => Promise<void>;
    onCancel: () => void;
    cvs: CV[];
}

export function ApplicationForm({ initialData, onSubmit, onCancel, cvs }: ApplicationFormProps) {
    const [formData, setFormData] = useState({
        company: '',
        role: '',
        status: ApplicationStatus.Applied,
        salary: '',
        url: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
        cvId: '',
        cvVersionId: '',
    });

    const [loading, setLoading] = useState(false);
    const [versions, setVersions] = useState<CVVersion[]>([]);

    useEffect(() => {
        if (initialData) {
            setFormData({
                company: initialData.company,
                role: initialData.role,
                status: initialData.status,
                salary: initialData.salary,
                url: initialData.url,
                date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : '',
                notes: initialData.notes,
                cvId: initialData.cvId || '',
                cvVersionId: initialData.cvVersionId || '',
            });
        }
    }, [initialData]);

    // Load versions when CV is selected
    useEffect(() => {
        if (formData.cvId) {
            api.listVersions(formData.cvId).then(setVersions).catch(console.error);
        } else {
            setVersions([]);
        }
    }, [formData.cvId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit({
                ...formData,
                date: new Date(formData.date).toISOString(),
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="application-form">
            <div className="form-grid" data-cols="2">
                <FormInput
                    label="Company"
                    value={formData.company}
                    onChange={v => setFormData({ ...formData, company: v })}
                />
                <FormInput
                    label="Role"
                    value={formData.role}
                    onChange={v => setFormData({ ...formData, role: v })}
                />
            </div>

            <div className="form-grid" data-cols="2">
                <div className="form-group">
                    <label>Status</label>
                    <div className="select-wrapper">
                        <select
                            className="form-select"
                            value={formData.status}
                            onChange={e => setFormData({ ...formData, status: e.target.value as ApplicationStatus })}
                        >
                            {Object.values(ApplicationStatus).map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <FormInput
                    label="Date Applied"
                    type="date"
                    value={formData.date}
                    onChange={v => setFormData({ ...formData, date: v })}
                />
            </div>

            <div className="form-grid" data-cols="2">
                <FormInput
                    label="Salary Expectation"
                    value={formData.salary}
                    onChange={v => setFormData({ ...formData, salary: v })}
                    placeholder="e.g. $120k"
                />
                <FormInput
                    label="Job URL"
                    value={formData.url}
                    onChange={v => setFormData({ ...formData, url: v })}
                    placeholder="https://..."
                />
            </div>

            <div className="form-group">
                <label>Linked CV (Optional)</label>
                <div className="form-grid" data-cols="2">
                    <div className="select-wrapper">
                        <select
                            className="form-select"
                            value={formData.cvId}
                            onChange={e => setFormData({ ...formData, cvId: e.target.value, cvVersionId: '' })}
                        >
                            <option value="">Select CV...</option>
                            {cvs.map(cv => (
                                <option key={cv.id} value={cv.id}>{cv.title}</option>
                            ))}
                        </select>
                    </div>

                    <div className="select-wrapper">
                        <select
                            className="form-select"
                            value={formData.cvVersionId}
                            onChange={e => setFormData({ ...formData, cvVersionId: e.target.value })}
                            disabled={!formData.cvId}
                        >
                            <option value="">Current Version (Live)</option>
                            {versions.map(v => (
                                <option key={v.id} value={v.id}>
                                    {v.message || new Date(v.createdAt).toLocaleDateString()}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="form-group">
                <label>Notes</label>
                <textarea
                    className="form-textarea"
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    rows={4}
                />
            </div>

            <div className="modal__actions">
                <button type="button" className="btn btn--secondary" onClick={onCancel} disabled={loading}>
                    Cancel
                </button>
                <button type="submit" className="btn btn--primary" disabled={loading}>
                    {loading ? 'Saving...' : (initialData ? 'Update' : 'Create')}
                </button>
            </div>
        </form>
    );
}

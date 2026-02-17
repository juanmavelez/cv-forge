import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, applicationsApi } from '../../api';
import { Application, CV } from '../../types';
import { useToast } from '../../components/Toast';
import { ApplicationForm } from './components/ApplicationForm';

export function ApplicationEditor() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const toast = useToast();

    const [application, setApplication] = useState<Application | undefined>(undefined);
    const [cvs, setCvs] = useState<CV[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const [cvsData, appData] = await Promise.all([
                    api.listCVs(),
                    id ? applicationsApi.get(id) : Promise.resolve(undefined)
                ]);
                setCvs(cvsData);
                if (appData) setApplication(appData);
            } catch (err) {
                toast('Failed to load data', 'error');
                navigate('/tracker');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id, navigate, toast]);

    const handleSubmit = async (data: any) => {
        try {
            if (id) {
                await applicationsApi.update(id, data);
                toast('Application updated', 'success');
            } else {
                await applicationsApi.create(data);
                toast('Application created', 'success');
            }
            navigate('/tracker');
        } catch (err) {
            toast('Failed to save application', 'error');
        }
    };

    if (loading) return <div className="container">Loading...</div>;

    return (
        <div className="container">
            <header className="page-header">
                <div>
                    <h1>{id ? 'Edit Application' : 'New Application'}</h1>
                    <p>{id ? 'Update your application details' : 'Track a new job opportunity'}</p>
                </div>
            </header>

            <div className="card">

                <ApplicationForm
                    initialData={application}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate('/tracker')}
                    cvs={cvs}
                />
            </div>
        </div>
    );
}

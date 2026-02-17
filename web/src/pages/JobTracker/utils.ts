import { ApplicationStatus } from '../../types';

export const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
        case ApplicationStatus.Applied:
            return { background: '#e0f2fe', color: '#0369a1' };
        case ApplicationStatus.Interviewing:
            return { background: '#fef3c7', color: '#92400e' };
        case ApplicationStatus.Offer:
            return { background: '#dcfce7', color: '#166534' };
        case ApplicationStatus.Rejected:
            return { background: '#fee2e2', color: '#991b1b' };
        default:
            return { background: '#f3f4f6', color: '#374151' };
    }
};

import { Application, CreateApplicationRequest, UpdateApplicationRequest } from '../types';

const API_BASE = '/api/applications';

export const applicationsApi = {
    list: async (): Promise<Application[]> => {
        const res = await fetch(API_BASE);
        if (!res.ok) throw new Error('Failed to list applications');
        return res.json();
    },

    get: async (id: string): Promise<Application> => {
        const res = await fetch(`${API_BASE}/${id}`);
        if (!res.ok) throw new Error('Failed to get application');
        return res.json();
    },

    create: async (req: CreateApplicationRequest): Promise<Application> => {
        const res = await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req),
        });
        if (!res.ok) throw new Error('Failed to create application');
        return res.json();
    },

    update: async (id: string, req: UpdateApplicationRequest): Promise<Application> => {
        const res = await fetch(`${API_BASE}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req),
        });
        if (!res.ok) throw new Error('Failed to update application');
        return res.json();
    },

    delete: async (id: string): Promise<void> => {
        const res = await fetch(`${API_BASE}/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('Failed to delete application');
    },
};

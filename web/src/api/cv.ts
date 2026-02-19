import type { CV, CVData, CVVersion, CVExport } from '../types';

const BASE = import.meta.env.VITE_API_BASE || '/api';

async function request<T>(path: string, opts?: RequestInit): Promise<T> {
    const res = await fetch(BASE + path, {
        headers: { 'Content-Type': 'application/json' },
        ...opts,
    });
    if (!res.ok) {
        const body = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(body.error || `Request failed: ${res.status}`);
    }
    return res.json();
}

export const api = {
    listCVs: () => request<CV[]>('/cvs'),

    getCV: (id: string) => request<CV>(`/cvs/${id}`),

    createCV: (title: string, data: CVData) =>
        request<CV>('/cvs', { method: 'POST', body: JSON.stringify({ title, data }) }),

    updateCV: (id: string, title: string, data: CVData) =>
        request<CV>(`/cvs/${id}`, { method: 'PUT', body: JSON.stringify({ title, data }) }),

    deleteCV: (id: string) =>
        request<{ status: string }>(`/cvs/${id}`, { method: 'DELETE' }),


    listVersions: (cvId: string) =>
        request<CVVersion[]>(`/cvs/${cvId}/versions`),

    createVersion: (cvId: string, message: string) =>
        request<CVVersion>(`/cvs/${cvId}/versions`, {
            method: 'POST',
            body: JSON.stringify({ message }),
        }),

    getVersion: (cvId: string, versionId: string) =>
        request<CVVersion>(`/cvs/${cvId}/versions/${versionId}`),

    restoreVersion: (cvId: string, versionId: string) =>
        request<CV>(`/cvs/${cvId}/versions/${versionId}/restore`, { method: 'POST' }),


    exportPDFUrl: (id: string) => `${BASE}/cvs/${id}/export/pdf`,
    exportDOCXUrl: (id: string) => `${BASE}/cvs/${id}/export/docx`,
    exportJSONUrl: (id: string) => `${BASE}/cvs/${id}/export/json`,

    exportPDFLive: async (id: string, title: string, data: CVData): Promise<Blob> => {
        const res = await fetch(`${BASE}/cvs/${id}/export/pdf`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, data }),
        });
        if (!res.ok) throw new Error('Live export failed');
        return res.blob();
    },

    importCV: (data: CVExport) =>
        request<CV>('/cvs/import', { method: 'POST', body: JSON.stringify(data) }),
};

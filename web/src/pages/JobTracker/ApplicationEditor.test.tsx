import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApplicationEditor } from './ApplicationEditor';
import { api, applicationsApi } from '../../api';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from '../../components/Toast';
import { ModalProvider } from '../../components/Modal';
import { ApplicationStatus } from '../../types';

// Mock API
vi.mock('../../api', () => ({
    api: {
        listCVs: vi.fn(),
    },
    applicationsApi: {
        get: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
    }
}));

describe('Feature: Application Editor', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Scenario: Rendering New Application form', async () => {
        (api.listCVs as any).mockResolvedValue([]);

        render(
            <MemoryRouter initialEntries={['/tracker/new']}>
                <Routes>
                    <Route path="/tracker/new" element={
                        <ToastProvider>
                            <ModalProvider>
                                <ApplicationEditor />
                            </ModalProvider>
                        </ToastProvider>
                    } />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('New Application')).toBeInTheDocument();
            expect(screen.getByText('Company')).toBeInTheDocument();
            expect(screen.getByText('Role')).toBeInTheDocument();
            expect(screen.getByText('Create')).toBeInTheDocument();
        });
    });

    it('Scenario: Loading existing application for Edit', async () => {
        const mockApp = {
            id: '123',
            company: 'Google',
            role: 'Engineer',
            status: ApplicationStatus.Applied,
            date: new Date().toISOString(),
            salary: '',
            url: '',
            notes: ''
        };
        (api.listCVs as any).mockResolvedValue([]);
        (applicationsApi.get as any).mockResolvedValue(mockApp);

        render(
            <MemoryRouter initialEntries={['/tracker/123']}>
                <Routes>
                    <Route path="/tracker/:id" element={
                        <ToastProvider>
                            <ModalProvider>
                                <ApplicationEditor />
                            </ModalProvider>
                        </ToastProvider>
                    } />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Edit Application')).toBeInTheDocument();
            expect(screen.getByDisplayValue('Google')).toBeInTheDocument();
            expect(screen.getByDisplayValue('Engineer')).toBeInTheDocument();
        });
    });
});

import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { JobTracker } from '.';
import { applicationsApi } from '../../api';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from '../../components/Toast';
import { ModalProvider } from '../../components/Modal';

// Mock API
vi.mock('../../api', () => ({
    applicationsApi: {
        list: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
    }
}));

describe('Feature: Job Tracker', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Scenario: Renders empty state', async () => {
        (applicationsApi.list as any).mockResolvedValue([]);

        render(
            <BrowserRouter>
                <ToastProvider>
                    <ModalProvider>
                        <JobTracker />
                    </ModalProvider>
                </ToastProvider>
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Job Tracker')).toBeInTheDocument();
            // Assuming empty state text or just checking that loading is done
            expect(screen.queryByText('Loading…')).not.toBeInTheDocument();
        });
    });

    it('Scenario: Renders list of applications', async () => {
        const mockApps = [
            { id: '1', role: 'Software Engineer', company: 'Google', status: 'Applied', date: new Date().toISOString() },
            { id: '2', role: 'Product Manager', company: 'Amazon', status: 'Interviewing', date: new Date().toISOString() }
        ];
        (applicationsApi.list as any).mockResolvedValue(mockApps);

        render(
            <BrowserRouter>
                <ToastProvider>
                    <ModalProvider>
                        <JobTracker />
                    </ModalProvider>
                </ToastProvider>
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Google')).toBeInTheDocument();
            expect(screen.getByText('Software Engineer')).toBeInTheDocument();
            expect(screen.getByText('Amazon')).toBeInTheDocument();
            expect(screen.getByText('Product Manager')).toBeInTheDocument();
        });
    });
});

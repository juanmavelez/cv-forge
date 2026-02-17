import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { History } from '.';
import { api } from '../../api';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from '../../components/Toast';
import { ModalProvider } from '../../components/Modal';

// Mock API
vi.mock('../../api', () => ({
    api: {
        getCV: vi.fn(),
        listVersions: vi.fn(),
        restoreVersion: vi.fn(),
        getVersion: vi.fn(),
    }
}));

describe('Feature: CV History', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Scenario: Displaying version history', async () => {
        const mockCV = { id: '123', title: 'My CV', data: {} };
        const mockVersions = [
            { id: 'v1', cvId: '123', message: 'Initial commit', createdAt: new Date().toISOString() },
            { id: 'v2', cvId: '123', message: 'Updated skills', createdAt: new Date().toISOString() },
        ];

        (api.getCV as any).mockResolvedValue(mockCV);
        (api.listVersions as any).mockResolvedValue(mockVersions);

        render(
            <MemoryRouter initialEntries={['/cv/123/history']}>
                <Routes>
                    <Route path="/cv/:id/history" element={
                        <ToastProvider>
                            <ModalProvider>
                                <History />
                            </ModalProvider>
                        </ToastProvider>
                    } />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('My CV')).toBeInTheDocument();
            expect(screen.getByText('Initial commit')).toBeInTheDocument();
            expect(screen.getByText('Updated skills')).toBeInTheDocument();
        });
    });
});

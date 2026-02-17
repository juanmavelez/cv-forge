import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Dashboard } from '.';
import { api } from '../../api';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from '../../components/Toast';
import { ModalProvider } from '../../components/Modal';

// Mock API
vi.mock('../../api', () => ({
    api: {
        listCVs: vi.fn(),
        createCV: vi.fn(),
        deleteCV: vi.fn(),
        importCV: vi.fn(),
    }
}));

describe('Feature: Dashboard', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Scenario: Displaying list of CVs', async () => {
        // Given the API returns a list of CVs
        const mockCVs = [
            { id: '1', title: 'My CV', data: { personal: { firstName: 'John', lastName: 'Doe' } }, updatedAt: new Date().toISOString() },
            { id: '2', title: 'Another CV', data: { personal: { firstName: 'Jane', lastName: 'Smith' } }, updatedAt: new Date().toISOString() }
        ];
        (api.listCVs as any).mockResolvedValue(mockCVs);

        // When the dashboard is rendered
        render(
            <BrowserRouter>
                <ToastProvider>
                    <ModalProvider>
                        <Dashboard />
                    </ModalProvider>
                </ToastProvider>
            </BrowserRouter>
        );

        // Then it should display the CVs
        await waitFor(() => {
            expect(screen.getByText('My CV')).toBeInTheDocument();
            expect(screen.getByText('Another CV')).toBeInTheDocument();
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });
    });

    it('Scenario: Handling API errors', async () => {
        // Given the API fails
        (api.listCVs as any).mockRejectedValue(new Error('Network error'));

        render(
            <BrowserRouter>
                <ToastProvider>
                    <ModalProvider>
                        <Dashboard />
                    </ModalProvider>
                </ToastProvider>
            </BrowserRouter>
        );

        // Then an error toast should appear
        await waitFor(() => {
            expect(screen.getByText(/Failed to load CVs/i)).toBeInTheDocument();
        });
    });
});

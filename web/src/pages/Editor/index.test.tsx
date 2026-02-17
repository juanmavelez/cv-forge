import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Editor } from './index';
import { api } from '../../api';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from '../../components/Toast';
import { emptyCVData } from '../../types';

// Mock API
vi.mock('../../api', () => ({
    api: {
        getCV: vi.fn(),
        updateCV: vi.fn(),
        createVersion: vi.fn(),
        exportPDFUrl: vi.fn(),
        exportDOCXUrl: vi.fn(),
        exportJSONUrl: vi.fn(),
    }
}));

// Mock scrollIntoView for jsdom
window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe('Feature: Editor', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Scenario: Rendering editor with CV data', async () => {
        const mockCV = {
            id: '123',
            title: 'My CV',
            data: { ...emptyCVData(), personal: { ...emptyCVData().personal, firstName: 'John' } }
        };
        (api.getCV as any).mockResolvedValue(mockCV);

        render(
            <MemoryRouter initialEntries={['/cv/123']}>
                <Routes>
                    <Route path='/cv/:id' element={
                        <ToastProvider>
                                <Editor />
                        </ToastProvider>
                    } />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByDisplayValue('My CV')).toBeInTheDocument();
            expect(screen.getByDisplayValue('John')).toBeInTheDocument();
        });
    });
});

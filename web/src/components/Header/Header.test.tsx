import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Header } from './index';
import { BrowserRouter } from 'react-router-dom';

describe('Feature: Header Theme Toggle', () => {

    beforeEach(() => {
        Object.defineProperty(window, 'localStorage', {
            value: {
                getItem: vi.fn(() => null),
                setItem: vi.fn(),
                removeItem: vi.fn(),
                clear: vi.fn(),
            },
            writable: true
        });
    });

    it('Scenario: User toggles theme from light to dark', async () => {
        // Given the header is rendered in light mode
        vi.spyOn(window.localStorage, 'getItem').mockReturnValue('light');
        render(
            <BrowserRouter>
                <Header />
            </BrowserRouter>
        );
        const toggleBtn = screen.getByTitle('Toggle theme');
        expect(toggleBtn).toHaveTextContent('🌙');

        // When the user clicks the theme toggle button
        await userEvent.click(toggleBtn);

        // Then the theme should switch to dark
        expect(toggleBtn).toHaveTextContent('☀️');
        expect(document.documentElement.dataset.theme).toBe('dark');
        expect(window.localStorage.setItem).toHaveBeenCalledWith('cv-forge-theme', 'dark');
    });
});

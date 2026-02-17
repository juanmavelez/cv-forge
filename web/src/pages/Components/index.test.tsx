import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ComponentsPage } from '.';
import { BrowserRouter } from 'react-router-dom';

describe('Feature: Components Page', () => {
    it('Scenario: Renders all sections', () => {
        render(
            <BrowserRouter>
                <ComponentsPage />
            </BrowserRouter>
        );

        // Header
        expect(screen.getByText('Components System')).toBeInTheDocument();

        // Sections
        expect(screen.getByText('Typography')).toBeInTheDocument();
        expect(screen.getByText('Buttons')).toBeInTheDocument();
        expect(screen.getByText('Form Elements')).toBeInTheDocument();
        expect(screen.getByText('Cards')).toBeInTheDocument();
        expect(screen.getByText('Colors')).toBeInTheDocument();
    });

    it('Scenario: Renders button variants', () => {
        render(
            <BrowserRouter>
                <ComponentsPage />
            </BrowserRouter>
        );

        expect(screen.getByText('Primary Button')).toHaveClass('btn--primary');
        expect(screen.getByText('Secondary Button')).toHaveClass('btn--secondary');
        expect(screen.getByText('Ghost Button')).toHaveClass('btn--ghost');
        expect(screen.getByText('Danger Button')).toHaveClass('btn--danger');
    });
});

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SectionCard } from './index';

describe('Feature: Section Card Expansion', () => {
    it('Scenario: Toggling section expansion', () => {
        // Given a closed section card
        const handleToggle = vi.fn();
        const { rerender } = render(
            <SectionCard title="Experience" icon="💼" isOpen={false} onToggle={handleToggle}>
                <div data-testid="content">Section Content</div>
            </SectionCard>
        );

        expect(screen.queryByTestId('content')).not.toBeInTheDocument();

        // When the user clicks the header
        fireEvent.click(screen.getByText('Experience'));

        // Then the toggle handler should be called
        expect(handleToggle).toHaveBeenCalled();

        // Given the section is now open (simulating parent state update)
        rerender(
            <SectionCard title="Experience" icon="💼" isOpen={true} onToggle={handleToggle}>
                <div data-testid="content">Section Content</div>
            </SectionCard>
        );

        // Then the content should be visible
        expect(screen.getByTestId('content')).toBeInTheDocument();
    });
});

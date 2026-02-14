import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FormInput } from './index';

describe('Feature: Form Input', () => {
    it('Scenario: Rendering and handling input changes', () => {
        // Given a form input with an initial value
        const handleChange = vi.fn();
        render(<FormInput label="Full Name" value="John Doe" onChange={handleChange} />);

        const input = screen.getByRole('textbox');
        expect(input).toHaveValue('John Doe');
        expect(screen.getByText('Full Name')).toBeInTheDocument();

        // When the user types a new value
        fireEvent.change(input, { target: { value: 'Jane Doe' } });

        // Then the onChange handler should be called
        expect(handleChange).toHaveBeenCalledWith('Jane Doe');
    });
});

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CVSettings } from './index';
import { emptyCVData } from '../../types';

describe('Feature: CV Styling Configuration', () => {
    it('Scenario: User changes the Name color', async () => {
        const updateData = vi.fn();
        const data = emptyCVData();
        if (data.style) {
            data.style.title1.color = [0, 0, 0];
        }

        render(<CVSettings data={data} updateData={updateData} />);

        const nameLabels = screen.getAllByText('Name');
        expect(nameLabels.length).toBeGreaterThan(0);

        const input = document.querySelector('input[type="color"][value="#000000"]');
        expect(input).toBeInTheDocument();

        if (input) {
            fireEvent.change(input, { target: { value: '#ff0000' } });
        }
        expect(updateData).toHaveBeenCalled();
    });

    it('Scenario: User changes the Name size', () => {
        const updateData = vi.fn();
        const data = emptyCVData();
        // Force a known initial size
        if (data.style) {
            data.style.title1.size = 18;
        }

        render(<CVSettings data={data} updateData={updateData} />);


        const nameSizeInput = screen.getByDisplayValue('18');

        expect(nameSizeInput).toBeInTheDocument();
        expect(nameSizeInput).toHaveValue(18);

        if (nameSizeInput) {
            fireEvent.change(nameSizeInput, { target: { value: '24' } });
            expect(updateData).toHaveBeenCalled();
            // Verify args if possible or just call count
        }
    });

    it('Scenario: User changes all configuration options', () => {
        const updateData = vi.fn();
        const data = emptyCVData();
        render(<CVSettings data={data} updateData={updateData} />);

        const colorInputs = document.querySelectorAll('input[type="color"]');
        colorInputs.forEach(input => {
            fireEvent.change(input, { target: { value: '#123456' } });
        });

        const numberInputs = screen.getAllByRole('spinbutton'); // input type="number"
        numberInputs.forEach(input => {
            fireEvent.change(input, { target: { value: '20' } });
        });

        expect(updateData).toHaveBeenCalled();
        expect(updateData.mock.calls.length).toBeGreaterThan(5);
    });

    it('Scenario: User resets styles to defaults', () => {
        const updateData = vi.fn();
        const data = emptyCVData();
        render(<CVSettings data={data} updateData={updateData} />);

        const resetBtn = screen.getByRole('button', { name: /reset styles/i });
        fireEvent.click(resetBtn);

        expect(updateData).toHaveBeenCalled();
    });
});

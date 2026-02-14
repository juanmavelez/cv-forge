import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CVPreview } from './index';
import { emptyCVData } from '../../types';

describe('Feature: CV Preview Rendering', () => {
    it('Scenario: Renders CV data correctly', () => {
        // Given a CV object with personal info and summary
        const data = emptyCVData();
        data.personal.firstName = 'John';
        data.personal.lastName = 'Doe';
        data.personal.title = 'Software Engineer';
        data.summary = 'Passionate developer.';

        // When the preview is rendered
        render(<CVPreview data={data} />);

        // Then the information should be visible
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Software Engineer')).toBeInTheDocument();
        expect(screen.getByText('Passionate developer.')).toBeInTheDocument();
    });

    it('Scenario: Renders empty state when no data', () => {
        const data = emptyCVData();
        render(<CVPreview data={data} />);
        expect(screen.getByText(/Start filling in the form/i)).toBeInTheDocument();
    });
});

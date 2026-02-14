import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { ModalProvider, useModal } from './index';
import { useState } from 'react';

// Wrapper component to trigger modal
function TestComponent() {
    const { confirm } = useModal();
    const [result, setResult] = useState<string>('');

    const handleConfirm = async () => {
        const confirmed = await confirm('Confirm Action', 'Are you sure?');
        setResult(confirmed ? 'Confirmed' : 'Cancelled');
    };

    return (
        <div>
            <button onClick={handleConfirm}>Trigger Confirm</button>
            <div data-testid="result">{result}</div>
        </div>
    );
}

describe('Feature: Modal Confirmation', () => {
    it('Scenario: User confirms an action', async () => {
        // Given the modal provider is active and user triggers a confirmation
        render(
            <ModalProvider>
                <TestComponent />
            </ModalProvider>
        );

        await userEvent.click(screen.getByText('Trigger Confirm'));

        // Then the modal should appear with correct title and message
        expect(screen.getByText('Confirm Action')).toBeInTheDocument();
        expect(screen.getByText('Are you sure?')).toBeInTheDocument();

        // When the user clicks the confirm button
        await userEvent.click(screen.getByText('Confirm'));

        // Then the modal should close and return true
        expect(screen.queryByText('Confirm Action')).not.toBeInTheDocument();
        expect(screen.getByTestId('result')).toHaveTextContent('Confirmed');
    });

    it('Scenario: User cancels an action', async () => {
        // Given the modal is open
        render(
            <ModalProvider>
                <TestComponent />
            </ModalProvider>
        );
        await userEvent.click(screen.getByText('Trigger Confirm'));

        // When the user clicks cancel
        await userEvent.click(screen.getByText('Cancel'));

        // Then the modal should close and return false
        expect(screen.queryByText('Confirm Action')).not.toBeInTheDocument();
        expect(screen.getByTestId('result')).toHaveTextContent('Cancelled');
    });
});

import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ToastProvider, useToast } from './index';

// Wrapper to trigger toast
function TestComponent() {
    const toast = useToast();
    return (
        <button onClick={() => toast('Operation successful', 'success')}>
            Show Toast
        </button>
    );
}

describe('Feature: Toast Notifications', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('Scenario: Toast appears and auto-dismisses', async () => {
        // Given the toast provider is active
        render(
            <ToastProvider>
                <TestComponent />
            </ToastProvider>
        );

        // When component triggers a toast
        const btn = screen.getByText('Show Toast');
        act(() => {
            btn.click();
        });

        // Then the toast should be visible
        expect(screen.getByText('Operation successful')).toBeInTheDocument();

        // When time passes (3000ms is default duration)
        act(() => {
            vi.advanceTimersByTime(3000);
        });

        // Then the toast should be removed (or have exiting class)
        // Note: The component removes it from DOM after animation.
        // Let's advance a bit more for animation
        act(() => {
            vi.advanceTimersByTime(500);
        });

        expect(screen.queryByText('Operation successful')).not.toBeInTheDocument();
    });
});

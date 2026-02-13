import { createContext, useContext, useState, useCallback, useRef, useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

// --- Types ---
interface ModalState {
    type: 'confirm' | 'prompt';
    title: string;
    message: string;
    defaultValue?: string;
    label?: string;
    resolve: (value: string | boolean | null) => void;
}

interface ModalContextValue {
    confirm: (title: string, message: string) => Promise<boolean>;
    prompt: (title: string, label: string, defaultValue?: string) => Promise<string | null>;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
    const [modal, setModal] = useState<ModalState | null>(null);

    const confirm = useCallback((title: string, message: string): Promise<boolean> => {
        return new Promise(resolve => {
            setModal({ type: 'confirm', title, message, resolve: (v) => resolve(v as boolean) });
        });
    }, []);

    const prompt = useCallback((title: string, label: string, defaultValue = ''): Promise<string | null> => {
        return new Promise(resolve => {
            setModal({ type: 'prompt', title, message: '', label, defaultValue, resolve: (v) => resolve(v as string | null) });
        });
    }, []);

    const close = useCallback((value: string | boolean | null) => {
        modal?.resolve(value);
        setModal(null);
    }, [modal]);

    return (
        <ModalContext.Provider value={{ confirm, prompt }}>
            {children}
            {modal && createPortal(<ModalOverlay modal={modal} close={close} />, document.body)}
        </ModalContext.Provider>
    );
}

function ModalOverlay({ modal, close }: { modal: ModalState; close: (v: string | boolean | null) => void }) {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (modal.type === 'prompt' && inputRef.current) {
            inputRef.current.focus();
        }
    }, [modal.type]);

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            close(modal.type === 'confirm' ? false : null);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && modal.type === 'prompt' && inputRef.current) {
            close(inputRef.current.value);
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal" onKeyDown={handleKeyDown}>
                <h3 className="modal__title">{modal.title}</h3>

                {modal.type === 'confirm' && (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{modal.message}</p>
                )}

                {modal.type === 'prompt' && (
                    <div className="form-group">
                        <label>{modal.label}</label>
                        <input
                            ref={inputRef}
                            className="form-input"
                            type="text"
                            defaultValue={modal.defaultValue}
                        />
                    </div>
                )}

                <div className="modal__actions">
                    <button
                        className="btn btn--secondary"
                        onClick={() => close(modal.type === 'confirm' ? false : null)}
                    >
                        Cancel
                    </button>
                    {modal.type === 'confirm' ? (
                        <button className="btn btn--danger" onClick={() => close(true)}>
                            Confirm
                        </button>
                    ) : (
                        <button className="btn btn--primary" onClick={() => close(inputRef.current?.value ?? '')}>
                            OK
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export function useModal() {
    const ctx = useContext(ModalContext);
    if (!ctx) throw new Error('useModal must be used within ModalProvider');
    return ctx;
}

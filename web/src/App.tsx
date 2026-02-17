import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { ToastProvider } from './components/Toast';
import { ModalProvider } from './components/Modal';
import { Dashboard } from './pages/Dashboard';
import { Editor } from './pages/Editor';
import { History } from './pages/History';
import { JobTracker } from './pages/JobTracker';
import { ApplicationEditor } from './pages/JobTracker/ApplicationEditor';
import { ComponentsPage } from './pages/Components';

export function App() {
    return (
        <HashRouter>
            <ToastProvider>
                <ModalProvider>
                    <Header />
                    <main>
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/tracker" element={<JobTracker />} />
                            <Route path="/tracker/new" element={<ApplicationEditor />} />
                            <Route path="/tracker/:id" element={<ApplicationEditor />} />
                            <Route path="/components" element={<ComponentsPage />} />
                            <Route path="/cv/:id" element={<Editor />} />
                            <Route path="/cv/:id/history" element={<History />} />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </main>
                </ModalProvider>
            </ToastProvider>
        </HashRouter>
    );
}

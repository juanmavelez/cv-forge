import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Header } from './components/Header';
import { ToastProvider } from './components/Toast';
import { ModalProvider } from './components/Modal';
import { Dashboard } from './pages/Dashboard';
import { Editor } from './pages/Editor';
import { History } from './pages/History';
import { JobTracker } from './pages/JobTracker';
import { ApplicationEditor } from './pages/JobTracker/ApplicationEditor';
import { ComponentsPage } from './pages/Components';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

const MainLayout = () => (
    <>
        <Header />
        <main>
            <Outlet />
        </main>
    </>
);

export function App() {
    return (
        <HashRouter>
            <AuthProvider>
                <ToastProvider>
                    <ModalProvider>
                        <Routes>
                            <Route path="/login" element={<Login />} />

                            <Route element={<ProtectedRoute />}>
                                <Route element={<MainLayout />}>
                                    <Route path="/" element={<Dashboard />} />
                                    <Route path="/tracker" element={<JobTracker />} />
                                    <Route path="/tracker/new" element={<ApplicationEditor />} />
                                    <Route path="/tracker/:id" element={<ApplicationEditor />} />
                                    <Route path="/components" element={<ComponentsPage />} />
                                    <Route path="/cv/:id" element={<Editor />} />
                                    <Route path="/cv/:id/history" element={<History />} />
                                </Route>
                            </Route>

                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </ModalProvider>
                </ToastProvider>
            </AuthProvider>
        </HashRouter>
    );
}

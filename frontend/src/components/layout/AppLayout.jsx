import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppLayout() {
    const { user } = useAuth();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 ${user?.role === 'ADMIN' ? 'theme-admin' : ''}`}>
            {/* Sidebar */}
            <Sidebar
                isOpen={isMobileOpen}
                onClose={() => setIsMobileOpen(false)}
            />

            {/* Main Content */}
            <div className="lg:pl-64 transition-all duration-300 flex flex-col min-h-screen">
                <Header toggleMobileSidebar={() => setIsMobileOpen(!isMobileOpen)} />

                {/* Content Area */}
                <main className="flex-1 pb-20 lg:pb-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

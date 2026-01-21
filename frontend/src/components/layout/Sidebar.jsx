import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    LayoutDashboard,
    Receipt,
    Target,
    BarChart3,
    MessageSquare,
    Menu,
    X,
    LogOut,
    Wallet,
    ChevronLeft,
    ChevronRight,
    Settings,
    Users,
    Tag
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSystemSettings } from '../../contexts/SystemSettingsContext';
import DarkModeToggle from './DarkModeToggle';

export default function Sidebar({ isOpen, onClose, isCollapsed, setIsCollapsed }) {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { settings } = useSystemSettings();
    // Internal state removed, using props now

    const navItems = [
        {
            name: t('sidebar.dashboard'),
            path: '/dashboard',
            icon: LayoutDashboard,
            description: t('sidebar.dashboard_desc')
        },
        {
            name: t('sidebar.transactions'),
            path: '/transactions',
            icon: Receipt,
            description: t('sidebar.transactions_desc')
        },
        {
            name: t('sidebar.budgets'),
            path: '/budgets',
            icon: Target,
            description: t('sidebar.budgets_desc')
        },
        {
            name: t('sidebar.reports'),
            path: '/reports',
            icon: BarChart3,
            description: t('sidebar.reports_desc')
        },
        {
            name: t('sidebar.ai_assistant'),
            path: '/chat',
            icon: MessageSquare,
            description: t('sidebar.ai_assistant_desc')
        }
    ];

    const adminItems = [
        {
            name: t('sidebar.admin.categories'),
            path: '/admin/categories',
            icon: Tag,
            description: t('sidebar.admin.categories_desc')
        },
        {
            name: t('sidebar.admin.users'),
            path: '/admin/users',
            icon: Users,
            description: t('sidebar.admin.users_desc')
        },
        {
            name: t('sidebar.admin.settings'),
            path: '/admin/system',
            icon: Settings,
            description: t('sidebar.admin.settings_desc')
        }
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    onClick={onClose}
                    className="lg:hidden fixed inset-0 bg-black/50 dark:bg-black/70 z-40 animate-fade-in"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed top-0 left-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-40
                    transition-all duration-300 ease-in-out
                    ${isCollapsed ? 'w-64 lg:w-20' : 'w-64'}
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                {/* Header */}
                <div className={`h-16 flex items-center px-4 border-b border-gray-200 dark:border-gray-800 ${isCollapsed ? 'justify-center lg:justify-center' : 'justify-between'}`}>
                    <div className={`flex items-center gap-3 ${isCollapsed ? 'hidden lg:hidden' : 'flex'} transition-opacity duration-200`}>
                        <img src="/logo.png" alt="Monex Logo" className="w-10 h-10 object-contain" />
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                                {settings?.siteName || 'Monex'}
                            </h1>
                        </div>
                    </div>

                    {/* Logo/Icon only when collapsed on desktop */}
                    <div className={`hidden ${isCollapsed ? 'lg:flex' : 'hidden'} items-center justify-center`}>
                        <img src="/logo.png" alt="Monex Logo" className="w-8 h-8 object-contain" />
                    </div>

                    {/* Collapse Button (Desktop only) */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={`hidden lg:flex p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${!isCollapsed && 'ml-auto'}`}
                    >
                        {isCollapsed ? (
                            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        ) : (
                            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        )}
                    </button>

                    {/* Cloud Button (Mobile only) - to close sidebar */}
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ml-auto"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4 px-3">
                    <div className="space-y-1">
                        {/* Admin Section - Only show for ADMIN users */}
                        {user?.role === 'ADMIN' && (
                            <>
                                {/* Admin Section Header */}
                                <div className={`px-3 mb-3 ${isCollapsed ? 'lg:opacity-0 lg:h-0 overflow-hidden' : 'opacity-100'} transition-all duration-300`}>
                                    <div className="flex items-center gap-2 text-xs font-bold text-transparent bg-clip-text gradient-primary uppercase tracking-wider">
                                        <Settings className="w-4 h-4 text-primary" />
                                        <span>{t('sidebar.admin.title')}</span>
                                    </div>
                                </div>

                                {/* Admin Menu Items */}
                                {adminItems.map((item) => (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        onClick={onClose}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${isActive
                                                ? 'bg-primary text-white shadow-lg'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                            } ${isCollapsed ? 'justify-start lg:justify-center' : 'justify-start'}`
                                        }
                                    >
                                        {({ isActive }) => (
                                            <>
                                                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400 group-hover:text-primary'}`} />
                                                <div className={`flex-1 whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? 'lg:w-0 lg:opacity-0' : 'w-auto opacity-100'}`}>
                                                    <p className={`font-medium ${isActive ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                                                        {item.name}
                                                    </p>
                                                    <p className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                                                        {item.description}
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </NavLink>
                                ))}

                                {/* Divider between Admin and Personal sections */}
                                <div className={`my-4 ${isCollapsed ? 'lg:opacity-0 lg:h-0' : 'opacity-100'} transition-all duration-300`}>
                                    <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>
                                </div>
                            </>
                        )}

                        {/* Personal Section Header - Only show for ADMIN */}
                        {user?.role === 'ADMIN' && (
                            <div className={`px-3 mb-3 ${isCollapsed ? 'lg:opacity-0 lg:h-0 overflow-hidden' : 'opacity-100'} transition-all duration-300`}>
                                <div className="flex items-center gap-2 text-xs font-bold text-transparent bg-clip-text gradient-primary uppercase tracking-wider">
                                    <Wallet className="w-4 h-4 text-primary" />
                                    <span>{t('sidebar.personal')}</span>
                                </div>
                            </div>
                        )}

                        {/* Regular User Menu Items */}
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${isActive
                                        ? 'bg-primary text-white shadow-lg'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    } ${isCollapsed ? 'justify-start lg:justify-center' : 'justify-start'}`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400 group-hover:text-primary'}`} />
                                        <div className={`flex-1 whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? 'lg:w-0 lg:opacity-0' : 'w-auto opacity-100'}`}>
                                            <p className={`font-medium ${isActive ? 'text-white' : ''}`}>
                                                {item.name}
                                            </p>
                                            <p className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                                                {item.description}
                                            </p>
                                        </div>
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </div>
                </nav>
            </aside>

            {/* Mobile Bottom Navigation */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-30">
                <div className="flex items-center justify-around px-2 py-2">
                    {navItems.slice(0, 5).map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${isActive
                                    ? 'text-primary'
                                    : 'text-gray-600 dark:text-gray-400'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon className={`w-6 h-6 ${isActive ? 'text-primary' : ''}`} />
                                    <span className="text-xs font-medium">{item.name}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>
            </nav>
        </>
    );
}

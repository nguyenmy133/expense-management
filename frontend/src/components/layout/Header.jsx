import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, User, Bell, Search, Settings, ChevronDown, Menu } from 'lucide-react';
import DarkModeToggle from './DarkModeToggle';
import { useNavigate } from 'react-router-dom';

export default function Header({ toggleMobileSidebar }) {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    const getInitials = (name) => {
        return name
            ? name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)
            : 'U';
    };

    return (
        <header className="sticky top-0 right-0 z-30 h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
            <div className="h-full px-4 lg:px-6 flex items-center justify-between">
                {/* Left side - Mobile Menu & Search */}
                <div className="flex items-center gap-4 flex-1">
                    {/* Mobile Menu Button - Visible only on mobile */}
                    <button
                        onClick={toggleMobileSidebar}
                        className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    {/* Search Bar Removed */}
                </div>

                {/* Right side - Actions & Profile */}
                <div className="flex items-center gap-2 sm:gap-4">
                    <div className="hidden sm:block">
                        <DarkModeToggle />
                    </div>

                    <button className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full ring-2 ring-white dark:ring-gray-900 animate-pulse"></span>
                    </button>

                    <div className="h-8 w-px bg-gray-200 dark:bg-gray-800 mx-1 hidden sm:block"></div>

                    {/* Profile Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-3 p-1 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                        >
                            <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white dark:ring-gray-900">
                                {getInitials(user?.fullName)}
                            </div>
                            <div className="hidden sm:block text-left">
                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 max-w-[100px] truncate leading-tight">
                                    {user?.fullName}
                                </p>
                                <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400">
                                    {user?.role === 'ADMIN' ? 'Admin' : 'Member'}
                                </p>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''} hidden sm:block`} />
                        </button>

                        {/* Dropdown Menu */}
                        {isProfileOpen && (
                            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 py-2 animate-scale-in origin-top-right z-50">
                                {/* Mobile-only info in dropdown */}
                                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 sm:hidden">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        {user?.fullName}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        {user?.email}
                                    </p>
                                </div>
                                <div className="px-4 py-2">
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Tài khoản</p>
                                    <button
                                        onClick={() => {
                                            navigate('/profile');
                                            setIsProfileOpen(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary dark:hover:text-primary-400 transition-colors"
                                    >
                                        <User className="w-4 h-4" />
                                        Hồ sơ cá nhân
                                    </button>
                                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary dark:hover:text-primary-400 transition-colors">
                                        <Settings className="w-4 h-4" />
                                        Cài đặt
                                    </button>
                                </div>
                                <div className="h-px bg-gray-100 dark:bg-gray-800 my-1 mx-4"></div>
                                <div className="px-4 py-2">
                                    <div className="sm:hidden mb-2">
                                        <DarkModeToggle />
                                    </div>
                                    <button
                                        onClick={handleSignOut}
                                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/20 transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Đăng xuất
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

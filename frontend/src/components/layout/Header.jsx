import { Menu, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import DarkModeToggle from './DarkModeToggle';
import { useNavigate } from 'react-router-dom';

export default function Header({ toggleMobileSidebar }) {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/login');
        } catch (error) {
            console.error('Failed to log out', error);
        }
    };

    return (
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30 transition-colors duration-300">
            {/* Left Section */}
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleMobileSidebar}
                    className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>

                {/* Page Title (Optional - can be dynamic based on route if needed, for now static or hidden) */}
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 hidden sm:block">
                    {/* Could place breadcrumbs or page title here */}
                </h2>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3 sm:gap-4">
                <DarkModeToggle />

                {/* Vertical Divider */}
                <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>

                {/* User Profile */}
                <div className="flex items-center gap-3">
                    <div className="hidden md:block text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {user?.fullName || user?.username || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                            {user?.role?.toLowerCase() || 'Member'}
                        </p>
                    </div>

                    <div className="relative group">
                        <button className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-white ring-2 ring-white dark:ring-gray-800 shadow-md">
                            {user?.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt="Profile"
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                <User className="w-5 h-5" />
                            )}
                        </button>

                        {/* Dropdown Menu */}
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transform opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-right">
                            <div className="p-2">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
    User,
    Mail,
    Shield,
    Key,
    Bell,
    Moon,
    Globe,
    Camera,
    Save,
    Loader2,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';

export default function ProfilePage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('general');
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Form States
    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        phone: '0912 345 678', // Mock data
        bio: 'Senior Developer with a passion for clean code and UI design.',
        language: 'vi',
        notifications: {
            email: true,
            push: false,
            monthlyReport: true
        }
    });

    const handleSave = async () => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
        setSuccessMessage('Đã cập nhật thông tin thành công!');
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const tabs = [
        { id: 'general', label: 'Thông tin chung', icon: User },
        { id: 'security', label: 'Bảo mật', icon: Shield },
        { id: 'settings', label: 'Cài đặt', icon: Bell },
    ];

    const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto animate-fade-in">
            {/* Header Section */}
            <div className="relative mb-8">
                {/* Cover Image */}
                <div className="h-48 rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 overflow-hidden relative">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                </div>

                {/* Profile Info */}
                <div className="px-6 sm:px-10 pb-6">
                    <div className="relative -mt-16 flex flex-col sm:flex-row items-center sm:items-end gap-6">
                        {/* Avatar */}
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-3xl border-4 border-white dark:border-gray-900 bg-white dark:bg-gray-800 shadow-xl flex items-center justify-center text-4xl font-bold gradient-primary text-white overflow-hidden">
                                {getInitials(user?.fullName)}
                            </div>
                            <button className="absolute bottom-2 right-2 p-2 rounded-xl bg-gray-900/80 text-white hover:bg-gray-900 transition-colors opacity-0 group-hover:opacity-100 backdrop-blur-sm">
                                <Camera className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Name & Role */}
                        <div className="text-center sm:text-left flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                                {user?.fullName}
                            </h1>
                            <div className="flex items-center justify-center sm:justify-start gap-3 text-sm text-gray-500 dark:text-gray-400">
                                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold border border-blue-200 dark:border-blue-800">
                                    {user?.role === 'ADMIN' ? 'Administrator' : 'User'}
                                </span>
                                <span>•</span>
                                <span>Tham gia từ Tháng 1, 2026</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleSave}
                                disabled={isLoading}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-600 text-white font-medium shadow-lg shadow-primary/30 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Save className="w-5 h-5" />
                                )}
                                Lưu thay đổi
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Sidebar Navigation for Settings */}
                <div className="lg:col-span-3">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-2 sticky top-24">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === tab.id
                                        ? 'bg-primary text-white shadow-md'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                    }`}
                            >
                                <tab.icon className="w-5 h-5" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-9 space-y-6">
                    {successMessage && (
                        <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 flex items-center gap-3 animate-fade-in-down">
                            <CheckCircle2 className="w-5 h-5" />
                            {successMessage}
                        </div>
                    )}

                    {/* General Tab */}
                    {activeTab === 'general' && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 animate-fade-in">
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Thông tin cá nhân</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Cập nhật thông tin công khai của bạn.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Họ và tên</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            disabled
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900/50 text-gray-500 cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
                                    <textarea
                                        rows="4"
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
                                    />
                                    <p className="text-xs text-right text-gray-400">Tối đa 500 ký tự</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Đổi mật khẩu</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Đảm bảo sử dụng mật khẩu mạnh để bảo vệ tài khoản.</p>
                                </div>

                                <div className="max-w-md space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Mật khẩu hiện tại</label>
                                        <div className="relative">
                                            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input type="password" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Mật khẩu mới</label>
                                        <div className="relative">
                                            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input type="password" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Xác nhận mật khẩu</label>
                                        <div className="relative">
                                            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input type="password" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                        <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Xác thực 2 yếu tố</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Tăng cường bảo mật bằng cách yêu cầu mã xác thực khi đăng nhập.</p>
                                        <button className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                            Thiết lập 2FA
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Settings Tab */}
                    {activeTab === 'settings' && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 animate-fade-in">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Thông báo</h3>
                                    <div className="space-y-4">
                                        <label className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <Mail className="w-5 h-5 text-gray-500" />
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">Email thông báo</p>
                                                    <p className="text-xs text-gray-500">Nhận thông báo về giao dịch mới qua email</p>
                                                </div>
                                            </div>
                                            <div className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                                            </div>
                                        </label>

                                        <label className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <Bell className="w-5 h-5 text-gray-500" />
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">Thông báo đẩy</p>
                                                    <p className="text-xs text-gray-500">Nhận thông báo trực tiếp trên trình duyệt</p>
                                                </div>
                                            </div>
                                            <div className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <div className="h-px bg-gray-100 dark:bg-gray-800"></div>

                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Giao diện & Ngôn ngữ</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Globe className="w-5 h-5 text-gray-500" />
                                                <span className="font-medium">Ngôn ngữ</span>
                                            </div>
                                            <select
                                                className="bg-transparent font-medium text-primary focus:outline-none cursor-pointer"
                                                defaultValue="vi"
                                            >
                                                <option value="vi">Tiếng Việt</option>
                                                <option value="en">English</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

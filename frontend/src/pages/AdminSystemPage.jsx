import { useState, useEffect } from 'react';
import {
    Settings,
    Database,
    Mail,
    Bell,
    Shield,
    Globe,
    Save,
    Loader2,
    Check,
    Server,
    Key,
    RefreshCw
} from 'lucide-react';
import { useSystemSettings } from '../contexts/SystemSettingsContext';

export default function AdminSystemPage() {
    const { settings, updateSystemSettings, loading: contextLoading } = useSystemSettings();
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const [generalSettings, setGeneralSettings] = useState({
        siteName: 'Expense Management',
        siteDescription: 'Quản lý chi tiêu cá nhân',
        timezone: 'Asia/Ho_Chi_Minh',
        language: 'vi',
        currency: 'VND'
    });

    const [notificationSettings, setNotificationSettings] = useState({
        enableEmailNotifications: true,
        enableBudgetAlerts: true,
        budgetAlertThreshold: 80,
        enableTransactionNotifications: false
    });


    const [databaseSettings, setDatabaseSettings] = useState({
        autoBackup: true,
        backupFrequency: 'daily',
        retentionDays: 30
    });

    // Populate local state from context when settings change
    useEffect(() => {
        if (settings.general) setGeneralSettings(settings.general);
        if (settings.notification) setNotificationSettings(settings.notification);
        if (settings.database) setDatabaseSettings(settings.database);
    }, [settings]);

    const handleSave = async () => {
        try {
            setSaving(true);

            const settingsData = {
                general: generalSettings,
                notification: notificationSettings,
                database: databaseSettings
            };

            await updateSystemSettings(settingsData);

            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error('Error saving settings:', error);
            const message = error.response?.data?.message || error.message;
            alert('Lỗi khi lưu cài đặt: ' + message);
        } finally {
            setSaving(false);
        }
    };

    const ToggleSwitch = ({ checked, onChange, label }) => (
        <label className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200 select-none">
                {label}
            </span>
            <div className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
            </div>
        </label>
    );

    const SectionHeader = ({ icon: Icon, title, description, gradient }) => (
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl ${gradient} flex items-center justify-center shadow-lg shadow-purple-500/10`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0B1120] transition-colors duration-200 p-4 md:p-6 lg:p-8">
            <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
                {/* Header Page */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                            Cài đặt Hệ thống
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Quản lý toàn bộ cấu hình và tham số vận hành của hệ thống
                        </p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className={`
                            flex items-center gap-2 px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200
                            ${saved
                                ? 'bg-success-500 hover:bg-success-600 text-white shadow-success-500/30'
                                : 'bg-primary hover:bg-primary-600 text-white shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]'
                            }
                            disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none
                        `}
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Đang lưu...</span>
                            </>
                        ) : saved ? (
                            <>
                                <Check className="w-5 h-5" />
                                <span>Đã lưu thành công!</span>
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                <span>Lưu thay đổi</span>
                            </>
                        )}
                    </button>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* General Settings */}
                    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-black/20 overflow-hidden border border-gray-100 dark:border-gray-800 transition-all hover:border-primary/20 dark:hover:border-primary/20">
                        <SectionHeader
                            icon={Globe}
                            title="Tổng quan"
                            description="Thông tin cơ bản và bản địa hóa"
                            gradient="bg-gradient-to-br from-purple-500 to-indigo-600"
                        />
                        <div className="p-6 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Tên ứng dụng
                                    </label>
                                    <input
                                        type="text"
                                        value={generalSettings.siteName}
                                        onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary text-gray-900 dark:text-white placeholder-gray-400 transition-all font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Mô tả ngắn
                                    </label>
                                    <textarea
                                        value={generalSettings.siteDescription}
                                        onChange={(e) => setGeneralSettings({ ...generalSettings, siteDescription: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary text-gray-900 dark:text-white placeholder-gray-400 transition-all font-medium resize-none"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Ngôn ngữ
                                        </label>
                                        <select
                                            value={generalSettings.language}
                                            onChange={(e) => setGeneralSettings({ ...generalSettings, language: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary text-gray-900 dark:text-white font-medium appearance-none cursor-pointer"
                                        >
                                            <option value="vi">🇻🇳 Tiếng Việt</option>
                                            <option value="en">🇺🇸 English</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Tiền tệ
                                        </label>
                                        <select
                                            value={generalSettings.currency}
                                            onChange={(e) => setGeneralSettings({ ...generalSettings, currency: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary text-gray-900 dark:text-white font-medium appearance-none cursor-pointer"
                                        >
                                            <option value="VND">VND (₫)</option>
                                            <option value="USD">USD ($)</option>
                                            <option value="EUR">EUR (€)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notification Settings */}
                    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-black/20 overflow-hidden border border-gray-100 dark:border-gray-800 transition-all hover:border-primary/20 dark:hover:border-primary/20">
                        <SectionHeader
                            icon={Bell}
                            title="Thông báo"
                            description="Tùy chỉnh các kênh liên lạc và cảnh báo"
                            gradient="bg-gradient-to-br from-orange-400 to-pink-500"
                        />
                        <div className="p-6 space-y-4">
                            <ToggleSwitch
                                label="Gửi thông báo qua Email"
                                checked={notificationSettings.enableEmailNotifications}
                                onChange={(val) => setNotificationSettings({ ...notificationSettings, enableEmailNotifications: val })}
                            />

                            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Cảnh báo vượt ngân sách</span>
                                    <div className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={notificationSettings.enableBudgetAlerts}
                                            onChange={(e) => setNotificationSettings({ ...notificationSettings, enableBudgetAlerts: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                                    </div>
                                </div>
                                {notificationSettings.enableBudgetAlerts && (
                                    <div className="animate-fade-in pl-4 border-l-2 border-primary/20">
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                                            Ngưỡng cảnh báo (%)
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="range"
                                                min="50"
                                                max="100"
                                                step="5"
                                                value={notificationSettings.budgetAlertThreshold}
                                                onChange={(e) => setNotificationSettings({ ...notificationSettings, budgetAlertThreshold: parseInt(e.target.value) })}
                                                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                                            />
                                            <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary font-bold text-sm min-w-[3rem] text-center">
                                                {notificationSettings.budgetAlertThreshold}%
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <ToggleSwitch
                                label="Thông báo khi có giao dịch mới"
                                checked={notificationSettings.enableTransactionNotifications}
                                onChange={(val) => setNotificationSettings({ ...notificationSettings, enableTransactionNotifications: val })}
                            />
                        </div>
                    </div>


                    {/* Database Settings */}
                    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-black/20 overflow-hidden border border-gray-100 dark:border-gray-800 transition-all hover:border-primary/20 dark:hover:border-primary/20">
                        <SectionHeader
                            icon={Database}
                            title="Dữ liệu & Backup"
                            description="Quản lý sao lưu và vòng đời dữ liệu"
                            gradient="bg-gradient-to-br from-green-400 to-emerald-600"
                        />
                        <div className="p-6 space-y-6">
                            <ToggleSwitch
                                label="Tự động sao lưu định kỳ"
                                checked={databaseSettings.autoBackup}
                                onChange={(val) => setDatabaseSettings({ ...databaseSettings, autoBackup: val })}
                            />

                            {databaseSettings.autoBackup && (
                                <div className="grid grid-cols-2 gap-4 animate-fade-in">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                                            Tần suất
                                        </label>
                                        <select
                                            value={databaseSettings.backupFrequency}
                                            onChange={(e) => setDatabaseSettings({ ...databaseSettings, backupFrequency: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white font-medium appearance-none cursor-pointer"
                                        >
                                            <option value="daily">Hàng ngày</option>
                                            <option value="weekly">Hàng tuần</option>
                                            <option value="monthly">Hàng tháng</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                                            Lưu trữ (ngày)
                                        </label>
                                        <input
                                            type="number"
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/50 font-bold text-gray-900 dark:text-white"
                                            value={databaseSettings.retentionDays}
                                            onChange={(e) => setDatabaseSettings({ ...databaseSettings, retentionDays: parseInt(e.target.value) })}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 flex items-start gap-4">
                                <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                                    <Server className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-blue-900 dark:text-blue-200 text-sm">Trạng thái Backup</h4>
                                    <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                                        Lần backup cuối: <span className="font-mono font-bold">Today, 04:00 AM</span>
                                    </p>
                                    <button className="mt-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                                        <RefreshCw className="w-3 h-3" /> Backup ngay
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

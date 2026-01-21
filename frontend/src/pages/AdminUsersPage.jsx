import { useState, useEffect } from 'react';
import {
    Users,
    Search,
    Edit2,
    Trash2,
    UserPlus,
    Mail,
    Calendar,
    Shield,
    X,
    Save,
    Loader2,
    Eye,
    EyeOff
} from 'lucide-react';
import { adminAPI } from '../services/api';
import { useTranslation } from 'react-i18next';

export default function AdminUsersPage() {
    const { t } = useTranslation();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        role: 'USER'
    });
    const [saving, setSaving] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getAllUsers();
            setUsers(response.data.data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                fullName: user.fullName,
                email: user.email,
                password: '',
                role: user.role
            });
        } else {
            setEditingUser(null);
            setFormData({
                fullName: '',
                email: '',
                password: '',
                role: 'USER'
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingUser(null);
        setFormData({
            fullName: '',
            email: '',
            password: '',
            role: 'USER'
        });
        setShowPassword(false);
    };

    const handleSave = async () => {
        try {
            setSaving(true);

            // Validate form
            if (!formData.fullName.trim() || !formData.email.trim()) {
                alert(t('admin.users.messages.required_fields'));
                return;
            }

            if (editingUser) {
                // Update existing user
                await adminAPI.update(editingUser.id, {
                    fullName: formData.fullName,
                    email: formData.email,
                    role: formData.role,
                    password: formData.password || null // Send null if empty to avoid changing password
                });
            } else {
                // Create new user
                if (!formData.password) {
                    alert(t('admin.users.messages.password_required'));
                    return;
                }
                await adminAPI.create({
                    fullName: formData.fullName,
                    email: formData.email,
                    role: formData.role,
                    password: formData.password
                });
            }

            await fetchUsers();
            handleCloseModal();
            // Show success message (optional, could use a toast library if available)
        } catch (error) {
            console.error('Error saving user:', error);
            const message = error.response?.data?.message || error.message;
            alert(editingUser ? `${t('admin.users.messages.error_save')}: ${message}` : `${t('admin.users.messages.error_save')}: ${message}`);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm(t('admin.users.messages.confirm_delete'))) return;

        try {
            await adminAPI.deleteUser(id);
            await fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            alert(t('admin.users.messages.error_delete') + ': ' + (error.response?.data?.message || error.message));
        }
    };

    const filteredUsers = users.filter(user =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        total: users.length,
        admins: users.filter(u => u.role === 'ADMIN').length,
        users: users.filter(u => u.role === 'USER').length
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';

        // Handle Spring Boot LocalDateTime array format [year, month, day, hour, minute, second]
        if (Array.isArray(dateString)) {
            // Note: Month in JS Date is 0-indexed (0-11), but in Java it's 1-12.
            const date = new Date(
                dateString[0],      // year
                dateString[1] - 1,  // month
                dateString[2],      // day
                dateString[3] || 0, // hour
                dateString[4] || 0, // minute
                dateString[5] || 0  // second
            );
            return date.toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }

        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        {t('admin.users.title')}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {t('admin.users.subtitle')}
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="card-modern p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('admin.users.total')}</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="card-modern p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('admin.users.admins')}</p>
                                <p className="text-3xl font-bold text-primary">{stats.admins}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="card-modern p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('admin.users.regular_users')}</p>
                                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.users}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="card-modern p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        {/* Search */}
                        <div className="relative flex-1 w-full md:max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder={t('admin.users.search_placeholder')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input-modern pl-10 w-full"
                            />
                        </div>

                        {/* Add Button */}
                        <button
                            onClick={() => handleOpenModal()}
                            className="btn-primary flex items-center gap-2 w-full md:w-auto"
                        >
                            <UserPlus className="w-5 h-5" />
                            <span>{t('admin.users.add_button')}</span>
                        </button>
                    </div>
                </div>

                {/* Users Table */}
                <div className="card-modern overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="text-center py-12">
                            <Users className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                            <p className="text-gray-600 dark:text-gray-400">{t('admin.users.empty')}</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                            {t('admin.users.table.name')}
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                            {t('admin.users.table.email')}
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                            {t('admin.users.table.role')}
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                            {t('admin.users.table.created_at')}
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                            {t('admin.users.table.actions')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                                                        {user.fullName.charAt(0).toUpperCase()}
                                                    </div>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {user.fullName}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                    <Mail className="w-4 h-4" />
                                                    {user.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${user.role === 'ADMIN'
                                                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                                                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                                                    }`}>
                                                    <Shield className="w-3 h-3" />
                                                    {user.role === 'ADMIN' ? t('admin.users.modal.role_admin') : t('admin.users.modal.role_user')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                    <Calendar className="w-4 h-4" />
                                                    {formatDate(user.createdAt)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleOpenModal(user)}
                                                        className="p-2 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                                                        title={t('common.edit')}
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user.id)}
                                                        className="p-2 rounded-lg text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/30 transition-colors"
                                                        title={t('common.delete')}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="card-modern max-w-md w-full animate-scale-in">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {editingUser ? t('admin.users.modal.edit_title') : t('admin.users.modal.create_title')}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-4">
                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t('admin.users.modal.name')}
                                </label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    placeholder={t('admin.users.modal.name_placeholder')}
                                    className="input-modern w-full"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t('admin.users.modal.email')}
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder={t('admin.users.modal.email_placeholder')}
                                    className="input-modern w-full"
                                    disabled={!!editingUser}
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t('admin.users.modal.password')} {editingUser && t('admin.users.modal.password_hint')}
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder={t('admin.users.modal.password_placeholder')}
                                        className="input-modern w-full pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Role */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t('admin.users.modal.role')}
                                </label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="input-modern w-full"
                                >
                                    <option value="USER">{t('admin.users.modal.role_user')}</option>
                                    <option value="ADMIN">{t('admin.users.modal.role_admin')}</option>
                                </select>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={handleCloseModal}
                                className="btn-secondary"
                                disabled={saving}
                            >
                                {t('common.cancel')}
                            </button>
                            <button
                                onClick={handleSave}
                                className="btn-primary flex items-center gap-2"
                                disabled={saving || !formData.fullName.trim() || !formData.email.trim() || (!editingUser && !formData.password.trim())}
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        {t('admin.system.saving')}
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        {t('common.save')}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

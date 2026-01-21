import { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Filter,
    X,
    Save,
    Loader2,
    Tag,
    TrendingUp,
    TrendingDown
} from 'lucide-react';
import { categoryAPI } from '../services/api';
import { useTranslation } from 'react-i18next';

export default function AdminCategoriesPage() {
    const { t } = useTranslation();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('ALL');
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        type: 'EXPENSE',
        icon: '📁'
    });
    const [saving, setSaving] = useState(false);

    const iconOptions = [
        '💰', '💼', '📈', '🎁', '💵', '🍔', '🚗', '🛍️',
        '🎮', '🏠', '🏥', '📚', '💡', '💸', '✈️', '🎬',
        '🏋️', '🎨', '📱', '💻', '🍕', '☕', '🎵', '📷'
    ];

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await categoryAPI.getAll();
            setCategories(response.data.data || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                type: category.type,
                icon: category.icon
            });
        } else {
            setEditingCategory(null);
            setFormData({
                name: '',
                type: 'EXPENSE',
                icon: '📁'
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingCategory(null);
        setFormData({
            name: '',
            type: 'EXPENSE',
            icon: '📁'
        });
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            if (editingCategory) {
                await categoryAPI.update(editingCategory.id, formData);
            } else {
                await categoryAPI.create(formData);
            }
            await fetchCategories();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving category:', error);
            alert(t('admin.categories.messages.error_save') + ': ' + (error.response?.data?.message || error.message));
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm(t('admin.categories.messages.confirm_delete'))) return;

        try {
            await categoryAPI.delete(id);
            await fetchCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
            alert(t('admin.categories.messages.error_delete') + ': ' + (error.response?.data?.message || error.message));
        }
    };

    const filteredCategories = categories.filter(cat => {
        const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'ALL' || cat.type === filterType;
        return matchesSearch && matchesType;
    });

    const stats = {
        total: categories.length,
        income: categories.filter(c => c.type === 'INCOME').length,
        expense: categories.filter(c => c.type === 'EXPENSE').length
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        {t('admin.categories.title')}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {t('admin.categories.subtitle')}
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="card-modern p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('admin.categories.total')}</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                                <Tag className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="card-modern p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('admin.categories.income')}</p>
                                <p className="text-3xl font-bold text-success-600 dark:text-success-400">{stats.income}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="card-modern p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('admin.categories.expense')}</p>
                                <p className="text-3xl font-bold text-danger-600 dark:text-danger-400">{stats.expense}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                                <TrendingDown className="w-6 h-6 text-white" />
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
                                placeholder={t('admin.categories.search_placeholder')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input-modern pl-10 w-full"
                            />
                        </div>

                        {/* Filter & Add Button */}
                        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-stretch sm:items-center">
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="input-modern min-w-[140px]"
                            >
                                <option value="ALL">{t('transactions.filters.all_categories')}</option>
                                <option value="INCOME">{t('admin.categories.income')}</option>
                                <option value="EXPENSE">{t('admin.categories.expense')}</option>
                            </select>

                            <button
                                onClick={() => handleOpenModal()}
                                className="btn-primary flex items-center justify-center gap-2 whitespace-nowrap shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all duration-200"
                            >
                                <Plus className="w-5 h-5" />
                                <span>{t('admin.categories.add_button')}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Categories Table */}
                <div className="card-modern overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        </div>
                    ) : filteredCategories.length === 0 ? (
                        <div className="text-center py-12">
                            <Tag className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                            <p className="text-gray-600 dark:text-gray-400">{t('admin.categories.empty')}</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                            {t('admin.categories.table.icon')}
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                            {t('admin.categories.table.name')}
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                            {t('admin.categories.table.type')}
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                            {t('admin.categories.table.actions')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {filteredCategories.map((category) => (
                                        <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="text-3xl">{category.icon}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {category.name}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${category.type === 'INCOME'
                                                    ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400'
                                                    : 'bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-400'
                                                    }`}>
                                                    {category.type === 'INCOME' ? (
                                                        <>
                                                            <TrendingUp className="w-3 h-3" />
                                                            {t('admin.categories.income')}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <TrendingDown className="w-3 h-3" />
                                                            {t('admin.categories.expense')}
                                                        </>
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleOpenModal(category)}
                                                        className="p-2 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                                                        title={t('common.edit')}
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(category.id)}
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
                                {editingCategory ? t('admin.categories.modal.edit_title') : t('admin.categories.modal.create_title')}
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
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t('admin.categories.modal.name')}
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder={t('admin.categories.modal.name_placeholder')}
                                    className="input-modern w-full"
                                />
                            </div>

                            {/* Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t('admin.categories.modal.type')}
                                </label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="input-modern w-full"
                                >
                                    <option value="INCOME">{t('admin.categories.income')}</option>
                                    <option value="EXPENSE">{t('admin.categories.expense')}</option>
                                </select>
                            </div>

                            {/* Icon */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t('admin.categories.modal.icon')}
                                </label>
                                <div className="grid grid-cols-8 gap-2">
                                    {iconOptions.map((icon) => (
                                        <button
                                            key={icon}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, icon })}
                                            className={`p-2 rounded-lg text-2xl transition-all ${formData.icon === icon
                                                ? 'bg-primary text-white scale-110'
                                                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                                                }`}
                                        >
                                            {icon}
                                        </button>
                                    ))}
                                </div>
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
                                disabled={saving || !formData.name.trim()}
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Đang lưu...
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

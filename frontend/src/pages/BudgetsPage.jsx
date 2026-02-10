import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { budgetAPI, categoryAPI } from '../services/api';
import { Plus, Calendar, AlertTriangle, Edit, ExternalLink, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function BudgetsPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [budgets, setBudgets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
    const [selectedBudget, setSelectedBudget] = useState(null);
    const [currentDate] = useState(new Date());
    const [formData, setFormData] = useState({
        categoryId: '',
        amount: '',
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear()
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [budgetResponse, catResponse] = await Promise.all([
                budgetAPI.getAll({
                    month: currentDate.getMonth() + 1,
                    year: currentDate.getFullYear()
                }),
                categoryAPI.getByType('EXPENSE')
            ]);
            setBudgets(budgetResponse.data.data || []);
            setCategories(catResponse.data.data || []);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCreateModal = () => {
        setModalMode('create');
        setSelectedBudget(null);
        setFormData({
            categoryId: '',
            amount: '',
            month: currentDate.getMonth() + 1,
            year: currentDate.getFullYear()
        });
        setShowModal(true);
    };

    const handleEdit = (budget) => {
        setModalMode('edit');
        setSelectedBudget(budget);
        setFormData({
            categoryId: budget.categoryId,
            amount: budget.amount,
            month: budget.month,
            year: budget.year
        });
        setShowModal(true);
    };

    const handleViewTransactions = (categoryId) => {
        navigate('/transactions', { state: { categoryId: categoryId } });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
                amount: parseFloat(formData.amount)
            };

            if (modalMode === 'create') {
                await budgetAPI.create(payload);
            } else {
                // Assuming standard update pattern
                await budgetAPI.update(selectedBudget.id, payload);
            }

            setShowModal(false);
            loadData();
        } catch (error) {
            console.error('Failed to save budget:', error);
            alert(error.response?.data?.message || 'Lưu ngân sách thất bại!');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t('common.confirm_delete'))) return;
        try {
            await budgetAPI.delete(id);
            loadData();
        } catch (error) {
            console.error('Failed to delete:', error);
        }
    };

    const getProgressColor = (percentage) => {
        if (percentage >= 100) return 'bg-red-500';
        if (percentage >= 80) return 'bg-orange-500';
        if (percentage >= 60) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('budgets.title')}</h1>
                    <p className="text-gray-600 dark:text-gray-400">{t('budgets.subtitle')}</p>
                </div>
                <button
                    onClick={handleOpenCreateModal}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    <span className="hidden sm:inline">{t('budgets.add_button')}</span>
                </button>
            </div>

            {/* Content */}
            <main className="max-w-7xl mx-auto">
                <div className="mb-6 flex items-center gap-2 text-primary font-medium bg-primary/10 w-fit px-4 py-2 rounded-lg">
                    <Calendar className="w-5 h-5" />
                    {t('transactions.filters.this_month')} {currentDate.getMonth() + 1}/{currentDate.getFullYear()}
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#079DD9]"></div>
                    </div>
                ) : budgets.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{t('budgets.empty.title')}</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">{t('budgets.empty.subtitle')}</p>
                        <button onClick={handleOpenCreateModal} className="btn-primary">
                            {t('budgets.empty.create_first')}
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {budgets.map((budget) => (
                            <div key={budget.id} className="card relative group-hover:shadow-lg transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{budget.categoryName}</h3>
                                            {budget.percentage >= 100 && (
                                                <div className="group/tooltip relative">
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 cursor-help">
                                                        <AlertTriangle className="w-3 h-3" />
                                                        {t('budgets.card.over_budget')}
                                                    </span>
                                                    {/* Tooltip */}
                                                    <div className="absolute left-0 bottom-full mb-2 hidden group-hover/tooltip:block w-max px-3 py-1.5 bg-gray-800 text-white text-xs rounded shadow-xl z-20 whitespace-nowrap">
                                                        {t('budgets.card.over_amount', { amount: (budget.spent - budget.amount).toLocaleString('vi-VN') })}
                                                        <div className="absolute left-4 top-full w-2 h-2 bg-gray-800 rotate-45 -mt-1"></div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            {budget.spent.toLocaleString('vi-VN')} / {budget.amount.toLocaleString('vi-VN')} {t('common.currency_symbol')}
                                        </p>
                                    </div>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => handleEdit(budget)}
                                            className="p-2 text-gray-400 hover:text-primary transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                                            title="Điều chỉnh ngân sách"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(budget.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                                            title="Xóa ngân sách"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-3">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600 dark:text-gray-400">{t('budgets.card.spent')}</span>
                                        <span className={`font-semibold ${budget.percentage >= 100 ? 'text-red-600 dark:text-red-400' :
                                            budget.percentage >= 80 ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'
                                            }`}>
                                            {budget.percentage.toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                        <div
                                            className={`h-3 rounded-full transition-all ${getProgressColor(budget.percentage)}`}
                                            style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Action Suggestions for Over Budget */}
                                {budget.percentage >= 100 && (
                                    <div className="mt-4 pt-3 border-t border-red-100 dark:border-red-900/30 flex gap-2 animate-fade-in">
                                        <button
                                            onClick={() => handleEdit(budget)}
                                            className="flex-1 text-xs flex items-center justify-center gap-1 py-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 transition-colors font-medium border border-red-100 dark:border-red-900/50"
                                        >
                                            <Edit className="w-3 h-3" />
                                            {t('budgets.card.adjust')}
                                        </button>
                                        <button
                                            onClick={() => handleViewTransactions(budget.categoryId)}
                                            className="flex-1 text-xs flex items-center justify-center gap-1 py-1.5 rounded bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 transition-colors font-medium border border-gray-200 dark:border-gray-700"
                                        >
                                            <ExternalLink className="w-3 h-3" />
                                            {t('budgets.card.view_tx')}
                                        </button>
                                    </div>
                                )}

                                {/* Normal State Warning */}
                                {budget.percentage < 100 && (
                                    <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-800">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">{t('budgets.card.remaining')}</span>
                                        <span className={`text-lg font-bold ${budget.remaining < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                                            }`}>
                                            {budget.remaining.toLocaleString('vi-VN')} {t('common.currency_symbol')}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-800 animate-scale-in">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {modalMode === 'create' ? t('budgets.modal.create_title') : t('budgets.modal.edit_title')}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('transactions.modal.category')}</label>
                                <select
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    className="input-field"
                                    required
                                    disabled={modalMode === 'edit'} // Usually we don't change category in edit, or allow it
                                >
                                    <option value="">{t('transactions.modal.select_category')}</option>
                                    {/* Only show parent categories (parentId = null) */}
                                    {categories.filter(cat => cat.parentId === null).map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                                    {t('budgets.modal.parent_only_hint')}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('transactions.modal.amount')}</label>
                                <input
                                    type="number"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    className="input-field"
                                    placeholder="0"
                                    required
                                    min="0"
                                    step="1"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('budgets.modal.month')}</label>
                                    <input
                                        type="number"
                                        value={formData.month}
                                        onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
                                        className="input-field"
                                        min="1"
                                        max="12"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('budgets.modal.year')}</label>
                                    <input
                                        type="number"
                                        value={formData.year}
                                        onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                                        className="input-field"
                                        min="2020"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 btn-secondary">
                                    {t('common.cancel')}
                                </button>
                                <button type="submit" className="flex-1 btn-primary">
                                    {modalMode === 'create' ? t('common.add') : t('common.save')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

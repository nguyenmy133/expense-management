import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { transactionAPI, categoryAPI } from '../services/api';
import { useTranslation } from 'react-i18next';
import {
    Plus,
    Loader2,
    Trash2,
    X,
    TrendingUp,
    TrendingDown,
    Receipt,
    Search,
    Filter,
    Calendar,
    Edit2,
    MoreVertical,
    ChevronRight,
    ChevronLeft
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function TransactionsPage() {
    const { t } = useTranslation();
    const location = useLocation();
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter State
    const [filters, setFilters] = useState(() => {
        const initialState = {
            search: '',
            type: 'ALL',
            categoryId: 'ALL',
            startDate: '',
            endDate: ''
        };
        // Initialize from navigation state if present
        if (location.state?.categoryId) {
            initialState.categoryId = location.state.categoryId;
        }
        return initialState;
    });

    // UI State for Date Preset
    const [datePreset, setDatePreset] = useState('ALL');

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [showCategorySelector, setShowCategorySelector] = useState(false);
    const [selectorView, setSelectorView] = useState('ROOT'); // 'ROOT' | 'SUB'
    const [parentCategory, setParentCategory] = useState(null);
    const [modalMode, setModalMode] = useState('create'); // 'create', 'view', 'edit'
    const [selectedTx, setSelectedTx] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        categoryId: '',
        amount: '',
        type: 'EXPENSE',
        transactionDate: new Date().toISOString().split('T')[0],
        note: ''
    });

    useEffect(() => {
        // Handle navigation state
        if (location.state?.openModal) {
            handleOpenCreateModal(location.state?.type);
        }

        // Handle pre-filter by category if changed (e.g. navigation update while mounted)
        if (location.state?.categoryId && location.state.categoryId !== filters.categoryId) {
            setFilters(prev => ({
                ...prev,
                categoryId: location.state.categoryId
            }));
        }
    }, [location]);

    // Reload when filters change
    useEffect(() => {
        loadData();
    }, [filters.type, filters.categoryId, filters.startDate, filters.endDate]);

    // Date Filter Logic
    const handlePresetChange = (e) => {
        const preset = e.target.value;
        setDatePreset(preset);

        const now = new Date();
        const getFormat = (d) => {
            const offset = d.getTimezoneOffset() * 60000;
            return new Date(d.getTime() - offset).toISOString().split('T')[0];
        };

        let start = '', end = '';

        switch (preset) {
            case 'TODAY':
                start = end = getFormat(now);
                break;
            case 'THIS_WEEK':
                const day = now.getDay() || 7;
                const monday = new Date(now);
                monday.setDate(now.getDate() - day + 1);
                const sunday = new Date(now);
                sunday.setDate(now.getDate() - day + 7);
                start = getFormat(monday);
                end = getFormat(sunday);
                break;
            case 'THIS_MONTH':
                start = getFormat(new Date(now.getFullYear(), now.getMonth(), 1));
                end = getFormat(new Date(now.getFullYear(), now.getMonth() + 1, 0));
                break;
            case 'LAST_MONTH':
                start = getFormat(new Date(now.getFullYear(), now.getMonth() - 1, 1));
                end = getFormat(new Date(now.getFullYear(), now.getMonth(), 0));
                break;
            case 'CUSTOM':
                // Keep existing values or clear? Let's keep existing to allow edit
                // If current values are empty, maybe set today? No, let user pick.
                return; // Don't override filters immediately if custom, waiting for input
            case 'ALL':
            default:
                start = '';
                end = '';
                break;
        }

        setFilters(prev => ({ ...prev, startDate: start, endDate: end }));
    };

    const loadData = async () => {
        setLoading(true);
        try {
            // Build query params
            const params = {
                page: 0,
                size: 100,
                sort: 'transactionDate,desc',
                ...(filters.type !== 'ALL' && { type: filters.type }),
                ...(filters.categoryId !== 'ALL' && { categoryId: filters.categoryId }),
                ...(filters.startDate && { startDate: filters.startDate }),
                ...(filters.endDate && { endDate: filters.endDate }),
                ...(filters.search && { note: filters.search })
            };

            const [txResponse, catResponse] = await Promise.all([
                transactionAPI.getAll(params),
                categoryAPI.getAll()
            ]);

            let data = txResponse.data.data.content || [];

            // --- CLIENT-SIDE FALLBACKS (Robustness) ---

            // 1. Date Filter Fallback
            if (filters.startDate || filters.endDate) {
                const start = filters.startDate ? filters.startDate : null;
                const end = filters.endDate ? filters.endDate : null;

                data = data.filter(tx => {
                    const txStr = tx.transactionDate.split('T')[0];
                    if (start && txStr < start) return false;
                    if (end && txStr > end) return false;
                    return true;
                });
            }

            // 2. Category Filter Fallback (Fixes "chưa thể lọc đúng")
            if (filters.categoryId !== 'ALL') {
                const catId = parseInt(filters.categoryId);
                // Ensure comparison is number vs number
                data = data.filter(tx => tx.categoryId === catId);
            }

            // 3. Search Fallback
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                data = data.filter(tx =>
                    tx.note?.toLowerCase().includes(searchLower) ||
                    tx.categoryName?.toLowerCase().includes(searchLower)
                );
            }

            setTransactions(data);
            setCategories(catResponse.data.data || []);
        } catch (error) {
            console.error('Failed to load data:', error);
            // toast.error('Có lỗi xảy ra khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCreateModal = (preselectedType = 'EXPENSE') => {
        setModalMode('create');
        setSelectedTx(null);
        setFormData({
            categoryId: '',
            amount: '',
            type: preselectedType,
            transactionDate: new Date().toISOString().split('T')[0],
            note: ''
        });
        setShowModal(true);
    };

    const handleViewTransaction = (tx) => {
        setModalMode('view');
        setSelectedTx(tx);
        setShowModal(true);
    };

    const handleEditTransaction = () => {
        if (!selectedTx) return;
        setModalMode('edit');
        setFormData({
            categoryId: selectedTx.categoryId,
            amount: selectedTx.amount,
            type: selectedTx.type,
            transactionDate: selectedTx.transactionDate.split('T')[0],
            note: selectedTx.note || ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                categoryId: parseInt(formData.categoryId),
                amount: parseFloat(formData.amount)
            };

            if (modalMode === 'create') {
                await transactionAPI.create(payload);
                toast.success(t('transactions.messages.add_success'));
            } else if (modalMode === 'edit' && selectedTx) {
                await transactionAPI.update(selectedTx.id, payload);
                toast.success(t('transactions.messages.update_success'));
            }

            setShowModal(false);
            loadData();
        } catch (error) {
            console.error('Failed to save transaction:', error);
            toast.error(t('transactions.messages.save_error'));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t('common.confirm_delete'))) return;
        try {
            await transactionAPI.delete(id);
            toast.success(t('transactions.messages.delete_success'));
            setShowModal(false);
            loadData();
        } catch (error) {
            console.error('Failed to delete:', error);
            toast.error(t('transactions.messages.delete_error'));
        }
    };

    const getCategoryIcon = (catName) => {
        const cat = categories.find(c => c.name === catName);
        return cat?.icon || (modalMode === 'view' && selectedTx?.type === 'INCOME' ? '💰' : '💸');
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('transactions.title')}</h1>
                    <p className="text-gray-600 dark:text-gray-400">{t('transactions.subtitle')}</p>
                </div>
                <button
                    onClick={() => handleOpenCreateModal()}
                    className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                    <Plus className="w-5 h-5" />
                    <span>{t('transactions.add_button')}</span>
                </button>
            </div>

            {/* Filters Bar */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-800 mb-6 transition-all">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder={t('transactions.search_placeholder')}
                            value={filters.search}
                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                            onKeyDown={(e) => e.key === 'Enter' && loadData()}
                            className="input-field pl-10 py-2 text-sm"
                        />
                    </div>

                    {/* Filter Category */}
                    <select
                        value={filters.categoryId}
                        onChange={(e) => setFilters(prev => ({ ...prev, categoryId: e.target.value }))}
                        className="input-field py-2 text-sm"
                    >
                        <option value="ALL">{t('transactions.filters.all_categories')}</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>

                    {/* Date Range Filter */}
                    <div className="flex gap-2">
                        <select
                            value={datePreset}
                            onChange={handlePresetChange}
                            className="input-field py-2 text-sm w-full"
                        >
                            <option value="ALL">{t('transactions.filters.all_time')}</option>
                            <option value="TODAY">{t('transactions.filters.today')}</option>
                            <option value="THIS_WEEK">{t('transactions.filters.this_week')}</option>
                            <option value="THIS_MONTH">{t('transactions.filters.this_month')}</option>
                            <option value="LAST_MONTH">{t('transactions.filters.last_month')}</option>
                            <option value="CUSTOM" disabled>──────────</option>
                            <option value="CUSTOM">{t('transactions.filters.custom')}</option>
                        </select>

                        {/* Show inputs ONLY if CUSTOM preset is selected */}
                        {datePreset === 'CUSTOM' && (
                            <>
                                <input
                                    type="date"
                                    className="input-field py-2 text-sm px-2 w-[110px]"
                                    value={filters.startDate}
                                    onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                                    title={t('transactions.filters.from_date')}
                                />
                                <input
                                    type="date"
                                    className="input-field py-2 text-sm px-2 w-[110px]"
                                    value={filters.endDate}
                                    onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                                    title={t('transactions.filters.to_date')}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <main className="max-w-7xl mx-auto">
                {loading ? (
                    <div className="text-center py-12">
                        <Loader2 className="inline-block w-12 h-12 text-primary animate-spin" />
                        <p className="mt-4 text-gray-600 dark:text-gray-400">{t('common.loading')}</p>
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Receipt className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{t('transactions.empty.title')}</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">{t('transactions.empty.subtitle')}</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {transactions.map((tx) => (
                            <div
                                key={tx.id}
                                onClick={() => handleViewTransaction(tx)}
                                className="card-solid flex items-center justify-between hover:shadow-xl hover:scale-[1.01] cursor-pointer transition-all duration-200 group border-l-4 border-transparent hover:border-l-primary"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm ${tx.type === 'INCOME'
                                        ? 'bg-success-100 dark:bg-success-900/20 text-success-600'
                                        : 'bg-danger-100 dark:bg-danger-900/20 text-danger-600'
                                        }`}>
                                        {getCategoryIcon(tx.categoryName)}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">{tx.categoryName}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">{tx.note || 'Không có ghi chú'}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Calendar className="w-3 h-3 text-gray-400" />
                                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                                {new Date(tx.transactionDate).toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className={`text-lg sm:text-xl font-bold ${tx.type === 'INCOME'
                                            ? 'text-success-600 dark:text-success-400'
                                            : 'text-danger-600 dark:text-danger-400'
                                            }`}>
                                            {tx.type === 'INCOME' ? '+' : '-'}{tx.amount.toLocaleString('vi-VN')}
                                        </p>
                                        <p className="text-xs text-gray-400">VNĐ</p>
                                    </div>
                                    {/* Chevron for indication */}
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400">
                                        <MoreVertical className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Combined Modal (View / Create / Edit) */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50 animate-fade-in backdrop-blur-sm">
                    <div className="card-solid max-w-md w-full animate-scale-in relative overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {modalMode === 'create' && t('transactions.modal.create_title')}
                                {modalMode === 'edit' && t('transactions.modal.edit_title')}
                                {modalMode === 'view' && t('transactions.modal.view_title')}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                            </button>
                        </div>

                        {/* VIEW MODE */}
                        {modalMode === 'view' && selectedTx && (
                            <div className="space-y-6">
                                <div className="flex flex-col items-center justify-center py-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-md mb-4 ${selectedTx.type === 'INCOME'
                                        ? 'bg-success-100 text-success-600'
                                        : 'bg-danger-100 text-danger-600'
                                        }`}>
                                        {getCategoryIcon(selectedTx.categoryName)}
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{selectedTx.categoryName}</h3>
                                    <p className={`text-3xl font-bold mt-2 ${selectedTx.type === 'INCOME' ? 'text-success-600' : 'text-danger-600'}`}>
                                        {selectedTx.type === 'INCOME' ? '+' : '-'}{selectedTx.amount.toLocaleString('vi-VN')} {t('common.currency_symbol')}
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/30">
                                        <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-semibold">{t('transactions.modal.date')}</p>
                                            <p className="text-gray-900 dark:text-white">
                                                {new Date(selectedTx.transactionDate).toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>

                                    {selectedTx.note && (
                                        <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/30">
                                            <Edit2 className="w-5 h-5 text-gray-500 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase font-semibold">{t('transactions.modal.note')}</p>
                                                <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{selectedTx.note}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                                    <button
                                        onClick={() => handleDelete(selectedTx.id)}
                                        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-danger-600 bg-danger-50 hover:bg-danger-100 dark:bg-danger-900/20 dark:hover:bg-danger-900/40 transition-colors font-medium"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        {t('common.delete')}
                                    </button>
                                    <button
                                        onClick={handleEditTransaction}
                                        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-white bg-primary hover:bg-primary-600 transition-colors font-medium shadow-lg shadow-primary/30"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        {t('common.edit')}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* CREATE / EDIT MODE */}
                        {(modalMode === 'create' || modalMode === 'edit') && (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('transactions.modal.type')}</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type: 'EXPENSE', categoryId: '' })}
                                            className={`py-2 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${formData.type === 'EXPENSE'
                                                ? 'bg-danger-500 text-white shadow-lg ring-2 ring-danger-200 dark:ring-danger-900'
                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                                                }`}
                                        >
                                            <TrendingDown className="w-4 h-4" />
                                            {t('transactions.modal.expense')}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type: 'INCOME', categoryId: '' })}
                                            className={`py-2 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${formData.type === 'INCOME'
                                                ? 'bg-success-500 text-white shadow-lg ring-2 ring-success-200 dark:ring-success-900'
                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                                                }`}
                                        >
                                            <TrendingUp className="w-4 h-4" />
                                            {t('transactions.modal.income')}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('transactions.modal.category')}</label>

                                    {/* Custom Select Trigger */}
                                    <div
                                        onClick={() => setShowCategorySelector(true)}
                                        className="input-field flex items-center justify-between cursor-pointer hover:border-primary transition-colors"
                                    >
                                        {formData.categoryId ? (
                                            (() => {
                                                const selectedCat = categories.find(c => c.id == formData.categoryId);
                                                return selectedCat ? (
                                                    <span className="flex items-center gap-2">
                                                        <span className="text-xl">{selectedCat.icon}</span>
                                                        <span className="font-medium">{selectedCat.name}</span>
                                                    </span>
                                                ) : <span className="text-gray-400">{t('transactions.modal.select_category')}</span>;
                                            })()
                                        ) : (
                                            <span className="text-gray-400">{t('transactions.modal.select_category')}</span>
                                        )}
                                        <div className="text-gray-400">
                                            <ChevronRight className="w-5 h-5 rotate-90" />
                                        </div>
                                    </div>

                                    {/* Category Selector Modal */}
                                    {showCategorySelector && (
                                        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-[60] flex items-end sm:items-center justify-center sm:p-4 animate-fade-in backdrop-blur-sm">
                                            <div className="bg-white dark:bg-gray-900 w-full max-w-md h-[80vh] sm:h-[600px] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col animate-slide-up sm:animate-scale-in overflow-hidden">
                                                {/* Header */}
                                                <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
                                                    {selectorView === 'ROOT' ? (
                                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                                            {t('transactions.modal.select_category')}
                                                        </h3>
                                                    ) : (
                                                        <button
                                                            onClick={() => setSelectorView('ROOT')}
                                                            className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                                                        >
                                                            <ChevronLeft className="w-5 h-5" />
                                                            <span className="font-medium text-sm">Quay lại</span>
                                                        </button>
                                                    )}

                                                    <button
                                                        onClick={() => { setShowCategorySelector(false); setSelectorView('ROOT'); }}
                                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                                                    >
                                                        <X className="w-5 h-5 text-gray-500" />
                                                    </button>
                                                </div>

                                                {/* Parent Name (if in sub view) */}
                                                {selectorView === 'SUB' && parentCategory && (
                                                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 flex items-center gap-3 border-b border-gray-100 dark:border-gray-800">
                                                        <span className="text-3xl">{parentCategory.icon}</span>
                                                        <div>
                                                            <p className="font-bold text-gray-900 dark:text-white text-lg">{parentCategory.name}</p>
                                                            <p className="text-xs text-gray-500">Chọn danh mục con hoặc chính danh mục này</p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* List */}
                                                <div className="flex-1 overflow-y-auto p-2">
                                                    <div className="grid grid-cols-1 gap-1">
                                                        {selectorView === 'ROOT' ? (
                                                            /* ROOT CATEGORIES */
                                                            categories
                                                                .filter(c => c.type === formData.type && !c.parentId)
                                                                .map(cat => {
                                                                    const hasChildren = categories.some(c => c.parentId === cat.id);
                                                                    return (
                                                                        <button
                                                                            key={cat.id}
                                                                            onClick={() => {
                                                                                if (hasChildren) {
                                                                                    setParentCategory(cat);
                                                                                    setSelectorView('SUB');
                                                                                } else {
                                                                                    setFormData({ ...formData, categoryId: cat.id });
                                                                                    setShowCategorySelector(false);
                                                                                }
                                                                            }}
                                                                            className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-700 group"
                                                                        >
                                                                            <div className="flex items-center gap-4">
                                                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${formData.categoryId == cat.id
                                                                                        ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                                                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                                                                                    }`}>
                                                                                    {cat.icon}
                                                                                </div>
                                                                                <span className={`font-medium ${formData.categoryId == cat.id ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>
                                                                                    {cat.name}
                                                                                </span>
                                                                            </div>
                                                                            {hasChildren && <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />}
                                                                        </button>
                                                                    );
                                                                })
                                                        ) : (
                                                            /* SUB CATEGORIES */
                                                            <>
                                                                {/* Option to select Parent itself */}
                                                                <button
                                                                    onClick={() => {
                                                                        setFormData({ ...formData, categoryId: parentCategory.id });
                                                                        setShowCategorySelector(false);
                                                                        setSelectorView('ROOT');
                                                                    }}
                                                                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all border-l-4 border-transparent hover:border-l-primary"
                                                                >
                                                                    <div className="w-10 h-10 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-400">
                                                                        <div className="w-2 h-2 rounded-full bg-current"></div>
                                                                    </div>
                                                                    <span className="font-medium text-gray-600 dark:text-gray-400">
                                                                        Chọn "{parentCategory.name}"
                                                                    </span>
                                                                </button>

                                                                {categories
                                                                    .filter(c => c.parentId === parentCategory.id)
                                                                    .map(cat => (
                                                                        <button
                                                                            key={cat.id}
                                                                            onClick={() => {
                                                                                setFormData({ ...formData, categoryId: cat.id });
                                                                                setShowCategorySelector(false);
                                                                                setSelectorView('ROOT');
                                                                            }}
                                                                            className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all ml-4"
                                                                        >
                                                                            <div className="flex items-center gap-4">
                                                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${formData.categoryId == cat.id
                                                                                        ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                                                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                                                                                    }`}>
                                                                                    {cat.icon}
                                                                                </div>
                                                                                <span className={`font-medium ${formData.categoryId == cat.id ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>
                                                                                    {cat.name}
                                                                                </span>
                                                                            </div>
                                                                        </button>
                                                                    ))}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('transactions.modal.amount')}</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={formData.amount}
                                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                            className="input-field pl-4 pr-12 text-lg font-semibold"
                                            placeholder="0"
                                            required
                                            min="0"
                                            step="1"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">VNĐ</div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('transactions.modal.date')}</label>
                                    <input
                                        type="date"
                                        value={formData.transactionDate}
                                        onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
                                        className="input-field"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('transactions.modal.note')}</label>
                                    <textarea
                                        value={formData.note}
                                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                        className="input-field min-h-[100px]"
                                        rows="3"
                                        placeholder={t('transactions.modal.note_placeholder')}
                                    />
                                </div>

                                <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 btn-secondary"
                                    >
                                        {t('common.cancel')}
                                    </button>
                                    <button type="submit" className="flex-1 btn-primary">
                                        {modalMode === 'edit' ? t('common.save') : t('transactions.modal.create_title')}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

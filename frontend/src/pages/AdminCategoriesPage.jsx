import { useState, useEffect, useRef } from 'react';
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
    TrendingDown,
    ChevronRight,
    ChevronLeft,
    FolderOpen,
    LayoutGrid
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
        icon: '📁',
        parentId: ''
    });
    const [saving, setSaving] = useState(false);

    // UI State for Icon Selector
    const [activeIconTab, setActiveIconTab] = useState('Common');
    const scrollContainerRef = useRef(null);

    // Categorized Icons
    const iconLibrary = {
        'Common': ['💰', '💸', '🏦', '💳', '💵', '🪙', '📁', '📅', '📝', '⭐', '🔥', '📍'],
        'Food': ['🍔', '🍕', '🍣', '🍜', '🍱', '🍚', '🍗', '🥩', '🍳', '🍞', '🍟', '🍦', '🍩', '🍪', '🍫', '🍬', '🍺', '🍷', '🍹', '☕', '🍵', '🥤', '🥗', '🥦', '🥕', '🥔', '🍎', '🍉', '🍇', '🍓', '🍒', '🍑'],
        'Shopping': ['🛍️', '🛒', '🎁', '👓', '🕶️', '👔', '👕', '👖', '👗', '👘', '👟', '👠', '👢', '💍', '💄', '🧢', '🎒', '👜', '🌂', '🕯️', '🧸'],
        'Transport': ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🚚', '🚛', '🚜', '🏍️', '🛵', '🚲', '🛴', '✈️', '🚀', '🛸', '🚁', '🛶', '⛵', '🚤', '🛳️', '⛴️', '🚂', '🚆', '🚇', '⛽', '🚧', '🅿️'],
        'Entertainment': ['🎮', '🕹️', '🎲', '🎰', '🎳', '🎡', '🎢', '🎪', '🎭', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', '🥁', '🎷', '🎺', '🎸', '🎻', '🎫', '🎟️', '🏟️', '⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🥅', '⛳', '🥋', '🥊'],
        'Health': ['🏥', '🚑', '💊', '💉', '🩹', '🩺', '🦷', '🦴', '🧼', '🧻', '🧴', '💈', '💇', '💅', '🧘', '🏋️', '🤸', '⛹️', '🏊'],
        'Services': ['🏠', '🏡', '🏢', '🏣', '🏤', '🏥', '🏦', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏯', '🏰', '💒', '🗼', '🗽', '⛪', '🕌', '🛕', '🕍', '⛩️', '🕋', '⛲', '⛺', '🌁', '🌃', '🏙️', '🌄', '🌅', '🌆', '🌇', '🌉'],
        'Tech & Util': ['📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '⏱️', '⏲️', '⏰', '🕰️', '⌛', '⏳', '📡', '🔋', '🔌', '💡', '🔦', '🕯️', '🗑️', '🛢️', '💸', '💵', '💴', '💶', '💷', '💰', '💳', '💎', '⚖️', '🔧', '🔨', '⚒️', '🛠️', '⛏️', '🔩', '⚙️', '⛓️', '🔫', '💣', '🔪', '🗡️', '⚔️', '🛡️', '🚬', '⚰️', '⚱️', '🏺', '🔮', '📿', '🧿']
    };

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
                icon: category.icon,
                parentId: category.parentId || ''
            });
        } else {
            setEditingCategory(null);
            setFormData({
                name: '',
                type: 'EXPENSE',
                icon: '📁',
                parentId: ''
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
            icon: '📁',
            parentId: ''
        });
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            // Ensure parentId is strictly null if empty string or 0
            const finalParentId = formData.parentId && formData.parentId !== ''
                ? parseInt(formData.parentId)
                : null;

            const payload = {
                ...formData,
                parentId: finalParentId
            };

            if (editingCategory) {
                await categoryAPI.update(editingCategory.id, payload);
            } else {
                await categoryAPI.create(payload);
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

    // Helper to build tree for display
    const buildCategoryTree = (cats, parentId = null, level = 0) => {
        return cats
            .filter(c => c.parentId === parentId)
            .flatMap(c => [
                { ...c, level, hasChildren: cats.some(child => child.parentId === c.id) },
                ...buildCategoryTree(cats, c.id, level + 1)
            ]);
    };

    // Prepare data for rendering
    const isSearching = searchTerm.trim().length > 0;

    let displayCategories = [];

    if (isSearching) {
        displayCategories = categories.filter(cat => {
            const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = filterType === 'ALL' || cat.type === filterType;
            return matchesSearch && matchesType;
        });
    } else {
        const typeFiltered = filterType === 'ALL' ? categories : categories.filter(c => c.type === filterType);
        displayCategories = buildCategoryTree(typeFiltered);
    }

    // For Modal Parent Selection
    const getValidParents = () => {
        let candidates = categories.filter(c => c.type === formData.type);
        if (editingCategory) {
            const excludeIds = new Set();
            const addChildrenToExclude = (parentId) => {
                excludeIds.add(parentId);
                categories.filter(c => c.parentId === parentId).forEach(c => addChildrenToExclude(c.id));
            };
            addChildrenToExclude(editingCategory.id);
            candidates = candidates.filter(c => !excludeIds.has(c.id));
        }
        return candidates;
    };

    const stats = {
        total: categories.length,
        income: categories.filter(c => c.type === 'INCOME').length,
        expense: categories.filter(c => c.type === 'EXPENSE').length
    };

    const scrollTabs = (direction) => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef;
            const scrollAmount = 200;
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 p-4 md:p-6 lg:p-8 font-ibm">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                            <LayoutGrid className="w-8 h-8 text-primary" />
                            {t('admin.categories.title')}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            {t('admin.categories.subtitle')}
                        </p>
                    </div>
                    {/* Add Button at Top */}
                    <button
                        onClick={() => handleOpenModal()}
                        className="btn-primary flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300"
                    >
                        <Plus className="w-5 h-5" />
                        <span>{t('admin.categories.add_button')}</span>
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar Stats / Filter (Desktop) or Top (Mobile) */}
                    <div className="lg:w-80 space-y-6">
                        {/* Stats */}
                        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                            <div className="card-modern p-5 border-l-4 border-l-primary relative overflow-hidden group">
                                <div className="absolute right-0 top-0 opacity-10 transform translate-x-3 -translate-y-3 group-hover:scale-110 transition-transform">
                                    <Tag className="w-24 h-24" />
                                </div>
                                <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">{t('admin.categories.total')}</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                            </div>
                            <div className="card-modern p-5 border-l-4 border-l-success-500 relative overflow-hidden group">
                                <div className="absolute right-0 top-0 opacity-10 transform translate-x-3 -translate-y-3 group-hover:scale-110 transition-transform">
                                    <TrendingUp className="w-24 h-24 text-success-500" />
                                </div>
                                <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">{t('admin.categories.income')}</p>
                                <p className="text-3xl font-bold text-success-600 dark:text-success-400">{stats.income}</p>
                            </div>
                            <div className="card-modern p-5 border-l-4 border-l-danger-500 relative overflow-hidden group">
                                <div className="absolute right-0 top-0 opacity-10 transform translate-x-3 -translate-y-3 group-hover:scale-110 transition-transform">
                                    <TrendingDown className="w-24 h-24 text-danger-500" />
                                </div>
                                <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">{t('admin.categories.expense')}</p>
                                <p className="text-3xl font-bold text-danger-600 dark:text-danger-400">{stats.expense}</p>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="card-modern p-5 sticky top-6">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Filter className="w-4 h-4" />
                                Bộ lọc
                            </h3>
                            <div className="space-y-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder={t('admin.categories.search_placeholder')}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="input-modern pl-9 w-full text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">Loại danh mục</label>
                                    <div className="flex flex-col gap-2">
                                        {['ALL', 'INCOME', 'EXPENSE'].map(type => (
                                            <button
                                                key={type}
                                                onClick={() => setFilterType(type)}
                                                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${filterType === type
                                                    ? 'bg-primary/10 text-primary font-medium'
                                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                    }`}
                                            >
                                                <span>
                                                    {type === 'ALL' ? t('transactions.filters.all_categories') :
                                                        type === 'INCOME' ? t('admin.categories.income') : t('admin.categories.expense')}
                                                </span>
                                                {filterType === type && <div className="w-2 h-2 rounded-full bg-primary" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table List */}
                    <div className="flex-1 card-modern overflow-hidden min-h-[500px]">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                                <p className="text-gray-500">Đang tải danh mục...</p>
                            </div>
                        ) : displayCategories.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                                    <FolderOpen className="w-10 h-10 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('admin.categories.empty')}</h3>
                                <p className="text-gray-500 max-w-sm mx-auto mb-6">Danh sách danh mục đang trống. Hãy tạo danh mục đầu tiên để bắt đầu quản lý.</p>
                                <button onClick={() => handleOpenModal()} className="btn-primary">
                                    <Plus className="w-5 h-5 mr-2" />
                                    Thêm mới ngay
                                </button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[400px]">
                                                {t('admin.categories.table.name')}
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                {t('admin.categories.table.type')}
                                            </th>
                                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                {t('admin.categories.table.actions')}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {displayCategories.map((category) => (
                                            <tr
                                                key={category.id}
                                                className={`group transition-colors ${category.level === 0
                                                    ? 'bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                                    : 'bg-gray-50/30 dark:bg-gray-900/30 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                                    }`}
                                            >
                                                <td className="px-6 py-3">
                                                    <div style={{ paddingLeft: `${category.level * 36}px` }} className="flex items-center relative">
                                                        {/* Connector Lines for Subcategories */}
                                                        {category.level > 0 && (
                                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full h-full w-9 flex items-center justify-center pointer-events-none">
                                                                {/* L-Shape Line */}
                                                                <div className="absolute left-1/2 top-[-50%] bottom-1/2 w-px bg-gray-300 dark:bg-gray-700"></div>
                                                                <div className="absolute left-1/2 top-1/2 w-4 h-px bg-gray-300 dark:bg-gray-700"></div>
                                                            </div>
                                                        )}

                                                        {/* Icon Box */}
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm mr-4 transition-transform group-hover:scale-110 ${category.level === 0
                                                            ? 'bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700'
                                                            : 'bg-transparent border border-gray-200 dark:border-gray-700'
                                                            }`}>
                                                            {category.icon}
                                                        </div>

                                                        {/* Name */}
                                                        <div>
                                                            <p className={`font-medium ${category.level === 0
                                                                ? 'text-gray-900 dark:text-white text-base'
                                                                : 'text-gray-700 dark:text-gray-300 text-sm'
                                                                }`}>
                                                                {category.name}
                                                            </p>
                                                            {category.level === 0 && category.hasChildren && (
                                                                <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">Danh mục chính</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-3">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${category.type === 'INCOME'
                                                        ? 'bg-success-50 dark:bg-success-900/20 text-success-600 dark:text-success-400 border border-success-100 dark:border-success-900/30'
                                                        : 'bg-danger-50 dark:bg-danger-900/20 text-danger-600 dark:text-danger-400 border border-danger-100 dark:border-danger-900/30'
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
                                                <td className="px-6 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
            </div>

            {/* Enhanced Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 dark:bg-black/80 z-[60] flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[90vh] animate-scale-in">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {editingCategory ? t('admin.categories.modal.edit_title') : t('admin.categories.modal.create_title')}
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">Điền thông tin chi tiết cho danh mục</p>
                            </div>
                            <button onClick={handleCloseModal} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        {/* Body - Scrollable */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column: Basic Info */}
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            {t('admin.categories.modal.type')} <span className="text-danger-500">*</span>
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setFormData(p => ({ ...p, type: 'EXPENSE', parentId: '' }))}
                                                className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${formData.type === 'EXPENSE'
                                                    ? 'border-danger-500 bg-danger-50 text-danger-600'
                                                    : 'border-gray-200 dark:border-gray-700 hover:border-danger-200'
                                                    }`}
                                            >
                                                <TrendingDown className="w-5 h-5" />
                                                Chi tiêu
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormData(p => ({ ...p, type: 'INCOME', parentId: '' }))}
                                                className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${formData.type === 'INCOME'
                                                    ? 'border-success-500 bg-success-50 text-success-600'
                                                    : 'border-gray-200 dark:border-gray-700 hover:border-success-200'
                                                    }`}
                                            >
                                                <TrendingUp className="w-5 h-5" />
                                                Thu nhập
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            {t('admin.categories.modal.name')} <span className="text-danger-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Ví dụ: Ăn uống, Lương..."
                                            className="input-field"
                                            autoFocus
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Danh mục cha (Tùy chọn)
                                        </label>
                                        <select
                                            value={formData.parentId}
                                            onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                                            className="input-field"
                                        >
                                            <option value="">-- Là danh mục chính --</option>
                                            {getValidParents().map(cat => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.icon} {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                        <p className="text-xs text-gray-500 mt-2">
                                            Chọn danh mục cha nếu bạn muốn tạo danh mục con (Ví dụ: "Ăn trưa" thuộc "Ăn uống").
                                        </p>
                                    </div>
                                </div>

                                {/* Right Column: Icon Selector */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                        Biểu tượng <span className="text-danger-500">*</span>
                                    </label>
                                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 h-[320px] flex flex-col">
                                        {/* Icon Categories Tabs with Scroll Controls */}
                                        <div className="relative group mb-3">
                                            {/* Left Scroller */}
                                            <button
                                                type="button"
                                                onClick={() => scrollTabs('left')}
                                                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-white shadow-md rounded-full text-gray-600 hover:text-primary hover:scale-110 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0 -ml-2 border border-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                            </button>

                                            {/* Scrollable Container */}
                                            <div
                                                ref={scrollContainerRef}
                                                className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide px-1 snap-x"
                                            >
                                                {Object.keys(iconLibrary).map(key => (
                                                    <button
                                                        key={key}
                                                        type="button"
                                                        onClick={() => setActiveIconTab(key)}
                                                        className={`snap-start px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 ${activeIconTab === key
                                                            ? 'bg-primary text-white shadow-md shadow-primary/30 transform scale-105'
                                                            : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-100 dark:border-gray-600'
                                                            }`}
                                                    >
                                                        {t(`admin.categories.icon_categories.${key}`, { defaultValue: key })}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Right Scroller */}
                                            <button
                                                type="button"
                                                onClick={() => scrollTabs('right')}
                                                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-white shadow-md rounded-full text-gray-600 hover:text-primary hover:scale-110 transition-all opacity-0 group-hover:opacity-100 -mr-2 border border-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                                            >
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Icon Grid */}
                                        <div className="flex-1 overflow-y-auto grid grid-cols-6 gap-2 content-start pr-1 custom-scrollbar">
                                            {iconLibrary[activeIconTab].map((icon) => (
                                                <button
                                                    key={icon}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, icon })}
                                                    className={`aspect-square rounded-lg text-2xl flex items-center justify-center transition-all ${formData.icon === icon
                                                        ? 'bg-white shadow-md ring-2 ring-primary scale-110'
                                                        : 'hover:bg-white hover:shadow-sm dark:hover:bg-gray-700'
                                                        }`}
                                                >
                                                    {icon}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-gray-100 dark:border-gray-100 bg-gray-50/50 dark:bg-gray-900/50 flex justify-end gap-3 rounded-b-2xl">
                            <button
                                onClick={handleCloseModal}
                                className="btn-secondary px-6"
                                disabled={saving}
                            >
                                {t('common.cancel')}
                            </button>
                            <button
                                onClick={handleSave}
                                className="btn-primary px-8 flex items-center gap-2"
                                disabled={saving || !formData.name.trim()}
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Đang lưu...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
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

import { useNavigate } from 'react-router-dom';
import { ArrowRight, AlertTriangle, Edit, ExternalLink } from 'lucide-react';

export default function BudgetProgress({ budgets, transactions }) {
    const navigate = useNavigate();

    // Calculate progress for each budget
    const calculateProgress = () => {
        if (!budgets || budgets.length === 0) return [];

        return budgets.map(budget => {
            // Sum expenses for this category
            const spent = transactions
                ?.filter(t => t.categoryId === budget.categoryId && t.type === 'EXPENSE')
                .reduce((sum, t) => sum + Math.abs(t.amount), 0) || 0;

            const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
            const remaining = budget.amount - spent;

            let status = 'SAFE';
            if (percentage >= 100) status = 'OVER_BUDGET';
            else if (percentage >= 80) status = 'WARNING';

            return {
                ...budget,
                spent,
                remaining,
                percentage: Math.min(percentage, 100),
                status
            };
        });
    };

    const budgetProgress = calculateProgress();

    if (!budgets || budgets.length === 0) {
        return (
            <div className="card-solid animate-slide-up">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Ngân sách tháng này
                    </h3>
                </div>
                <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400 mb-3">
                        Chưa có ngân sách nào
                    </p>
                    <button
                        onClick={() => navigate('/budgets')}
                        className="btn-primary px-4 py-2 text-sm"
                    >
                        Tạo ngân sách
                    </button>
                </div>
            </div>
        );
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN').format(Math.abs(amount));
    };

    const getProgressColor = (status) => {
        switch (status) {
            case 'OVER_BUDGET':
                return 'progress-danger';
            case 'WARNING':
                return 'progress-warning';
            default:
                return 'progress-success';
        }
    };

    const getCategoryIcon = (categoryName) => {
        const icons = {
            'Food': '🍔',
            'Transport': '🚗',
            'Shopping': '🛍️',
            'Entertainment': '🎮',
            'Housing': '🏠',
            'Healthcare': '🏥',
            'Education': '📚',
            'Other': '💵'
        };
        return icons[categoryName] || '💰';
    };

    return (
        <div className="card-solid animate-slide-up">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Ngân sách tháng này
                </h3>
                <button
                    onClick={() => navigate('/budgets')}
                    className="text-sm text-primary hover:text-primary-700 dark:hover:text-primary-400 font-medium flex items-center gap-1 transition-colors"
                >
                    Chi tiết
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            <div className="space-y-4">
                {budgetProgress.map((budget) => (
                    <div key={budget.id} className="group pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <span className="text-lg">{getCategoryIcon(budget.categoryName)}</span>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                            {budget.categoryName}
                                        </span>
                                        {budget.status === 'OVER_BUDGET' && (
                                            <div className="relative group/tooltip">
                                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 uppercase tracking-wider cursor-help">
                                                    <AlertTriangle className="w-3 h-3" />
                                                    Vượt
                                                </span>
                                                {/* Tooltip */}
                                                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover/tooltip:block w-max px-2 py-1 bg-gray-800 text-white text-xs rounded shadow z-10">
                                                    Bạn đã chi vượt {formatCurrency(Math.abs(budget.remaining))}đ
                                                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-2 h-2 bg-gray-800 rotate-45 -mt-1"></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className={`text-sm font-semibold ${budget.status === 'OVER_BUDGET'
                                    ? 'text-danger-600 dark:text-danger-400'
                                    : budget.status === 'WARNING'
                                        ? 'text-yellow-600 dark:text-yellow-400'
                                        : 'text-success-600 dark:text-success-400'
                                    }`}>
                                    {budget.percentage.toFixed(0)}%
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                                    {formatCurrency(budget.spent)}/{formatCurrency(budget.amount)}
                                </span>
                            </div>
                        </div>

                        <div className="progress-bar mb-2">
                            <div
                                className={`progress-fill ${getProgressColor(budget.status)}`}
                                style={{ width: `${budget.percentage}%` }}
                            />
                        </div>

                        {/* Action Suggestions for Over Budget */}
                        {budget.status === 'OVER_BUDGET' && (
                            <div className="flex gap-2 animate-fade-in mt-2">
                                <button
                                    onClick={() => navigate('/budgets')}
                                    className="text-xs flex items-center gap-1.5 px-2 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 transition-colors font-medium"
                                >
                                    <Edit className="w-3 h-3" />
                                    Điều chỉnh
                                </button>
                                <button
                                    onClick={() => navigate('/transactions', { state: { categoryId: budget.categoryId } })}
                                    className="text-xs flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 transition-colors font-medium border border-gray-100 dark:border-gray-700"
                                >
                                    <ExternalLink className="w-3 h-3" />
                                    Xem giao dịch
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

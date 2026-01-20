import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';

export default function RecentTransactions({ transactions, loading }) {
    const navigate = useNavigate();

    if (loading) {
        return (
            <div className="card-solid animate-slide-up">
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
                </div>
            </div>
        );
    }

    if (!transactions || transactions.length === 0) {
        return (
            <div className="card-solid animate-slide-up">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Giao dịch gần đây
                    </h3>
                </div>
                <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                        Chưa có giao dịch nào
                    </p>
                </div>
            </div>
        );
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN').format(Math.abs(amount));
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Hôm nay';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Hôm qua';
        } else {
            return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
        }
    };

    return (
        <div className="card-solid animate-slide-up">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Giao dịch gần đây
                </h3>
                <button
                    onClick={() => navigate('/transactions')}
                    className="text-sm text-primary hover:text-primary-700 dark:hover:text-primary-400 font-medium flex items-center gap-1 transition-colors"
                >
                    Xem tất cả
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            <div className="space-y-1">
                {transactions.map((transaction) => (
                    <div
                        key={transaction.id}
                        onClick={() => navigate(`/transactions`)}
                        className="transaction-item"
                    >
                        <div className="flex items-center gap-3 flex-1">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${transaction.type === 'INCOME'
                                    ? 'bg-success-100 dark:bg-success-900/20'
                                    : 'bg-danger-100 dark:bg-danger-900/20'
                                }`}>
                                <span className="text-lg">
                                    {transaction.categoryName === 'Food' ? '🍔' :
                                        transaction.categoryName === 'Transport' ? '🚗' :
                                            transaction.categoryName === 'Shopping' ? '🛍️' :
                                                transaction.categoryName === 'Salary' ? '💰' :
                                                    transaction.categoryName === 'Entertainment' ? '🎮' :
                                                        transaction.categoryName === 'Housing' ? '🏠' :
                                                            '💵'}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {transaction.note || transaction.categoryName}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatDate(transaction.transactionDate)}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className={`text-sm font-semibold ${transaction.type === 'INCOME'
                                    ? 'text-success-600 dark:text-success-400'
                                    : 'text-danger-600 dark:text-danger-400'
                                }`}>
                                {transaction.type === 'INCOME' ? '+' : '-'}
                                {formatCurrency(transaction.amount)} VNĐ
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

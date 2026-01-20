import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { transactionAPI, budgetAPI } from '../services/api';
import {
    Wallet,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Receipt,
    Target,
    BarChart3,
    MessageSquare,
    LogOut,
    Loader2,
    Sparkles
} from 'lucide-react';
import DarkModeToggle from '../components/layout/DarkModeToggle';
import StatCard from '../components/dashboard/StatCard';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import BudgetProgress from '../components/dashboard/BudgetProgress';
import FloatingActionButton from '../components/dashboard/FloatingActionButton';

export default function DashboardPage() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [trendData, setTrendData] = useState(null);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [allTransactions, setAllTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('month');

    useEffect(() => {
        loadDashboardData();
    }, [timeRange]);

    const loadDashboardData = async () => {
        try {
            const currentDate = new Date();
            const month = currentDate.getMonth() + 1;
            const year = currentDate.getFullYear();

            // Load all data in parallel
            const [statsRes, trendRes, recentRes, budgetsRes, transactionsRes] = await Promise.all([
                transactionAPI.getStats({ month, year }),
                transactionAPI.getTrend({ month, year }),
                transactionAPI.getRecent({ limit: 5 }),
                budgetAPI.getAll({ month, year }),
                transactionAPI.getAll({ page: 0, size: 100 }) // For budget calculation
            ]);

            setStats(statsRes.data.data);
            setTrendData(trendRes.data.data);
            setRecentTransactions(recentRes.data.data);
            setBudgets(budgetsRes.data.data);
            setAllTransactions(transactionsRes.data.data.content || []);
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const currentMonth = new Date().toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            {/* Welcome & Filter Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Xin chào, {user?.fullName?.split(' ').pop() || 'bạn'}!
                        </h2>
                        <Sparkles className="w-7 h-7 text-primary animate-pulse" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">Tổng quan chi tiêu của bạn trong tháng {currentMonth}</p>
                </div>

                {/* Time Range Dropdown */}
                <div className="relative">
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="appearance-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium shadow-sm transition-all cursor-pointer hover:border-primary/50"
                    >
                        <option value="today">Hôm nay</option>
                        <option value="week">Tuần này</option>
                        <option value="month">Tháng này</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            {loading ? (
                <div className="text-center py-12">
                    <Loader2 className="inline-block w-12 h-12 text-primary animate-spin" />
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Đang tải dữ liệu...</p>
                </div>
            ) : (
                <>
                    {/* Enhanced Stat Cards with Sparklines */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <StatCard
                            title="Thu nhập"
                            value={stats?.totalIncome || 0}
                            currency="VNĐ"
                            trend={trendData?.income?.percentageChange}
                            trendData={trendData?.income?.sparklineData}
                            type="income"
                            icon={TrendingUp}
                        />
                        <StatCard
                            title="Chi tiêu"
                            value={stats?.totalExpense || 0}
                            currency="VNĐ"
                            trend={trendData?.expense?.percentageChange}
                            trendData={trendData?.expense?.sparklineData}
                            type="expense"
                            icon={TrendingDown}
                        />
                        <StatCard
                            title="Số dư"
                            value={stats?.balance || 0}
                            currency="VNĐ"
                            trend={trendData?.balance?.percentageChange}
                            trendData={trendData?.balance?.sparklineData}
                            type="balance"
                            icon={DollarSign}
                        />
                    </div>

                    {/* Recent Transactions Widget */}
                    <div className="mb-8">
                        <RecentTransactions
                            transactions={recentTransactions}
                            loading={false}
                        />
                    </div>

                    {/* Budget Progress Widget */}
                    <div className="mb-8">
                        <BudgetProgress
                            budgets={budgets}
                            transactions={allTransactions}
                        />
                    </div>
                </>
            )}

            {/* Info Card */}
            <div className="card-solid gradient-primary text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-5 h-5" />
                            <h4 className="text-lg font-semibold">Mẹo quản lý chi tiêu</h4>
                        </div>
                        <p className="text-sm opacity-90">
                            Hãy ghi chép mọi khoản chi tiêu hàng ngày để kiểm soát tài chính tốt hơn!
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <DollarSign className="w-20 h-20 opacity-20" />
                    </div>
                </div>
            </div>

            {/* Floating Action Button */}
            <FloatingActionButton />
        </div>
    );
}

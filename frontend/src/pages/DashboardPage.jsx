import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { transactionAPI, budgetAPI } from '../services/api';
import CalendarView from '../components/dashboard/CalendarView';
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
    Sparkles,
    Calendar,
    List
} from 'lucide-react';
import DarkModeToggle from '../components/layout/DarkModeToggle';
import StatCard from '../components/dashboard/StatCard';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import BudgetProgress from '../components/dashboard/BudgetProgress';
import FloatingActionButton from '../components/dashboard/FloatingActionButton';

export default function DashboardPage() {
    const { user, signOut } = useAuth();
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [trendData, setTrendData] = useState(null);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [allTransactions, setAllTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('month');

    // View Mode State: 'list' or 'calendar'
    const [viewMode, setViewMode] = useState('list');

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
                // Increase limit to cover enough data for calendar (approx 3-4 months history)
                transactionAPI.getAll({ page: 0, size: 300 })
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

    // Get current locale from i18n (vi -> vi-VN, en -> en-US)
    const currentLocale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';
    const currentMonth = new Date().toLocaleDateString(currentLocale, { month: 'long', year: 'numeric' });

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            {/* Welcome & Filter Section */}
            {/* ... (Keep existing code) ... */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {t('dashboard.title', { name: user?.fullName?.split(' ').pop() || 'User' })}
                        </h2>
                        <Sparkles className="w-7 h-7 text-primary animate-pulse" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                        {t('dashboard.subtitle', { month: currentMonth })}
                    </p>
                </div>

                {/* Time Range Dropdown */}
                <div className="relative">
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="appearance-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium shadow-sm transition-all cursor-pointer hover:border-primary/50"
                    >
                        <option value="today">{t('dashboard.time_range.today')}</option>
                        <option value="week">{t('dashboard.time_range.week')}</option>
                        <option value="month">{t('dashboard.time_range.month')}</option>
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
                    <p className="mt-4 text-gray-600 dark:text-gray-400">{t('dashboard.loading')}</p>
                </div>
            ) : (
                <>
                    {/* Enhanced Stat Cards with Sparklines */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <StatCard
                            title={t('dashboard.stats.income')}
                            value={stats?.totalIncome || 0}
                            currency="VNĐ"
                            trend={trendData?.income?.percentageChange}
                            trendData={trendData?.income?.sparklineData}
                            type="income"
                            icon={TrendingUp}
                        />
                        <StatCard
                            title={t('dashboard.stats.expense')}
                            value={stats?.totalExpense || 0}
                            currency="VNĐ"
                            trend={trendData?.expense?.percentageChange}
                            trendData={trendData?.expense?.sparklineData}
                            type="expense"
                            icon={TrendingDown}
                        />
                        <StatCard
                            title={t('dashboard.stats.balance')}
                            value={stats?.balance || 0}
                            currency="VNĐ"
                            trend={trendData?.balance?.percentageChange}
                            trendData={trendData?.balance?.sparklineData}
                            type="balance"
                            icon={DollarSign}
                        />
                    </div>

                    {/* Transaction Section with Toggle */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {viewMode === 'list' ? t('dashboard.transactions.recent') : t('dashboard.transactions.calendar_title')}
                            </h3>

                            {/* Toggle Switch */}
                            <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-xl flex items-center">
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${viewMode === 'list'
                                        ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                        }`}
                                >
                                    <List className="w-4 h-4" />
                                    {t('dashboard.view_mode.list')}
                                </button>
                                <button
                                    onClick={() => setViewMode('calendar')}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${viewMode === 'calendar'
                                        ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                        }`}
                                >
                                    <Calendar className="w-4 h-4" />
                                    {t('dashboard.view_mode.calendar')}
                                </button>
                            </div>
                        </div>

                        {viewMode === 'list' ? (
                            <RecentTransactions
                                transactions={recentTransactions}
                                loading={false}
                            />
                        ) : (
                            <CalendarView transactions={allTransactions} />
                        )}
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
                            <h4 className="text-lg font-semibold">{t('dashboard.tip.title')}</h4>
                        </div>
                        <p className="text-sm opacity-90">
                            {t('dashboard.tip.content')}
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

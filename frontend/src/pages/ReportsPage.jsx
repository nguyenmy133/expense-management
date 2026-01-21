import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportAPI, transactionAPI } from '../services/api';
import {
    PieChart, Pie, Cell,
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer
} from 'recharts';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ReportsPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [monthlyReport, setMonthlyReport] = useState(null);
    const [dailyExpenses, setDailyExpenses] = useState([]); // State for Line Chart
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        loadData();
    }, [selectedMonth, selectedYear]);

    const loadData = async () => {
        setLoading(true);
        try {
            // 1. Load Monthly Report (for Summary & Pie Chart)
            const reportPromise = reportAPI.getMonthly({
                month: selectedMonth,
                year: selectedYear
            });

            // 2. Load Transactions for Line Chart (Daily Expense Trend)
            // Calculate start and end date of the month
            const startDate = new Date(selectedYear, selectedMonth - 1, 1);
            const endDate = new Date(selectedYear, selectedMonth, 0); // Last day of month

            // Format dates for API (YYYY-MM-DD)
            // Adjust for timezone to avoid off-by-one errors
            const formatDate = (date) => {
                const offset = date.getTimezoneOffset() * 60000;
                return new Date(date.getTime() - offset).toISOString().split('T')[0];
            };

            const txPromise = transactionAPI.getAll({
                startDate: formatDate(startDate),
                endDate: formatDate(endDate),
                type: 'EXPENSE', // Only interested in expenses for the chart
                size: 1000 // Ensure we get most/all transactions
            });

            const [reportRes, txRes] = await Promise.all([reportPromise, txPromise]);

            setMonthlyReport(reportRes.data.data);
            processDailyExpenses(txRes.data.data.content || [], startDate, endDate);

        } catch (error) {
            console.error('Failed to load report data:', error);
        } finally {
            setLoading(false);
        }
    };

    const processDailyExpenses = (transactions, startDate, endDate) => {
        // Initialize an array for all days in the month
        const daysInMonth = endDate.getDate();
        const dailyData = [];

        // Create a map for quick lookup
        const expenseMap = {};
        transactions.forEach(tx => {
            // STRICT CLIENT-SIDE FILTER: Ensure we only sum EXPENSE transactions.
            // Even if API is asked for EXPENSE, checking here prevents income mix-up.
            if (tx.type !== 'EXPENSE') return;

            const dateStr = tx.transactionDate.split('T')[0];
            const amount = Math.abs(tx.amount);
            expenseMap[dateStr] = (expenseMap[dateStr] || 0) + amount;
        });

        // Fill data for each day
        for (let i = 1; i <= daysInMonth; i++) {
            const day = new Date(selectedYear, selectedMonth - 1, i);
            const dateStr = new Date(day.getTime() - (day.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
            dailyData.push({
                day: i, // distinct day number for X-axis
                date: dateStr,
                amount: expenseMap[dateStr] || 0
            });
        }
        setDailyExpenses(dailyData);
    };

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Colors for Pie Chart
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1919', '#00CCFF', '#8884d8'];

    const handlePrevMonth = () => {
        if (selectedMonth === 1) {
            setSelectedMonth(12);
            setSelectedYear(prev => prev - 1);
        } else {
            setSelectedMonth(prev => prev - 1);
        }
    };

    const handleNextMonth = () => {
        if (selectedMonth === 12) {
            setSelectedMonth(1);
            setSelectedYear(prev => prev + 1);
        } else {
            setSelectedMonth(prev => prev + 1);
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            {/* Professional Header with Integrated Date Navigator */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('reports.title')}</h1>
                    <p className="text-gray-600 dark:text-gray-400">{t('reports.subtitle')}</p>
                </div>

                {/* Date Navigator */}
                <div className="flex items-center bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-1.5 self-start md:self-center">
                    <button
                        onClick={handlePrevMonth}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors text-gray-600 dark:text-gray-400"
                        title="Tháng trước"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-2 px-4 border-l border-r border-gray-200 dark:border-gray-700 mx-1">
                        <Calendar className="w-5 h-5 text-primary" />

                        {/* Custom Selects - Styled to look like text */}
                        <div className="flex items-center gap-1">
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                className="appearance-none bg-transparent font-bold text-gray-900 dark:text-white text-lg focus:outline-none cursor-pointer hover:text-primary transition-colors text-right pr-1"
                            >
                                {months.map((month, index) => (
                                    <option key={index} value={index + 1}>{t(`transactions.filters.this_month`)} {index + 1}</option>
                                ))}
                            </select>

                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                className="appearance-none bg-transparent font-bold text-gray-900 dark:text-white text-lg focus:outline-none cursor-pointer hover:text-primary transition-colors"
                            >
                                {[2023, 2024, 2025, 2026, 2027].map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={handleNextMonth}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors text-gray-600 dark:text-gray-400"
                        title="Tháng sau"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <main className="max-w-7xl mx-auto">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#079DD9]"></div>
                    </div>
                ) : (
                    <>
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="card bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-100 dark:border-green-800">
                                <p className="text-sm font-medium text-green-700 dark:text-green-400 mb-2">{t('reports.summary.total_income')}</p>
                                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                                    {(monthlyReport?.totalIncome || 0).toLocaleString('vi-VN')}
                                </p>
                                <p className="text-xs text-green-600 dark:text-green-500 mt-1">{t('common.currency_symbol')}</p>
                            </div>

                            <div className="card bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border border-red-100 dark:border-red-800">
                                <p className="text-sm font-medium text-red-700 dark:text-red-400 mb-2">{t('reports.summary.total_expense')}</p>
                                <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                                    {(monthlyReport?.totalExpense || 0).toLocaleString('vi-VN')}
                                </p>
                                <p className="text-xs text-red-600 dark:text-red-500 mt-1">{t('common.currency_symbol')}</p>
                            </div>

                            <div className="card bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-100 dark:border-blue-800">
                                <p className="text-sm font-medium text-[#1261A6] dark:text-blue-400 mb-2">{t('reports.summary.balance')}</p>
                                <p className={`text-3xl font-bold ${(monthlyReport?.balance || 0) >= 0 ? 'text-[#079DD9] dark:text-blue-400' : 'text-red-600 dark:text-red-400'
                                    }`}>
                                    {(monthlyReport?.balance || 0).toLocaleString('vi-VN')}
                                </p>
                                <p className="text-xs text-[#079DD9] dark:text-blue-500 mt-1">{t('common.currency_symbol')}</p>
                            </div>
                        </div>

                        {/* CHARTS ROW */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            {/* 1. PIE CHART: Expense by Category */}
                            <div className="card min-h-[400px] flex flex-col">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('reports.charts.distribution')}</h3>
                                {(monthlyReport?.categoryBreakdown && monthlyReport.categoryBreakdown.length > 0) ? (
                                    <div className="flex-1">
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={monthlyReport.categoryBreakdown}
                                                    dataKey="amount"
                                                    nameKey="categoryName"
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={100}
                                                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                                >
                                                    {monthlyReport.categoryBreakdown.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    formatter={(value) => new Intl.NumberFormat('vi-VN').format(value) + ` ${t('common.currency_symbol')}`}
                                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                />
                                                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex items-center justify-center text-gray-500">
                                        {t('reports.charts.no_data')}
                                    </div>
                                )}
                            </div>

                            {/* 2. LINE CHART: Expense by Day */}
                            <div className="card min-h-[400px] flex flex-col">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('reports.charts.trend')}</h3>
                                <div className="flex-1">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={dailyExpenses} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                                            <XAxis
                                                dataKey="day"
                                                label={{ value: t('reports.charts.day'), position: 'insideBottomRight', offset: 0 }}
                                                tick={{ fontSize: 12 }}
                                            />
                                            <YAxis
                                                tickFormatter={(value) => `${value / 1000}k`}
                                                tick={{ fontSize: 12 }}
                                            />
                                            <Tooltip
                                                labelFormatter={(day) => `${t('reports.charts.day')} ${day}`}
                                                formatter={(value) => [new Intl.NumberFormat('vi-VN').format(value) + ` ${t('common.currency_symbol')}`, t('reports.charts.expense')]}
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="amount"
                                                stroke="#ef4444"
                                                strokeWidth={2}
                                                dot={{ r: 3, fill: '#ef4444' }}
                                                activeDot={{ r: 6 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Detailed List (Optional, can keep) */}
                        <div className="card">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('reports.list.title')}</h3>
                            {/* ... existing list ... code reused */}
                            {!monthlyReport?.categoryBreakdown || monthlyReport.categoryBreakdown.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-600 dark:text-gray-400">{t('reports.list.empty')}</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {monthlyReport.categoryBreakdown.map((cat, index) => (
                                        <div key={index} className="border-b border-gray-100 dark:border-gray-800 pb-4 last:border-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl">{cat.categoryIcon || '💰'}</span>
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white">{cat.categoryName}</p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            {cat.amount.toLocaleString('vi-VN')} {t('common.currency_symbol')}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-[#079DD9] dark:text-blue-400">
                                                        {cat.percentage.toFixed(1)}%
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                <div
                                                    className="gradient-primary h-2 rounded-full transition-all"
                                                    style={{ width: `${cat.percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Insights */}
                        <div className="card mt-6 gradient-primary text-white">
                            {/* ... existing insights ... */}
                            <h3 className="text-lg font-semibold mb-3">💡 {t('reports.analysis.title')}</h3>
                            <div className="space-y-2 text-sm opacity-90">
                                {monthlyReport?.balance >= 0 ? (
                                    <>
                                        <p>✓ {t('reports.analysis.good')}</p>
                                        <p>✓ {t('reports.analysis.keep_up')}</p>
                                    </>
                                ) : (
                                    <>
                                        <p>⚠ {t('reports.analysis.bad')}</p>
                                        <p>⚠ {t('reports.analysis.cut_down')}</p>
                                    </>
                                )}
                                {monthlyReport?.categoryBreakdown && monthlyReport.categoryBreakdown.length > 0 && (
                                    <p>
                                        📊 {t('reports.analysis.top_category')}: {monthlyReport.categoryBreakdown[0]?.categoryName}
                                        ({monthlyReport.categoryBreakdown[0]?.percentage.toFixed(1)}%)
                                    </p>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

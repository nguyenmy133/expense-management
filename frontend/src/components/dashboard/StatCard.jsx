import { TrendingUp, TrendingDown } from 'lucide-react';
import CountUp from 'react-countup';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

export default function StatCard({ title, value, currency, trend, trendData, type, icon: Icon }) {
    const isPositiveTrend = trend >= 0;

    // Convert sparkline data to chart format
    const chartData = trendData?.map((value, index) => ({ value })) || [];

    // Color schemes based on type
    const colorSchemes = {
        income: {
            bg: 'from-success-50 to-emerald-50 dark:from-success-900/20 dark:to-emerald-900/20',
            border: 'border-success-200 dark:border-success-800',
            text: 'text-success-700 dark:text-success-400',
            value: 'text-success-600 dark:text-success-400',
            gradient: 'gradient-success',
            chartColor: '#22c55e'
        },
        expense: {
            bg: 'from-danger-50 to-rose-50 dark:from-danger-900/20 dark:to-rose-900/20',
            border: 'border-danger-200 dark:border-danger-800',
            text: 'text-danger-700 dark:text-danger-400',
            value: 'text-danger-600 dark:text-danger-400',
            gradient: 'gradient-danger',
            chartColor: '#ef4444'
        },
        balance: {
            bg: 'from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20',
            border: 'border-primary-200 dark:border-primary-800',
            text: 'text-primary-700 dark:text-primary-400',
            value: 'text-primary-600 dark:text-primary-400',
            gradient: 'gradient-primary',
            chartColor: '#7C3AED'
        }
    };

    const colors = colorSchemes[type];

    return (
        <div className={`card-solid bg-gradient-to-br ${colors.bg} ${colors.border} group cursor-pointer animate-slide-up`}>
            <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                    <p className={`text-sm font-medium ${colors.text} mb-1`}>{title}</p>
                    <div className="flex items-baseline gap-2">
                        <p className={`text-3xl font-bold ${colors.value}`}>
                            <CountUp
                                end={value}
                                duration={1.5}
                                separator=","
                                decimals={0}
                            />
                        </p>
                        {trend !== undefined && (
                            <div className="relative group/tooltip">
                                <span className={`trend-badge ${isPositiveTrend ? 'trend-up' : 'trend-down'} flex items-center gap-1 cursor-help`}>
                                    {isPositiveTrend ? (
                                        <TrendingUp className="w-3 h-3" />
                                    ) : (
                                        <TrendingDown className="w-3 h-3" />
                                    )}
                                    {Math.abs(trend).toFixed(1)}%
                                </span>
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                    So với tháng trước
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                                </div>
                            </div>
                        )}
                    </div>
                    <p className={`text-xs ${colors.value} mt-1`}>{currency}</p>
                </div>
                <div className={`w-16 h-16 ${colors.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
            </div>

            {/* Sparkline Chart */}
            {chartData.length > 0 && (
                <div className="h-12 mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke={colors.chartColor}
                                strokeWidth={2}
                                dot={false}
                                animationDuration={1000}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}

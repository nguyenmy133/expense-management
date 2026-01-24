import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function CalendarView({ transactions = [] }) {
    const { t } = useTranslation();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);

    const daysInMonth = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        return new Date(year, month + 1, 0).getDate();
    }, [currentDate]);

    const firstDayOfMonth = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        // 0 = Sunday, 1 = Monday, ... 6 = Saturday
        // We want Monday to be first? Let's stick to standard Sunday first for now or check locale.
        // Vietnamese calendar often starts on Monday but standard libraries vary. 
        // Let's use standard Sunday=0 for simplicity of grid, or map it.
        return new Date(year, month, 1).getDay();
    }, [currentDate]);

    const dailyStats = useMemo(() => {
        const stats = {};
        transactions.forEach(tx => {
            const txDate = new Date(tx.transactionDate);
            // Filter by current month view
            if (
                txDate.getMonth() === currentDate.getMonth() &&
                txDate.getFullYear() === currentDate.getFullYear()
            ) {
                const day = txDate.getDate();
                if (!stats[day]) stats[day] = { income: 0, expense: 0, transactions: [] };

                if (tx.type === 'INCOME') {
                    stats[day].income += tx.amount;
                } else {
                    stats[day].expense += tx.amount;
                }
                stats[day].transactions.push(tx);
            }
        });
        return stats;
    }, [transactions, currentDate]);

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
        setSelectedDate(null);
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
        setSelectedDate(null);
    };

    const handleDateClick = (day) => {
        if (dailyStats[day]) {
            setSelectedDate(selectedDate === day ? null : day);
        }
    };

    // Render Grid
    const renderCalendarGrid = () => {
        const days = [];
        // Empty slots for previous month
        // Adjust for Monday start if needed. Let's assume Monday start for Vietnam context?
        // Let's stick to Sunday (0) for now to match `firstDayOfMonth`.
        // If 0 (Sunday), push 0.
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50/30 dark:bg-gray-800/20 border border-gray-100 dark:border-gray-800/50"></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const stat = dailyStats[day];
            const hasData = !!stat;
            const isSelected = selectedDate === day;

            days.push(
                <div
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className={`h-24 border border-gray-100 dark:border-gray-800 transition-all cursor-pointer relative group flex flex-col items-center justify-start pt-2
                        ${hasData ? 'hover:bg-primary/5 dark:hover:bg-primary/10' : 'hover:bg-gray-50 dark:hover:bg-gray-800/30'}
                        ${isSelected ? 'ring-2 ring-primary bg-primary/5 z-10 rounded-lg shadow-lg scale-[1.02]' : ''}
                    `}
                >
                    <span className={`text-sm font-semibold ${new Date().getDate() === day &&
                            new Date().getMonth() === currentDate.getMonth() &&
                            new Date().getFullYear() === currentDate.getFullYear()
                            ? 'bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}>
                        {day}
                    </span>

                    {hasData && (
                        <div className="flex flex-col gap-0.5 mt-auto mb-2 w-full px-1">
                            {stat.income > 0 && (
                                <div className="text-[10px] font-bold text-success-600 bg-success-50 dark:bg-success-900/30 dark:text-success-400 rounded px-1 truncate text-center">
                                    +{stat.income.toLocaleString('vi-VN')}
                                </div>
                            )}
                            {stat.expense > 0 && (
                                <div className="text-[10px] font-bold text-danger-600 bg-danger-50 dark:bg-danger-900/30 dark:text-danger-400 rounded px-1 truncate text-center">
                                    -{stat.expense.toLocaleString('vi-VN')}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            );
        }
        return days;
    };

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 px-2">
                <button onClick={prevMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                    <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white capitalize">
                    {currentDate.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
                </h3>
                <button onClick={nextMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                    <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 mb-2">
                {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((d, i) => (
                    <div key={i} className="text-center text-xs font-semibold text-gray-500 uppercase py-2">
                        {d}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-800">
                {renderCalendarGrid()}
            </div>

            {/* Selected Day Details */}
            {selectedDate && dailyStats[selectedDate] && (
                <div className="mt-4 animate-slide-up">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span>Chi tiết ngày {selectedDate}/{currentDate.getMonth() + 1}</span>
                            <span className="text-xs font-normal text-gray-500">
                                ({dailyStats[selectedDate].transactions.length} giao dịch)
                            </span>
                        </h4>
                        <button onClick={() => setSelectedDate(null)} className="text-gray-400 hover:text-gray-600">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        {dailyStats[selectedDate].transactions.map(tx => (
                            <div key={tx.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${tx.type === 'INCOME' ? 'bg-success-50 text-success-600' : 'bg-danger-50 text-danger-600'
                                        }`}>
                                        {tx.type === 'INCOME' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white text-sm">{tx.categoryName}</p>
                                        <p className="text-xs text-gray-500 line-clamp-1">{tx.note || 'Không có ghi chú'}</p>
                                    </div>
                                </div>
                                <span className={`font-bold text-sm ${tx.type === 'INCOME' ? 'text-success-600' : 'text-danger-600'}`}>
                                    {tx.type === 'INCOME' ? '+' : '-'}{tx.amount.toLocaleString('vi-VN')}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

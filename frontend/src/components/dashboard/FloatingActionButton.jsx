import { useState } from 'react';
import { Plus, X, TrendingUp, TrendingDown, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function FloatingActionButton() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => setIsOpen(!isOpen);

    const actions = [
        {
            label: 'Thu nhập',
            icon: TrendingUp,
            color: 'bg-success-500 hover:bg-success-600',
            action: () => {
                navigate('/transactions', { state: { openModal: true, type: 'INCOME' } });
                setIsOpen(false);
            }
        },
        {
            label: 'Chi tiêu',
            icon: TrendingDown,
            color: 'bg-danger-500 hover:bg-danger-600',
            action: () => {
                navigate('/transactions', { state: { openModal: true, type: 'EXPENSE' } });
                setIsOpen(false);
            }
        },
        {
            label: 'Ngân sách',
            icon: Target,
            color: 'bg-primary-500 hover:bg-primary-600',
            action: () => {
                navigate('/budgets');
                setIsOpen(false);
            }
        }
    ];

    return (
        <>
            {/* Backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40"
                    />
                )}
            </AnimatePresence>

            {/* Speed Dial Actions */}
            <div className="fixed bottom-24 right-6 z-50 flex flex-col-reverse items-end gap-3">
                <AnimatePresence>
                    {isOpen && actions.map((action, index) => (
                        <motion.button
                            key={action.label}
                            initial={{ scale: 0, opacity: 0, y: 20 }}
                            animate={{
                                scale: 1,
                                opacity: 1,
                                y: 0,
                                transition: { delay: index * 0.05 }
                            }}
                            exit={{ scale: 0, opacity: 0, y: 20 }}
                            onClick={action.action}
                            className={`flex items-center gap-3 ${action.color} text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all group`}
                        >
                            <span className="text-sm font-medium whitespace-nowrap">
                                {action.label}
                            </span>
                            <action.icon className="w-5 h-5" />
                        </motion.button>
                    ))}
                </AnimatePresence>
            </div>

            {/* Main FAB Button */}
            <motion.button
                onClick={toggleMenu}
                className="fab"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label={isOpen ? 'Close menu' : 'Open quick actions'}
            >
                <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {isOpen ? (
                        <X className="w-6 h-6" />
                    ) : (
                        <Plus className="w-6 h-6" />
                    )}
                </motion.div>
            </motion.button>
        </>
    );
}

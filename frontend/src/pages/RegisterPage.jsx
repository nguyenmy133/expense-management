import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Wallet, User, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function RegisterPage() {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { signUp } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Email validation regex
        const emailRegex = /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/;

        if (!emailRegex.test(email)) {
            setError('Vui lòng nhập địa chỉ email hợp lệ (ví dụ: user@example.com)');
            return;
        }

        if (password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        if (!fullName.trim()) {
            setError('Vui lòng nhập họ tên');
            return;
        }

        setLoading(true);

        try {
            await signUp(email, password, fullName);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || t('common.error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900"></div>

            {/* Animated Overlay Pattern */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-20 right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-1/3 left-20 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.2s' }}></div>
                <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2.5s' }}></div>
                <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-pink-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.8s' }}></div>
            </div>

            {/* Floating Financial Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Dollar sign inspired circles */}
                <div className="absolute top-20 left-1/4 w-16 h-16 border-4 border-emerald-300/30 rounded-full animate-bounce" style={{ animationDuration: '3.2s' }}></div>
                <div className="absolute top-1/2 right-1/4 w-12 h-12 border-4 border-teal-400/25 rounded-full animate-bounce" style={{ animationDuration: '4.2s', animationDelay: '0.8s' }}></div>
                <div className="absolute bottom-1/4 left-1/2 w-18 h-18 border-4 border-cyan-300/30 rounded-full animate-bounce" style={{ animationDuration: '3.8s', animationDelay: '1.2s' }}></div>
                <div className="absolute bottom-1/2 right-1/3 w-14 h-14 border-4 border-lime-300/20 rounded-full animate-bounce" style={{ animationDuration: '4.8s', animationDelay: '1.8s' }}></div>
                <div className="absolute top-2/3 left-1/5 w-10 h-10 border-4 border-yellow-300/25 rounded-full animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '2.2s' }}></div>
            </div>

            {/* Content Container */}
            <div className="max-w-md w-full animate-scale-in relative z-10">
                {/* Logo/Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 gradient-primary rounded-2xl mb-4 shadow-xl animate-pulse">
                        <Wallet className="w-9 h-9 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">
                        {t('auth.register.title')}
                    </h1>
                    <p className="text-white/90">{t('auth.register.subtitle')}</p>
                </div>

                {/* Register Form */}
                <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/50 animate-slide-up">
                    {error && (
                        <div className="mb-4 p-4 bg-danger-50 dark:bg-danger-900/20 border-l-4 border-danger-500 rounded-lg">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-danger-600 dark:text-danger-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-medium text-danger-800 dark:text-danger-300">{t('auth.login.error_title')}</p>
                                    <p className="text-sm text-danger-700 dark:text-danger-400">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('auth.register.fullname')}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                </div>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="input-field pl-10"
                                    placeholder={t('auth.register.fullname_placeholder')}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('auth.register.email')}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field pl-10"
                                    placeholder={t('auth.register.email_placeholder')}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('auth.register.password')}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-field pl-10"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                            </div>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t('auth.register.min_length')}</p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-3 text-base"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    {t('auth.register.loading')}
                                </span>
                            ) : (
                                t('auth.register.submit')
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {t('auth.register.have_account')}{' '}
                                <Link
                                    to="/login"
                                    className="text-primary hover:text-primary-700 dark:hover:text-primary-400 font-medium hover:underline transition-colors"
                                >
                                    {t('auth.register.login_now')}
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-white/80 mt-8">
                    {t('auth.footer')}
                </p>
            </div>
        </div>
    );
}

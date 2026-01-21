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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-gray-950 px-4">
            <div className="max-w-md w-full animate-scale-in">
                {/* Logo/Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 gradient-primary rounded-2xl mb-4 shadow-xl animate-pulse">
                        <Wallet className="w-9 h-9 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        {t('auth.register.title')}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">{t('auth.register.subtitle')}</p>
                </div>

                {/* Register Form */}
                <div className="card-solid animate-slide-up">
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
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
                    {t('auth.footer')}
                </p>
            </div>
        </div>
    );
}

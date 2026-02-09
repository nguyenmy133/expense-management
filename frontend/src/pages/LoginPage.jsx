import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Wallet, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import { useSystemSettings } from '../contexts/SystemSettingsContext';
import { useTranslation } from 'react-i18next';
import { GoogleLogin } from '@react-oauth/google';
import api from '../services/api';

export default function LoginPage() {
    const { t } = useTranslation();
    const { settings } = useSystemSettings();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { signIn } = useAuth();
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

        setLoading(true);

        try {
            await signIn(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || t('common.error'));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setLoading(true);
        setError('');
        try {
            const response = await api.post('/auth/google-login', {
                token: credentialResponse.credential
            });

            const { token, user } = response.data.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            navigate('/dashboard');
            window.location.reload();
        } catch (err) {
            setError(err.response?.data?.message || 'Google login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleError = () => {
        setError('Google login was cancelled or failed');
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600 dark:from-purple-900 dark:via-blue-900 dark:to-pink-900"></div>

            {/* Animated Overlay Pattern */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-40 right-20 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute bottom-40 right-1/3 w-64 h-64 bg-pink-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
            </div>

            {/* Floating Financial Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Coin-like circles */}
                <div className="absolute top-1/4 left-1/4 w-16 h-16 border-4 border-yellow-300/30 rounded-full animate-bounce" style={{ animationDuration: '3s' }}></div>
                <div className="absolute top-1/3 right-1/4 w-12 h-12 border-4 border-yellow-400/20 rounded-full animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }}></div>
                <div className="absolute bottom-1/4 left-1/3 w-20 h-20 border-4 border-green-300/25 rounded-full animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '1s' }}></div>
                <div className="absolute bottom-1/3 right-1/3 w-14 h-14 border-4 border-blue-300/20 rounded-full animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '1.5s' }}></div>
            </div>

            {/* Content Container */}
            <div className="max-w-md w-full animate-scale-in relative z-10">
                {/* Logo/Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 gradient-primary rounded-2xl mb-4 shadow-xl animate-pulse">
                        <Wallet className="w-9 h-9 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">
                        {t('auth.login.title')}
                    </h1>
                    <p className="text-white/90">
                        {settings.siteDescription || t('auth.login.subtitle')}
                    </p>
                </div>

                {/* Login Form */}
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
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end">
                            <Link
                                to="/forgot-password"
                                className="text-sm text-primary hover:text-primary-700 dark:hover:text-primary-400 font-medium hover:underline transition-colors"
                            >
                                Quên mật khẩu?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-3 text-base"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    {t('auth.login.loading')}
                                </span>
                            ) : (
                                t('auth.login.submit')
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                                Hoặc
                            </span>
                        </div>
                    </div>

                    {/* Google Sign-In Button */}
                    <div className="w-full flex justify-center">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                            theme="outline"
                            size="large"
                            text="signin_with"
                            width="100%"
                            locale="vi"
                        />
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {t('auth.login.no_account')}{' '}
                            <Link
                                to="/register"
                                className="text-primary hover:text-primary-700 dark:hover:text-primary-400 font-medium hover:underline transition-colors"
                            >
                                {t('auth.login.register_now')}
                            </Link>
                        </p>
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

import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import Navbar from '../components/Navbar';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaArrowLeft } from 'react-icons/fa';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useContext(UserContext);
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLoginSubmit = async (ev) => {
        ev.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setErrors({});

        try {
            await login(email, password);
            setRedirect(true);
        } catch (e) {
            setErrors({ general: e.response?.data?.message || 'Login failed. Please check your credentials.' });
        } finally {
            setIsLoading(false);
        }
    };

    if (redirect) {
        return <Navigate to={'/'} />;
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 to-white">
            <Navbar />

            <div className="flex-1 flex items-center justify-center px-4 py-12 relative">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-8 left-8 flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-semibold z-10"
                >
                    <FaArrowLeft /> Back
                </button>
                <div className="w-full max-w-md animate-slide-up">
                    {/* Card Container */}
                    <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                                Welcome Back
                            </h1>
                            <p className="text-gray-500">Login to your account</p>
                        </div>

                        {/* Error Message */}
                        {errors.general && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg animate-fade-in">
                                <p className="text-sm font-medium">{errors.general}</p>
                            </div>
                        )}

                        {/* Login Form */}
                        <form onSubmit={handleLoginSubmit} className="space-y-5">
                            {/* Email Input */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FaEnvelope className="text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(ev) => {
                                            setEmail(ev.target.value);
                                            if (errors.email) {
                                                setErrors(prev => ({ ...prev, email: '' }));
                                            }
                                        }}
                                        className={`input-field pl-11 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>

                            {/* Password Input */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FaLock className="text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(ev) => {
                                            setPassword(ev.target.value);
                                            if (errors.password) {
                                                setErrors(prev => ({ ...prev, password: '' }));
                                            }
                                        }}
                                        className={`input-field pl-11 pr-11 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition"
                                    >
                                        {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                )}
                            </div>

                            {/* Forgot Password */}
                            <div className="text-right">
                                <Link
                                    to="/forgot-password"
                                    className="text-sm text-primary hover:text-primary-dark font-medium transition"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Logging in...
                                    </span>
                                ) : (
                                    'Login'
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">Don't have an account?</span>
                            </div>
                        </div>

                        {/* Register Link */}
                        <div className="text-center">
                            <Link
                                to="/register"
                                className="inline-block w-full py-3 px-6 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition-all duration-200"
                            >
                                Create an account
                            </Link>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <p className="text-center text-sm text-gray-500 mt-6">
                        By continuing, you agree to WonderLust's{' '}
                        <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
                        {' '}and{' '}
                        <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

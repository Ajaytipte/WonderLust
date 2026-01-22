import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import Navbar from '../components/Navbar';
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [redirect, setRedirect] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useContext(UserContext);
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};

        if (!username) {
            newErrors.username = 'Name is required';
        } else if (username.length < 2) {
            newErrors.username = 'Name must be at least 2 characters';
        }

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

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const registerUser = async (ev) => {
        ev.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setErrors({});

        try {
            await register(username, email, password);
            setRedirect(true);
        } catch (e) {
            setErrors({
                general: e.response?.data?.message || 'Registration failed. Email might already be in use.'
            });
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
                                Join WonderLust
                            </h1>
                            <p className="text-gray-500">Create your account to get started</p>
                        </div>

                        {/* Error Message */}
                        {errors.general && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg animate-fade-in">
                                <p className="text-sm font-medium">{errors.general}</p>
                            </div>
                        )}

                        {/* Registration Form */}
                        <form onSubmit={registerUser} className="space-y-5">
                            {/* Name Input */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FaUser className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        value={username}
                                        onChange={(ev) => {
                                            setUsername(ev.target.value);
                                            if (errors.username) {
                                                setErrors(prev => ({ ...prev, username: '' }));
                                            }
                                        }}
                                        className={`input-field pl-11 ${errors.username ? 'border-red-500 focus:ring-red-500' : ''}`}
                                    />
                                </div>
                                {errors.username && (
                                    <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                                )}
                            </div>

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
                                        placeholder="Create a password"
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

                            {/* Confirm Password Input */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FaLock className="text-gray-400" />
                                    </div>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="Confirm your password"
                                        value={confirmPassword}
                                        onChange={(ev) => {
                                            setConfirmPassword(ev.target.value);
                                            if (errors.confirmPassword) {
                                                setErrors(prev => ({ ...prev, confirmPassword: '' }));
                                            }
                                        }}
                                        className={`input-field pl-11 pr-11 ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition"
                                    >
                                        {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                                )}
                            </div>



                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating account...
                                    </span>
                                ) : (
                                    'Create Account'
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">Already have an account?</span>
                            </div>
                        </div>

                        {/* Login Link */}
                        <div className="text-center">
                            <Link
                                to="/login"
                                className="inline-block w-full py-3 px-6 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition-all duration-200"
                            >
                                Login to your account
                            </Link>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <p className="text-center text-sm text-gray-500 mt-6">
                        By creating an account, you agree to our{' '}
                        <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
                        {' '}and{' '}
                        <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;

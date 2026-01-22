import { useState, useContext, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import Navbar from '../components/Navbar';
import { FaUser, FaEnvelope, FaPhone, FaCamera, FaLock, FaSave, FaEdit, FaArrowLeft } from 'react-icons/fa';
import axios from '../services/api';

const ProfilePage = () => {
    const { user, setUser, loading } = useContext(UserContext);
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showPasswordSection, setShowPasswordSection] = useState(false);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        profilePicture: ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                email: user.email || '',
                phone: user.phone || '',
                profilePicture: user.profilePicture || ''
            });
        }
    }, [user]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error when user starts typing
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const [profileFile, setProfileFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSuccess('');
        setIsSaving(true);

        try {
            const data = new FormData();
            data.append('username', formData.username);
            data.append('email', formData.email);
            data.append('phone', formData.phone);
            if (profileFile) {
                data.append('profilePicture', profileFile);
            }

            const response = await axios.put('/auth/profile', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setUser(response.data.user);
            // CRITICAL FIX: Update localStorage so data persists on refresh
            localStorage.setItem('user', JSON.stringify(response.data.user));

            setSuccess('Profile updated successfully!');
            setIsEditing(false);
            setProfileFile(null); // Reset file
        } catch (error) {
            setErrors({ general: error.response?.data?.message || 'Failed to update profile' });
        } finally {
            setIsSaving(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setErrors({});
        setSuccess('');

        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            setErrors({ confirmNewPassword: 'Passwords do not match' });
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setErrors({ newPassword: 'Password must be at least 6 characters' });
            return;
        }

        setIsSaving(true);

        try {
            await axios.put('/auth/password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            setSuccess('Password updated successfully!');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: ''
            });
            setShowPasswordSection(false);
        } catch (error) {
            setErrors({ password: error.response?.data?.message || 'Failed to update password' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setProfileFile(file);
        // Preview logic
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({ ...prev, profilePicture: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-primary mb-6 transition-colors font-semibold"
                    >
                        <FaArrowLeft /> Back
                    </button>
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">My Profile</h1>
                    <p className="text-gray-500">Manage your account information</p>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg animate-fade-in">
                        {success}
                    </div>
                )}

                {/* Error Message */}
                {errors.general && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg animate-fade-in">
                        {errors.general}
                    </div>
                )}

                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-card p-8 mb-6">
                    {/* Profile Picture */}
                    <div className="flex items-center gap-6 mb-8 pb-8 border-b">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                                {formData.profilePicture ? (
                                    <img
                                        src={formData.profilePicture}
                                        alt={formData.username}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <FaUser size={40} className="text-gray-400" />
                                )}
                            </div>
                            {isEditing && (
                                <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary-dark transition">
                                    <FaCamera size={14} />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageUpload}
                                    />
                                </label>
                            )}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-gray-800">{formData.username}</h2>
                            <p className="text-gray-500">{formData.email}</p>
                            <span className="inline-block mt-2 px-3 py-1 bg-orange-100 text-primary text-sm font-semibold rounded-full">
                                {user.role === 'host' ? 'Host' : 'Guest'}
                            </span>
                        </div>
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="btn-primary flex items-center gap-2"
                            >
                                <FaEdit /> Edit Profile
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsEditing(false)}
                                className="btn-secondary"
                            >
                                Cancel
                            </button>
                        )}
                    </div>

                    {/* Profile Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Username */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    <FaUser className="inline mr-2" /> Full Name
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="input-field disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    <FaEnvelope className="inline mr-2" /> Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="input-field disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    <FaPhone className="inline mr-2" /> Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="+1 (555) 123-4567"
                                    className="input-field disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>

                        {isEditing && (
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="btn-primary flex items-center gap-2 disabled:opacity-50"
                                >
                                    <FaSave /> {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        )}
                    </form>
                </div>

                {/* Password Update Section */}
                <div className="bg-white rounded-2xl shadow-card p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <FaLock /> Password & Security
                            </h3>
                            <p className="text-gray-500 text-sm mt-1">Update your password</p>
                        </div>
                        {!showPasswordSection && (
                            <button
                                onClick={() => setShowPasswordSection(true)}
                                className="btn-secondary"
                            >
                                Change Password
                            </button>
                        )}
                    </div>

                    {showPasswordSection && (
                        <form onSubmit={handlePasswordUpdate} className="space-y-5">
                            {errors.password && (
                                <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                                    {errors.password}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    className="input-field"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    className={`input-field ${errors.newPassword ? 'border-red-500' : ''}`}
                                    required
                                />
                                {errors.newPassword && (
                                    <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    name="confirmNewPassword"
                                    value={passwordData.confirmNewPassword}
                                    onChange={handlePasswordChange}
                                    className={`input-field ${errors.confirmNewPassword ? 'border-red-500' : ''}`}
                                    required
                                />
                                {errors.confirmNewPassword && (
                                    <p className="mt-1 text-sm text-red-600">{errors.confirmNewPassword}</p>
                                )}
                            </div>

                            <div className="flex gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowPasswordSection(false);
                                        setPasswordData({
                                            currentPassword: '',
                                            newPassword: '',
                                            confirmNewPassword: ''
                                        });
                                        setErrors({});
                                    }}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="btn-primary disabled:opacity-50"
                                >
                                    {isSaving ? 'Updating...' : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;

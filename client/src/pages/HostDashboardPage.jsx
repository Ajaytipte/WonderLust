import { useState, useContext, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import Navbar from '../components/Navbar';
import { FaPlus, FaHome, FaMapMarkerAlt, FaStar, FaEdit, FaTrash, FaArrowLeft, FaCalendarAlt } from 'react-icons/fa';
import axios, { BASE_URL } from '../services/api';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const HostDashboardPage = () => {
    const { user, loading } = useContext(UserContext);
    const navigate = useNavigate();
    const [properties, setProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const getImageUrl = (photo) => {
        if (!photo) return '/placeholder-property.jpg';
        if (photo.startsWith('http')) return photo;
        return `${BASE_URL}/${photo.replace(/\\/g, '/')}`;
    };

    useEffect(() => {
        if (user) {
            fetchMyProperties();
        }
    }, [user]);

    const fetchMyProperties = async () => {
        try {
            setIsLoading(true);
            // Based on propertyController, we can filter by hostId
            const response = await axios.get(`/properties?hostId=${user._id}`);
            if (response.data.success) {
                setProperties(response.data.data.properties);
            }
        } catch (err) {
            setError('Failed to load your properties');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteProperty = async (id) => {
        if (!window.confirm('Are you sure you want to delete this property?')) return;
        try {
            await axios.delete(`/properties/${id}`);
            setProperties(properties.filter(p => p._id !== id));
            toast.success('Property deleted successfully');
        } catch (err) {
            toast.error('Failed to delete property');
            console.error(err);
        }
    };

    if (loading || isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex items-center justify-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-primary mb-6 transition-colors font-semibold"
                >
                    <FaArrowLeft /> Back
                </button>
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                            <FaHome className="text-primary" />
                            My Properties
                        </h1>
                        <p className="text-gray-500">
                            Manage your property listings and hosting
                        </p>
                    </div>
                    <Link to="/host/new" className="btn-primary flex items-center gap-2 py-3 px-6 rounded-xl text-lg shadow-lg hover:shadow-primary/30 transform hover:-translate-y-0.5 transition-all">
                        <FaPlus size={16} />
                        Add New Property
                    </Link>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Properties Grid */}
                {properties.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
                        <div className="bg-orange-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaHome size={40} className="text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">No properties listed yet</h2>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">
                            You haven't added any properties to WonderLust. Start hosting today and reach thousands of guests!
                        </p>
                        <Link to="/host/new" className="btn-primary inline-flex items-center gap-2">
                            <FaPlus />
                            Create Your First Listing
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {properties.map((property) => (
                            <div
                                key={property._id}
                                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group flex flex-col h-full"
                            >
                                {/* Image Container */}
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <img
                                        src={getImageUrl(property.photos?.[0])}
                                        alt={property.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800';
                                        }}
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                                            {property.type}
                                        </span>
                                    </div>

                                    {/* Action Buttons Overlay */}
                                    <div className="absolute top-4 right-4 flex gap-2">
                                        <Link
                                            to={`/host/edit/${property._id}`}
                                            className="bg-white/90 hover:bg-white p-2 rounded-full shadow-md text-gray-700 hover:text-blue-600 transition-all hover:scale-110"
                                            title="Edit Property"
                                        >
                                            <FaEdit size={16} />
                                        </Link>
                                        <button
                                            onClick={() => deleteProperty(property._id)}
                                            className="bg-white/90 hover:bg-white p-2 rounded-full shadow-md text-gray-700 hover:text-red-600 transition-all hover:scale-110"
                                            title="Delete Property"
                                        >
                                            <FaTrash size={16} />
                                        </button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex-grow flex flex-col">
                                    <h3 className="text-lg font-bold text-gray-800 mb-2 truncate group-hover:text-primary transition-colors">
                                        {property.title}
                                    </h3>

                                    <div className="flex items-center text-gray-500 text-sm mb-2">
                                        <FaMapMarkerAlt className="text-primary mr-1.5" size={14} />
                                        <span className="truncate">{property.location?.city}, {property.location?.country}</span>
                                    </div>

                                    <div className="flex items-center text-gray-400 text-xs mb-4">
                                        <FaCalendarAlt className="mr-1.5" size={12} />
                                        <span>Added on {format(new Date(property.createdAt), 'MMM dd, yyyy')}</span>
                                    </div>

                                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                                        <div>
                                            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-0.5">Price per night</p>
                                            <p className="text-lg font-bold text-gray-900">₹{property.price?.toLocaleString() || property.pricePerNight?.toLocaleString()}</p>
                                        </div>
                                        <div className="flex items-center bg-orange-50 px-2.5 py-1 rounded-lg">
                                            <FaStar className="text-yellow-500 mr-1" size={12} />
                                            <span className="font-bold text-sm text-gray-800">{property.rating?.toFixed(1) || '0.0'}</span>
                                        </div>
                                    </div>

                                    <Link
                                        to={`/property/${property._id}`}
                                        className="mt-5 w-full text-center py-2.5 rounded-xl border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all duration-300"
                                    >
                                        View Listing
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HostDashboardPage;

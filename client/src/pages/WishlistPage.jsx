import { useState, useContext, useEffect } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import Navbar from '../components/Navbar';
import PropertyCard from '../components/PropertyCard';
import { FaHeart, FaArrowLeft } from 'react-icons/fa';
import axios from '../services/api';
import toast from 'react-hot-toast';
import Footer from '../components/Footer';

const WishlistPage = () => {
    const { user, loading } = useContext(UserContext);
    const navigate = useNavigate();
    const [wishlist, setWishlist] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            fetchWishlist();
        }
    }, [user]);

    const fetchWishlist = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('/wishlist');
            setWishlist(response.data);
            setError('');
        } catch (err) {
            setError('Failed to load wishlist');
            toast.error('Failed to load wishlist');
            console.error(err);
        } finally {
            setIsLoading(false);
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
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-primary mb-6 transition-colors font-semibold"
                    >
                        <FaArrowLeft /> Back
                    </button>
                    <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                        <FaHeart className="text-primary" />
                        My Wishlist
                    </h1>
                    <p className="text-gray-500">
                        {wishlist.length} {wishlist.length === 1 ? 'property' : 'properties'} saved
                    </p>
                </div>

                {/* Wishlist Grid */}
                {wishlist.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
                        <FaHeart size={64} className="text-gray-200 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your wishlist is empty</h2>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                            Start exploring and save your favorite properties to find them easily later.
                        </p>
                        <Link to="/" className="btn-primary inline-block px-8">
                            Explore Properties
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {wishlist.map((property) => (
                            <PropertyCard
                                key={property._id}
                                property={property}
                                onWishlistUpdate={fetchWishlist}
                            />
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default WishlistPage;

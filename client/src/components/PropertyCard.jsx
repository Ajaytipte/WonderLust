import { Link, useNavigate } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import { FaHeart, FaRegHeart, FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import { UserContext } from '../context/UserContext';
import axios, { BASE_URL } from '../services/api';
import toast from 'react-hot-toast';

const PropertyCard = ({ property, onWishlistUpdate }) => {
    // ...
    const getImageUrl = (photo) => {
        if (!photo) return '/placeholder-property.jpg';
        if (photo.startsWith('http')) return photo;
        return `${BASE_URL}/${photo.replace(/\\/g, '/')}`;
    };
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);

    useEffect(() => {
        if (user && user.wishlist) {
            const isWishlisted = user.wishlist.some(item => {
                const itemId = typeof item === 'object' ? item._id : item;
                return String(itemId) === String(property._id);
            });
            setIsInWishlist(isWishlisted);
        }
    }, [user, property._id]);

    const toggleWishlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            toast.error('Please login to save to wishlist');
            navigate('/login');
            return;
        }

        setIsTogglingWishlist(true);

        try {
            const propId = String(property._id);
            let response;
            if (isInWishlist) {
                response = await axios.delete(`/wishlist/${propId}`);
                toast.success('Removed from wishlist');
            } else {
                response = await axios.post(`/wishlist/${propId}`);
                toast.success('Added to wishlist');
            }

            // Sync with global user state
            if (response.data.success !== false) {
                const updatedWishlist = response.data.wishlist;
                const updatedUser = { ...user, wishlist: updatedWishlist };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }

            if (onWishlistUpdate) {
                onWishlistUpdate();
            }
        } catch (error) {
            console.error('Failed to update wishlist:', error);
            toast.error(error.response?.data?.message || 'Failed to update wishlist');
        } finally {
            setIsTogglingWishlist(false);
        }
    };

    const price = property.pricePerNight || property.price || 0;

    return (
        <div className="card overflow-hidden group animate-fade-in">
            <Link to={`/property/${property._id}`} className="block">
                {/* Property Image */}
                <div className="relative aspect-square overflow-hidden">
                    <img
                        src={getImageUrl(property.photos?.[0])}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'; // High-quality villa placeholder
                        }}
                    />

                    {/* Wishlist Heart Button */}
                    <button
                        onClick={toggleWishlist}
                        disabled={isTogglingWishlist}
                        className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2.5 rounded-full shadow-md transition-all hover:scale-110 z-10 disabled:opacity-50"
                        title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                        {isInWishlist ? (
                            <FaHeart className="text-red-500" size={16} />
                        ) : (
                            <FaRegHeart className="text-gray-700" size={16} />
                        )}
                    </button>
                </div>

                {/* Property Info */}
                <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-1 truncate group-hover:text-primary transition">
                        {property.title}
                    </h3>

                    <div className="flex items-center text-gray-600 text-sm mb-2">
                        <FaMapMarkerAlt className="mr-1 text-primary flex-shrink-0" size={12} />
                        <span className="truncate">
                            {property.location?.city && property.location?.country
                                ? `${property.location.city}, ${property.location.country}`
                                : 'Location not specified'}
                        </span>
                    </div>

                    <p className="text-sm text-gray-500 mb-3 truncate">
                        {property.type || 'Property'}
                    </p>

                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-lg font-bold text-gray-800">
                                ₹{price.toLocaleString()}
                            </span>
                            <span className="text-sm text-gray-500"> / night</span>
                        </div>

                        {property.numReviews > 0 && (
                            <div className="flex items-center gap-1 text-sm">
                                <FaStar className="text-yellow-500" size={14} />
                                <span className="font-semibold">{property.rating?.toFixed(1) || '0.0'}</span>
                                <span className="text-gray-500">({property.numReviews})</span>
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default PropertyCard;

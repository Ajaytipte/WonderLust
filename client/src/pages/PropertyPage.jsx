import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios, { BASE_URL } from "../services/api";
import BookingWidget from "../components/BookingWidget";
import Navbar from "../components/Navbar";
import { FaStar, FaUserCircle, FaPaperPlane, FaArrowLeft, FaMapMarkerAlt, FaHeart, FaRegHeart } from "react-icons/fa";
import { format } from "date-fns";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PropertyMap from "../components/PropertyMap";
import Footer from "../components/Footer";

export default function PropertyPage() {
    const { id } = useParams();
    const [property, setProperty] = useState(null);

    // Gallery state
    const [showAllPhotos, setShowAllPhotos] = useState(false);
    const navigate = useNavigate();

    const { user, setUser } = useContext(UserContext);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);

    const getImageUrl = (photo) => {
        if (!photo) return '/placeholder-property.jpg';
        if (photo.startsWith('http')) return photo;
        return `${BASE_URL}/${photo.replace(/\\/g, '/')}`;
    };

    // Reviews state
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        if (user && user.wishlist && id) {
            const isWishlisted = user.wishlist.some(item => {
                const itemId = typeof item === 'object' ? item._id : item;
                return String(itemId) === String(id);
            });
            setIsInWishlist(isWishlisted);
        }
    }, [user, id]);

    const toggleWishlist = async () => {
        if (!user) {
            toast.error('Please login to save to wishlist');
            navigate('/login');
            return;
        }

        setIsTogglingWishlist(true);
        try {
            const propId = String(id);
            let response;
            if (isInWishlist) {
                response = await axios.delete(`/wishlist/${propId}`);
                setIsInWishlist(false);
                toast.success('Removed from wishlist');
            } else {
                response = await axios.post(`/wishlist/${propId}`);
                setIsInWishlist(true);
                toast.success('Added to wishlist');
            }

            // Sync with global user state
            if (response.data.success !== false) {
                const updatedWishlist = response.data.wishlist;
                const updatedUser = { ...user, wishlist: updatedWishlist };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }
        } catch (error) {
            console.error('Failed to update wishlist:', error);
            toast.error('Failed to update wishlist');
        } finally {
            setIsTogglingWishlist(false);
        }
    };

    useEffect(() => {
        if (!id) return;

        // Fetch property
        axios.get(`/properties/${id}`).then(response => {
            setProperty(response.data.data.property);
        }).catch(err => {
            toast.error("Property not found");
        });

        // Fetch reviews
        axios.get(`/properties/${id}/reviews`).then(response => {
            setReviews(response.data.data.reviews);
        });
    }, [id]);

    const submitReview = async (e) => {
        e.preventDefault();
        if (!user) return toast.error('Please login to leave a review');

        setSubmittingReview(true);
        try {
            const response = await axios.post('/reviews', {
                propertyId: id,
                rating,
                comment
            });

            // Add new review to list
            setReviews(prev => [{
                ...response.data.data.review,
                userId: {
                    username: user.username,
                    profilePicture: user.profilePicture
                }
            }, ...prev]);

            // Update local property state for immediate UI update
            setProperty(prev => ({
                ...prev,
                numReviews: (prev.numReviews || 0) + 1,
                rating: prev.numReviews > 0
                    ? ((prev.rating * prev.numReviews) + rating) / (prev.numReviews + 1)
                    : rating
            }));

            // Reset form
            setComment('');
            setRating(5);
            toast.success('Review submitted successfully!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit review');
        } finally {
            setSubmittingReview(false);
        }
    };

    if (!property) return '';

    if (showAllPhotos) {
        return (
            <div className="fixed inset-0 bg-black text-white z-[100] overflow-y-auto no-scrollbar">
                {/* Header */}
                <div className="sticky top-0 bg-black/80 backdrop-blur-md z-50 p-6 flex justify-between items-center border-b border-gray-800">
                    <h2 className="text-xl md:text-3xl font-bold truncate pr-4">Photos of {property.title}</h2>
                    <button
                        onClick={() => setShowAllPhotos(false)}
                        className="flex items-center gap-2 py-2.5 px-5 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition-all active:scale-95 shadow-lg"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="hidden sm:inline">Close photos</span>
                    </button>
                </div>

                {/* Gallery Content */}
                <div className="p-4 md:p-12">
                    {/* Mobile Swiper (Snap Gallery) */}
                    <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory gap-4 pb-8 no-scrollbar">
                        {property.photos?.length > 0 && property.photos.map((photo, index) => (
                            <div key={photo} className="min-w-full snap-center flex items-center justify-center">
                                <div className="relative group">
                                    <img
                                        src={getImageUrl(photo)}
                                        alt=""
                                        className="rounded-2xl max-h-[70vh] object-contain shadow-2xl"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800';
                                        }}
                                    />
                                    <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-medium">
                                        {index + 1} / {property.photos.length}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop Stacked Gallery */}
                    <div className="hidden md:grid gap-8 max-w-4xl mx-auto">
                        {property.photos?.length > 0 && property.photos.map(photo => (
                            <div key={photo} className="flex justify-center group">
                                <img
                                    src={getImageUrl(photo)}
                                    alt=""
                                    className="rounded-3xl shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800';
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-8">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex justify-between items-start">
                    <div>
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-gray-600 hover:text-primary mb-6 transition-colors font-semibold"
                        >
                            <FaArrowLeft /> Back
                        </button>
                        <h1 className="text-3xl font-display font-semibold">{property.title}</h1>
                    </div>
                    <button
                        onClick={toggleWishlist}
                        disabled={isTogglingWishlist}
                        className={`flex items-center gap-2 py-2 px-4 rounded-xl border transition-all ${isInWishlist
                            ? 'bg-red-50 border-red-200 text-red-500 shadow-sm'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                            } disabled:opacity-50`}
                    >
                        {isInWishlist ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                        <span className="font-semibold">{isInWishlist ? 'Saved' : 'Save'}</span>
                    </button>
                </div>
                <a className="flex gap-1 my-3 block font-semibold underline text-gray-700" target="_blank" href={'https://maps.google.com/?q=' + property.location?.address}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    {property.location?.address}
                </a>

                {/* Images Grid */}
                <div className="relative">
                    <div className="grid gap-2 grid-cols-[2fr_1fr] rounded-3xl overflow-hidden shadow-sm">
                        <div>
                            {property.photos?.[0] && (
                                <div onClick={() => setShowAllPhotos(true)} className="aspect-w-16 aspect-h-9 cursor-pointer">
                                    <img
                                        className="object-cover w-full h-[400px]"
                                        src={getImageUrl(property.photos[0])}
                                        alt=""
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800';
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="grid gap-2">
                            {property.photos?.[1] && (
                                <div onClick={() => setShowAllPhotos(true)} className="cursor-pointer">
                                    <img
                                        className="object-cover w-full h-[195px]"
                                        src={getImageUrl(property.photos[1])}
                                        alt=""
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800';
                                        }}
                                    />
                                </div>
                            )}
                            {property.photos?.[2] && (
                                <div onClick={() => setShowAllPhotos(true)} className="cursor-pointer">
                                    <img
                                        className="object-cover w-full h-[195px]"
                                        src={getImageUrl(property.photos[2])}
                                        alt=""
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800';
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <button onClick={() => setShowAllPhotos(true)} className="absolute bottom-2 right-2 py-2 px-4 bg-white rounded-2xl shadow-md border border-black font-semibold flex gap-1 items-center hover:bg-gray-100">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                        Show all photos
                    </button>
                </div>

                {/* Content & Booking Widget */}
                <div className="mt-8 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
                    <div>
                        <div className="my-4">
                            <h2 className="font-semibold text-2xl">Description</h2>
                            <div className="text-gray-700 leading-relaxed mt-4 whitespace-pre-line">
                                {property.description}
                            </div>
                        </div>

                        <div className="my-8">
                            <h2 className="font-semibold text-2xl mb-4">What this place offers</h2>
                            <div className="grid grid-cols-2 gap-2 text-gray-700">
                                {property.amenities?.map(amenity => (
                                    <div key={amenity} className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                        {amenity}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="border-t pt-8">
                            <h2 className="font-semibold text-2xl">Host Info</h2>
                            <div className="mt-2 text-gray-700">
                                Hosted by <span className="font-bold">{property.hostId?.username || 'Host'}</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <BookingWidget property={property} />
                    </div>
                </div>

                {/* Review Section */}
                <div className="border-t pt-12 mt-12">
                    <div className="flex items-center gap-3 mb-8">
                        {property.numReviews > 0 ? (
                            <>
                                <FaStar className="text-primary text-2xl" />
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {property.rating?.toFixed(1) || '0.0'} · {property.numReviews} reviews
                                </h2>
                            </>
                        ) : (
                            <h2 className="text-2xl font-bold text-gray-800">No reviews yet</h2>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Review Form */}
                        <div>
                            {user ? (
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <h3 className="text-xl font-bold mb-4">Leave a review</h3>
                                    <form onSubmit={submitReview} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                                            <div className="flex gap-2">
                                                {[1, 2, 3, 4, 5].map(num => (
                                                    <button
                                                        key={num}
                                                        type="button"
                                                        onClick={() => setRating(num)}
                                                        className={`p-2 rounded-lg transition-all ${rating >= num ? 'text-yellow-500' : 'text-gray-300'}`}
                                                    >
                                                        <FaStar size={24} />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Your review</label>
                                            <textarea
                                                value={comment}
                                                onChange={e => setComment(e.target.value)}
                                                required
                                                className="w-full border border-gray-200 rounded-xl p-3 h-32 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                                placeholder="Tell others about your stay..."
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={submittingReview}
                                            className="btn-primary w-full flex items-center justify-center gap-2 py-3"
                                        >
                                            <FaPaperPlane size={14} />
                                            {submittingReview ? 'Submitting...' : 'Post Review'}
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                <div className="bg-orange-50 p-6 rounded-2xl text-center">
                                    <p className="text-gray-700 font-medium mb-4">Please login to write a review</p>
                                    <Link to="/login" className="btn-primary inline-block">Login</Link>
                                </div>
                            )}
                        </div>

                        {/* Recent Reviews List */}
                        <div className="space-y-8">
                            {reviews.length > 0 ? (
                                reviews.map(review => (
                                    <div key={review._id} className="border-b border-gray-100 pb-8 last:border-0">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                                                {review.userId?.profilePicture ? (
                                                    <img src={review.userId.profilePicture} alt={review.userId.username} className="w-full h-full object-cover" />
                                                ) : (
                                                    <FaUserCircle className="w-full h-full text-gray-300" />
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-800">{review.userId?.username}</h4>
                                                <p className="text-xs text-gray-500">{format(new Date(review.createdAt), 'MMMM yyyy')}</p>
                                            </div>
                                            <div className="ml-auto flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                                                <FaStar className="text-yellow-500" size={12} />
                                                <span className="font-bold text-sm">{review.rating}</span>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed">
                                            {review.comment}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    <p>No reviews yet. Be the first to review this property!</p>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Map Section */}
                    <div className="border-t pt-12 mt-12 pb-12">
                        <div className="flex items-center gap-2 mb-6">
                            <FaMapMarkerAlt className="text-primary text-2xl" />
                            <h2 className="text-2xl font-bold text-gray-800">Where you'll be</h2>
                        </div>
                        <PropertyMap location={property.location} />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

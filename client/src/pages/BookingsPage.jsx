import { useState, useEffect, useContext } from "react";
import axios, { BASE_URL } from "../services/api";
import AccountNav from "../components/AccountNav";
import Navbar from "../components/Navbar";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { format, isPast, isFuture } from "date-fns";
import { FaCalendarAlt, FaMapMarkerAlt, FaMoon, FaMoneyBillWave, FaChevronRight, FaArrowLeft } from "react-icons/fa";
import toast from "react-hot-toast";
import { UserContext } from "../context/UserContext";

export default function BookingsPage() {
    const { user, loading: userLoading } = useContext(UserContext);
    const [bookings, setBookings] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const getImageUrl = (photo) => {
        if (!photo) return '/placeholder-property.jpg';
        if (photo.startsWith('http')) return photo;
        return `${BASE_URL}/${photo.replace(/\\/g, '/')}`;
    };

    useEffect(() => {
        if (user) {
            axios.get('/bookings/my-bookings').then(response => {
                setBookings(response.data.data.bookings);
                setLoading(false);
            }).catch(() => setLoading(false));
        } else if (!userLoading) {
            setLoading(false);
        }
    }, [user, userLoading]);

    const handleCancel = async (e, bookingId) => {
        e.preventDefault(); // Prevent navigating to details page
        e.stopPropagation();

        if (window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
            try {
                await axios.delete(`/bookings/${bookingId}`);
                // Remove from state immediately
                setBookings(prev => prev.filter(booking => booking._id !== bookingId));
                toast.success('Booking cancelled successfully.');
            } catch (error) {
                console.error('Error cancelling booking:', error);
                toast.error('Failed to cancel booking. Please try again.');
            }
        }
    };

    if (userLoading || loading) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    if (!user && !userLoading) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <AccountNav />
            <div className="max-w-5xl mx-auto px-4 py-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-primary mb-6 transition-colors font-semibold"
                >
                    <FaArrowLeft /> Back
                </button>
                <h1 className="text-3xl font-bold mb-8 text-gray-800">My Trips</h1>

                {bookings?.length > 0 ? (
                    <div className="space-y-6">
                        {bookings.map(booking => {
                            const startDate = new Date(booking.startDate);
                            const endDate = new Date(booking.endDate);
                            const isCompleted = isPast(endDate);
                            const isCancelled = booking.status === 'cancelled';
                            const canCancel = !isCompleted && !isCancelled;

                            const statusColor = booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700';

                            return (
                                <Link
                                    to={`/account/bookings/${booking._id}`}
                                    key={booking._id}
                                    className="group flex flex-col md:flex-row bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    {/* Image Section */}
                                    <div className="w-full md:w-72 h-48 md:h-auto shrink-0 relative overflow-hidden">
                                        {booking.propertyId.photos?.[0] ? (
                                            <img
                                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                                src={getImageUrl(booking.propertyId.photos[0])}
                                                alt={booking.propertyId.title}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800';
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                                                No Image
                                            </div>
                                        )}
                                        <div className="absolute top-3 left-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${statusColor}`}>
                                                {booking.status || 'Confirmed'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="p-6 grow flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors mb-1">
                                                        {booking.propertyId.title}
                                                    </h2>
                                                    <div className="flex items-center text-gray-500 text-sm mb-4">
                                                        <FaMapMarkerAlt className="mr-1 text-primary" />
                                                        {booking.propertyId.location?.city}, {booking.propertyId.location?.country}
                                                    </div>
                                                </div>
                                                <div className="bg-gray-100 p-2 rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
                                                    <FaChevronRight className="w-4 h-4" />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mt-2">
                                                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                    <span className="text-xs text-gray-500 uppercase font-bold block mb-1">Dates</span>
                                                    <div className="flex items-center text-gray-700 font-medium">
                                                        <FaCalendarAlt className="mr-2 text-primary opacity-80" />
                                                        {format(startDate, 'MMM dd')} - {format(endDate, 'MMM dd, yyyy')}
                                                    </div>
                                                </div>
                                                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                    <span className="text-xs text-gray-500 uppercase font-bold block mb-1">Total Cost</span>
                                                    <div className="flex items-center text-gray-700 font-medium">
                                                        <FaMoneyBillWave className="mr-2 text-green-500 opacity-80" />
                                                        ₹{booking.totalPrice}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
                                            <div className="text-gray-500">
                                                {Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))} nights stay
                                            </div>

                                            <div className="flex items-center gap-3">
                                                {canCancel && (
                                                    <button
                                                        onClick={(e) => handleCancel(e, booking._id)}
                                                        className="px-4 py-2 border border-red-500 text-red-500 rounded-full hover:bg-red-50 font-semibold transition text-xs uppercase tracking-wide"
                                                    >
                                                        Cancel Booking
                                                    </button>
                                                )}

                                                {isCompleted ? (
                                                    <span className="text-gray-400 font-medium">Completed</span>
                                                ) : isCancelled ? (
                                                    <span className="text-red-400 font-medium">Cancelled</span>
                                                ) : (
                                                    <span className="text-primary font-medium">Upcoming Trip</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
                        <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaMoon className="text-4xl text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">No trips booked... yet!</h2>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">Time to dust off your bags and start planning your next adventure.</p>
                        <Link to="/" className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-dark transition shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-block">
                            Start Exploring
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

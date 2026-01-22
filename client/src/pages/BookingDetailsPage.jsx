import { useEffect, useState } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import axios from '../services/api';
import Navbar from '../components/Navbar';
import AccountNav from '../components/AccountNav';
import { format } from 'date-fns';
import { FaCalendar, FaUsers, FaMapMarkerAlt, FaHome, FaMoneyBillWave, FaInfoCircle, FaArrowLeft } from 'react-icons/fa';

export default function BookingDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;

        axios.get(`/bookings/${id}`)
            .then(response => {
                setBooking(response.data.data.booking);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching booking:', err);
                setError('Failed to load booking details');
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <AccountNav />
                <div className="flex items-center justify-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <AccountNav />
                <div className="max-w-4xl mx-auto px-4 py-12">
                    <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl text-center">
                        <p className="text-xl font-semibold mb-2">Booking Not Found</p>
                        <p>{error || 'This booking does not exist or you do not have access to it.'}</p>
                    </div>
                </div>
            </div>
        );
    }

    const checkInDate = booking.startDate ? new Date(booking.startDate) : new Date();
    const checkOutDate = booking.endDate ? new Date(booking.endDate) : new Date();
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <AccountNav />

            <div className="max-w-6xl mx-auto px-4 py-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-primary mb-6 transition-colors font-semibold"
                >
                    <FaArrowLeft /> Back
                </button>
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Booking Details</h1>
                    <p className="text-gray-500">Booking ID: {booking._id}</p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Property Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Property Card */}
                        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                            {/* Property Image */}
                            {booking.propertyId?.photos?.[0] && (
                                <div className="aspect-video overflow-hidden">
                                    <img
                                        src={booking.propertyId.photos[0]}
                                        alt={booking.propertyId.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            {/* Property Details */}
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                            {booking.propertyId?.title || 'Property'}
                                        </h2>
                                        {booking.propertyId?.location && (
                                            <div className="flex items-center text-gray-600">
                                                <FaMapMarkerAlt className="mr-2 text-primary" />
                                                <span>
                                                    {booking.propertyId.location.city}, {booking.propertyId.location.state}, {booking.propertyId.location.country}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {booking.propertyId?.description && (
                                    <p className="text-gray-600 mb-4">
                                        {booking.propertyId.description.substring(0, 200)}...
                                    </p>
                                )}

                                {/* Property Stats */}
                                <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200">
                                    <div className="flex items-center gap-2">
                                        <FaHome className="text-primary" />
                                        <span className="text-gray-600 capitalize">{booking.propertyId?.type || 'Property'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaUsers className="text-primary" />
                                        <span className="text-gray-600">Up to {booking.propertyId?.maxGuests || 'N/A'} guests</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Booking Timeline */}
                        <div className="bg-white rounded-2xl shadow-card p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <FaCalendar className="text-primary" />
                                Booking Timeline
                            </h3>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Check-in</p>
                                        <p className="text-lg font-semibold text-gray-800">
                                            {format(checkInDate, 'EEEE, MMMM dd, yyyy')}
                                        </p>
                                        <p className="text-sm text-gray-500">After 2:00 PM</p>
                                    </div>
                                </div>

                                <div className="border-l-4 border-primary h-12 ml-4"></div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Check-out</p>
                                        <p className="text-lg font-semibold text-gray-800">
                                            {format(checkOutDate, 'EEEE, MMMM dd, yyyy')}
                                        </p>
                                        <p className="text-sm text-gray-500">Before 11:00 AM</p>
                                    </div>
                                </div>

                                <div className="bg-orange-50 p-4 rounded-xl mt-4">
                                    <p className="text-primary font-semibold">
                                        Total stay: {nights} {nights === 1 ? 'night' : 'nights'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Booking Summary */}
                    <div className="space-y-6">
                        {/* Price Breakdown */}
                        <div className="bg-white rounded-2xl shadow-card p-6 sticky top-4">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <FaMoneyBillWave className="text-primary" />
                                Price Summary
                            </h3>

                            <div className="space-y-3">
                                <div className="flex justify-between text-gray-600">
                                    <span>₹{booking.propertyId?.pricePerNight || 0} × {nights} nights</span>
                                    <span>₹{(booking.propertyId?.pricePerNight || 0) * nights}</span>
                                </div>

                                <div className="flex justify-between text-gray-600">
                                    <span>Service fee</span>
                                    <span>₹{Math.floor((booking.totalPrice || 0) * 0.05)}</span>
                                </div>

                                <div className="border-t border-gray-200 pt-3 mt-3">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-lg text-gray-800">Total</span>
                                        <span className="font-bold text-2xl text-primary">
                                            ₹{booking.totalPrice || 0}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Guest Information */}
                        <div className="bg-white rounded-2xl shadow-card p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <FaUsers className="text-primary" />
                                Guest Details
                            </h3>

                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Number of guests</span>
                                    <span className="font-semibold text-gray-800">{booking.guests || 1}</span>
                                </div>
                            </div>
                        </div>

                        {/* Booking Status */}
                        <div className="bg-white rounded-2xl shadow-card p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <FaInfoCircle className="text-primary" />
                                Booking Status
                            </h3>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${booking.status === 'confirmed' ? 'bg-green-500' :
                                        booking.status === 'pending' ? 'bg-yellow-500' :
                                            'bg-gray-500'
                                        }`}></div>
                                    <span className="font-semibold text-gray-800 capitalize">
                                        {booking.status || 'Confirmed'}
                                    </span>
                                </div>

                                <p className="text-sm text-gray-500">
                                    Booked on {format(new Date(booking.createdAt || Date.now()), 'MMM dd, yyyy')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "../services/api";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function BookingWidget({ property }) {
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [numberOfGuests, setNumberOfGuests] = useState(1);
    const [redirect, setRedirect] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const { user } = useContext(UserContext);

    let numberOfNights = 0;
    if (checkIn && checkOut) {
        numberOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
    }

    async function bookThisPlace() {
        if (!user) {
            setRedirect('/login');
            return;
        }

        if (!checkIn || !checkOut) return alert('Please select dates');
        if (numberOfNights <= 0) return alert('Check out date must be after check in date');

        try {
            await axios.post('/bookings', {
                checkIn,
                checkOut,
                numberOfGuests,
                firstName: user.username,
                phone: '1234567890',
                propertyId: property._id,
                price: numberOfNights * property.pricePerNight,
                startDate: checkIn,
                endDate: checkOut
            });

            // Show success popup
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                setRedirect('/bookings');
            }, 2000);

            setCheckIn('');
            setCheckOut('');
            setNumberOfGuests(1);
        } catch (e) {
            console.error(e);
            alert('Booking failed. Dates might be taken.');
        }
    }

    if (redirect) {
        return <Navigate to={redirect} />;
    }

    return (
        <div className="bg-white shadow p-4 rounded-2xl border relative">
            {/* Success Popup Banner */}
            {showSuccess && (
                <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-8 py-4 rounded-xl shadow-2xl z-50 flex items-center gap-3 animate-fade-in">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                        <h4 className="font-bold text-lg">Booking Successful!</h4>
                        <p className="text-sm">Your reservation has been confirmed.</p>
                    </div>
                </div>
            )}

            <div className="text-2xl text-center">
                Price: ₹{property.pricePerNight} / per night
            </div>
            <div className="border rounded-2xl mt-4">
                <div className="flex">
                    <div className="py-3 px-4">
                        <label>Check in:</label>
                        <input type="date"
                            value={checkIn}
                            onChange={ev => setCheckIn(ev.target.value)} />
                    </div>
                    <div className="py-3 px-4 border-l">
                        <label>Check out:</label>
                        <input type="date"
                            value={checkOut}
                            onChange={ev => setCheckOut(ev.target.value)} />
                    </div>
                </div>
                <div className="py-3 px-4 border-t">
                    <label>Number of guests:</label>
                    <input type="number"
                        value={numberOfGuests}
                        onChange={ev => setNumberOfGuests(ev.target.value)} />
                </div>
            </div>
            {numberOfNights > 0 && (
                <div className="py-3 px-4 border-t">
                    <label>Your full name:</label>
                    <input type="text"
                        value={user?.username || ''}
                        readOnly />
                    <div className="mt-2 font-bold flex justify-between">
                        <span>Total price:</span>
                        <span>₹{numberOfNights * property.pricePerNight}</span>
                    </div>
                </div>
            )}
            <button onClick={bookThisPlace} className="bg-primary p-2 w-full text-white font-bold rounded-2xl mt-4 hover:scale-105 transition-transform">
                Book this place
                {numberOfNights > 0 && (
                    <span> ₹{numberOfNights * property.pricePerNight}</span>
                )}
            </button>
        </div>
    );
}

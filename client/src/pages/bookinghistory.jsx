import { useContext, useEffect, useState } from 'react';
import Accountbar from '../Components/Navbarcomponents/Accountbar';
import axios from 'axios';
import audi from "../Components/images/audi.jpg";
import toyota from "../Components/images/toyota.jpg";
import bmw from "../Components/images/bmw.jpg";
import passat from "../Components/images/passat.jpg";
import benz from "../Components/images/benz.jpg";
import golf from "../Components/images/golf.jpg";
import Footer from "../Components/Bodycomponents/Footer";
import LinearColor from '../Components/Bodycomponents/linearprogress';
import { UserContext } from '../Context/Clientcontext';
import { useNavigate } from 'react-router-dom';
import Privateroute from '../middleware/privateroute';

export default function Booking() {
    const [checkUser, setCheckUser] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [isLoadingCancel, setIsLoadingCancel] = useState(false);
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        // Protect route
        Privateroute();

        // Simulate loading user (for UI)
        const timer = setTimeout(() => setCheckUser(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Fetch bookings from the backend
        const fetchBookings = async () => {
            try {
                const response = await axios.get('/bookings'); // Make sure this URL is correct
                setBookings(response.data);  // Store the fetched data in state
            } catch (error) {
                console.error("Error fetching bookings:", error);
            }
        };
        fetchBookings();
    }, []);  // Only fetch once when the component mounts

    const carImages = {
        "Audi A1 S-Line": audi,
        "VW Golf 6": golf,
        "Toyota Camry": toyota,
        "BMW 320 ModernLine": bmw,
        "Mercedes-Benz GLK": benz,
        "VW Passat CC": passat
    };

    const handleCancelBooking = async (bookingId) => {
        setIsLoadingCancel(true);
        try {
            await axios.post('/cancel', { bookingId });
            // Update state instead of full reload (optimistic update)
            setBookings(prev => prev.filter(b => b._id !== bookingId));
        } catch (error) {
            console.error("Error canceling booking:", error);
        } finally {
            setIsLoadingCancel(false);
        }
    };

    if (!checkUser) return <LinearColor />;  // Display loading indicator while checking user

    return (
        <div>
            <Accountbar />
            <div className="container mx-auto py-4 flex justify-center md:justify-start">
                <h2 className="text-xl font-semibold italic">Booking History</h2>
            </div>
            <div className="flex flex-col min-h-screen">
                <div className="flex-grow container mx-auto">
                    <div className="grid lg:grid-cols-3 gap-4">
                        {bookings.length === 0 ? (
                            <p className="text-center italic text-gray-500">No bookings found.</p>
                        ) : (
                            bookings.map((booking, index) => (
                                <div key={index} className="text-center shadow-xl py-4 px-2 rounded-lg bg-white">
                                    <p className="font-semibold italic text-base">{booking.firstname} {booking.lastname}</p>
                                    <p className="italic text-sm">{booking.email}</p>
                                    <p className="italic text-sm">{booking.phone}</p>

                                    <div className="grid grid-cols-2 py-2 items-center">
                                        <div className="text-left space-y-1">
                                            <p className="italic">{booking.pickDate} - {booking.dropDate}</p>
                                            <p className="italic">{booking.pickPlace} - {booking.dropPlace}</p>
                                            <p className="italic">{booking.pickTime} - {booking.dropTime}</p>
                                        </div>
                                        <div>
                                            {carImages[booking.carType] ? (
                                                <img src={carImages[booking.carType]} alt={booking.carType} className="w-full h-auto rounded" />
                                            ) : (
                                                <p className="italic text-gray-400">Image unavailable</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-center mt-2">
                                        <button
                                            onClick={() => handleCancelBooking(booking._id)}
                                            className={`bg-orange rounded px-4 py-2 text-white font-bold transition-opacity ${isLoadingCancel ? "opacity-50 cursor-not-allowed" : "hover:opacity-100"}`}
                                            disabled={isLoadingCancel}
                                        >
                                            {isLoadingCancel ? "Cancelling..." : "Cancel"}
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

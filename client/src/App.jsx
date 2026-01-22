import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import WishlistPage from './pages/WishlistPage';
import HostDashboardPage from './pages/HostDashboardPage';
import PropertyFormPage from './pages/PropertyFormPage';
import PropertyPage from './pages/PropertyPage';
import BookingsPage from './pages/BookingsPage';
import BookingDetailsPage from './pages/BookingDetailsPage';
import InfoPage from './pages/InfoPage';
import { UserContextProvider } from './context/UserContext';
import { Toaster } from 'react-hot-toast';
import axios from 'axios';

// Default base URL for axios (if not using the service instance everywhere)
axios.defaults.baseURL = 'http://localhost:5000/api';
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/wishlist" element={<WishlistPage />} />

        <Route path="/host/dashboard" element={<HostDashboardPage />} />
        <Route path="/host/new" element={<PropertyFormPage />} />
        <Route path="/host/edit/:id" element={<PropertyFormPage />} />

        <Route path="/property/:id" element={<PropertyPage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/account/bookings/:id" element={<BookingDetailsPage />} />
        <Route path="/info/:slug" element={<InfoPage />} />
      </Routes>
    </UserContextProvider>
  );
}

export default App;

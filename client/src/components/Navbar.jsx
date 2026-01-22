import { Link, useNavigate } from 'react-router-dom';
import { useState, useContext, useEffect, useRef } from 'react';
import { FaSearch, FaUserCircle, FaBars } from 'react-icons/fa';
import { UserContext } from '../context/UserContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { user, logout } = useContext(UserContext);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const [isScrolled, setIsScrolled] = useState(false);

    // Track scroll for mobile search bar hiding
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Real-time search logic
    useEffect(() => {
        if (searchQuery.trim()) {
            const delayDebounceFn = setTimeout(() => {
                navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
            }, 500);
            return () => clearTimeout(delayDebounceFn);
        } else if (searchQuery === '' && window.location.search.includes('search=')) {
            navigate('/');
        }
    }, [searchQuery, navigate]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleHostYourHome = () => {
        setIsOpen(false);
        if (user) {
            navigate('/host/new');
        } else {
            navigate('/login');
        }
    };

    const handleLogout = () => {
        logout();
        setIsOpen(false);
        navigate('/');
    };

    return (
        <nav className="border-b sticky top-0 bg-white z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Brand Logo - Using logo.png image */}
                    <Link to="/" className="flex items-center flex-shrink-0 group">
                        <img
                            src="/logo.png"
                            alt="WonderLust"
                            className="h-14 w-auto object-contain transition-transform group-hover:scale-105 duration-300"
                        />
                    </Link>

                    {/* Search Bar - Center */}
                    <div className="hidden md:block flex-1 max-w-md mx-8">
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                placeholder="Search destinations or properties"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-5 pr-12 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm hover:shadow-md transition-all"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white p-2.5 rounded-full hover:bg-primary-dark transition-all hover:scale-105"
                            >
                                <FaSearch size={14} />
                            </button>
                        </form>
                    </div>

                    {/* Right Side - Profile Menu */}
                    <div className="flex items-center gap-4 relative" ref={dropdownRef}>
                        {/* Host Your Home Link - Desktop */}
                        <button
                            onClick={handleHostYourHome}
                            className="hidden md:block font-semibold text-gray-700 hover:bg-gray-100 py-2 px-4 rounded-full cursor-pointer transition"
                        >
                            Host Your Home
                        </button>

                        {/* Separated Profile & Menu Icons */}
                        <div className="flex items-center gap-3">
                            {/* Profile Link - Separate button for Desktop only */}
                            {user && (
                                <Link
                                    to="/profile"
                                    className="hidden md:flex bg-gray-100 rounded-full w-10 h-10 items-center justify-center overflow-hidden hover:shadow-md transition-all border border-gray-200"
                                    title="My Profile"
                                >
                                    {user.profilePicture ? (
                                        <img
                                            src={user.profilePicture}
                                            alt={user.username}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <FaUserCircle size={28} className="text-gray-400" />
                                    )}
                                </Link>
                            )}

                            {/* Menu Trigger Button */}
                            <div
                                className={`border rounded-full flex items-center justify-center w-10 h-10 hover:shadow-md cursor-pointer transition-all duration-300 bg-white ${isOpen ? 'border-primary rotate-90 shadow-inner' : 'border-gray-300'}`}
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                <FaBars size={18} className={`${isOpen ? 'text-primary' : 'text-gray-600'} transition-colors`} />
                            </div>
                        </div>

                        {/* Dropdown Menu - Dynamic Transition */}
                        {isOpen && (
                            <div className="absolute top-16 right-0 bg-white shadow-2xl rounded-2xl w-64 py-3 border border-gray-100 flex flex-col z-50 animate-slide-up ring-1 ring-black ring-opacity-5">
                                {user ? (
                                    <>
                                        {/* User Info Header with Profile Picture for Mobile */}
                                        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-4 bg-gray-50/50 rounded-t-2xl">
                                            <div className="md:hidden bg-gray-200 text-white rounded-full overflow-hidden w-12 h-12 flex-shrink-0 ring-2 ring-white">
                                                {user.profilePicture ? (
                                                    <img
                                                        src={user.profilePicture}
                                                        alt={user.username}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <FaUserCircle
                                                        size={48}
                                                        className="text-gray-400 bg-white"
                                                    />
                                                )}
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="font-bold text-gray-900 truncate leading-tight">{user.username}</p>
                                                <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
                                            </div>
                                        </div>

                                        <div className="py-2">
                                            <Link
                                                to="/profile"
                                                onClick={() => setIsOpen(false)}
                                                className="px-5 py-3 hover:bg-gray-50 font-medium text-gray-700 transition flex items-center"
                                            >
                                                My Profile
                                            </Link>
                                            <Link
                                                to="/wishlist"
                                                onClick={() => setIsOpen(false)}
                                                className="px-5 py-3 hover:bg-gray-50 font-medium text-gray-700 transition flex items-center"
                                            >
                                                Wishlist
                                            </Link>
                                            <Link
                                                to="/bookings"
                                                onClick={() => setIsOpen(false)}
                                                className="px-5 py-3 hover:bg-gray-50 font-medium text-gray-700 transition flex items-center"
                                            >
                                                My Bookings
                                            </Link>
                                        </div>

                                        <div className="border-t border-gray-100"></div>

                                        <div className="py-2">
                                            <button
                                                onClick={handleHostYourHome}
                                                className="w-full text-left px-5 py-3 hover:bg-gray-50 font-medium text-gray-700 transition flex items-center"
                                            >
                                                Host Your Home
                                            </button>
                                            <Link
                                                to="/host/dashboard"
                                                onClick={() => setIsOpen(false)}
                                                className="px-5 py-3 hover:bg-gray-50 font-medium text-gray-700 transition flex items-center"
                                            >
                                                My Properties
                                            </Link>
                                        </div>

                                        <div className="border-t border-gray-100"></div>

                                        <div className="py-2">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-5 py-3 hover:bg-red-50 text-primary font-bold transition flex items-center"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="py-2">
                                        <Link
                                            to="/login"
                                            onClick={() => setIsOpen(false)}
                                            className="px-5 py-3 hover:bg-gray-50 font-bold text-gray-900 transition flex items-center"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            to="/register"
                                            onClick={() => setIsOpen(false)}
                                            className="px-5 py-3 hover:bg-gray-50 text-gray-700 transition flex items-center"
                                        >
                                            Sign up
                                        </Link>
                                        <div className="border-t my-2 border-gray-100"></div>
                                        <button
                                            onClick={handleHostYourHome}
                                            className="w-full text-left px-5 py-3 hover:bg-gray-50 text-gray-700 transition flex items-center"
                                        >
                                            Host your home
                                        </button>
                                        <Link
                                            to="/help"
                                            onClick={() => setIsOpen(false)}
                                            className="px-5 py-3 hover:bg-gray-50 text-gray-700 transition flex items-center"
                                        >
                                            Help Center
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Search Bar - Positioned below the main navbar row */}
                <div className={`md:hidden px-4 transition-all duration-300 ease-in-out ${isScrolled ? 'max-h-0 opacity-0 pb-0 overflow-hidden' : 'max-h-40 opacity-100 pb-5'}`}>
                    <div className="animate-fade-in">
                        <form onSubmit={handleSearch} className="relative group">
                            <input
                                type="text"
                                placeholder="Where to?"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-6 pr-14 py-3.5 text-sm border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm group-hover:shadow-md transition-all placeholder:text-gray-400"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white p-2.5 rounded-xl hover:bg-primary-dark transition-all active:scale-95"
                            >
                                <FaSearch size={14} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

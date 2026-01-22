import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { FaUser, FaListUl, FaHotel } from 'react-icons/fa';

const AccountNav = () => {
    const { pathname } = useLocation();
    const { user } = useContext(UserContext);

    // More robust subpage detection
    let subpage = pathname.split('/')?.[1];
    if (pathname === '/profile' || pathname.startsWith('/profile')) subpage = 'profile';
    if (pathname === '/bookings' || pathname.startsWith('/bookings')) subpage = 'bookings';
    if (pathname.includes('/host')) subpage = 'host';

    function linkClasses(type = null) {
        let classes = 'inline-flex items-center gap-2 py-2.5 px-6 rounded-full transition-all duration-300 whitespace-nowrap font-medium ';
        if (type === subpage) {
            classes += 'bg-primary text-white shadow-md transform scale-105';
        } else {
            classes += 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow-sm';
        }
        return classes;
    }

    return (
        <nav className="w-full flex flex-wrap justify-center mt-8 gap-3 mb-8 px-4">
            <Link className={linkClasses('profile')} to={'/profile'}>
                <FaUser size={14} />
                <span>My Profile</span>
            </Link>
            <Link className={linkClasses('bookings')} to={'/bookings'}>
                <FaListUl size={14} />
                <span>My Bookings</span>
            </Link>
            {user && (
                <Link className={linkClasses('host')} to={'/host/dashboard'}>
                    <FaHotel size={14} />
                    <span>My Properties</span>
                </Link>
            )}
        </nav>
    );
};

export default AccountNav;

import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaGlobe, FaRupeeSign } from 'react-icons/fa';

const Footer = () => {
    const footerSections = [
        {
            title: 'Support',
            links: [
                { name: 'Help Centre', path: '/info/help-centre' },
                { name: 'Safety information', path: '/info/safety' },
                { name: 'AirCover', path: '/info/aircover' },
                { name: 'Anti-discrimination', path: '/info/anti-discrimination' },
                { name: 'Disability support', path: '/info/disability-support' },
                { name: 'Cancellation options', path: '/info/cancellation-options' },
                { name: 'Report neighbourhood concern', path: '/info/report-concern' },
            ]
        },
        {
            title: 'Hosting',
            links: [
                { name: 'WonderLust your home', path: '/host/new' },
                { name: 'AirCover for Hosts', path: '/info/aircover-hosts' },
                { name: 'Hosting resources', path: '/info/hosting-resources' },
                { name: 'Community forum', path: '/info/community-forum' },
                { name: 'Hosting responsibly', path: '/info/hosting-responsibly' },
                { name: 'Join a free hosting class', path: '/info/hosting-class' },
                { name: 'Find a co-host', path: '/info/find-cohost' },
                { name: 'Refer a host', path: '/info/refer-host' },
            ]
        },
        {
            title: 'WonderLust',
            links: [
                { name: 'Newsroom', path: '/info/newsroom' },
                { name: 'New features', path: '/info/new-features' },
                { name: 'Careers', path: '/info/careers' },
                { name: 'Investors', path: '/info/investors' },
                { name: 'WonderLust.org emergency stays', path: '/info/emergency-stays' },
            ]
        }
    ];

    return (
        <footer className="bg-gray-50 border-t border-gray-200 pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Footer Links */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    {footerSections.map((section) => (
                        <div key={section.title}>
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
                                {section.title}
                            </h3>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            to={link.path}
                                            className="text-gray-600 hover:text-gray-900 hover:underline transition-all text-sm"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-600">
                        <span>© {new Date().getFullYear()} WonderLust, Inc.</span>
                        <span className="hidden md:inline">·</span>
                        <Link to="/info/privacy" className="hover:underline">Privacy</Link>
                        <span>·</span>
                        <Link to="/info/terms" className="hover:underline">Terms</Link>
                        <span>·</span>
                        <Link to="/info/sitemap" className="hover:underline">Sitemap</Link>
                        <span>·</span>
                        <Link to="/info/company-details" className="hover:underline">Company details</Link>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-800 hover:underline cursor-pointer">
                            <FaGlobe />
                            <span>English (IN)</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm font-bold text-gray-800 hover:underline cursor-pointer">
                            <FaRupeeSign />
                            <span>INR</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <a href="#" className="text-gray-900 hover:text-primary transition-colors">
                                <FaFacebook size={18} />
                            </a>
                            <a href="#" className="text-gray-900 hover:text-primary transition-colors">
                                <FaTwitter size={18} />
                            </a>
                            <a href="#" className="text-gray-900 hover:text-primary transition-colors">
                                <FaInstagram size={18} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

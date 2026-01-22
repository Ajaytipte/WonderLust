import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaArrowLeft, FaInfoCircle, FaShieldAlt, FaHandshake, FaUserShield, FaGlobe, FaQuestionCircle } from 'react-icons/fa';

const InfoPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();

    // Map of slug to content
    const contentMap = {
        'help-centre': {
            title: 'Help Centre',
            icon: <FaQuestionCircle className="text-primary" />,
            description: 'Get help with your bookings, account, and more. Our support team is here for you 24/7.',
            details: 'Whether you are a guest looking for a place to stay or a host inviting others into your space, we have the resources to help you succeed. Browse through our frequently asked questions or contact us directly.'
        },
        'safety': {
            title: 'Safety Information',
            icon: <FaShieldAlt className="text-primary" />,
            description: 'Your safety is our priority. Learn about our community standards and safety features.',
            details: 'We implement rigorous identity verification, secure payment systems, and 24/7 emergency support to ensure every stay is safe and comfortable.'
        },
        'aircover': {
            title: 'AirCover for Guests',
            icon: <FaUserShield className="text-primary" />,
            description: 'The most comprehensive protection in travel. Every booking includes AirCover.',
            details: 'Get protection against host cancellations, listing inaccuracies, and other big issues like being unable to check in. If something goes wrong, we will find you a similar or better home, or refund you.'
        },
        'privacy': {
            title: 'Privacy Policy',
            icon: <FaShieldAlt className="text-primary" />,
            description: 'How we handle your data and protect your privacy.',
            details: 'We are committed to protecting your personal information. This policy explains what data we collect, why we collect it, and how we keep it secure.'
        },
        'terms': {
            title: 'Terms of Service',
            icon: <FaHandshake className="text-primary" />,
            description: 'Our agreement with you. Please read these terms carefully.',
            details: 'By using WonderLust, you agree to comply with and be bound by these terms. This agreement covers your use of our platform, bookings, and payments.'
        },
        'newsroom': {
            title: 'WonderLust Newsroom',
            icon: <FaGlobe className="text-primary" />,
            description: 'The latest news, announcements, and stories from our community.',
            details: 'Stay updated with the latest trends in travel, new feature announcements, and inspiring stories from hosts and guests around the world.'
        }
    };

    const content = contentMap[slug] || {
        title: slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        icon: <FaInfoCircle className="text-primary" />,
        description: `Everything you need to know about ${slug.replace(/-/g, ' ')}.`,
        details: 'This page is currently being updated with the latest information. Please check back soon for more details about WonderLust services and policies.'
    };

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />

            <main className="flex-grow max-w-4xl mx-auto px-4 py-16 w-full">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-primary mb-8 transition-colors font-semibold"
                >
                    <FaArrowLeft /> Back
                </button>

                <div className="bg-gray-50 rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm">
                    <div className="text-5xl mb-6">
                        {content.icon}
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 mb-6">
                        {content.title}
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 leading-relaxed font-medium">
                        {content.description}
                    </p>
                    <div className="prose prose-lg text-gray-700 leading-relaxed">
                        {content.details}
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-200">
                        <h3 className="text-lg font-bold mb-4">Need more help?</h3>
                        <div className="flex flex-wrap gap-4">
                            <button className="btn-primary">Contact Support</button>
                            <button className="btn-secondary">Visit Community Forum</button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default InfoPage;

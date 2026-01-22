import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from '../services/api';
import Navbar from '../components/Navbar';
import PropertyCard from '../components/PropertyCard';
import Footer from '../components/Footer';

const HomePage = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchParams] = useSearchParams();

    const categories = [
        'All',
        'Apartment',
        'House',
        'Villa',
        'Cabin',
        'Hotel'
    ];

    useEffect(() => {
        fetchProperties();
    }, [searchParams, selectedCategory]);

    const fetchProperties = async () => {
        try {
            setLoading(true);
            const searchQuery = searchParams.get('search') || '';
            const categoryFilter = selectedCategory !== 'All' ? selectedCategory.toLowerCase() : '';

            let url = '/properties';
            const params = new URLSearchParams();

            if (searchQuery) params.append('search', searchQuery);
            if (categoryFilter) params.append('type', categoryFilter);

            if (params.toString()) url += `?${params.toString()}`;

            console.log('🔍 Fetching from URL:', url);
            const response = await axios.get(url);
            console.log('📦 API Response:', response.data);
            console.log('🏡 Properties extracted:', response.data.data?.properties);

            const fetchedProperties = response.data.data?.properties || response.data || [];
            console.log('✅ Setting properties:', fetchedProperties.length, 'items');
            setProperties(fetchedProperties);
        } catch (error) {
            console.error('❌ Failed to fetch properties:', error);
            console.error('Error details:', error.response?.data || error.message);
            setProperties([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <main className="flex-grow max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-6 px-4 py-8">
                {/* Categories Bar - Sticky on scroll */}
                <div className="sticky top-[80px] z-40 bg-gray-50 pb-4 mb-8 border-b border-gray-200 -mx-4 px-4 md:mx-0 md:px-0">
                    <div className="flex items-center md:justify-center gap-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`font-medium pb-3 px-1 whitespace-nowrap transition-all border-b-2 flex-shrink-0 ${selectedCategory === cat
                                    ? 'text-gray-900 border-primary'
                                    : 'text-gray-500 border-transparent hover:text-gray-800 hover:border-gray-300'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search Results Header */}
                {searchParams.get('search') && (
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Search results for "{searchParams.get('search')}"
                        </h2>
                        <p className="text-gray-500 mt-1">
                            {properties.length} {properties.length === 1 ? 'property' : 'properties'} found
                        </p>
                    </div>
                )}

                {/* Loading State */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                            <div key={n} className="animate-pulse">
                                <div className="aspect-square bg-gray-300 rounded-xl mb-3"></div>
                                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                                <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Properties Grid */}
                        {properties.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {properties.map((property) => (
                                    <PropertyCard
                                        key={property._id}
                                        property={property}
                                        onWishlistUpdate={fetchProperties}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <div className="text-gray-400 mb-4">
                                    <svg className="mx-auto h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">No Properties Found</h3>
                                <p className="text-gray-500 mb-6">
                                    {searchParams.get('search')
                                        ? 'Try adjusting your search or filters'
                                        : 'No properties available at the moment'}
                                </p>
                            </div>
                        )}
                    </>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default HomePage;

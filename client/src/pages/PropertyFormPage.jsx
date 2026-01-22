import { useEffect, useState } from 'react';
import axios from '../services/api';
import Navbar from '../components/Navbar';
import AccountNav from '../components/AccountNav';
import { Navigate, useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCloudUploadAlt, FaTrash, FaWifi, FaTv, FaCar, FaSwimmingPool, FaDoorOpen, FaMusic } from 'react-icons/fa';
import toast from 'react-hot-toast';

const PropertyFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [addedPhotos, setAddedPhotos] = useState([]); // Existing photo URLs
    const [newPhotoFiles, setNewPhotoFiles] = useState([]); // Selected files
    const [previews, setPreviews] = useState([]); // Previews for both
    const [description, setDescription] = useState('');
    const [amenities, setAmenities] = useState([]);
    const [maxGuests, setMaxGuests] = useState(1);
    const [price, setPrice] = useState(100);
    const [type, setType] = useState('apartment');
    const [redirect, setRedirect] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!id) return;
        axios.get('/properties/' + id).then(response => {
            const { property: prop } = response.data.data;
            setTitle(prop.title);
            setAddress(prop.location?.address || '');
            setCity(prop.location?.city || '');
            setCountry(prop.location?.country || '');
            setAddedPhotos(prop.photos || []);
            setDescription(prop.description);
            setAmenities(prop.amenities || []);
            setMaxGuests(prop.maxGuests);
            setPrice(prop.pricePerNight);
            setType(prop.type);
        }).catch(err => {
            toast.error('Failed to load property details');
        });
    }, [id]);

    const handlePhotoChange = (ev) => {
        const files = Array.from(ev.target.files);
        setNewPhotoFiles(prev => [...prev, ...files]);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(prev => [...prev, ...newPreviews]);
    };

    const removePhoto = (index, isNew) => {
        if (isNew) {
            setNewPhotoFiles(prev => prev.filter((_, i) => i !== index));
            setPreviews(prev => prev.filter((_, i) => i !== index));
        } else {
            setAddedPhotos(prev => prev.filter((_, i) => i !== index));
        }
    };

    const saveProperty = async (ev) => {
        ev.preventDefault();
        setIsSaving(true);

        const propertyData = new FormData();
        propertyData.append('title', title);
        propertyData.append('location[address]', address);
        propertyData.append('location[city]', city);
        propertyData.append('location[country]', country);
        propertyData.append('description', description);
        propertyData.append('pricePerNight', price);
        propertyData.append('maxGuests', maxGuests);
        propertyData.append('type', type);

        // Keep existing photos that weren't removed
        addedPhotos.forEach(photo => {
            propertyData.append('existingPhotos', photo);
        });

        // Add new photo files
        newPhotoFiles.forEach(file => {
            propertyData.append('photos', file);
        });

        // Amenities
        amenities.forEach((amenity, index) => {
            propertyData.append(`amenities[${index}]`, amenity);
        });

        try {
            if (id) {
                await axios.patch('/properties/' + id, propertyData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Property updated successfully!');
            } else {
                await axios.post('/properties', propertyData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Property created successfully!');
            }
            setRedirect(true);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error saving property');
        } finally {
            setIsSaving(false);
        }
    };

    if (redirect) {
        return <Navigate to={'/host/dashboard'} />
    }

    const handleAmenityClick = (name) => {
        setAmenities(prev =>
            prev.includes(name) ? prev.filter(am => am !== name) : [...prev, name]
        );
    };

    const amenityList = [
        { name: 'Wifi', icon: <FaWifi /> },
        { name: 'TV', icon: <FaTv /> },
        { name: 'Parking', icon: <FaCar /> },
        { name: 'Pool', icon: <FaSwimmingPool /> },
        { name: 'Entrance', icon: <FaDoorOpen /> },
        { name: 'Radio', icon: <FaMusic /> }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <AccountNav />
            <div className="max-w-5xl mx-auto px-4 py-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-primary mb-8 transition-colors font-semibold px-2"
                >
                    <FaArrowLeft /> Back to Dashboard
                </button>

                <form onSubmit={saveProperty} className="space-y-8">
                    {/* Basic Info Section */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Basic Information</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Property Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={ev => setTitle(ev.target.value)}
                                    placeholder="e.g. Modern Beachfront Villa"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-lg"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                <textarea
                                    value={description}
                                    onChange={ev => setDescription(ev.target.value)}
                                    placeholder="Describe your beautiful place..."
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all h-40"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Property Type</label>
                                    <select
                                        value={type}
                                        onChange={ev => setType(ev.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    >
                                        <option value="apartment">Apartment</option>
                                        <option value="house">House</option>
                                        <option value="villa">Villa</option>
                                        <option value="cabin">Cabin</option>
                                        <option value="hotel">Hotel</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Location Section */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Location Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Street Address</label>
                                <input
                                    type="text"
                                    value={address}
                                    onChange={ev => setAddress(ev.target.value)}
                                    placeholder="123 Ocean Drive"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                                <input
                                    type="text"
                                    value={city}
                                    onChange={ev => setCity(ev.target.value)}
                                    placeholder="Mumbai"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                                <input
                                    type="text"
                                    value={country}
                                    onChange={ev => setCountry(ev.target.value)}
                                    placeholder="India"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Photos Section */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Photos</h2>
                        <p className="text-gray-500 mb-6">Showcase your property with beautiful images</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
                            {/* Existing Photos */}
                            {addedPhotos.map((link, idx) => (
                                <div key={link} className="relative aspect-square rounded-xl overflow-hidden group">
                                    <img className="w-full h-full object-cover" src={link} alt="" />
                                    <button
                                        type="button"
                                        onClick={() => removePhoto(idx, false)}
                                        className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                    >
                                        <FaTrash size={14} />
                                    </button>
                                </div>
                            ))}

                            {/* New Previews */}
                            {previews.map((preview, idx) => (
                                <div key={preview} className="relative aspect-square rounded-xl overflow-hidden group border-2 border-primary/20">
                                    <img className="w-full h-full object-cover" src={preview} alt="" />
                                    <button
                                        type="button"
                                        onClick={() => removePhoto(idx, true)}
                                        className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                    >
                                        <FaTrash size={14} />
                                    </button>
                                    <div className="absolute bottom-0 left-0 right-0 bg-primary/80 text-white text-[10px] py-0.5 text-center font-bold">NEW</div>
                                </div>
                            ))}

                            {/* Upload Button */}
                            <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary hover:bg-orange-50 transition-all text-gray-500">
                                <FaCloudUploadAlt size={32} />
                                <span className="text-xs mt-2 font-semibold">Upload Photos</span>
                                <input type="file" multiple className="hidden" onChange={handlePhotoChange} />
                            </label>
                        </div>
                    </div>

                    {/* Amenities Section */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Amenities</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {amenityList.map(item => (
                                <button
                                    key={item.name}
                                    type="button"
                                    onClick={() => handleAmenityClick(item.name)}
                                    className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${amenities.includes(item.name)
                                            ? 'border-primary bg-orange-50 text-primary shadow-inner'
                                            : 'border-gray-100 hover:border-gray-300 text-gray-600'
                                        }`}
                                >
                                    <span className="text-2xl">{item.icon}</span>
                                    <span className="text-sm font-semibold">{item.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Pricing & Capacity Section */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Pricing & Capacity</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 text-lg">Price Per Night (₹)</label>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={ev => setPrice(ev.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-xl font-bold"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 text-lg">Maximum Guests</label>
                                <input
                                    type="number"
                                    value={maxGuests}
                                    onChange={ev => setMaxGuests(ev.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-xl font-bold"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full py-4 bg-primary text-white rounded-2xl text-xl font-bold shadow-lg hover:bg-primary-dark transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70"
                    >
                        {isSaving ? 'Saving Changes...' : (id ? 'Update Property' : 'Publish Property')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PropertyFormPage;

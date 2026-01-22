import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Child component to update map view when coordinates change
function ChangeView({ center }) {
    const map = useMap();
    map.setView(center, map.getZoom());
    return null;
}

const PropertyMap = ({ location }) => {
    const [coords, setCoords] = useState(null); // [lat, lng]
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!location) return;

        // If coordinates already exist in location object
        if (location.coordinates?.lat && location.coordinates?.lng) {
            setCoords([location.coordinates.lat, location.coordinates.lng]);
            setLoading(false);
            return;
        }

        // Otherwise, geocode using Nominatim
        const address = `${location.city}, ${location.country}`;
        const geocode = async () => {
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
                );
                const data = await response.json();
                if (data && data.length > 0) {
                    setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
                } else {
                    setError('Could not find location on map');
                }
            } catch (err) {
                console.error('Geocoding error:', err);
                setError('Error loading map');
            } finally {
                setLoading(false);
            }
        };

        geocode();
    }, [location]);

    if (loading) {
        return (
            <div className="h-96 w-full bg-gray-100 rounded-2xl flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !coords) {
        return (
            <div className="h-96 w-full bg-gray-100 rounded-2xl flex items-center justify-center text-gray-500">
                <p>{error || 'Location coordinates not available'}</p>
            </div>
        );
    }

    return (
        <div className="rounded-2xl overflow-hidden h-96 w-full shadow-sm border border-gray-200 z-0">
            <MapContainer
                center={coords}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={coords}>
                    <Popup>
                        {location.city}, {location.country}
                    </Popup>
                </Marker>
                <ChangeView center={coords} />
            </MapContainer>
        </div>
    );
};

export default PropertyMap;

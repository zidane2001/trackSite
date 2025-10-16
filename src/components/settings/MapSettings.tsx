import React, { useEffect, useState } from 'react';
import { MapIcon } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
// Fix for default marker icon in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});
interface LocationMarker {
  position: [number, number];
}
const LocationMarkerComponent: React.FC<LocationMarker & {
  onLocationChange: (lat: number, lng: number) => void;
}> = ({
  position,
  onLocationChange
}) => {
    const [markerPosition, setMarkerPosition] = useState<[number, number]>(position);
    useMapEvents({
      click(e: any) {
        const { lat, lng } = e.latlng as { lat: number; lng: number };
        setMarkerPosition([lat, lng]);
        onLocationChange(lat, lng);
      }
    });
    return <Marker position={markerPosition} />;
  };
export const MapSettings: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [defaultLatitude, setDefaultLatitude] = useState(48.8566);
  const [defaultLongitude, setDefaultLongitude] = useState(2.3522);
  const [countryRestrictions, setCountryRestrictions] = useState('FR,BE,CH,ES,IT,DE');
  const [isSaving, setIsSaving] = useState(false);
  const [useGooglePreview, setUseGooglePreview] = useState(false);
  const [geocodeQuery, setGeocodeQuery] = useState('');
  const [geocodeResult, setGeocodeResult] = useState<string>('');
  const handleLocationChange = (lat: number, lng: number) => {
    setDefaultLatitude(lat);
    setDefaultLongitude(lng);
  };
  const handleSaveSettings = () => {
    setIsSaving(true);
    try {
      const payload = { apiKey, defaultLatitude, defaultLongitude, countryRestrictions };
      localStorage.setItem('cs_admin_map_settings', JSON.stringify(payload));
    } finally {
      setTimeout(() => {
        setIsSaving(false);
        alert('Map settings saved successfully!');
      }, 500);
    }
  };
  useEffect(() => {
    try {
      const raw = localStorage.getItem('cs_admin_map_settings');
      if (raw) {
        const parsed = JSON.parse(raw);
        setApiKey(parsed.apiKey || '');
        setDefaultLatitude(typeof parsed.defaultLatitude === 'number' ? parsed.defaultLatitude : 48.8566);
        setDefaultLongitude(typeof parsed.defaultLongitude === 'number' ? parsed.defaultLongitude : 2.3522);
        setCountryRestrictions(parsed.countryRestrictions || 'FR,BE,CH,ES,IT,DE');
        setUseGooglePreview(!!parsed.useGooglePreview);
      }
    } catch { }
  }, []);
  useEffect(() => {
    try {
      const raw = localStorage.getItem('cs_admin_map_settings');
      const parsed = raw ? JSON.parse(raw) : {};
      localStorage.setItem('cs_admin_map_settings', JSON.stringify({
        ...parsed,
        useGooglePreview
      }));
    } catch { }
  }, [useGooglePreview]);
  const handleGeocode = async () => {
    setGeocodeResult('');
    try {
      if (!apiKey || !geocodeQuery) return;
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(geocodeQuery)}&key=${apiKey}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.results && data.results[0]) {
        const loc = data.results[0].geometry.location;
        setGeocodeResult(`${loc.lat}, ${loc.lng}`);
        setDefaultLatitude(loc.lat);
        setDefaultLongitude(loc.lng);
      } else {
        setGeocodeResult('No results');
      }
    } catch {
      setGeocodeResult('Error fetching geocode');
    }
  };
  return <div>
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Map Settings</h1>
      <p className="text-gray-600">
        Configure map settings for shipment tracking and location services
      </p>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <MapIcon className="mr-2" size={20} />
            Google Maps Configuration
          </h2>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Google Maps API Key
            </label>
            <input type="text" className="w-full p-2 border rounded-lg" placeholder="Enter your Google Maps API Key" value={apiKey} onChange={e => setApiKey(e.target.value)} />
            <p className="text-xs text-gray-500 mt-1">
              Required for map display, autocomplete, and geocoding
              functionality
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Default Latitude
              </label>
              <input type="number" step="0.0001" className="w-full p-2 border rounded-lg" value={defaultLatitude} onChange={e => setDefaultLatitude(parseFloat(e.target.value))} />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Default Longitude
              </label>
              <input type="number" step="0.0001" className="w-full p-2 border rounded-lg" value={defaultLongitude} onChange={e => setDefaultLongitude(parseFloat(e.target.value))} />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Country Restrictions (ISO Codes)
            </label>
            <input type="text" className="w-full p-2 border rounded-lg" placeholder="e.g. FR,BE,CH,ES,IT,DE" value={countryRestrictions} onChange={e => setCountryRestrictions(e.target.value)} />
            <p className="text-xs text-gray-500 mt-1">
              Comma-separated ISO country codes to restrict autocomplete
              results
            </p>
          </div>
          <button className={`w-full py-2 rounded-lg flex justify-center items-center ${isSaving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white`} onClick={handleSaveSettings} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Map Preview
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Click on the map to set the default center position
          </p>
          <div className="mb-4 flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" className="w-4 h-4" checked={useGooglePreview} onChange={e => setUseGooglePreview(e.target.checked)} />
              Use Google Map Preview (requires API key)
            </label>
          </div>
          <div className="h-[400px] rounded-lg overflow-hidden border">
            {!useGooglePreview && <MapContainer center={[defaultLatitude, defaultLongitude]} zoom={5} style={{
              height: '100%',
              width: '100%'
            }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
              <LocationMarkerComponent position={[defaultLatitude, defaultLongitude]} onLocationChange={handleLocationChange} />
            </MapContainer>}
            {useGooglePreview && apiKey && <iframe title="google-preview" className="w-full h-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${defaultLatitude},${defaultLongitude}&zoom=5`}></iframe>}
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>
              Current center position: {defaultLatitude.toFixed(6)},{' '}
              {defaultLongitude.toFixed(6)}
            </p>
            <p className="mt-2">
              <strong>Note:</strong> This map uses Leaflet for preview
              purposes. Your production site will use Google Maps with the API
              key configured above.
            </p>
            <div className="mt-4">
              <div className="flex gap-2 items-center">
                <input type="text" className="flex-1 p-2 border rounded-lg" placeholder="Geocode an address (requires API key)" value={geocodeQuery} onChange={e => setGeocodeQuery(e.target.value)} />
                <button className="px-3 py-2 bg-amber-600 text-white rounded-lg" onClick={handleGeocode}>Geocode</button>
              </div>
              {geocodeResult && <div className="text-xs text-gray-700 mt-2">{geocodeResult}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>;
};
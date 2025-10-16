import React, { useEffect, useState } from 'react';
import { PlusIcon, SearchIcon, TrashIcon, PencilIcon } from 'lucide-react';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../../utils/storage';
import { toCsv, parseCsv, downloadCsv } from '../../utils/csv';
import { locationsApi, Location } from '../../utils/api';
export const LocationsManagement: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [newLocation, setNewLocation] = useState<Omit<Location, 'id'>>({
    name: '',
    slug: '',
    country: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      const data = await locationsApi.getAll();
      setLocations(data);
    } catch (error) {
      console.error('Failed to load locations:', error);
      // Fallback to localStorage if API fails
      const fallback = loadFromStorage<Location[]>(STORAGE_KEYS.locations, []);
      setLocations(fallback);
    } finally {
      setLoading(false);
    }
  };
  const filteredLocations = locations.filter(location => location.name.toLowerCase().includes(searchTerm.toLowerCase()) || location.country.toLowerCase().includes(searchTerm.toLowerCase()));
  const handleAddLocation = async () => {
    if (newLocation.name && newLocation.country) {
      try {
        const slug = newLocation.slug || newLocation.name.toLowerCase().replace(/\s+/g, '-');
        const created = await locationsApi.create({
          ...newLocation,
          slug
        });
        setLocations([...locations, created]);
        setNewLocation({
          name: '',
          slug: '',
          country: ''
        });
        setIsAddModalOpen(false);
      } catch (error) {
        console.error('Failed to create location:', error);
        // Fallback to local storage
        const slug = newLocation.slug || newLocation.name.toLowerCase().replace(/\s+/g, '-');
        const newLocationWithId = {
          ...newLocation,
          id: Date.now(),
          slug
        };
        setLocations([...locations, newLocationWithId as Location]);
        saveToStorage(STORAGE_KEYS.locations, [...locations, newLocationWithId as Location]);
      }
    }
  };

  const handleDeleteLocation = async (id: number) => {
    try {
      await locationsApi.delete(id);
      setLocations(locations.filter(location => location.id !== id));
    } catch (error) {
      console.error('Failed to delete location:', error);
      // Fallback to local storage
      const updated = locations.filter(location => location.id !== id);
      setLocations(updated);
      saveToStorage(STORAGE_KEYS.locations, updated);
    }
  };

  const handleEditLocation = async () => {
    if (editingLocation && editingLocation.name && editingLocation.country) {
      try {
        await locationsApi.update(editingLocation.id, {
          name: editingLocation.name,
          slug: editingLocation.slug,
          country: editingLocation.country
        });
        setLocations(locations.map(location => location.id === editingLocation.id ? editingLocation : location));
        setIsEditModalOpen(false);
        setEditingLocation(null);
      } catch (error) {
        console.error('Failed to update location:', error);
        // Fallback to local storage
        const updated = locations.map(location => location.id === editingLocation.id ? editingLocation : location);
        setLocations(updated);
        saveToStorage(STORAGE_KEYS.locations, updated);
      }
    }
  };

  const openEditModal = (location: Location) => {
    setEditingLocation(location);
    setIsEditModalOpen(true);
  };

  const handleExportCsv = () => {
    const csv = toCsv(locations.map(l => ({ id: l.id, name: l.name, slug: l.slug, country: l.country })), ['id', 'name', 'slug', 'country']);
    downloadCsv('locations.csv', csv);
  };
  const handleImportCsv = async (file: File) => {
    const text = await file.text();
    const rows = parseCsv(text);
    const imported: Location[] = rows.map((r, idx) => ({
      id: parseInt(String(r.id ?? `0`)) || Date.now() + idx,
      name: String(r.name ?? ''),
      slug: String(r.slug ?? String(r.name ?? '').toLowerCase().replace(/\s+/g, '-')),
      country: String(r.country ?? '')
    })).filter(r => r.name && r.country);

    try {
      // Try to create via API
      const createdLocations = [];
      for (const loc of imported) {
        const created = await locationsApi.create({
          name: loc.name,
          slug: loc.slug,
          country: loc.country
        });
        createdLocations.push(created);
      }
      setLocations([...locations, ...createdLocations]);
    } catch (error) {
      console.error('Failed to import via API, using local storage:', error);
      // Fallback to local storage
      setLocations(imported);
      saveToStorage(STORAGE_KEYS.locations, imported);
    }
  };
  return <div>
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Locations Management
        </h1>
        <p className="text-gray-600">
          Manage shipping locations for your rates
        </p>
        {loading && <p className="text-sm text-blue-600 mt-1">Loading...</p>}
      </div>
      <div className="flex gap-2">
        <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg" onClick={handleExportCsv}>
          Export CSV
        </button>
        <label className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg cursor-pointer">
          Import CSV
          <input type="file" accept=".csv,text/csv" className="hidden" onChange={e => {
            const f = e.target.files?.[0];
            if (f) handleImportCsv(f);
            e.currentTarget.value = '';
          }} />
        </label>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center" onClick={() => setIsAddModalOpen(true)}>
          <PlusIcon size={18} className="mr-2" />
          Add Location
        </button>
      </div>
    </div>
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b">
        <div className="relative">
          <input type="text" placeholder="Search locations..." className="w-full pl-10 pr-4 py-2 border rounded-lg" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          <SearchIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left bg-gray-50">
              <th className="px-6 py-3 border-b font-medium">Name</th>
              <th className="px-6 py-3 border-b font-medium">Slug</th>
              <th className="px-6 py-3 border-b font-medium">Country</th>
              <th className="px-6 py-3 border-b font-medium text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredLocations.map(location => <tr key={location.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 border-b">{location.name}</td>
              <td className="px-6 py-4 border-b">{location.slug}</td>
              <td className="px-6 py-4 border-b">{location.country}</td>
              <td className="px-6 py-4 border-b text-right">
                <button className="text-blue-600 hover:text-blue-800 p-1" title="Edit" onClick={() => openEditModal(location)}>
                  <PencilIcon size={16} />
                </button>
                <button className="text-red-600 hover:text-red-800 p-1 ml-2" title="Delete" onClick={() => handleDeleteLocation(location.id)}>
                  <TrashIcon size={16} />
                </button>
              </td>
            </tr>)}
            {filteredLocations.length === 0 && <tr>
              <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                No locations found
              </td>
            </tr>}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing {filteredLocations.length} of {locations.length} locations
        </div>
        <div className="flex">
          <button className="px-3 py-1 border rounded mr-2 text-gray-600 hover:bg-gray-100">
            Previous
          </button>
          <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-100">
            Next
          </button>
        </div>
      </div>
    </div>
    {isAddModalOpen && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Add New Location</h2>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Location Name
            </label>
            <input type="text" className="w-full p-2 border rounded-lg" placeholder="e.g. Paris" value={newLocation.name} onChange={e => setNewLocation({
              ...newLocation,
              name: e.target.value
            })} />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Slug (Optional)
            </label>
            <input type="text" className="w-full p-2 border rounded-lg" placeholder="e.g. paris" value={newLocation.slug} onChange={e => setNewLocation({
              ...newLocation,
              slug: e.target.value
            })} />
            <p className="text-xs text-gray-500 mt-1">
              Leave empty to generate automatically from name
            </p>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Country
            </label>
            <input type="text" className="w-full p-2 border rounded-lg" placeholder="e.g. France" value={newLocation.country} onChange={e => setNewLocation({
              ...newLocation,
              country: e.target.value
            })} />
          </div>
          <div className="flex justify-end space-x-3">
            <button className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={handleAddLocation}>
              Add Location
            </button>
          </div>
        </div>
      </div>
    </div>}
    {isEditModalOpen && editingLocation && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Edit Location</h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Location Name
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-lg"
                value={editingLocation.name}
                onChange={(e) => setEditingLocation({ ...editingLocation, name: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Slug
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-lg"
                value={editingLocation.slug}
                onChange={(e) => setEditingLocation({ ...editingLocation, slug: e.target.value })}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Country
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-lg"
                value={editingLocation.country}
                onChange={(e) => setEditingLocation({ ...editingLocation, country: e.target.value })}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingLocation(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={handleEditLocation}
              >
                Update Location
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>;
};
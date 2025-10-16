import React, { useEffect, useState } from 'react';
import { PlusIcon, SearchIcon, TrashIcon, PencilIcon, MapPinIcon } from 'lucide-react';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../../utils/storage';
interface Zone {
  id: string;
  name: string;
  slug: string;
  locations: string[];
  description: string;
}
export const ZonesManagement: React.FC = () => {
  const defaultZones: Zone[] = [{
    id: '1',
    name: 'France North',
    slug: 'france-north',
    locations: ['Paris', 'Lille', 'Strasbourg'],
    description: 'Northern regions of France'
  }, {
    id: '2',
    name: 'France South',
    slug: 'france-south',
    locations: ['Marseille', 'Nice', 'Toulouse', 'Montpellier'],
    description: 'Southern regions of France'
  }, {
    id: '3',
    name: 'France West',
    slug: 'france-west',
    locations: ['Nantes', 'Bordeaux', 'Rennes'],
    description: 'Western regions of France'
  }, {
    id: '4',
    name: 'France Central',
    slug: 'france-central',
    locations: ['Lyon', 'Clermont-Ferrand'],
    description: 'Central regions of France'
  }];
  const [zones, setZones] = useState<Zone[]>(() => loadFromStorage<Zone[]>(STORAGE_KEYS.zones, defaultZones));
  const [searchTerm, setSearchTerm] = useState('');
  const filteredZones = zones.filter(zone => zone.name.toLowerCase().includes(searchTerm.toLowerCase()) || zone.description.toLowerCase().includes(searchTerm.toLowerCase()) || zone.locations.some(location => location.toLowerCase().includes(searchTerm.toLowerCase())));
  const handleDeleteZone = (id: string) => {
    setZones(zones.filter(zone => zone.id !== id));
  };
  useEffect(() => {
    saveToStorage<Zone[]>(STORAGE_KEYS.zones, zones);
  }, [zones]);
  return <div>
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Zones Management
        </h1>
        <p className="text-gray-600">Manage shipping zones for your rates</p>
      </div>
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
        <PlusIcon size={18} className="mr-2" />
        Add Zone
      </button>
    </div>
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b">
        <div className="relative">
          <input type="text" placeholder="Search zones..." className="w-full pl-10 pr-4 py-2 border rounded-lg" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          <SearchIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left bg-gray-50">
              <th className="px-6 py-3 border-b font-medium">Name</th>
              <th className="px-6 py-3 border-b font-medium">Slug</th>
              <th className="px-6 py-3 border-b font-medium">Locations</th>
              <th className="px-6 py-3 border-b font-medium">Description</th>
              <th className="px-6 py-3 border-b font-medium text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredZones.map(zone => <tr key={zone.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 border-b font-medium">
                {zone.name}
              </td>
              <td className="px-6 py-4 border-b">{zone.slug}</td>
              <td className="px-6 py-4 border-b">
                <div className="flex flex-wrap gap-1">
                  {zone.locations.map((location, index) => <span key={index} className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                    <MapPinIcon size={10} className="mr-1" />
                    {location}
                  </span>)}
                </div>
              </td>
              <td className="px-6 py-4 border-b">{zone.description}</td>
              <td className="px-6 py-4 border-b text-right">
                <button className="text-blue-600 hover:text-blue-800 p-1" title="Edit">
                  <PencilIcon size={16} />
                </button>
                <button className="text-red-600 hover:text-red-800 p-1 ml-2" title="Delete" onClick={() => handleDeleteZone(zone.id)}>
                  <TrashIcon size={16} />
                </button>
              </td>
            </tr>)}
            {filteredZones.length === 0 && <tr>
              <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                No zones found
              </td>
            </tr>}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing {filteredZones.length} of {zones.length} zones
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
  </div>;
};
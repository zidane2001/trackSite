import React, { useEffect, useState } from 'react';
import { PlusIcon, SearchIcon, TrashIcon, PencilIcon } from 'lucide-react';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../../utils/storage';
import { toCsv, parseCsv, downloadCsv } from '../../utils/csv';
interface PickupRate {
  id: string;
  zone: string;
  minWeight: number;
  maxWeight: number;
  rate: number;
  description: string;
}
export const PickupRatesManagement: React.FC = () => {
  const defaultPickupRates: PickupRate[] = [{
    id: '1',
    zone: 'France North',
    minWeight: 0,
    maxWeight: 5,
    rate: 8.5,
    description: 'Standard pickup for small packages in Northern France'
  }, {
    id: '2',
    zone: 'France South',
    minWeight: 0,
    maxWeight: 5,
    rate: 9.5,
    description: 'Standard pickup for small packages in Southern France'
  }, {
    id: '3',
    zone: 'France North',
    minWeight: 5,
    maxWeight: 20,
    rate: 15.75,
    description: 'Medium package pickup in Northern France'
  }, {
    id: '4',
    zone: 'France South',
    minWeight: 5,
    maxWeight: 20,
    rate: 17.25,
    description: 'Medium package pickup in Southern France'
  }, {
    id: '5',
    zone: 'France West',
    minWeight: 0,
    maxWeight: 10,
    rate: 12.0,
    description: 'Standard pickup in Western France'
  }];
  const [pickupRates, setPickupRates] = useState<PickupRate[]>(() => loadFromStorage<PickupRate[]>(STORAGE_KEYS.pickupRates, defaultPickupRates));
  const [searchTerm, setSearchTerm] = useState('');
  const filteredRates = pickupRates.filter(rate => rate.zone.toLowerCase().includes(searchTerm.toLowerCase()) || rate.description.toLowerCase().includes(searchTerm.toLowerCase()));
  const handleDeleteRate = (id: string) => {
    setPickupRates(pickupRates.filter(rate => rate.id !== id));
  };
  const handleExportCsv = () => {
    const csv = toCsv(pickupRates.map(r => ({ id: r.id, zone: r.zone, minWeight: r.minWeight, maxWeight: r.maxWeight, rate: r.rate, description: r.description })), ['id', 'zone', 'minWeight', 'maxWeight', 'rate', 'description']);
    downloadCsv('pickup_rates.csv', csv);
  };
  const handleImportCsv = async (file: File) => {
    const text = await file.text();
    const rows = parseCsv(text);
    const imported: PickupRate[] = rows.map((r, idx) => ({
      id: String(r.id ?? `imp-${Date.now()}-${idx}`),
      zone: String(r.zone ?? ''),
      minWeight: parseFloat(String(r.minWeight ?? '0')) || 0,
      maxWeight: parseFloat(String(r.maxWeight ?? '0')) || 0,
      rate: parseFloat(String(r.rate ?? '0')) || 0,
      description: String(r.description ?? '')
    })).filter(r => r.zone);
    setPickupRates(imported);
  };
  useEffect(() => {
    saveToStorage<PickupRate[]>(STORAGE_KEYS.pickupRates, pickupRates);
  }, [pickupRates]);
  return <div>
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Pickup Rates Management
        </h1>
        <p className="text-gray-600">
          Manage pickup rates for different zones
        </p>
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
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
          <PlusIcon size={18} className="mr-2" />
          Add Pickup Rate
        </button>
      </div>
    </div>
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b">
        <div className="relative">
          <input type="text" placeholder="Search pickup rates..." className="w-full pl-10 pr-4 py-2 border rounded-lg" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          <SearchIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left bg-gray-50">
              <th className="px-6 py-3 border-b font-medium">Zone</th>
              <th className="px-6 py-3 border-b font-medium">Weight Range</th>
              <th className="px-6 py-3 border-b font-medium">Rate</th>
              <th className="px-6 py-3 border-b font-medium">Description</th>
              <th className="px-6 py-3 border-b font-medium text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRates.map(rate => <tr key={rate.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 border-b">{rate.zone}</td>
              <td className="px-6 py-4 border-b">
                {rate.minWeight} kg - {rate.maxWeight} kg
              </td>
              <td className="px-6 py-4 border-b">
                €{rate.rate.toFixed(2)}
              </td>
              <td className="px-6 py-4 border-b">{rate.description}</td>
              <td className="px-6 py-4 border-b text-right">
                <button className="text-blue-600 hover:text-blue-800 p-1" title="Edit">
                  <PencilIcon size={16} />
                </button>
                <button className="text-red-600 hover:text-red-800 p-1 ml-2" title="Delete" onClick={() => handleDeleteRate(rate.id)}>
                  <TrashIcon size={16} />
                </button>
              </td>
            </tr>)}
            {filteredRates.length === 0 && <tr>
              <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                No pickup rates found
              </td>
            </tr>}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing {filteredRates.length} of {pickupRates.length} pickup rates
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
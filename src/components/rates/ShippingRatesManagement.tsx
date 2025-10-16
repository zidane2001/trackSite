import React, { useEffect, useState } from 'react';
import { PlusIcon, SearchIcon, TrashIcon, PencilIcon } from 'lucide-react';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../../utils/storage';
import { toCsv, parseCsv, downloadCsv } from '../../utils/csv';
import { calculateVolumetricWeightKg } from '../../utils/weight';
import { shippingRatesApi, ShippingRate } from '../../utils/api';
export const ShippingRatesManagement: React.FC = () => {
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRate, setEditingRate] = useState<ShippingRate | null>(null);
  const [newRate, setNewRate] = useState<Omit<ShippingRate, 'id'>>({
    name: '',
    type: 'flat',
    min_weight: 0,
    max_weight: 0,
    rate: 0,
    insurance: 0,
    description: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRates();
  }, []);

  const loadRates = async () => {
    try {
      const data = await shippingRatesApi.getAll();
      setRates(data);
    } catch (error) {
      console.error('Failed to load shipping rates:', error);
      // Fallback to localStorage
      const fallback = loadFromStorage<ShippingRate[]>(STORAGE_KEYS.shippingRates, []);
      setRates(fallback);
    } finally {
      setLoading(false);
    }
  };

  const filteredRates = rates.filter(rate => rate.name.toLowerCase().includes(searchTerm.toLowerCase()) || rate.description.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleAddRate = async () => {
    if (newRate.name && newRate.rate > 0) {
      try {
        const created = await shippingRatesApi.create(newRate);
        setRates([...rates, created]);
        setNewRate({
          name: '',
          type: 'flat',
          min_weight: 0,
          max_weight: 0,
          rate: 0,
          insurance: 0,
          description: ''
        });
        setIsAddModalOpen(false);
      } catch (error) {
        console.error('Failed to create shipping rate:', error);
        // Fallback to local storage
        const newRateWithId = {
          ...newRate,
          id: Date.now()
        };
        setRates([...rates, newRateWithId as ShippingRate]);
        saveToStorage(STORAGE_KEYS.shippingRates, [...rates, newRateWithId as ShippingRate]);
      }
    }
  };

  const handleDeleteRate = async (id: number) => {
    try {
      await shippingRatesApi.delete(id);
      setRates(rates.filter(rate => rate.id !== id));
    } catch (error) {
      console.error('Failed to delete shipping rate:', error);
      // Fallback to local storage
      const updated = rates.filter(rate => rate.id !== id);
      setRates(updated);
      saveToStorage(STORAGE_KEYS.shippingRates, updated);
    }
  };

  const handleEditRate = async () => {
    if (editingRate && editingRate.name && editingRate.rate > 0) {
      try {
        await shippingRatesApi.update(editingRate.id, {
          name: editingRate.name,
          type: editingRate.type,
          min_weight: editingRate.min_weight,
          max_weight: editingRate.max_weight,
          rate: editingRate.rate,
          insurance: editingRate.insurance,
          description: editingRate.description
        });
        setRates(rates.map(rate => rate.id === editingRate.id ? editingRate : rate));
        setIsEditModalOpen(false);
        setEditingRate(null);
      } catch (error) {
        console.error('Failed to update shipping rate:', error);
        // Fallback to local storage
        const updated = rates.map(rate => rate.id === editingRate.id ? editingRate : rate);
        setRates(updated);
        saveToStorage(STORAGE_KEYS.shippingRates, updated);
      }
    }
  };

  const openEditModal = (rate: ShippingRate) => {
    setEditingRate(rate);
    setIsEditModalOpen(true);
  };

  const handleExportCsv = () => {
    const csv = toCsv(rates.map(r => ({ id: r.id, name: r.name, type: r.type, minWeight: r.min_weight, maxWeight: r.max_weight, rate: r.rate, insurance: r.insurance, description: r.description })), ['id', 'name', 'type', 'minWeight', 'maxWeight', 'rate', 'insurance', 'description']);
    downloadCsv('shipping_rates.csv', csv);
  };

  const handleImportCsv = async (file: File) => {
    const text = await file.text();
    const rows = parseCsv(text);
    const imported: ShippingRate[] = rows.map((r, idx) => {
      const rateType: 'flat' | 'weight' = String(r.type ?? 'flat') === 'weight' ? 'weight' : 'flat';
      const item: ShippingRate = {
        id: parseInt(String(r.id ?? '0')) || Date.now() + idx,
        name: String(r.name ?? ''),
        type: rateType,
        min_weight: parseFloat(String(r.minWeight ?? '0')) || 0,
        max_weight: parseFloat(String(r.maxWeight ?? '0')) || 0,
        rate: parseFloat(String(r.rate ?? '0')) || 0,
        insurance: parseFloat(String(r.insurance ?? '0')) || 0,
        description: String(r.description ?? '')
      };
      return item;
    }).filter(r => r.name);

    try {
      // Try to create via API
      const createdRates = [];
      for (const rate of imported) {
        const created = await shippingRatesApi.create({
          name: rate.name,
          type: rate.type,
          min_weight: rate.min_weight,
          max_weight: rate.max_weight,
          rate: rate.rate,
          insurance: rate.insurance,
          description: rate.description
        });
        createdRates.push(created);
      }
      setRates([...rates, ...createdRates]);
    } catch (error) {
      console.error('Failed to import via API, using local storage:', error);
      // Fallback to local storage
      setRates(imported);
      saveToStorage(STORAGE_KEYS.shippingRates, imported);
    }
  };
  return <div>
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Shipping Rates Management
        </h1>
        <p className="text-gray-600">
          Manage shipping rates for your services
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
          Add Shipping Rate
        </button>
      </div>
    </div>
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b bg-amber-50">
        <div className="text-sm text-gray-700">
          <span className="font-medium">Volumetric helper:</span> L×W×H (cm) / Divisor ➜ Volumetric kg
        </div>
        <div className="mt-2 grid grid-cols-6 gap-2 items-end">
          <div>
            <label className="block text-xs text-gray-600">L (cm)</label>
            <input id="vh-l" type="number" step="0.1" className="w-full p-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-xs text-gray-600">W (cm)</label>
            <input id="vh-w" type="number" step="0.1" className="w-full p-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-xs text-gray-600">H (cm)</label>
            <input id="vh-h" type="number" step="0.1" className="w-full p-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-xs text-gray-600">Divisor</label>
            <input id="vh-d" type="number" className="w-full p-2 border rounded-lg" defaultValue={5000} />
          </div>
          <div className="col-span-2">
            <button className="w-full px-3 py-2 bg-amber-600 text-white rounded-lg" onClick={() => {
              const l = parseFloat((document.getElementById('vh-l') as HTMLInputElement)?.value || '0');
              const w = parseFloat((document.getElementById('vh-w') as HTMLInputElement)?.value || '0');
              const h = parseFloat((document.getElementById('vh-h') as HTMLInputElement)?.value || '0');
              const d = parseInt((document.getElementById('vh-d') as HTMLInputElement)?.value || '5000');
              const v = calculateVolumetricWeightKg(l, w, h, d);
              alert(`Volumetric weight: ${v} kg`);
            }}>Compute Volumetric</button>
          </div>
        </div>
      </div>
      <div className="p-4 border-b">
        <div className="relative">
          <input type="text" placeholder="Search rates..." className="w-full pl-10 pr-4 py-2 border rounded-lg" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          <SearchIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left bg-gray-50">
              <th className="px-6 py-3 border-b font-medium">Name</th>
              <th className="px-6 py-3 border-b font-medium">Type</th>
              <th className="px-6 py-3 border-b font-medium">Weight Range</th>
              <th className="px-6 py-3 border-b font-medium">Rate</th>
              <th className="px-6 py-3 border-b font-medium">Insurance</th>
              <th className="px-6 py-3 border-b font-medium text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRates.map(rate => <tr key={rate.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 border-b">
                <div>
                  <div className="font-medium">{rate.name}</div>
                  <div className="text-xs text-gray-500">
                    {rate.description}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 border-b capitalize">{rate.type}</td>
              <td className="px-6 py-4 border-b">
                {rate.min_weight} kg - {rate.max_weight} kg
              </td>
              <td className="px-6 py-4 border-b">
                €{rate.rate.toFixed(2)}
              </td>
              <td className="px-6 py-4 border-b">
                €{rate.insurance.toFixed(2)}
              </td>
              <td className="px-6 py-4 border-b text-right">
                <button className="text-blue-600 hover:text-blue-800 p-1" title="Edit" onClick={() => openEditModal(rate)}>
                  <PencilIcon size={16} />
                </button>
                <button className="text-red-600 hover:text-red-800 p-1 ml-2" title="Delete" onClick={() => handleDeleteRate(rate.id)}>
                  <TrashIcon size={16} />
                </button>
              </td>
            </tr>)}
            {filteredRates.length === 0 && <tr>
              <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                No shipping rates found
              </td>
            </tr>}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing {filteredRates.length} of {rates.length} shipping rates
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
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Add New Shipping Rate</h2>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Rate Name
            </label>
            <input type="text" className="w-full p-2 border rounded-lg" placeholder="e.g. Express Air" value={newRate.name} onChange={e => setNewRate({
              ...newRate,
              name: e.target.value
            })} />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Rate Type
            </label>
            <select className="w-full p-2 border rounded-lg" value={newRate.type} onChange={e => setNewRate({
              ...newRate,
              type: e.target.value as 'flat' | 'weight'
            })}>
              <option value="flat">Flat Rate</option>
              <option value="weight">Weight-Based</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Min Weight (kg)
              </label>
              <input type="number" min="0" step="0.1" className="w-full p-2 border rounded-lg" value={newRate.min_weight} onChange={e => setNewRate({
                ...newRate,
                min_weight: parseFloat(e.target.value) || 0
              })} />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Max Weight (kg)
              </label>
              <input type="number" min="0" step="0.1" className="w-full p-2 border rounded-lg" value={newRate.max_weight} onChange={e => setNewRate({
                ...newRate,
                max_weight: parseFloat(e.target.value) || 0
              })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Rate (€)
              </label>
              <input type="number" min="0" step="0.01" className="w-full p-2 border rounded-lg" value={newRate.rate} onChange={e => setNewRate({
                ...newRate,
                rate: parseFloat(e.target.value) || 0
              })} />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Insurance (€)
              </label>
              <input type="number" min="0" step="0.01" className="w-full p-2 border rounded-lg" value={newRate.insurance} onChange={e => setNewRate({
                ...newRate,
                insurance: parseFloat(e.target.value) || 0
              })} />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Description
            </label>
            <textarea className="w-full p-2 border rounded-lg" rows={3} placeholder="Describe this shipping rate..." value={newRate.description} onChange={e => setNewRate({
              ...newRate,
              description: e.target.value
            })} />
          </div>
          <div className="flex justify-end space-x-3">
            <button className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={handleAddRate}>
              Add Shipping Rate
            </button>
          </div>
        </div>
      </div>
    </div>}
    {isEditModalOpen && editingRate && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Edit Shipping Rate</h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Rate Name
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-lg"
                value={editingRate.name}
                onChange={(e) => setEditingRate({ ...editingRate, name: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Rate Type
              </label>
              <select
                className="w-full p-2 border rounded-lg"
                value={editingRate.type}
                onChange={(e) => setEditingRate({ ...editingRate, type: e.target.value as 'flat' | 'weight' })}
              >
                <option value="flat">Flat Rate</option>
                <option value="weight">Weight-Based</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Min Weight (kg)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  className="w-full p-2 border rounded-lg"
                  value={editingRate.min_weight}
                  onChange={(e) => setEditingRate({ ...editingRate, min_weight: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Max Weight (kg)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  className="w-full p-2 border rounded-lg"
                  value={editingRate.max_weight}
                  onChange={(e) => setEditingRate({ ...editingRate, max_weight: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Rate (€)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full p-2 border rounded-lg"
                  value={editingRate.rate}
                  onChange={(e) => setEditingRate({ ...editingRate, rate: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Insurance (€)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full p-2 border rounded-lg"
                  value={editingRate.insurance}
                  onChange={(e) => setEditingRate({ ...editingRate, insurance: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                className="w-full p-2 border rounded-lg"
                rows={3}
                value={editingRate.description}
                onChange={(e) => setEditingRate({ ...editingRate, description: e.target.value })}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingRate(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={handleEditRate}
              >
                Update Shipping Rate
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>;
};
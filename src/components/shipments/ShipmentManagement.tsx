import React, { useEffect, useState } from 'react';
import { PlusIcon, SearchIcon, EyeIcon, TrashIcon, PencilIcon, PackageIcon } from 'lucide-react';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../../utils/storage';
import { calculateShipmentWeights, PackageInput } from '../../utils/weight';
import { AddressAutocomplete } from './AddressAutocomplete';
import { toCsv, downloadCsv } from '../../utils/csv';
import { shipmentsApi, Shipment } from '../../utils/api';
export const ShipmentManagement: React.FC = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);
  const [newPackages, setNewPackages] = useState<PackageInput[]>([{ weightKg: 0, lengthCm: 0, widthCm: 0, heightCm: 0, quantity: 1 }]);
  const [newOrigin, setNewOrigin] = useState('');
  const [newDestination, setNewDestination] = useState('');
  const [divisor, setDivisor] = useState(5000);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  useEffect(() => {
    loadShipments();
  }, []);

  const loadShipments = async () => {
    try {
      const data = await shipmentsApi.getAll();
      setShipments(data);
    } catch (error) {
      console.error('Failed to load shipments:', error);
      // Fallback to localStorage
      const fallback = loadFromStorage<Shipment[]>(STORAGE_KEYS.shipments, []);
      setShipments(fallback);
    } finally {
      setLoading(false);
    }
  };

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = shipment.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()) || shipment.origin.toLowerCase().includes(searchTerm.toLowerCase()) || shipment.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || shipment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredShipments.length / pageSize);
  const paginatedShipments = filteredShipments.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleDeleteShipment = async (id: number) => {
    try {
      await shipmentsApi.delete(id);
      setShipments(shipments.filter(shipment => shipment.id !== id));
    } catch (error) {
      console.error('Failed to delete shipment:', error);
      // Fallback to local storage
      const updated = shipments.filter(shipment => shipment.id !== id);
      setShipments(updated);
      saveToStorage(STORAGE_KEYS.shipments, updated);
    }
  };
  const addPackageRow = () => {
    setNewPackages([...newPackages, { weightKg: 0, lengthCm: 0, widthCm: 0, heightCm: 0, quantity: 1 }]);
  };
  const removePackageRow = (index: number) => {
    setNewPackages(newPackages.filter((_, i) => i !== index));
  };
  const updatePackageRow = (index: number, field: keyof PackageInput, value: number) => {
    const copy = [...newPackages];
    copy[index] = { ...copy[index], [field]: value } as PackageInput;
    setNewPackages(copy);
  };
  const handleCreateShipment = async () => {
    const { taxedWeightKg } = calculateShipmentWeights(newPackages, divisor);
    const tracking = `CS-${Math.floor(10000000 + Math.random() * 89999999)}`;

    try {
      const created = await shipmentsApi.create({
        tracking_number: tracking,
        shipper_name: '',
        shipper_address: '',
        shipper_phone: '',
        shipper_email: '',
        receiver_name: '',
        receiver_address: '',
        receiver_phone: '',
        receiver_email: '',
        origin: newOrigin,
        destination: newDestination,
        status: 'processing',
        packages: newPackages.reduce((sum, p) => sum + Math.max(1, p.quantity || 1), 0),
        total_weight: taxedWeightKg,
        date_created: new Date().toISOString().slice(0, 10)
      });
      setShipments([created, ...shipments]);
      setIsAddOpen(false);
      setNewPackages([{ weightKg: 0, lengthCm: 0, widthCm: 0, heightCm: 0, quantity: 1 }]);
      setNewOrigin('');
      setNewDestination('');
    } catch (error) {
      console.error('Failed to create shipment:', error);
      // Fallback to local storage
      const fallbackShipment: Shipment = {
        id: Date.now(),
        tracking_number: tracking,
        shipper_name: '',
        shipper_address: '',
        shipper_phone: '',
        shipper_email: '',
        receiver_name: '',
        receiver_address: '',
        receiver_phone: '',
        receiver_email: '',
        origin: newOrigin,
        destination: newDestination,
        status: 'processing',
        packages: newPackages.reduce((sum, p) => sum + Math.max(1, p.quantity || 1), 0),
        total_weight: taxedWeightKg,
        date_created: new Date().toISOString().slice(0, 10)
      };
      setShipments([fallbackShipment, ...shipments]);
      saveToStorage(STORAGE_KEYS.shipments, [fallbackShipment, ...shipments]);
    }
  };
  useEffect(() => {
    saveToStorage<Shipment[]>(STORAGE_KEYS.shipments, shipments);
  }, [shipments]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const handleEditShipment = async () => {
    if (editingShipment && editingShipment.tracking_number && editingShipment.origin && editingShipment.destination) {
      try {
        await shipmentsApi.update(editingShipment.id, {
          tracking_number: editingShipment.tracking_number,
          origin: editingShipment.origin,
          destination: editingShipment.destination,
          status: editingShipment.status,
          packages: editingShipment.packages,
          total_weight: editingShipment.total_weight,
          date_created: editingShipment.date_created
        });
        setShipments(shipments.map(shipment => shipment.id === editingShipment.id ? editingShipment : shipment));
        setIsEditOpen(false);
        setEditingShipment(null);
      } catch (error) {
        console.error('Failed to update shipment:', error);
        // Fallback to local storage
        const updated = shipments.map(shipment => shipment.id === editingShipment.id ? editingShipment : shipment);
        setShipments(updated);
        saveToStorage(STORAGE_KEYS.shipments, updated);
      }
    }
  };

  const openEditModal = (shipment: Shipment) => {
    setEditingShipment(shipment);
    setIsEditOpen(true);
  };
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'picked_up':
        return 'bg-purple-100 text-purple-800';
      case 'in_transit':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'delayed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };
  const exportShipmentsCsv = () => {
    const csv = toCsv(filteredShipments.map(s => ({
      id: s.id,
      trackingNumber: s.tracking_number,
      origin: s.origin,
      destination: s.destination,
      status: s.status,
      packages: s.packages,
      totalWeight: s.total_weight,
      dateCreated: s.date_created
    })), ['id', 'trackingNumber', 'origin', 'destination', 'status', 'packages', 'totalWeight', 'dateCreated']);
    downloadCsv('shipments.csv', csv);
  };
  return <div>
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Shipment Management
        </h1>
        <p className="text-gray-600">
          Manage all your shipments in one place
        </p>
        {loading && <p className="text-sm text-blue-600 mt-1">Loading...</p>}
      </div>
      <div className="flex gap-2">
        <button className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100" onClick={exportShipmentsCsv}>Export CSV</button>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center" onClick={() => setIsAddOpen(true)}>
          <PlusIcon size={18} className="mr-2" />
          Add Shipment
        </button>
      </div>
    </div>
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-grow max-w-md">
            <input type="text" placeholder="Search by tracking #, origin, destination..." className="w-full pl-10 pr-4 py-2 border rounded-lg" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            <SearchIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <div className="flex items-center">
            <label className="mr-2 text-sm text-gray-600">Status:</label>
            <select className="p-2 border rounded-lg" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">All Statuses</option>
              <option value="processing">Processing</option>
              <option value="picked_up">Picked Up</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="delayed">Delayed</option>
            </select>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left bg-gray-50">
              <th className="px-6 py-3 border-b font-medium">Tracking #</th>
              <th className="px-6 py-3 border-b font-medium">Origin</th>
              <th className="px-6 py-3 border-b font-medium">Destination</th>
              <th className="px-6 py-3 border-b font-medium">Status</th>
              <th className="px-6 py-3 border-b font-medium">Packages</th>
              <th className="px-6 py-3 border-b font-medium">Weight</th>
              <th className="px-6 py-3 border-b font-medium">Date Created</th>
              <th className="px-6 py-3 border-b font-medium text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedShipments.map(shipment => <tr key={shipment.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 border-b font-medium">
                {shipment.tracking_number}
              </td>
              <td className="px-6 py-4 border-b">{shipment.origin}</td>
              <td className="px-6 py-4 border-b">{shipment.destination}</td>
              <td className="px-6 py-4 border-b">
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(shipment.status)}`}>
                  {formatStatus(shipment.status)}
                </span>
              </td>
              <td className="px-6 py-4 border-b">
                <div className="flex items-center">
                  <PackageIcon size={14} className="mr-1 text-gray-500" />
                  {shipment.packages}
                </div>
              </td>
              <td className="px-6 py-4 border-b">
                {shipment.total_weight} kg
              </td>
              <td className="px-6 py-4 border-b">{shipment.date_created}</td>
              <td className="px-6 py-4 border-b text-right">
                <button className="text-blue-600 hover:text-blue-800 p-1" title="View">
                  <EyeIcon size={16} />
                </button>
                <button className="text-green-600 hover:text-green-800 p-1 ml-2" title="Edit" onClick={() => openEditModal(shipment)}>
                  <PencilIcon size={16} />
                </button>
                <button className="text-red-600 hover:text-red-800 p-1 ml-2" title="Delete" onClick={() => handleDeleteShipment(shipment.id)}>
                  <TrashIcon size={16} />
                </button>
              </td>
            </tr>)}
            {filteredShipments.length === 0 && <tr>
              <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                No shipments found
              </td>
            </tr>}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing {paginatedShipments.length} of {filteredShipments.length} shipments (Page {currentPage} of {totalPages})
        </div>
        <div className="flex">
          <button
            className="px-3 py-1 border rounded mr-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
      {isAddOpen && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Create Shipment</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Origin</label>
                <AddressAutocomplete placeholder="e.g. Paris, FR" value={newOrigin} onChange={setNewOrigin} />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Destination</label>
                <AddressAutocomplete placeholder="e.g. Lyon, FR" value={newDestination} onChange={setNewDestination} />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-1">Volumetric Divisor</label>
              <input type="number" className="w-40 p-2 border rounded-lg" value={divisor} onChange={e => setDivisor(parseInt(e.target.value) || 5000)} />
              <span className="text-xs text-gray-500 ml-2">Default 5000 (air), 6000 (some carriers)</span>
            </div>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Packages</h3>
                <button className="px-3 py-1 bg-blue-600 text-white rounded-lg" onClick={addPackageRow}>Add Package</button>
              </div>
              <div className="space-y-3">
                {newPackages.map((pkg, idx) => <div key={idx} className="grid grid-cols-6 gap-2 items-end">
                  <div>
                    <label className="block text-xs text-gray-600">Weight (kg)</label>
                    <input type="number" step="0.01" className="w-full p-2 border rounded-lg" value={pkg.weightKg} onChange={e => updatePackageRow(idx, 'weightKg', parseFloat(e.target.value) || 0)} />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600">L (cm)</label>
                    <input type="number" step="0.1" className="w-full p-2 border rounded-lg" value={pkg.lengthCm} onChange={e => updatePackageRow(idx, 'lengthCm', parseFloat(e.target.value) || 0)} />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600">W (cm)</label>
                    <input type="number" step="0.1" className="w-full p-2 border rounded-lg" value={pkg.widthCm} onChange={e => updatePackageRow(idx, 'widthCm', parseFloat(e.target.value) || 0)} />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600">H (cm)</label>
                    <input type="number" step="0.1" className="w-full p-2 border rounded-lg" value={pkg.heightCm} onChange={e => updatePackageRow(idx, 'heightCm', parseFloat(e.target.value) || 0)} />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600">Qty</label>
                    <input type="number" min="1" className="w-full p-2 border rounded-lg" value={pkg.quantity} onChange={e => updatePackageRow(idx, 'quantity', parseInt(e.target.value) || 1)} />
                  </div>
                  <div className="flex items-end">
                    <button className="px-3 py-2 border rounded-lg text-red-600" onClick={() => removePackageRow(idx)}>Remove</button>
                  </div>
                </div>)}
              </div>
              <div className="mt-3 text-sm text-gray-600">
                {(() => {
                  const w = calculateShipmentWeights(newPackages, divisor);
                  return <span>Actual: {w.actualWeightKg} kg • Volumetric: {w.volumetricWeightKg} kg • Taxed: <strong>{w.taxedWeightKg} kg</strong></span>;
                })()}
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button className="px-4 py-2 border rounded-lg" onClick={() => setIsAddOpen(false)}>Cancel</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg" onClick={handleCreateShipment}>Create</button>
            </div>
          </div>
        </div>
      </div>}
      {isEditOpen && editingShipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Edit Shipment</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Tracking Number</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg"
                    value={editingShipment.tracking_number}
                    onChange={(e) => setEditingShipment({ ...editingShipment, tracking_number: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Status</label>
                  <select
                    className="w-full p-2 border rounded-lg"
                    value={editingShipment.status}
                    onChange={(e) => setEditingShipment({ ...editingShipment, status: e.target.value as Shipment['status'] })}
                  >
                    <option value="processing">Processing</option>
                    <option value="picked_up">Picked Up</option>
                    <option value="in_transit">In Transit</option>
                    <option value="delivered">Delivered</option>
                    <option value="delayed">Delayed</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Origin</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg"
                    value={editingShipment.origin}
                    onChange={(e) => setEditingShipment({ ...editingShipment, origin: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Destination</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg"
                    value={editingShipment.destination}
                    onChange={(e) => setEditingShipment({ ...editingShipment, destination: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Packages</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full p-2 border rounded-lg"
                    value={editingShipment.packages}
                    onChange={(e) => setEditingShipment({ ...editingShipment, packages: parseInt(e.target.value) || 1 })}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Total Weight (kg)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-full p-2 border rounded-lg"
                    value={editingShipment.total_weight}
                    onChange={(e) => setEditingShipment({ ...editingShipment, total_weight: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Date Created</label>
                  <input
                    type="date"
                    className="w-full p-2 border rounded-lg"
                    value={editingShipment.date_created}
                    onChange={(e) => setEditingShipment({ ...editingShipment, date_created: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  className="px-4 py-2 border rounded-lg"
                  onClick={() => {
                    setIsEditOpen(false);
                    setEditingShipment(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  onClick={handleEditShipment}
                >
                  Update Shipment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>;
};
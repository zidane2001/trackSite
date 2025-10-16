import React, { useState } from 'react';
import { SaveIcon } from 'lucide-react';
export const GeneralSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    companyName: 'ColisSelect',
    companyEmail: 'contact@colisselect.com',
    companyPhone: '+33 1 23 45 67 89',
    companyAddress: '123 Rue de la Logistique, 75001 Paris, France',
    defaultCurrency: 'EUR',
    weightUnit: 'kg',
    dimensionsUnit: 'cm',
    dateFormat: 'DD/MM/YYYY',
    enableEmailNotifications: true,
    enableSmsNotifications: false
  });
  const [isSaving, setIsSaving] = useState(false);
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem('cs_admin_general_settings');
      if (raw) {
        const parsed = JSON.parse(raw);
        setSettings({
          ...settings,
          ...parsed
        });
      }
    } catch { }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {
      name,
      value,
      type
    } = e.target as HTMLInputElement;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };
  const handleSaveSettings = () => {
    setIsSaving(true);
    try {
      localStorage.setItem('cs_admin_general_settings', JSON.stringify(settings));
    } finally {
      setTimeout(() => {
        setIsSaving(false);
        alert('Settings saved successfully!');
      }, 500);
    }
  };
  return <div>
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        General Settings
      </h1>
      <p className="text-gray-600">
        Configure general settings for your shipping platform
      </p>
    </div>
    <div className="bg-white rounded-lg shadow p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Company Information
          </h2>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Company Name
            </label>
            <input type="text" name="companyName" className="w-full p-2 border rounded-lg" value={settings.companyName} onChange={handleInputChange} />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Email Address
            </label>
            <input type="email" name="companyEmail" className="w-full p-2 border rounded-lg" value={settings.companyEmail} onChange={handleInputChange} />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Phone Number
            </label>
            <input type="text" name="companyPhone" className="w-full p-2 border rounded-lg" value={settings.companyPhone} onChange={handleInputChange} />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Company Address
            </label>
            <input type="text" name="companyAddress" className="w-full p-2 border rounded-lg" value={settings.companyAddress} onChange={handleInputChange} />
          </div>
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            System Settings
          </h2>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Default Currency
            </label>
            <select name="defaultCurrency" className="w-full p-2 border rounded-lg" value={settings.defaultCurrency} onChange={handleInputChange}>
              <option value="EUR">Euro (€)</option>
              <option value="USD">US Dollar ($)</option>
              <option value="GBP">British Pound (£)</option>
              <option value="CHF">Swiss Franc (CHF)</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Weight Unit
            </label>
            <select name="weightUnit" className="w-full p-2 border rounded-lg" value={settings.weightUnit} onChange={handleInputChange}>
              <option value="kg">Kilograms (kg)</option>
              <option value="lb">Pounds (lb)</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Dimensions Unit
            </label>
            <select name="dimensionsUnit" className="w-full p-2 border rounded-lg" value={settings.dimensionsUnit} onChange={handleInputChange}>
              <option value="cm">Centimeters (cm)</option>
              <option value="in">Inches (in)</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Date Format
            </label>
            <select name="dateFormat" className="w-full p-2 border rounded-lg" value={settings.dateFormat} onChange={handleInputChange}>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </div>
      <div className="mt-6 border-t pt-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          Notification Settings
        </h2>
        <div className="flex items-center mb-4">
          <input type="checkbox" id="enableEmailNotifications" name="enableEmailNotifications" className="w-4 h-4 text-blue-600 border-gray-300 rounded" checked={settings.enableEmailNotifications} onChange={handleInputChange} />
          <label htmlFor="enableEmailNotifications" className="ml-2 text-sm text-gray-700">
            Enable email notifications
          </label>
        </div>
        <div className="flex items-center mb-6">
          <input type="checkbox" id="enableSmsNotifications" name="enableSmsNotifications" className="w-4 h-4 text-blue-600 border-gray-300 rounded" checked={settings.enableSmsNotifications} onChange={handleInputChange} />
          <label htmlFor="enableSmsNotifications" className="ml-2 text-sm text-gray-700">
            Enable SMS notifications (additional charges may apply)
          </label>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button className={`px-4 py-2 rounded-lg flex items-center ${isSaving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white`} onClick={handleSaveSettings} disabled={isSaving}>
          <SaveIcon size={18} className="mr-2" />
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  </div>;
};
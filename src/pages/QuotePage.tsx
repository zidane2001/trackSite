import React, { useState } from 'react';
import { PackageIcon, TruckIcon, ShipIcon, PlaneIcon, ArrowRightIcon, ChevronRightIcon, CheckCircleIcon } from 'lucide-react';
interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDelivery: string;
  icon: React.ReactNode;
}
interface FormData {
  origin: string;
  destination: string;
  weight: number;
  length: number;
  width: number;
  height: number;
  packageType: string;
}
export const QuotePage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    origin: '',
    destination: '',
    weight: 1,
    length: 30,
    width: 20,
    height: 15,
    packageType: 'package'
  });
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  const handleNextStep = () => {
    if (step === 1) {
      // Validate first step
      if (!formData.origin || !formData.destination) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
      }
    } else if (step === 2) {
      // Validate second step and generate quotes
      if (formData.weight <= 0) {
        alert('Le poids doit être supérieur à 0');
        return;
      }
      // Simulate API call to get shipping options
      setTimeout(() => {
        setShippingOptions([{
          id: 'standard',
          name: 'Livraison Standard',
          description: 'Livraison économique par voie terrestre',
          price: calculatePrice('standard'),
          estimatedDelivery: '3-5 jours ouvrables',
          icon: <TruckIcon size={24} className="text-blue-600" />
        }, {
          id: 'express',
          name: 'Livraison Express',
          description: 'Livraison rapide par voie aérienne',
          price: calculatePrice('express'),
          estimatedDelivery: '1-2 jours ouvrables',
          icon: <PlaneIcon size={24} className="text-blue-600" />
        }, {
          id: 'economy',
          name: 'Livraison Économique',
          description: 'Option la plus économique pour les envois non urgents',
          price: calculatePrice('economy'),
          estimatedDelivery: '5-7 jours ouvrables',
          icon: <ShipIcon size={24} className="text-blue-600" />
        }]);
      }, 500);
    }
    setStep(step + 1);
  };
  const handlePrevStep = () => {
    setStep(step - 1);
  };
  const calculatePrice = (type: string): number => {
    const basePrice = formData.weight * 5;
    const volume = formData.length * formData.width * formData.height / 5000;
    switch (type) {
      case 'express':
        return Math.round((basePrice * 2 + volume * 0.5) * 100) / 100;
      case 'economy':
        return Math.round((basePrice * 0.7 + volume * 0.3) * 100) / 100;
      case 'standard':
      default:
        return Math.round((basePrice + volume * 0.4) * 100) / 100;
    }
  };
  const handleSelectOption = (id: string) => {
    setSelectedOption(id);
  };
  const handleSubmit = () => {
    // Here you would typically submit the quote request
    alert('Votre demande de devis a été soumise avec succès !');
    // Reset form
    setStep(1);
    setFormData({
      origin: '',
      destination: '',
      weight: 1,
      length: 30,
      width: 20,
      height: 15,
      packageType: 'package'
    });
    setShippingOptions([]);
    setSelectedOption('');
  };
  return <div className="w-full bg-gray-50">
    <div className="bg-primary text-primary-content py-12">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Obtenez un devis d'expédition
        </h1>
        <p className="text-xl text-blue-100 max-w-2xl mx-auto">
          Remplissez le formulaire ci-dessous pour obtenir un devis instantané
          pour votre envoi.
        </p>
      </div>
    </div>
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden -mt-8">
        {/* Progress Steps */}
        <div className="p-4 bg-gray-50 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                1
              </div>
              <div className="ml-2">
                <div className="text-sm font-medium">
                  Origine & Destination
                </div>
              </div>
            </div>
            <div className="w-12 h-0.5 bg-gray-200 mx-2"></div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                2
              </div>
              <div className="ml-2">
                <div className="text-sm font-medium">Détails du colis</div>
              </div>
            </div>
            <div className="w-12 h-0.5 bg-gray-200 mx-2"></div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                3
              </div>
              <div className="ml-2">
                <div className="text-sm font-medium">Choix d'expédition</div>
              </div>
            </div>
          </div>
        </div>
        {/* Form Content */}
        <div className="p-6">
          {step === 1 && <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Origine et Destination
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label htmlFor="origin" className="block text-gray-700 text-sm font-medium mb-2">
                  Adresse d'origine <span className="text-red-500">*</span>
                </label>
                <input type="text" id="origin" name="origin" className="input input-bordered input-primary w-full" placeholder="Ex: 123 Rue de Paris, 75001 Paris" value={formData.origin} onChange={handleInputChange} required />
              </div>
              <div className="form-control">
                <label htmlFor="destination" className="block text-gray-700 text-sm font-medium mb-2">
                  Adresse de destination{' '}
                  <span className="text-red-500">*</span>
                </label>
                <input type="text" id="destination" name="destination" className="input input-bordered input-primary w-full" placeholder="Ex: 456 Avenue de Lyon, 69001 Lyon" value={formData.destination} onChange={handleInputChange} required />
              </div>
            </div>
            <div className="flex justify-end mt-8">
              <button type="button" onClick={handleNextStep} className="btn btn-primary">Suivant</button>
            </div>
          </div>}
          {step === 2 && <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Détails du colis
            </h2>
            <div className="mb-6 form-control">
              <label htmlFor="packageType" className="block text-gray-700 text-sm font-medium mb-2">
                Type de colis
              </label>
              <select id="packageType" name="packageType" className="select select-bordered select-primary w-full" value={formData.packageType} onChange={handleInputChange}>
                <option value="package">Colis standard</option>
                <option value="document">Document</option>
                <option value="fragile">Colis fragile</option>
                <option value="heavy">Colis lourd</option>
              </select>
            </div>
            <div className="mb-6 form-control">
              <label htmlFor="weight" className="block text-gray-700 text-sm font-medium mb-2">
                Poids (kg) <span className="text-red-500">*</span>
              </label>
              <input type="number" id="weight" name="weight" min="0.1" step="0.1" className="input input-bordered input-primary w-full" value={formData.weight} onChange={handleInputChange} required />
            </div>
            <div className="mb-6">
              <h3 className="text-gray-700 text-sm font-medium mb-2">
                Dimensions (cm)
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="form-control">
                  <label htmlFor="length" className="block text-gray-700 text-xs mb-1">
                    Longueur
                  </label>
                  <input type="number" id="length" name="length" min="1" className="input input-bordered input-primary w-full" value={formData.length} onChange={handleInputChange} />
                </div>
                <div className="form-control">
                  <label htmlFor="width" className="block text-gray-700 text-xs mb-1">
                    Largeur
                  </label>
                  <input type="number" id="width" name="width" min="1" className="input input-bordered input-primary w-full" value={formData.width} onChange={handleInputChange} />
                </div>
                <div className="form-control">
                  <label htmlFor="height" className="block text-gray-700 text-xs mb-1">
                    Hauteur
                  </label>
                  <input type="number" id="height" name="height" min="1" className="input input-bordered input-primary w-full" value={formData.height} onChange={handleInputChange} />
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-8">
              <button type="button" onClick={handlePrevStep} className="btn">
                Précédent
              </button>
              <button type="button" onClick={handleNextStep} className="btn btn-primary">Suivant</button>
            </div>
          </div>}
          {step === 3 && <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Options d'expédition
            </h2>
            <div className="mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex items-start mb-6">
                <div className="mr-3 mt-0.5">
                  <PackageIcon size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-blue-800 font-medium">
                    Résumé de votre envoi
                  </h3>
                  <p className="text-blue-700 text-sm mt-1">
                    De <strong>{formData.origin}</strong> à{' '}
                    <strong>{formData.destination}</strong>
                    <br />
                    Colis de <strong>{formData.weight} kg</strong> -
                    Dimensions:{' '}
                    <strong>
                      {formData.length} × {formData.width} ×{' '}
                      {formData.height} cm
                    </strong>
                  </p>
                </div>
              </div>
              {shippingOptions.length > 0 ? <div className="space-y-4">
                {shippingOptions.map(option => <div key={option.id} className={`border rounded-md p-4 cursor-pointer transition-colors ${selectedOption === option.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`} onClick={() => handleSelectOption(option.id)}>
                  <div className="flex items-start">
                    <div className="mr-3">{option.icon}</div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-800">
                          {option.name}
                        </h3>
                        <div className="text-lg font-bold text-gray-800">
                          €{option.price.toFixed(2)}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mt-1">
                        {option.description}
                      </p>
                      <p className="text-gray-500 text-sm mt-2">
                        Délai de livraison estimé:{' '}
                        <span className="font-medium">
                          {option.estimatedDelivery}
                        </span>
                      </p>
                    </div>
                    <div className="ml-4 flex items-center">
                      <div className={`w-6 h-6 rounded-full border ${selectedOption === option.id ? 'border-blue-500 bg-blue-500' : 'border-gray-300'} flex items-center justify-center`}>
                        {selectedOption === option.id && <CheckCircleIcon size={16} className="text-white" />}
                      </div>
                    </div>
                  </div>
                </div>)}
              </div> : <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-gray-600 mt-4">
                  Calcul des options d'expédition en cours...
                </p>
              </div>}
            </div>
            <div className="flex justify-between mt-8">
              <button type="button" onClick={handlePrevStep} className="btn">
                Précédent
              </button>
              <button type="button" onClick={handleSubmit} className={`btn btn-primary ${!selectedOption && shippingOptions.length > 0 ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={!selectedOption && shippingOptions.length > 0}>
                Confirmer la demande
              </button>
            </div>
          </div>}
        </div>
      </div>
    </div>
    {/* Additional Info Section */}
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Pourquoi choisir ColisSelect ?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Nous offrons des solutions d'expédition fiables et économiques
            pour tous vos besoins d'envoi.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <TruckIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Livraison fiable
            </h3>
            <p className="text-gray-600">
              Notre réseau de partenaires de transport garantit une livraison
              fiable et ponctuelle de vos colis.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <DollarSignIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Prix compétitifs
            </h3>
            <p className="text-gray-600">
              Nous négocions les meilleurs tarifs avec nos transporteurs pour
              vous offrir des prix avantageux.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <MapPinIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Couverture mondiale
            </h3>
            <p className="text-gray-600">
              Expédiez vos colis partout dans le monde grâce à notre réseau
              international de partenaires.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>;
};
// Add missing icons
const DollarSignIcon: React.FC<{
  className?: string;
  size?: number;
}> = ({
  className,
  size = 24
}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="12" y1="1" x2="12" y2="23"></line>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>;
const MapPinIcon: React.FC<{
  className?: string;
  size?: number;
}> = ({
  className,
  size = 24
}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>;
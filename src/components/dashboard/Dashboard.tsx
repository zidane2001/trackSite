import React, { useState } from 'react';
import { TruckIcon, PackageIcon, MapPinIcon, DollarSignIcon, UsersIcon, ArrowUpIcon, ArrowDownIcon, CheckCircleIcon, AlertCircleIcon, ClockIcon, BarChart2Icon, CalendarIcon, RefreshCcwIcon, FilterIcon, TrendingUpIcon, TrendingDownIcon, MoreHorizontalIcon } from 'lucide-react';
import { motion } from 'framer-motion';
interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  change?: {
    value: string;
    type: 'increase' | 'decrease';
  };
  period?: string;
}
const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  change,
  period
}) => {
  return <motion.div className="bg-white rounded-xl shadow-md p-6 border-b-4 border-amber-500 hover:shadow-lg transition-shadow" whileHover={{
    y: -5
  }} transition={{
    duration: 0.2
  }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
          {change && <div className="flex items-center mt-2">
              {change.type === 'increase' ? <span className="flex items-center text-green-600 text-xs">
                  <ArrowUpIcon size={14} className="mr-1" />
                  {change.value}
                </span> : <span className="flex items-center text-red-600 text-xs">
                  <ArrowDownIcon size={14} className="mr-1" />
                  {change.value}
                </span>}
              {period && <span className="text-gray-500 text-xs ml-1">vs {period}</span>}
            </div>}
        </div>
        <div className={`p-3 rounded-lg ${color} text-white`}>{icon}</div>
      </div>
    </motion.div>;
};
export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('today');
  const [dateRange, setDateRange] = useState('7days');
  return <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Tableau de bord
          </h1>
          <p className="text-gray-600">
            Bienvenue sur le tableau de bord administrateur de ColisSelect
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <div className="bg-white rounded-lg shadow-sm p-1 flex">
            <button className={`px-3 py-1.5 text-sm rounded-md ${activeTab === 'today' ? 'bg-amber-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`} onClick={() => setActiveTab('today')}>
              Aujourd'hui
            </button>
            <button className={`px-3 py-1.5 text-sm rounded-md ${activeTab === 'week' ? 'bg-amber-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`} onClick={() => setActiveTab('week')}>
              Cette semaine
            </button>
            <button className={`px-3 py-1.5 text-sm rounded-md ${activeTab === 'month' ? 'bg-amber-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`} onClick={() => setActiveTab('month')}>
              Ce mois
            </button>
          </div>
          <button className="bg-white p-2 rounded-lg shadow-sm hover:bg-gray-100">
            <RefreshCcwIcon size={18} className="text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Expéditions" value="1,248" icon={<TruckIcon size={24} />} color="bg-amber-500" change={{
        value: '12%',
        type: 'increase'
      }} period="dernier mois" />
        <StatCard title="Colis Actifs" value="356" icon={<PackageIcon size={24} />} color="bg-indigo-500" change={{
        value: '5%',
        type: 'increase'
      }} period="dernier mois" />
        <StatCard title="Destinations" value="124" icon={<MapPinIcon size={24} />} color="bg-green-500" change={{
        value: '3%',
        type: 'increase'
      }} period="dernier mois" />
        <StatCard title="Chiffre d'Affaires" value="€56,789" icon={<DollarSignIcon size={24} />} color="bg-purple-500" change={{
        value: '8%',
        type: 'increase'
      }} period="dernier mois" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <motion.div className="bg-white rounded-xl shadow-md lg:col-span-2 overflow-hidden" initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.3
      }}>
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Statistiques d'expédition
              </h2>
              <p className="text-sm text-gray-500">
                Vue d'ensemble des tendances d'expédition
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <select className="bg-gray-100 border-0 text-gray-600 text-sm rounded-md p-2 focus:ring-amber-500 focus:border-amber-500" value={dateRange} onChange={e => setDateRange(e.target.value)}>
                <option value="7days">7 derniers jours</option>
                <option value="30days">30 derniers jours</option>
                <option value="90days">90 derniers jours</option>
                <option value="year">Cette année</option>
              </select>
              <button className="p-2 hover:bg-gray-100 rounded-md">
                <FilterIcon size={16} className="text-gray-600" />
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="flex justify-between mb-6">
              <div>
                <div className="flex items-center">
                  <h3 className="text-2xl font-bold text-gray-800">1,248</h3>
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center">
                    <TrendingUpIcon size={12} className="mr-1" />
                    12%
                  </span>
                </div>
                <p className="text-sm text-gray-500">Expéditions totales</p>
              </div>
              <div>
                <div className="flex items-center">
                  <h3 className="text-2xl font-bold text-gray-800">€56,789</h3>
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center">
                    <TrendingUpIcon size={12} className="mr-1" />
                    8%
                  </span>
                </div>
                <p className="text-sm text-gray-500">Revenus</p>
              </div>
              <div>
                <div className="flex items-center">
                  <h3 className="text-2xl font-bold text-gray-800">€45.5</h3>
                  <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full flex items-center">
                    <TrendingDownIcon size={12} className="mr-1" />
                    3%
                  </span>
                </div>
                <p className="text-sm text-gray-500">Valeur moyenne</p>
              </div>
            </div>
            <div className="w-full h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <img src="https://miro.medium.com/v2/resize:fit:1400/1*D9JYQtEj9-uN2XPzMJzJOw.png" alt="Chart" className="max-w-full max-h-full object-contain" />
            </div>
          </div>
        </motion.div>

        <motion.div className="bg-white rounded-xl shadow-md overflow-hidden" initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.3,
        delay: 0.1
      }}>
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">
              Statuts des colis
            </h2>
            <button className="p-2 hover:bg-gray-100 rounded-md">
              <MoreHorizontalIcon size={16} className="text-gray-600" />
            </button>
          </div>
          <div className="p-6">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                  <span className="text-sm text-gray-700">En attente</span>
                </div>
                <span className="text-sm font-semibold text-gray-700">125</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{
                width: '25%'
              }}></div>
              </div>
            </div>
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></div>
                  <span className="text-sm text-gray-700">En transit</span>
                </div>
                <span className="text-sm font-semibold text-gray-700">356</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-indigo-500 h-2 rounded-full" style={{
                width: '45%'
              }}></div>
              </div>
            </div>
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm text-gray-700">Livrés</span>
                </div>
                <span className="text-sm font-semibold text-gray-700">721</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{
                width: '60%'
              }}></div>
              </div>
            </div>
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-sm text-gray-700">Problèmes</span>
                </div>
                <span className="text-sm font-semibold text-gray-700">46</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{
                width: '10%'
              }}></div>
              </div>
            </div>
            <div className="text-center">
              <button className="text-amber-500 hover:text-amber-600 text-sm font-medium">
                Voir les détails
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div className="bg-white rounded-xl shadow-md overflow-hidden" initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.3,
        delay: 0.2
      }}>
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">
              Expéditions récentes
            </h2>
            <button className="text-amber-500 hover:text-amber-600 text-sm font-medium">
              Voir tout
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left bg-gray-50">
                  <th className="px-6 py-3 border-b font-medium text-gray-500">
                    Tracking #
                  </th>
                  <th className="px-6 py-3 border-b font-medium text-gray-500">
                    Origine
                  </th>
                  <th className="px-6 py-3 border-b font-medium text-gray-500">
                    Destination
                  </th>
                  <th className="px-6 py-3 border-b font-medium text-gray-500">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 border-b">
                    <div className="flex items-center">
                      <PackageIcon size={16} className="mr-2 text-amber-500" />
                      <span className="font-medium">CS-12345678</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 border-b">Paris, FR</td>
                  <td className="px-6 py-4 border-b">Lyon, FR</td>
                  <td className="px-6 py-4 border-b">
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs flex items-center w-fit">
                      <ClockIcon size={12} className="mr-1" />
                      En Transit
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 border-b">
                    <div className="flex items-center">
                      <PackageIcon size={16} className="mr-2 text-amber-500" />
                      <span className="font-medium">CS-23456789</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 border-b">Marseille, FR</td>
                  <td className="px-6 py-4 border-b">Nice, FR</td>
                  <td className="px-6 py-4 border-b">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs flex items-center w-fit">
                      <CheckCircleIcon size={12} className="mr-1" />
                      Livré
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 border-b">
                    <div className="flex items-center">
                      <PackageIcon size={16} className="mr-2 text-amber-500" />
                      <span className="font-medium">CS-34567890</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 border-b">Toulouse, FR</td>
                  <td className="px-6 py-4 border-b">Bordeaux, FR</td>
                  <td className="px-6 py-4 border-b">
                    <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs flex items-center w-fit">
                      <ClockIcon size={12} className="mr-1" />
                      En attente
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 border-b">
                    <div className="flex items-center">
                      <PackageIcon size={16} className="mr-2 text-amber-500" />
                      <span className="font-medium">CS-45678901</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 border-b">Lille, FR</td>
                  <td className="px-6 py-4 border-b">Strasbourg, FR</td>
                  <td className="px-6 py-4 border-b">
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs flex items-center w-fit">
                      <AlertCircleIcon size={12} className="mr-1" />
                      Retardé
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 border-b">
                    <div className="flex items-center">
                      <PackageIcon size={16} className="mr-2 text-amber-500" />
                      <span className="font-medium">CS-56789012</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 border-b">Nantes, FR</td>
                  <td className="px-6 py-4 border-b">Rennes, FR</td>
                  <td className="px-6 py-4 border-b">
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs flex items-center w-fit">
                      <TruckIcon size={12} className="mr-1" />
                      Ramassé
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div className="bg-white rounded-xl shadow-md overflow-hidden" initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.3,
        delay: 0.3
      }}>
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">
              Activité récente
            </h2>
            <button className="text-amber-500 hover:text-amber-600 text-sm font-medium">
              Voir tout
            </button>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <UsersIcon size={18} className="text-indigo-600" />
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <p className="text-gray-800 font-medium">
                      Nouvel utilisateur enregistré
                    </p>
                    <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      Utilisateur
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">
                    Marie Laurent a créé un compte client
                  </p>
                  <p className="text-xs text-gray-400">Il y a 2 heures</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <PackageIcon size={18} className="text-green-600" />
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <p className="text-gray-800 font-medium">
                      Mise à jour du colis
                    </p>
                    <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      Expédition
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">
                    Le colis <span className="font-medium">CS-12345678</span> a
                    été mis à jour vers "En Transit"
                  </p>
                  <p className="text-xs text-gray-400">Il y a 4 heures</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <DollarSignIcon size={18} className="text-amber-600" />
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <p className="text-gray-800 font-medium">
                      Nouveau tarif d'expédition
                    </p>
                    <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      Tarification
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">
                    Nouveau tarif ajouté pour "Express Air"
                  </p>
                  <p className="text-xs text-gray-400">Hier à 15:30</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <MapPinIcon size={18} className="text-purple-600" />
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <p className="text-gray-800 font-medium">
                      Emplacements ajoutés
                    </p>
                    <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      Zones
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">
                    5 nouveaux emplacements ajoutés à la zone "Europe Centrale"
                  </p>
                  <p className="text-xs text-gray-400">Hier à 11:15</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <AlertCircleIcon size={18} className="text-red-600" />
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <p className="text-gray-800 font-medium">
                      Alerte de retard
                    </p>
                    <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      Problème
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">
                    L'expédition{' '}
                    <span className="font-medium">CS-45678901</span> marquée
                    comme "Retardée"
                  </p>
                  <p className="text-xs text-gray-400">Il y a 2 jours</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>;
};
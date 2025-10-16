import React, { useEffect, useState } from 'react';
import { LayoutDashboard, Package, DollarSign, Map, Settings, Users, ChevronDown, ChevronRight, LogOut, Menu, X, Search, Bell, User, HelpCircle, BarChart2, Truck, Globe, FileText, Home, Sun, Moon } from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
interface SidebarItemProps {
  icon: React.ReactNode;
  title: string;
  to: string;
  active: boolean;
  hasSubmenu?: boolean;
  isSubmenuOpen?: boolean;
  toggleSubmenu?: () => void;
  children?: React.ReactNode;
  badge?: string | number;
}
const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  title,
  to,
  active,
  hasSubmenu = false,
  isSubmenuOpen = false,
  toggleSubmenu,
  children,
  badge
}) => {
  return <div className="mb-1.5">
      <Link to={to} className={`flex items-center p-3 text-sm rounded-lg ${active ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md' : 'text-gray-700 hover:bg-amber-50 hover:text-amber-600'} transition-colors duration-200`} onClick={hasSubmenu && toggleSubmenu ? e => {
      e.preventDefault();
      toggleSubmenu();
    } : undefined}>
        <div className={`${active ? 'text-white' : 'text-amber-500'} mr-3`}>
          {icon}
        </div>
        <span className="flex-1">{title}</span>
        {badge && <span className={`px-2 py-0.5 text-xs rounded-full ${active ? 'bg-white text-amber-600' : 'bg-amber-100 text-amber-600'}`}>
            {badge}
          </span>}
        {hasSubmenu && <div className="ml-auto">
            {isSubmenuOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </div>}
      </Link>
      <AnimatePresence>
        {hasSubmenu && isSubmenuOpen && <motion.div className="pl-10 mt-1 space-y-1 overflow-hidden" initial={{
        height: 0,
        opacity: 0
      }} animate={{
        height: 'auto',
        opacity: 1
      }} exit={{
        height: 0,
        opacity: 0
      }} transition={{
        duration: 0.2
      }}>
            {children}
          </motion.div>}
      </AnimatePresence>
    </div>;
};
export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openSubmenus, setOpenSubmenus] = useState<{
    [key: string]: boolean;
  }>({
    rates: false,
    settings: false
  });
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([{
    id: 1,
    title: 'Nouveau colis',
    message: 'Un nouveau colis a été enregistré',
    time: 'Il y a 5 min',
    read: false
  }, {
    id: 2,
    title: 'Mise à jour de statut',
    message: 'Le colis CS-12345678 est en transit',
    time: 'Il y a 30 min',
    read: false
  }, {
    id: 3,
    title: 'Alerte système',
    message: 'Maintenance planifiée ce soir à 22h',
    time: 'Il y a 2h',
    read: true
  }]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  useEffect(() => {
    // Count unread notifications
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);
  const toggleSubmenu = (submenu: string) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [submenu]: !prev[submenu]
    }));
  };
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? {
      ...n,
      read: true
    } : n));
  };
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({
      ...n,
      read: true
    })));
  };
  return <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-800'}`}>
      {/* Sidebar */}
      <motion.div className={`fixed inset-y-0 left-0 z-30 w-64 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`} initial={false}>
        <div className={`flex items-center justify-between p-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
          <div className="flex items-center">
            <div className="relative w-10 h-10 mr-3">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg transform rotate-6 shadow-lg"></div>
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">
                CS
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                ColisSelect
              </h1>
              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Admin Portal
              </span>
            </div>
          </div>
          <button onClick={toggleSidebar} className={`p-1.5 rounded-md ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} lg:hidden`}>
            <X size={20} className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
          </button>
        </div>
        <div className={`p-4 overflow-y-auto h-[calc(100%-64px)] ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="mb-6">
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center mb-4`}>
              <Search size={16} className={`mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <input type="text" placeholder="Rechercher..." className={`bg-transparent border-none focus:outline-none w-full text-sm ${darkMode ? 'text-white placeholder-gray-500' : 'text-gray-700 placeholder-gray-400'}`} />
            </div>
            <div className="space-y-1 mb-6">
              <SidebarItem icon={<Home size={20} />} title="Accueil" to="/" active={location.pathname === '/'} />
              <SidebarItem icon={<LayoutDashboard size={20} />} title="Dashboard" to="/admin" active={location.pathname === '/admin'} />
            </div>
            <div className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase text-xs font-semibold pl-3`}>
              Gestion
            </div>
          </div>
          <div className="space-y-1">
            <SidebarItem icon={<Package size={20} />} title="Gestion des Colis" to="/admin/shipments" active={location.pathname.includes('/admin/shipments')} badge="12" />
            <SidebarItem icon={<Truck size={20} />} title="Livraisons" to="/admin/deliveries" active={location.pathname.includes('/admin/deliveries')} />
            <SidebarItem icon={<Globe size={20} />} title="Suivi International" to="/admin/international" active={location.pathname.includes('/admin/international')} />
            <SidebarItem icon={<DollarSign size={20} />} title="Tarifs d'Expédition" to="/admin/rates" active={location.pathname.includes('/admin/rates')} hasSubmenu={true} isSubmenuOpen={openSubmenus.rates} toggleSubmenu={() => toggleSubmenu('rates')}>
              <Link to="/admin/rates/locations" className={`block p-2 pl-3 text-sm rounded-lg ${location.pathname === '/admin/rates/locations' ? 'text-amber-500 font-medium' : `${darkMode ? 'text-gray-400 hover:text-amber-400' : 'text-gray-600 hover:text-amber-600'}`}`}>
                Emplacements
              </Link>
              <Link to="/admin/rates/zones" className={`block p-2 pl-3 text-sm rounded-lg ${location.pathname === '/admin/rates/zones' ? 'text-amber-500 font-medium' : `${darkMode ? 'text-gray-400 hover:text-amber-400' : 'text-gray-600 hover:text-amber-600'}`}`}>
                Zones
              </Link>
              <Link to="/admin/rates/shipping" className={`block p-2 pl-3 text-sm rounded-lg ${location.pathname === '/admin/rates/shipping' ? 'text-amber-500 font-medium' : `${darkMode ? 'text-gray-400 hover:text-amber-400' : 'text-gray-600 hover:text-amber-600'}`}`}>
                Tarifs d'Expédition
              </Link>
              <Link to="/admin/rates/pickup" className={`block p-2 pl-3 text-sm rounded-lg ${location.pathname === '/admin/rates/pickup' ? 'text-amber-500 font-medium' : `${darkMode ? 'text-gray-400 hover:text-amber-400' : 'text-gray-600 hover:text-amber-600'}`}`}>
                Tarifs de Ramassage
              </Link>
            </SidebarItem>
            <SidebarItem icon={<Map size={20} />} title="Paramètres Carte" to="/admin/map-settings" active={location.pathname === '/admin/map-settings'} />
            <SidebarItem icon={<BarChart2 size={20} />} title="Rapports" to="/admin/reports" active={location.pathname === '/admin/reports'} />
            <SidebarItem icon={<FileText size={20} />} title="Factures" to="/admin/invoices" active={location.pathname === '/admin/invoices'} />
            <div className="my-6 border-t border-gray-200 dark:border-gray-700"></div>
            <SidebarItem icon={<Settings size={20} />} title="Paramètres" to="/admin/settings" active={location.pathname.includes('/admin/settings')} hasSubmenu={true} isSubmenuOpen={openSubmenus.settings} toggleSubmenu={() => toggleSubmenu('settings')}>
              <Link to="/admin/settings/general" className={`block p-2 pl-3 text-sm rounded-lg ${location.pathname === '/admin/settings/general' ? 'text-amber-500 font-medium' : `${darkMode ? 'text-gray-400 hover:text-amber-400' : 'text-gray-600 hover:text-amber-600'}`}`}>
                Paramètres Généraux
              </Link>
              <Link to="/admin/settings/custom-fields" className={`block p-2 pl-3 text-sm rounded-lg ${location.pathname === '/admin/settings/custom-fields' ? 'text-amber-500 font-medium' : `${darkMode ? 'text-gray-400 hover:text-amber-400' : 'text-gray-600 hover:text-amber-600'}`}`}>
                Champs Personnalisés
              </Link>
              <Link to="/admin/settings/integrations" className={`block p-2 pl-3 text-sm rounded-lg ${location.pathname === '/admin/settings/integrations' ? 'text-amber-500 font-medium' : `${darkMode ? 'text-gray-400 hover:text-amber-400' : 'text-gray-600 hover:text-amber-600'}`}`}>
                Intégrations API
              </Link>
            </SidebarItem>
            <SidebarItem icon={<Users size={20} />} title="Gestion Utilisateurs" to="/admin/users" active={location.pathname === '/admin/users'} />
          </div>
          <div className={`mt-auto pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} mt-6`}>
            <div className={`p-3 rounded-lg mb-4 ${darkMode ? 'bg-gray-700' : 'bg-amber-50'}`}>
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white mr-3">
                  <HelpCircle size={16} />
                </div>
                <div className={`${darkMode ? 'text-gray-200' : 'text-gray-800'} font-medium`}>
                  Besoin d'aide ?
                </div>
              </div>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                Accédez à notre centre d'assistance ou contactez le support
                technique
              </p>
              <button className="text-amber-500 text-sm font-medium hover:text-amber-600 transition-colors">
                Centre d'aide
              </button>
            </div>
            <Link to="/logout" className={`flex items-center p-3 text-sm rounded-lg ${darkMode ? 'text-gray-300 hover:bg-red-900/20 hover:text-red-400' : 'text-gray-700 hover:bg-red-100 hover:text-red-600'} transition-colors duration-200`}>
              <LogOut size={20} className={`mr-3 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
              <span>Déconnexion</span>
            </Link>
          </div>
        </div>
      </motion.div>
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Header */}
        <header className={`${darkMode ? 'bg-gray-800 shadow-md' : 'bg-white shadow-sm'} z-10`}>
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <button onClick={toggleSidebar} className={`p-2 rounded-md ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} lg:hidden`}>
                <Menu size={20} className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
              </button>
              <div className={`ml-4 hidden md:block ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <h2 className="text-lg font-semibold">Bonjour, Admin</h2>
                <p className="text-sm">
                  Bienvenue dans votre espace d'administration
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={toggleDarkMode} className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-amber-400' : 'bg-gray-100 text-amber-600'}`}>
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <div className="relative">
                <button className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" onClick={() => setShowNotifications(!showNotifications)}>
                  <Bell size={20} className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
                  {unreadCount > 0 && <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>}
                </button>
                <AnimatePresence>
                  {showNotifications && <motion.div className={`absolute right-0 mt-2 w-80 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl z-50 overflow-hidden`} initial={{
                  opacity: 0,
                  y: -10
                }} animate={{
                  opacity: 1,
                  y: 0
                }} exit={{
                  opacity: 0,
                  y: -10
                }} transition={{
                  duration: 0.2
                }}>
                      <div className={`p-3 ${darkMode ? 'border-gray-700' : 'border-gray-100'} border-b flex justify-between items-center`}>
                        <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          Notifications
                        </h3>
                        <button className={`text-xs ${darkMode ? 'text-amber-400 hover:text-amber-300' : 'text-amber-600 hover:text-amber-700'}`} onClick={markAllAsRead}>
                          Tout marquer comme lu
                        </button>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length > 0 ? notifications.map(notification => <div key={notification.id} className={`p-3 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} ${notification.read ? '' : darkMode ? 'bg-gray-700/50' : 'bg-amber-50/50'} cursor-pointer ${darkMode ? 'border-gray-700' : 'border-gray-100'} border-b`} onClick={() => markAsRead(notification.id)}>
                              <div className="flex justify-between mb-1">
                                <h4 className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                  {notification.title}
                                </h4>
                                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {notification.time}
                                </span>
                              </div>
                              <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                {notification.message}
                              </p>
                            </div>) : <div className={`p-4 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Aucune notification
                          </div>}
                      </div>
                      <div className={`p-2 text-center ${darkMode ? 'border-gray-700' : 'border-gray-100'} border-t`}>
                        <Link to="/admin/notifications" className={`text-xs ${darkMode ? 'text-amber-400' : 'text-amber-600'} font-medium`}>
                          Voir toutes les notifications
                        </Link>
                      </div>
                    </motion.div>}
                </AnimatePresence>
              </div>
              <div className="relative">
                <button className={`flex items-center space-x-2 p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                  <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white">
                    <User size={16} />
                  </div>
                  <span className={`hidden md:block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Admin
                  </span>
                </button>
              </div>
            </div>
          </div>
        </header>
        {/* Page Content */}
        <main className={`flex-1 overflow-y-auto ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} p-4`}>
          <Outlet />
        </main>
      </div>
    </div>;
};
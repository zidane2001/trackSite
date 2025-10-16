import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { PhoneIcon, MailIcon, MapPinIcon, Package, TruckIcon, DollarSignIcon, MenuIcon, XIcon, ChevronDownIcon, GlobeIcon, ClockIcon, ShieldIcon, ShipIcon, PlaneIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
export const UserLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme') as 'light' | 'dark') || 'light');
  const location = useLocation();
  const isActive = (path: string) => {
    return location.pathname === path ? 'text-amber-500 font-medium' : 'text-gray-700 hover:text-amber-500';
  };
  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  // Close mobile menu when location changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);
  return <div className="min-h-screen flex flex-col bg-gray-50">
    {/* Top Info Bar */}
    <div className="bg-neutral text-neutral-content py-2 px-4">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center text-sm">
        <div className="flex space-x-4 mb-2 sm:mb-0">
          <a href="tel:+33123456789" className="flex items-center hover:text-amber-300 transition-colors">
            <PhoneIcon size={14} className="mr-1" />
            +33 1 23 45 67 89
          </a>
          <a href="mailto:contact@colisselect.com" className="flex items-center hover:text-amber-300 transition-colors">
            <MailIcon size={14} className="mr-1" />
            contact@colisselect.com
          </a>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <MapPinIcon size={14} className="mr-1" />
            123 Rue de la Logistique, 75001 Paris, France
          </div>
          <div className="hidden md:flex items-center space-x-3 pl-4 border-l border-indigo-500">
            <GlobeIcon size={14} />
            <span className="hover:text-amber-300 cursor-pointer">FR</span>
            <span className="text-indigo-400">|</span>
            <span className="hover:text-amber-300 cursor-pointer">EN</span>
          </div>
        </div>
      </div>
    </div>
    {/* Header */}
    <motion.header className={`bg-base-100 ${scrolled ? 'shadow-md' : 'shadow-sm'} sticky top-0 z-30 transition-all duration-300`} initial={{
      y: -10,
      opacity: 0
    }} animate={{
      y: 0,
      opacity: 1
    }} transition={{
      duration: 0.3
    }}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center group">
            <div className="relative w-12 h-12 mr-3">
              <motion.div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg transform rotate-6 shadow-lg" whileHover={{
                rotate: 0,
                scale: 1.05
              }} transition={{
                type: 'spring',
                stiffness: 400,
                damping: 10
              }}></motion.div>
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">
                <span className="relative z-10">CS</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-800 group-hover:text-amber-500 transition-colors">
                ColisSelect
              </span>
              <span className="text-xs text-gray-500 -mt-1">
                Transport & Logistique
              </span>
            </div>
          </Link>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center">
            <div className="flex space-x-1">
              <Link to="/" className={`${isActive('/')} px-3 py-2 rounded-md transition-colors duration-200 relative group`}>
                <span>Accueil</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              {/* Services Dropdown */}
              <div className="relative group">
                <button className={`flex items-center px-3 py-2 rounded-md ${isActive('/services')} transition-colors duration-200 relative group`} onClick={() => setServicesOpen(!servicesOpen)}>
                  <span>Services</span>
                  <ChevronDownIcon size={16} className={`ml-1 transform transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`} />
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-500 transition-all duration-300 group-hover:w-full"></span>
                </button>
                <AnimatePresence>
                  {servicesOpen && <motion.div className="absolute top-full left-0 mt-1 w-64 rounded-md shadow-xl bg-white overflow-hidden z-50" initial={{
                    opacity: 0,
                    y: -10,
                    height: 0
                  }} animate={{
                    opacity: 1,
                    y: 0,
                    height: 'auto'
                  }} exit={{
                    opacity: 0,
                    y: -10,
                    height: 0
                  }} transition={{
                    duration: 0.2
                  }}>
                    <div className="py-1 divide-y divide-gray-100" role="menu" aria-orientation="vertical">
                      <div>
                        <Link to="/services/shipping" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors">
                          <div className="bg-amber-100 p-2 rounded-full mr-3">
                            <ShipIcon size={16} className="text-amber-600" />
                          </div>
                          <div>
                            <div className="font-medium">
                              Expédition Maritime
                            </div>
                            <div className="text-xs text-gray-500">
                              Solutions économiques internationales
                            </div>
                          </div>
                        </Link>
                      </div>
                      <div>
                        <Link to="/services/air" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors">
                          <div className="bg-blue-100 p-2 rounded-full mr-3">
                            <PlaneIcon size={16} className="text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium">Fret Aérien</div>
                            <div className="text-xs text-gray-500">
                              Livraisons rapides et prioritaires
                            </div>
                          </div>
                        </Link>
                      </div>
                      <div>
                        <Link to="/services/delivery" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors">
                          <div className="bg-green-100 p-2 rounded-full mr-3">
                            <TruckIcon size={16} className="text-green-600" />
                          </div>
                          <div>
                            <div className="font-medium">
                              Livraison Porte-à-Porte
                            </div>
                            <div className="text-xs text-gray-500">
                              Service complet de ramassage et livraison
                            </div>
                          </div>
                        </Link>
                      </div>
                      <div>
                        <Link to="/services/special" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors">
                          <div className="bg-purple-100 p-2 rounded-full mr-3">
                            <Package size={16} className="text-purple-600" />
                          </div>
                          <div>
                            <div className="font-medium">
                              Colis Spéciaux
                            </div>
                            <div className="text-xs text-gray-500">
                              Transport sécurisé d'objets fragiles ou
                              précieux
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </motion.div>}
                </AnimatePresence>
              </div>
              <Link to="/tracking" className={`${isActive('/tracking')} px-3 py-2 rounded-md transition-colors duration-200 relative group`}>
                <span>Tracking</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link to="/quote" className={`${isActive('/quote')} px-3 py-2 rounded-md transition-colors duration-200 relative group`}>
                <span>Devis</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link to="/contact" className={`${isActive('/contact')} px-3 py-2 rounded-md transition-colors duration-200 relative group`}>
                <span>Contact</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
            <div className="ml-6">
              <motion.div whileHover={{
                scale: 1.05
              }} whileTap={{
                scale: 0.95
              }}>
                <Link to="/quote" className="btn btn-primary">
                  <span className="relative">Demander un devis</span>
                </Link>
              </motion.div>
            </div>
          </nav>
          {/* Theme toggle + Mobile menu button */}
          <button className="btn btn-sm mr-2" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? 'Dark' : 'Light'}
          </button>
          <motion.button className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} whileTap={{
            scale: 0.9
          }}>
            {mobileMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
          </motion.button>
        </div>
        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && <motion.nav className="md:hidden mt-4 pb-4 space-y-2 border-t border-gray-100 pt-4" initial={{
            opacity: 0,
            height: 0
          }} animate={{
            opacity: 1,
            height: 'auto'
          }} exit={{
            opacity: 0,
            height: 0
          }} transition={{
            duration: 0.3
          }}>
            <Link to="/" className={`block px-4 py-2.5 rounded-md ${isActive('/')} transition-all duration-200 hover:bg-amber-50`}>
              Accueil
            </Link>
            {/* Mobile Services Dropdown */}
            <div className="relative">
              <button className={`flex items-center w-full px-4 py-2.5 rounded-md ${isActive('/services')} justify-between transition-all duration-200 hover:bg-amber-50`} onClick={e => {
                e.preventDefault();
                setServicesOpen(!servicesOpen);
              }}>
                <span>Services</span>
                <ChevronDownIcon size={16} className={`transform transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {servicesOpen && <motion.div className="mt-1 space-y-1 pl-4 border-l-2 border-amber-200 ml-4" initial={{
                  opacity: 0,
                  height: 0
                }} animate={{
                  opacity: 1,
                  height: 'auto'
                }} exit={{
                  opacity: 0,
                  height: 0
                }} transition={{
                  duration: 0.2
                }}>
                  <Link to="/services/shipping" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600 rounded-md transition-colors">
                    <ShipIcon size={16} className="mr-3 text-amber-500" />
                    Expédition Maritime
                  </Link>
                  <Link to="/services/air" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600 rounded-md transition-colors">
                    <PlaneIcon size={16} className="mr-3 text-blue-500" />
                    Fret Aérien
                  </Link>
                  <Link to="/services/delivery" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600 rounded-md transition-colors">
                    <TruckIcon size={16} className="mr-3 text-green-500" />
                    Livraison Porte-à-Porte
                  </Link>
                  <Link to="/services/special" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600 rounded-md transition-colors">
                    <Package size={16} className="mr-3 text-purple-500" />
                    Colis Spéciaux
                  </Link>
                </motion.div>}
              </AnimatePresence>
            </div>
            <Link to="/tracking" className={`block px-4 py-2.5 rounded-md ${isActive('/tracking')} transition-all duration-200 hover:bg-amber-50`}>
              Tracking
            </Link>
            <Link to="/quote" className={`block px-4 py-2.5 rounded-md ${isActive('/quote')} transition-all duration-200 hover:bg-amber-50`}>
              Devis
            </Link>
            <Link to="/contact" className={`block px-4 py-2.5 rounded-md ${isActive('/contact')} transition-all duration-200 hover:bg-amber-50`}>
              Contact
            </Link>
            <div className="pt-2 mt-2 border-t border-gray-100">
              <Link to="/quote" className="block w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium px-4 py-3 rounded-md text-center shadow-md">
                Demander un devis
              </Link>
            </div>
          </motion.nav>}
        </AnimatePresence>
      </div>
    </motion.header>
    {/* Main Content */}
    <motion.main className="flex-grow" initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} exit={{
      opacity: 0
    }} transition={{
      duration: 0.3
    }}>
      <Outlet />
    </motion.main>
    {/* Footer */}
    <footer className="bg-gradient-to-b from-gray-800 via-gray-900 to-black text-white pt-16 pb-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1581088382991-83c7f170de13?q=80&w=3270&auto=format&fit=crop')] bg-repeat bg-center"></div>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4">
            <motion.div className="flex items-center mb-6" initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.5
            }}>
              <div className="relative w-12 h-12 mr-3">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg transform rotate-6"></div>
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">
                  CS
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold">ColisSelect</span>
                <span className="text-xs text-gray-400">
                  Transport & Logistique
                </span>
              </div>
            </motion.div>
            <motion.p className="text-gray-400 mb-6 leading-relaxed" initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.5,
              delay: 0.1
            }}>
              Des solutions d'expédition fiables et économiques pour
              particuliers et entreprises. Notre expertise en logistique vous
              garantit des livraisons sécurisées partout dans le monde.
            </motion.p>
            <motion.div className="flex flex-col space-y-4 mb-8" initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.5,
              delay: 0.2
            }}>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                  <ClockIcon size={18} className="text-amber-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-300">
                    Heures d'ouverture
                  </div>
                  <div className="text-gray-400 text-sm">
                    Lun-Ven: 8h-19h | Sam: 9h-17h
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                  <ShieldIcon size={18} className="text-amber-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-300">
                    Sécurité & Fiabilité
                  </div>
                  <div className="text-gray-400 text-sm">
                    Expéditions assurées et garanties
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div className="flex space-x-4" initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.5,
              delay: 0.3
            }}>
              <motion.a href="#" className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 hover:bg-amber-500 hover:text-white transition-colors" whileHover={{
                scale: 1.1
              }} whileTap={{
                scale: 0.9
              }}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </motion.a>
              <motion.a href="#" className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 hover:bg-amber-500 hover:text-white transition-colors" whileHover={{
                scale: 1.1
              }} whileTap={{
                scale: 0.9
              }}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </motion.a>
              <motion.a href="#" className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 hover:bg-amber-500 hover:text-white transition-colors" whileHover={{
                scale: 1.1
              }} whileTap={{
                scale: 0.9
              }}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </motion.a>
              <motion.a href="#" className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 hover:bg-amber-500 hover:text-white transition-colors" whileHover={{
                scale: 1.1
              }} whileTap={{
                scale: 0.9
              }}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </motion.a>
            </motion.div>
          </div>
          <div className="md:col-span-2">
            <motion.div initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.5,
              delay: 0.3
            }}>
              <h3 className="text-lg font-semibold mb-4 relative inline-block">
                Nos Services
                <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-amber-500"></span>
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/services/shipping" className="text-gray-400 hover:text-amber-400 transition-colors flex items-center">
                    <span className="mr-2">→</span>
                    Expédition maritime
                  </Link>
                </li>
                <li>
                  <Link to="/services/air" className="text-gray-400 hover:text-amber-400 transition-colors flex items-center">
                    <span className="mr-2">→</span>
                    Fret aérien
                  </Link>
                </li>
                <li>
                  <Link to="/services/express" className="text-gray-400 hover:text-amber-400 transition-colors flex items-center">
                    <span className="mr-2">→</span>
                    Livraison express
                  </Link>
                </li>
                <li>
                  <Link to="/services/economy" className="text-gray-400 hover:text-amber-400 transition-colors flex items-center">
                    <span className="mr-2">→</span>
                    Livraison économique
                  </Link>
                </li>
                <li>
                  <Link to="/services/special" className="text-gray-400 hover:text-amber-400 transition-colors flex items-center">
                    <span className="mr-2">→</span>
                    Colis spéciaux
                  </Link>
                </li>
              </ul>
            </motion.div>
          </div>
          <div className="md:col-span-2">
            <motion.div initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.5,
              delay: 0.4
            }}>
              <h3 className="text-lg font-semibold mb-4 relative inline-block">
                Liens Rapides
                <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-amber-500"></span>
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/tracking" className="text-gray-400 hover:text-amber-400 transition-colors flex items-center">
                    <span className="mr-2">→</span>
                    Suivi de colis
                  </Link>
                </li>
                <li>
                  <Link to="/quote" className="text-gray-400 hover:text-amber-400 transition-colors flex items-center">
                    <span className="mr-2">→</span>
                    Demande de devis
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-400 hover:text-amber-400 transition-colors flex items-center">
                    <span className="mr-2">→</span>À propos de nous
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-gray-400 hover:text-amber-400 transition-colors flex items-center">
                    <span className="mr-2">→</span>
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-400 hover:text-amber-400 transition-colors flex items-center">
                    <span className="mr-2">→</span>
                    Contactez-nous
                  </Link>
                </li>
              </ul>
            </motion.div>
          </div>
          <div className="md:col-span-4">
            <motion.div initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.5,
              delay: 0.5
            }}>
              <h3 className="text-lg font-semibold mb-4 relative inline-block">
                Contact
                <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-amber-500"></span>
              </h3>
              <div className="bg-gray-800 rounded-lg p-5 shadow-inner">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                      <MapPinIcon size={18} className="text-amber-400" />
                    </div>
                    <span className="text-gray-300">
                      123 Rue de la Logistique
                      <br />
                      75001 Paris, France
                    </span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mr-3 flex-shrink-0">
                      <PhoneIcon size={18} className="text-amber-400" />
                    </div>
                    <a href="tel:+33123456789" className="text-gray-300 hover:text-amber-400 transition-colors">
                      +33 1 23 45 67 89
                    </a>
                  </li>
                  <li className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mr-3 flex-shrink-0">
                      <MailIcon size={18} className="text-amber-400" />
                    </div>
                    <a href="mailto:contact@colisselect.com" className="text-gray-300 hover:text-amber-400 transition-colors">
                      contact@colisselect.com
                    </a>
                  </li>
                </ul>
                <div className="mt-5 pt-5 border-t border-gray-700">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">
                    Newsletter
                  </h4>
                  <div className="join w-full">
                    <input type="email" placeholder="Votre email" className="input input-bordered join-item w-full" />
                    <button className="btn btn-primary join-item">S'abonner</button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <motion.div className="border-t border-gray-700 mt-10 pt-8 flex flex-col md:flex-row justify-between" initial={{
          opacity: 0
        }} whileInView={{
          opacity: 1
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.5,
          delay: 0.6
        }}>
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} ColisSelect. Tous droits
            réservés.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/privacy" className="text-gray-400 hover:text-amber-400 text-sm transition-colors">
              Politique de confidentialité
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-amber-400 text-sm transition-colors">
              Conditions d'utilisation
            </Link>
            <Link to="/cookies" className="text-gray-400 hover:text-amber-400 text-sm transition-colors">
              Gestion des cookies
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  </div>;
};
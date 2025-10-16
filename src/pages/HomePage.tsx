import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { TruckIcon, ShipIcon, PlaneIcon, SearchIcon, MapPinIcon, PackageIcon, DollarSignIcon, ClockIcon, CheckCircleIcon, ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon, StarIcon, BarChart4Icon, GlobeIcon, HeadphonesIcon, ShieldCheckIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const HomePage: React.FC = () => {
  const servicesRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [{
    id: 1,
    text: "Service exceptionnel ! Mon colis fragile est arrivé dans les délais et en parfait état malgré un trajet international. L'équipe de ColisSelect a été proactive et m'a tenu informé à chaque étape.",
    author: 'Marie Dupont',
    position: 'Directrice E-commerce',
    location: 'Paris, France',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    color: 'blue'
  }, {
    id: 2,
    text: "En tant que PME, nous avons besoin d'un service d'expédition fiable et économique. ColisSelect répond parfaitement à nos attentes avec des tarifs compétitifs et un service client exceptionnel.",
    author: 'Jean Martin',
    position: 'Gérant de boutique',
    location: 'Lyon, France',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    color: 'green'
  }, {
    id: 3,
    text: "J'apprécie particulièrement la transparence des prix et la possibilité de suivre mon colis en temps réel. ColisSelect a rendu l'expédition internationale simple et abordable pour mon entreprise.",
    author: 'Sophie Bernard',
    position: 'Artisan créateur',
    location: 'Marseille, France',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    color: 'purple'
  }];

  const nextTestimonial = () => {
    setCurrentTestimonial(prev => prev === testimonials.length - 1 ? 0 : prev + 1);
  };
  const prevTestimonial = () => {
    setCurrentTestimonial(prev => prev === 0 ? testimonials.length - 1 : prev - 1);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  return <div className="w-full min-h-screen bg-base-100 text-base-content">

    {/* Hero Section - ULTRA SOMBRE */}
    <section className="relative bg-base-100 text-base-content overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-base-200/98 dark:bg-base-200/99"></div>
        <img src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=3270&auto=format&fit=crop" alt="Logistics background" className="w-full h-[60vh] md:h-screen object-cover [filter:sepia(0.4)_hue-rotate(-25deg)_brightness(0.5)_contrast(1.1)]" />
        <motion.div className="absolute -top-32 -right-32 w-48 h-48 md:w-96 md:h-96 rounded-full bg-warning mix-blend-multiply opacity-30" animate={{
          x: [0, 10, 0],
          y: [0, 15, 0]
        }} transition={{
          repeat: Infinity,
          duration: 8,
          ease: 'easeInOut'
        }}></motion.div>
        <motion.div className="absolute top-64 -left-20 w-32 h-32 md:w-64 md:h-64 rounded-full bg-primary mix-blend-multiply opacity-30" animate={{
          x: [0, -20, 0],
          y: [0, 20, 0]
        }} transition={{
          repeat: Infinity,
          duration: 10,
          ease: 'easeInOut'
        }}></motion.div>
      </div>
      <div className="container mx-auto px-4 py-12 md:py-24 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <motion.div className="w-full lg:w-1/2 mb-8 lg:mb-0" initial={{
            opacity: 0,
            x: -50
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.8,
            ease: 'easeOut'
          }}>
            <div className="badge badge-warning badge-lg px-6 py-3 mb-6">
              Transport & Logistique de confiance
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Expédition de colis{' '}
              <span className="text-warning relative">
                rapide et fiable
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-warning opacity-50" viewBox="0 0 100 12" preserveAspectRatio="none">
                  <path d="M0,0 Q50,12 100,0" fill="currentColor" />
                </svg>
              </span>
            </h1>
            <p className="text-lg sm:text-xl mb-8 text-base-content/90 leading-relaxed">
              Des solutions d'expédition économiques pour particuliers et
              entreprises. Envoyez vos colis en toute sécurité partout en
              France et à l'international.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <motion.div whileHover={{
                scale: 1.05
              }} whileTap={{
                scale: 0.95
              }}>
                <Link to="/quote" className="btn btn-lg shadow-lg border-0 bg-gradient-to-r from-warning to-orange-600 hover:from-orange-500 hover:to-warning text-base font-bold px-8 py-4 transform hover:scale-105 transition-all duration-300">
                  <TruckIcon className="w-5 h-5 mr-2" />
                  Demander un devis
                </Link>
              </motion.div>
              <motion.div whileHover={{
                scale: 1.05
              }} whileTap={{
                scale: 0.95
              }}>
                <button onClick={() => scrollToSection(servicesRef)} className="btn btn-outline">
                  Découvrir nos services
                </button>
              </motion.div>
            </div>
          </motion.div>
          <motion.div className="w-full lg:w-1/2" initial={{
            opacity: 0,
            x: 50
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.8,
            ease: 'easeOut',
            delay: 0.2
          }}>
            <div className="bg-base-100 p-4 sm:p-6 rounded-lg shadow-2xl relative">
              <div className="absolute -top-4 -right-4 w-12 h-12 sm:w-20 sm:h-20">
                <div className="absolute top-0 right-0 w-full h-full bg-warning rounded-lg transform rotate-12"></div>
                <div className="absolute top-0 right-0 w-full h-full bg-primary rounded-lg flex items-center justify-center">
                  <SearchIcon className="h-6 w-6 sm:h-8 sm:w-8 text-base-100" />
                </div>
              </div>
              <h2 className="text-primary font-bold text-lg sm:text-xl mb-4">
                Suivre votre colis
              </h2>
              <div className="mb-4">
                <label htmlFor="tracking-number" className="block text-base-content/70 text-sm font-medium mb-2">
                  Numéro de suivi
                </label>
                <div className="relative">
                  <input type="text" id="tracking-number" className="input input-bordered w-full pr-10" placeholder="Ex: CS-12345678" />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <SearchIcon className="h-4 w-4 text-base-content/50" />
                  </div>
                </div>
              </div>
              <motion.button type="submit" className="btn btn-primary w-full" whileHover={{
                scale: 1.02
              }} whileTap={{
                scale: 0.98
              }} onClick={() => window.location.href = '/tracking'}>
                Suivre mon colis
              </motion.button>
              <div className="mt-4 flex items-center justify-center">
                <div className="text-xs text-base-content/60 flex items-center">
                  <ShieldCheckIcon size={14} className="mr-1 text-success" />
                  Suivi sécurisé en temps réel
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        <div className="mt-12 sm:mt-16 text-center">
          <p className="text-base-content/60 mb-6">Ils nous font confiance</p>
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 md:gap-16">
            <motion.img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png" alt="Google" className="h-6 sm:h-8 opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300" whileHover={{
              scale: 1.1
            }} />
            <motion.img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png" alt="Amazon" className="h-6 sm:h-8 opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300" whileHover={{
              scale: 1.1
            }} />
            <motion.img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png" alt="Netflix" className="h-5 sm:h-7 opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300" whileHover={{
              scale: 1.1
            }} />
            <motion.img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/1200px-Logo_NIKE.svg.png" alt="Nike" className="h-5 sm:h-6 opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300" whileHover={{
              scale: 1.1
            }} />
            <motion.img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Apple_logo_grey.svg/1724px-Apple_logo_grey.svg.png" alt="Apple" className="h-6 sm:h-8 opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300" whileHover={{
              scale: 1.1
            }} />
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
          <path fill="base-100" fillOpacity="1" d="M0,96L60,112C120,128,240,160,360,186.7C480,213,600,235,720,218.7C840,203,960,149,1080,138.7C1200,128,1320,160,1380,176L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
        </svg>
      </div>
    </section>

    {/* Features Section */}
    <section className="py-12 sm:py-16 bg-base-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <motion.div className="bg-base-100 rounded-xl shadow-lg p-6 border-t-4 border-warning" initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true,
            margin: '-100px'
          }} transition={{
            duration: 0.5
          }} whileHover={{
            y: -10
          }}>
            <div className="w-16 h-16 rounded-xl bg-warning/10 flex items-center justify-center mb-6">
              <GlobeIcon className="h-8 w-8 text-warning" />
            </div>
            <h3 className="text-xl font-bold text-base-content mb-3">
              Couverture mondiale
            </h3>
            <p className="text-base-content/60 mb-4">
              Expédiez vos colis partout dans le monde grâce à notre réseau
              logistique international couvrant plus de 200 pays.
            </p>
          </motion.div>
          <motion.div className="bg-base-100 rounded-xl shadow-lg p-6 border-t-4 border-primary" initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true,
            margin: '-100px'
          }} transition={{
            duration: 0.5,
            delay: 0.2
          }} whileHover={{
            y: -10
          }}>
            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
              <BarChart4Icon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-base-content mb-3">
              Tarifs compétitifs
            </h3>
            <p className="text-base-content/60 mb-4">
              Bénéficiez des meilleurs prix du marché grâce à notre système de
              comparaison instantanée entre transporteurs.
            </p>
          </motion.div>
          <motion.div className="bg-base-100 rounded-xl shadow-lg p-6 border-t-4 border-success" initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true,
            margin: '-100px'
          }} transition={{
            duration: 0.5,
            delay: 0.4
          }} whileHover={{
            y: -10
          }}>
            <div className="w-16 h-16 rounded-xl bg-success/10 flex items-center justify-center mb-6">
              <HeadphonesIcon className="h-8 w-8 text-success" />
            </div>
            <h3 className="text-xl font-bold text-base-content mb-3">
              Support 24/7
            </h3>
            <p className="text-base-content/60 mb-4">
              Notre équipe de support client est disponible 24h/24 et 7j/7
              pour répondre à toutes vos questions et résoudre vos problèmes.
            </p>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Services Section */}
    <section className="py-16 sm:py-20 bg-base-100" ref={servicesRef}>
      <div className="container mx-auto px-4">
        <motion.div className="text-center mb-12 sm:mb-16" initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true,
          margin: '-100px'
        }} transition={{
          duration: 0.6
        }}>
          <div className="inline-block badge badge-warning text-sm px-3 py-1 mb-3">
            Nos Solutions
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-base-content mb-4">
            Services d'Expédition Premium
          </h2>
          <div className="w-24 h-1 bg-warning mx-auto mb-6"></div>
          <p className="text-base-content/60 max-w-2xl mx-auto text-lg">
            Découvrez nos différentes solutions d'expédition adaptées à tous
            vos besoins, que ce soit par voie maritime, aérienne ou terrestre.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <motion.div className="group relative overflow-hidden rounded-xl shadow-lg h-64" initial={{
            opacity: 0,
            y: 50
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true,
            margin: '-100px'
          }} transition={{
            duration: 0.5,
            delay: 0.1
          }} whileHover={{
            y: -10
          }}>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-warning/95 z-10 opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
            <img src="https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?q=80&w=3270&auto=format&fit=crop" alt="Shipping service" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 [filter:sepia(0.4)_hue-rotate(-25deg)_brightness(0.6)_contrast(1.1)]" />
            <div className="absolute inset-0 z-20 flex flex-col justify-end p-4 sm:p-6 text-base-100">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-warning flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300">
                <ShipIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 group-hover:translate-x-2 transition-transform duration-300">
                Expédition Maritime
              </h3>
              <p className="text-base-100/90 mb-4 text-sm group-hover:translate-x-2 transition-transform duration-300 delay-100">
                Solution économique pour les envois volumineux sans contrainte
                de temps.
              </p>
              <Link to="/services/shipping" className="inline-flex items-center text-warning/90 font-medium group-hover:translate-x-2 transition-transform duration-300 delay-150">
                <span>En savoir plus</span>
                <ArrowRightIcon size={14} className="ml-2 transform group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </motion.div>
          <motion.div className="group relative overflow-hidden rounded-xl shadow-lg h-64" initial={{
            opacity: 0,
            y: 50
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true,
            margin: '-100px'
          }} transition={{
            duration: 0.5,
            delay: 0.2
          }} whileHover={{
            y: -10
          }}>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/95 z-10 opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
            <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=3174&auto=format&fit=crop" alt="Air freight service" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 [filter:sepia(0.4)_hue-rotate(-25deg)_brightness(0.6)_contrast(1.1)]" />
            <div className="absolute inset-0 z-20 flex flex-col justify-end p-4 sm:p-6 text-base-100">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300">
                <PlaneIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 group-hover:translate-x-2 transition-transform duration-300">
                Fret Aérien
              </h3>
              <p className="text-base-100/90 mb-4 text-sm group-hover:translate-x-2 transition-transform duration-300 delay-100">
                Livraison rapide pour les envois urgents et documents
                importants.
              </p>
              <Link to="/services/air" className="inline-flex items-center text-primary/90 font-medium group-hover:translate-x-2 transition-transform duration-300 delay-150">
                <span>En savoir plus</span>
                <ArrowRightIcon size={14} className="ml-2 transform group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </motion.div>
          <motion.div className="group relative overflow-hidden rounded-xl shadow-lg h-64" initial={{
            opacity: 0,
            y: 50
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true,
            margin: '-100px'
          }} transition={{
            duration: 0.5,
            delay: 0.3
          }} whileHover={{
            y: -10
          }}>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-success/95 z-10 opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
            <img src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=3270&auto=format&fit=crop" alt="Door to door delivery" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 [filter:sepia(0.4)_hue-rotate(-25deg)_brightness(0.6)_contrast(1.1)]" />
            <div className="absolute inset-0 z-20 flex flex-col justify-end p-4 sm:p-6 text-base-100">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-success flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300">
                <TruckIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 group-hover:translate-x-2 transition-transform duration-300">
                Livraison Porte-à-Porte
              </h3>
              <p className="text-base-100/90 mb-4 text-sm group-hover:translate-x-2 transition-transform duration-300 delay-100">
                Service complet de ramassage et livraison à domicile.
              </p>
              <Link to="/services/delivery" className="inline-flex items-center text-success/90 font-medium group-hover:translate-x-2 transition-transform duration-300 delay-150">
                <span>En savoir plus</span>
                <ArrowRightIcon size={14} className="ml-2 transform group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </motion.div>
          <motion.div className="group relative overflow-hidden rounded-xl shadow-lg h-64" initial={{
            opacity: 0,
            y: 50
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true,
            margin: '-100px'
          }} transition={{
            duration: 0.5,
            delay: 0.4
          }} whileHover={{
            y: -10
          }}>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-secondary/95 z-10 opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
            <img src="https://images.unsplash.com/photo-1624704765325-fd4868c9702e?q=80&w=3270&auto=format&fit=crop" alt="Special packages" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 [filter:sepia(0.4)_hue-rotate(-25deg)_brightness(0.6)_contrast(1.1)]" />
            <div className="absolute inset-0 z-20 flex flex-col justify-end p-4 sm:p-6 text-base-100">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-secondary flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300">
                <PackageIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 group-hover:translate-x-2 transition-transform duration-300">
                Colis Spéciaux
              </h3>
              <p className="text-base-100/90 mb-4 text-sm group-hover:translate-x-2 transition-transform duration-300 delay-100">
                Transport sécurisé d'objets fragiles, précieux ou hors-normes.
              </p>
              <Link to="/services/special" className="inline-flex items-center text-secondary/90 font-medium group-hover:translate-x-2 transition-transform duration-300 delay-150">
                <span>En savoir plus</span>
                <ArrowRightIcon size={14} className="ml-2 transform group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* How It Works */}
    <section className="py-16 sm:py-20 bg-base-200 relative overflow-hidden" ref={howItWorksRef}>
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-warning/5 rounded-bl-full"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-primary/5 rounded-tr-full"></div>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div className="text-center mb-12 sm:mb-16" initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true,
          margin: '-100px'
        }} transition={{
          duration: 0.6
        }}>
          <div className="inline-block badge badge-primary text-sm px-3 py-1 mb-3">
            Processus Simple
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-base-content mb-4">
            Comment ça marche
          </h2>
          <div className="w-24 h-1 bg-warning mx-auto mb-6"></div>
          <p className="text-base-content/60 max-w-2xl mx-auto text-lg">
            Expédier un colis avec ColisSelect est simple et rapide. Suivez
            ces étapes pour envoyer votre colis en toute sécurité.
          </p>
        </motion.div>
        <div className="relative">
          <div className="hidden xl:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-warning/20 via-primary/20 to-warning/20 z-0 transform -translate-y-1/2"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <motion.div className="bg-base-100 rounded-xl shadow-lg p-6 sm:p-8 text-center relative z-10" initial={{
              opacity: 0,
              y: 50
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true,
              margin: '-100px'
            }} transition={{
              duration: 0.5,
              delay: 0.1
            }} whileHover={{
              y: -10,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}>
              <div className="relative mx-auto mb-8">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-warning/10 flex items-center justify-center mx-auto relative">
                  <DollarSignIcon className="h-8 w-8 sm:h-10 sm:w-10 text-warning" />
                </div>
                <div className="absolute -top-4 -right-4 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-warning text-base-100 flex items-center justify-center font-bold text-lg sm:text-xl shadow-lg">
                  1
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-base-content mb-4">
                Demandez un devis
              </h3>
              <p className="text-base-content/60">
                Remplissez notre formulaire en ligne pour obtenir un devis
                instantané basé sur votre envoi.
              </p>
            </motion.div>
            <motion.div className="bg-base-100 rounded-xl shadow-lg p-6 sm:p-8 text-center relative z-10" initial={{
              opacity: 0,
              y: 50
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true,
              margin: '-100px'
            }} transition={{
              duration: 0.5,
              delay: 0.3
            }} whileHover={{
              y: -10,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}>
              <div className="relative mx-auto mb-8">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto relative">
                  <PackageIcon className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                </div>
                <div className="absolute -top-4 -right-4 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary text-base-100 flex items-center justify-center font-bold text-lg sm:text-xl shadow-lg">
                  2
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-base-content mb-4">
                Préparez votre colis
              </h3>
              <p className="text-base-content/60">
                Emballez soigneusement votre colis et préparez les documents
                nécessaires à l'expédition.
              </p>
            </motion.div>
            <motion.div className="bg-base-100 rounded-xl shadow-lg p-6 sm:p-8 text-center relative z-10" initial={{
              opacity: 0,
              y: 50
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true,
              margin: '-100px'
            }} transition={{
              duration: 0.5,
              delay: 0.5
            }} whileHover={{
              y: -10,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}>
              <div className="relative mx-auto mb-8">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-success/10 flex items-center justify-center mx-auto relative">
                  <MapPinIcon className="h-8 w-8 sm:h-10 sm:w-10 text-success" />
                </div>
                <div className="absolute -top-4 -right-4 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-success text-base-100 flex items-center justify-center font-bold text-lg sm:text-xl shadow-lg">
                  3
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-base-content mb-4">
                Collecte ou dépôt
              </h3>
              <p className="text-base-content/60">
                Choisissez entre la collecte à domicile ou le dépôt dans l'un
                de nos points relais.
              </p>
            </motion.div>
            <motion.div className="bg-base-100 dark:bg-base-100/80 rounded-xl shadow-lg p-6 sm:p-8 text-center relative z-10" initial={{
              opacity: 0,
              y: 50
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true,
              margin: '-100px'
            }} transition={{
              duration: 0.5,
              delay: 0.7
            }} whileHover={{
              y: -10,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}>
              <div className="relative mx-auto mb-8">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-secondary/10 flex items-center justify-center mx-auto relative">
                  <ClockIcon className="h-8 w-8 sm:h-10 sm:w-10 text-secondary" />
                </div>
                <div className="absolute -top-4 -right-4 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-secondary text-base-100 flex items-center justify-center font-bold text-lg sm:text-xl shadow-lg">
                  4
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-base-content mb-4">
                Suivez votre envoi
              </h3>
              <p className="text-base-content/60">
                Recevez un numéro de suivi pour surveiller l'avancement de
                votre colis en temps réel.
              </p>
            </motion.div>
          </div>
        </div>
        <motion.div className="text-center mt-12 sm:mt-16" initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true,
          margin: '-100px'
        }} transition={{
          duration: 0.6,
          delay: 0.8
        }}>
          <motion.div whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }}>
            <Link to="/quote" className="btn btn-primary btn-lg px-8 py-4">
              Commencer maintenant
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>

    {/* Testimonials */}
    <section className="py-16 sm:py-20 bg-base-100" ref={testimonialsRef}>
      <div className="container mx-auto px-4">
        <motion.div className="text-center mb-12 sm:mb-16" initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true,
          margin: '-100px'
        }} transition={{
          duration: 0.6
        }}>
          <div className="inline-block badge badge-success text-sm px-3 py-1 mb-3">
            Témoignages
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-base-content mb-4">
            Ce que disent nos clients
          </h2>
          <div className="w-24 h-1 bg-warning mx-auto mb-6"></div>
          <p className="text-base-content/60 max-w-2xl mx-auto text-lg">
            Découvrez les témoignages de nos clients satisfaits qui font
            confiance à ColisSelect pour leurs besoins d'expédition.
          </p>
        </motion.div>
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="flex justify-between absolute top-1/2 left-0 right-0 transform -translate-y-1/2 z-20 px-4">
              <motion.button onClick={prevTestimonial} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-base-100 shadow-lg flex items-center justify-center text-base-content/70 hover:text-warning focus:outline-none" whileHover={{
                scale: 1.1
              }} whileTap={{
                scale: 0.9
              }}>
                <ChevronLeftIcon size={20} />
              </motion.button>
              <motion.button onClick={nextTestimonial} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-base-100 shadow-lg flex items-center justify-center text-base-content/70 hover:text-warning focus:outline-none" whileHover={{
                scale: 1.1
              }} whileTap={{
                scale: 0.9
              }}>
                <ChevronRightIcon size={20} />
              </motion.button>
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={currentTestimonial} initial={{
                opacity: 0,
                x: 100
              }} animate={{
                opacity: 1,
                x: 0
              }} exit={{
                opacity: 0,
                x: -100
              }} transition={{
                duration: 0.5
              }} className="bg-base-100 dark:bg-base-100/80 rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 relative">
                <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-12 h-12 sm:w-16 sm:h-16">
                  <div className="absolute inset-0 bg-warning rounded-xl transform rotate-6"></div>
                  <div className="absolute inset-0 bg-primary rounded-xl flex items-center justify-center text-base-100">
                    <svg width="20" height="20" className="sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.59003 15.9L4.81003 11.12L9.59003 6.34L8.17003 4.93L2.00003 11.1L8.17003 17.27L9.59003 15.9ZM14.41 15.9L19.19 11.12L14.41 6.34L15.83 4.93L22 11.1L15.83 17.27L14.41 15.9Z" fill="currentColor" />
                    </svg>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-6 sm:gap-8">
                  <div className="md:w-1/3 flex flex-col items-center text-center">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-4 border-4 border-base-100 shadow-lg">
                      <img src={testimonials[currentTestimonial].image} alt={testimonials[currentTestimonial].author} className="w-full h-full object-cover" />
                    </div>
                    <h4 className="font-bold text-base-content text-base sm:text-lg">
                      {testimonials[currentTestimonial].author}
                    </h4>
                    <p className="text-base-content/60 text-sm">
                      {testimonials[currentTestimonial].position}
                    </p>
                    <p className="text-base-content/60 text-sm">
                      {testimonials[currentTestimonial].location}
                    </p>
                    <div className="flex items-center mt-3">
                      {[...Array(5)].map((_, i) => <StarIcon key={i} size={14} className="text-warning fill-current" />)}
                    </div>
                  </div>
                  <div className="md:w-2/3">
                    <svg className="h-10 w-10 sm:h-12 sm:w-12 text-primary/10 mb-4" fill="currentColor" viewBox="0 0 32 32">
                      <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                    </svg>
                    <p className="text-base-content text-base sm:text-lg leading-relaxed mb-6">
                      {testimonials[currentTestimonial].text}
                    </p>
                    <div className="flex justify-center md:justify-start">
                      {testimonials.map((_, index) => <button key={index} onClick={() => setCurrentTestimonial(index)} className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full mx-1 ${index === currentTestimonial ? 'bg-warning' : 'bg-base-content/20'}`} aria-label={`Voir témoignage ${index + 1}`} />)}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>

    {/* CTA Section - ULTRA SOMBRE */}
    <section className="py-16 sm:py-20 relative overflow-hidden">
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?q=80&w=3000&auto=format&fit=crop" alt="Logistics background" className="w-full h-full object-cover opacity-30 [filter:sepia(0.3)_hue-rotate(-15deg)_brightness(0.5)_contrast(1.1)]" />
        <div className="absolute inset-0 bg-primary/98 dark:bg-primary/99"></div>
        <motion.div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-warning mix-blend-multiply opacity-20" animate={{
          x: [0, 10, 0],
          y: [0, 15, 0]
        }} transition={{
          repeat: Infinity,
          duration: 8,
          ease: 'easeInOut'
        }}></motion.div>
        <motion.div className="absolute bottom-0 left-0 w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-primary/30 mix-blend-multiply opacity-20" animate={{
          x: [0, -20, 0],
          y: [0, 20, 0]
        }} transition={{
          repeat: Infinity,
          duration: 10,
          ease: 'easeInOut'
        }}></motion.div>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6
          }}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-base-100">
              Prêt à expédier votre colis ?
            </h2>
            <p className="text-lg sm:text-xl text-base-100/95 mb-8 sm:mb-10">
              Obtenez un devis instantané et commencez votre expédition dès
              aujourd'hui avec ColisSelect.
            </p>
            <div className="bg-base-100/15 dark:bg-base-100/10 backdrop-blur-sm rounded-xl p-6 sm:p-8 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex flex-col">
                  <label className="text-sm mb-2 text-base-100/95">
                    Pays d'origine
                  </label>
                  <select className="select select-bordered bg-base-100/25 dark:bg-base-100/15 text-base-100 border-base-100/40 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-warning w-full">
                    <option value="france">France</option>
                    <option value="germany">Allemagne</option>
                    <option value="spain">Espagne</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-sm mb-2 text-base-100/95">
                    Pays de destination
                  </label>
                  <select className="select select-bordered bg-base-100/25 dark:bg-base-100/15 text-base-100 border-base-100/40 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-warning w-full">
                    <option value="usa">États-Unis</option>
                    <option value="uk">Royaume-Uni</option>
                    <option value="canada">Canada</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-sm mb-2 text-base-100/95">
                    Poids (kg)
                  </label>
                  <input type="number" placeholder="Ex: 5" className="input input-bordered bg-base-100/25 dark:bg-base-100/15 text-base-100 border-base-100/40 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-warning w-full" />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <motion.div whileHover={{
                  scale: 1.05
                }} whileTap={{
                  scale: 0.95
                }}>
                  <Link to="/quote" className="btn btn-warning w-full sm:w-auto">
                    Obtenir un devis
                  </Link>
                </motion.div>
                <motion.div whileHover={{
                  scale: 1.05
                }} whileTap={{
                  scale: 0.95
                }}>
                  <Link to="/contact" className="btn btn-ghost border-2 border-base-100 w-full sm:w-auto">
                    Contactez-nous
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Trust Indicators */}
    <section className="py-12 sm:py-16 bg-base-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <motion.div className="text-center" initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.4,
            delay: 0.1
          }} whileHover={{
            y: -5
          }}>
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-4">
              <div className="text-2xl sm:text-4xl font-bold text-warning">15+</div>
            </div>
            <div className="font-semibold text-base-content mb-1">
              Années d'expérience
            </div>
            <p className="text-base-content/60 text-sm">
              Expertise logistique confirmée
            </p>
          </motion.div>
          <motion.div className="text-center" initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.4,
            delay: 0.2
          }} whileHover={{
            y: -5
          }}>
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <div className="text-2xl sm:text-4xl font-bold text-primary">50k+</div>
            </div>
            <div className="font-semibold text-base-content mb-1">
              Colis livrés
            </div>
            <p className="text-base-content/60 text-sm">Chaque mois dans le monde</p>
          </motion.div>
          <motion.div className="text-center" initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.4,
            delay: 0.3
          }} whileHover={{
            y: -5
          }}>
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <div className="text-2xl sm:text-4xl font-bold text-success">200+</div>
            </div>
            <div className="font-semibold text-base-content mb-1">
              Destinations
            </div>
            <p className="text-base-content/60 text-sm">Couverture mondiale</p>
          </motion.div>
          <motion.div className="text-center" initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.4,
            delay: 0.4
          }} whileHover={{
            y: -5
          }}>
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
              <div className="text-2xl sm:text-4xl font-bold text-secondary">99%</div>
            </div>
            <div className="font-semibold text-base-content mb-1">
              Clients satisfaits
            </div>
            <p className="text-base-content/60 text-sm">Service client premium</p>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Partners Logos */}
    <section className="py-12 sm:py-16 bg-base-100 border-t border-base-200">
      <div className="container mx-auto px-4">
        <motion.div className="text-center mb-8 sm:mb-12" initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }}>
          <h3 className="text-xl sm:text-2xl font-bold text-base-content mb-2">
            Nos Partenaires de Confiance
          </h3>
          <p className="text-base-content/60">
            Nous collaborons avec les meilleurs transporteurs mondiaux pour
            vous offrir un service optimal
          </p>
        </motion.div>
        <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 md:gap-16">
          <motion.img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/DHL_201x_logo.svg/2560px-DHL_201x_logo.svg.png" alt="DHL" className="h-8 sm:h-10 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300" whileHover={{
            scale: 1.1
          }} />
          <motion.img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/FedEx_Ground_Logo.svg/2560px-FedEx_Ground_Logo.svg.png" alt="FedEx" className="h-8 sm:h-10 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300" whileHover={{
            scale: 1.1
          }} />
          <motion.img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/United_Parcel_Service_logo_2014.svg/2560px-United_Parcel_Service_logo_2014.svg.png" alt="UPS" className="h-8 sm:h-10 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300" whileHover={{
            scale: 1.1
          }} />
          <motion.img src="https://www.laposte.fr/themes/custom/colissimo/images/logo.svg" alt="Colissimo" className="h-8 sm:h-10 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300" whileHover={{
            scale: 1.1
          }} />
          <motion.img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/TNT_Express_Logo.svg/2560px-TNT_Express_Logo.svg.png" alt="TNT" className="h-8 sm:h-10 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300" whileHover={{
            scale: 1.1
          }} />
        </div>
      </div>
    </section>
  </div>;
};
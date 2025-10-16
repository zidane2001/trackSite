import React, { useState } from 'react'
import {
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  ClockIcon,
  SendIcon,
} from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
// Fix for default marker icon in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
})
interface FormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}
export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitSuccess(true)
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      })
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false)
      }, 5000)
    }, 1500)
  }
  return (
    <div className="w-full bg-gray-50">
      <div className="bg-primary text-primary-content py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Contactez-nous
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Nous sommes là pour répondre à toutes vos questions. N'hésitez pas à
            nous contacter.
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Nos coordonnées
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4 mt-1">
                      <MapPinIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">Adresse</h3>
                      <p className="text-gray-600 mt-1">
                        123 Rue de la Logistique
                        <br />
                        75001 Paris, France
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4 mt-1">
                      <PhoneIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">Téléphone</h3>
                      <p className="text-gray-600 mt-1">
                        <a
                          href="tel:+33123456789"
                          className="hover:text-blue-600"
                        >
                          +33 1 23 45 67 89
                        </a>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4 mt-1">
                      <MailIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">Email</h3>
                      <p className="text-gray-600 mt-1">
                        <a
                          href="mailto:contact@colisselect.com"
                          className="hover:text-blue-600"
                        >
                          contact@colisselect.com
                        </a>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4 mt-1">
                      <ClockIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">
                        Heures d'ouverture
                      </h3>
                      <p className="text-gray-600 mt-1">
                        Lundi - Vendredi: 8h30 - 18h00
                        <br />
                        Samedi: 9h00 - 12h00
                        <br />
                        Dimanche: Fermé
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md overflow-hidden h-[300px]">
                <MapContainer
                  center={[48.8566, 2.3522]}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={[48.8566, 2.3522]}>
                    <Popup>
                      ColisSelect
                      <br />
                      123 Rue de la Logistique
                      <br />
                      75001 Paris, France
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Envoyez-nous un message
              </h2>
              {submitSuccess ? (
                <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-green-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">
                        Message envoyé avec succès
                      </h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>
                          Merci de nous avoir contactés. Nous vous répondrons
                          dans les plus brefs délais.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="form-control">
                      <label
                        htmlFor="name"
                        className="block text-gray-700 text-sm font-medium mb-2 label-text"
                      >
                        Nom complet <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="input input-bordered input-primary w-full"
                        placeholder="Votre nom"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-control">
                      <label
                        htmlFor="email"
                        className="block text-gray-700 text-sm font-medium mb-2 label-text"
                      >
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="input input-bordered input-primary w-full"
                        placeholder="votre.email@exemple.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="form-control">
                      <label
                        htmlFor="phone"
                        className="block text-gray-700 text-sm font-medium mb-2 label-text"
                      >
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="input input-bordered input-primary w-full"
                        placeholder="Votre numéro de téléphone"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-control">
                      <label
                        htmlFor="subject"
                        className="block text-gray-700 text-sm font-medium mb-2 label-text"
                      >
                        Sujet <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        className="select select-bordered select-primary w-full"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Sélectionnez un sujet</option>
                        <option value="quote">Demande de devis</option>
                        <option value="tracking">Suivi de colis</option>
                        <option value="complaint">Réclamation</option>
                        <option value="info">Demande d'information</option>
                        <option value="other">Autre</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-6 form-control">
                    <label
                      htmlFor="message"
                      className="block text-gray-700 text-sm font-medium mb-2 label-text"
                    >
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      className="textarea textarea-bordered textarea-primary w-full"
                      placeholder="Votre message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>
                  {submitError && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-red-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">
                            Une erreur est survenue
                          </h3>
                          <div className="mt-2 text-sm text-red-700">
                            <p>{submitError}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <button
                    type="submit"
                    className={`btn btn-primary w-full ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <SendIcon size={18} className="mr-2" />
                        Envoyer le message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* FAQ Section */}
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Questions fréquentes
              </h2>
              <p className="text-gray-600">
                Consultez nos réponses aux questions les plus fréquemment posées
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="divide-y divide-gray-200">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    Comment puis-je suivre mon colis ?
                  </h3>
                  <p className="text-gray-600">
                    Vous pouvez suivre votre colis en utilisant le numéro de
                    suivi qui vous a été fourni lors de l'expédition.
                    Rendez-vous sur notre page de suivi et entrez ce numéro pour
                    voir l'état actuel de votre envoi.
                  </p>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    Quels sont vos délais de livraison ?
                  </h3>
                  <p className="text-gray-600">
                    Nos délais de livraison varient en fonction du service
                    choisi et de la destination. En général, les livraisons
                    nationales prennent 1 à 3 jours ouvrables, tandis que les
                    livraisons internationales peuvent prendre de 3 à 10 jours
                    ouvrables.
                  </p>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    Comment puis-je obtenir un devis pour mon envoi ?
                  </h3>
                  <p className="text-gray-600">
                    Vous pouvez obtenir un devis instantané en utilisant notre
                    calculateur de tarifs en ligne. Il vous suffit de fournir
                    les détails de votre envoi, notamment l'origine, la
                    destination, le poids et les dimensions du colis.
                  </p>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    Que faire en cas de colis endommagé ou perdu ?
                  </h3>
                  <p className="text-gray-600">
                    Si votre colis est endommagé ou perdu, veuillez nous
                    contacter dès que possible. Nous vous demanderons de fournir
                    le numéro de suivi et des détails sur le problème. Notre
                    équipe de service client traitera votre réclamation dans les
                    plus brefs délais.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


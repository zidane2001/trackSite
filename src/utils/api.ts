// API client for backend communication
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-deployed-backend-url.com' // Replace with your actual deployed backend URL
  : 'http://localhost:3003';
export const BACKEND_PORT = 3003;
export interface Location {
  id: number;
  name: string;
  slug: string;
  country: string;
}

export interface Zone {
  id: number;
  name: string;
  slug: string;
  locations: string;
  description: string;
}

export interface ShippingRate {
  id: number;
  name: string;
  type: 'flat' | 'weight';
  min_weight: number;
  max_weight: number;
  rate: number;
  insurance: number;
  description: string;
}

export interface PickupRate {
  id: number;
  zone: string;
  min_weight: number;
  max_weight: number;
  rate: number;
  description: string;
}

export interface Shipment {
  id: number;
  tracking_number: string;
  shipper_name: string;
  shipper_address: string;
  shipper_phone: string;
  shipper_email: string;
  receiver_name: string;
  receiver_address: string;
  receiver_phone: string;
  receiver_email: string;
  origin: string;
  destination: string;
  status: 'processing' | 'picked_up' | 'in_transit' | 'delivered' | 'delayed';
  packages: number;
  total_weight: number;
  product?: string;
  quantity?: number;
  payment_mode?: string;
  total_freight?: number;
  expected_delivery?: string;
  departure_time?: string;
  pickup_date?: string;
  pickup_time?: string;
  comments?: string;
  date_created: string;
}

export interface TrackingHistory {
  date_time: string;
  location: string;
  status: string;
  description: string;
  latitude?: number;
  longitude?: number;
}

export interface TrackingResult {
  shipment: Shipment;
  history: TrackingHistory[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'agent';
  branch: string;
  status: 'active' | 'inactive';
  last_login?: string;
  created_at: string;
}

// Generic API functions
async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Locations API
export const locationsApi = {
  getAll: () => apiRequest<Location[]>('/locations'),
  create: (data: Omit<Location, 'id'>) => apiRequest<Location>('/locations', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: Partial<Location>) => apiRequest<{ message: string }>(`/locations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiRequest<{ message: string }>(`/locations/${id}`, {
    method: 'DELETE',
  }),
};

// Zones API
export const zonesApi = {
  getAll: () => apiRequest<Zone[]>('/zones'),
  create: (data: Omit<Zone, 'id'>) => apiRequest<Zone>('/zones', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: Partial<Zone>) => apiRequest<{ message: string }>(`/zones/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiRequest<{ message: string }>(`/zones/${id}`, {
    method: 'DELETE',
  }),
};

// Shipping Rates API
export const shippingRatesApi = {
  getAll: () => apiRequest<ShippingRate[]>('/shipping-rates'),
  create: (data: Omit<ShippingRate, 'id'>) => apiRequest<ShippingRate>('/shipping-rates', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: Partial<ShippingRate>) => apiRequest<{ message: string }>(`/shipping-rates/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiRequest<{ message: string }>(`/shipping-rates/${id}`, {
    method: 'DELETE',
  }),
};

// Pickup Rates API
export const pickupRatesApi = {
  getAll: () => apiRequest<PickupRate[]>('/pickup-rates'),
  create: (data: Omit<PickupRate, 'id'>) => apiRequest<PickupRate>('/pickup-rates', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: Partial<PickupRate>) => apiRequest<{ message: string }>(`/pickup-rates/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiRequest<{ message: string }>(`/pickup-rates/${id}`, {
    method: 'DELETE',
  }),
};

// Shipments API
export const shipmentsApi = {
  getAll: (status?: string) => {
    const query = status && status !== 'all' ? `?status=${status}` : '';
    return apiRequest<Shipment[]>(`/shipments${query}`);
  },
  create: (data: Omit<Shipment, 'id'>) => apiRequest<Shipment>('/shipments', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: Partial<Shipment>) => apiRequest<{ message: string }>(`/shipments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiRequest<{ message: string }>(`/shipments/${id}`, {
    method: 'DELETE',
  }),
};

// Users API
export const usersApi = {
  getAll: () => apiRequest<User[]>('/users'),
  create: (data: Omit<User, 'id'>) => apiRequest<User>('/users', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: Partial<User>) => apiRequest<{ message: string }>(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiRequest<{ message: string }>(`/users/${id}`, {
    method: 'DELETE',
  }),
};

// Tracking API
export const trackingApi = {
  track: async (trackingNumber: string): Promise<TrackingResult> => {
    const response = await fetch(`${API_BASE_URL}/api/track/${trackingNumber}`); // ✅ FIXÉ : 3003 via config
    if (!response.ok) throw new Error('Colis non trouvé');
    return response.json();
  }
};
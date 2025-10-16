// Simple typed localStorage helpers with safe JSON parsing
export function loadFromStorage<T>(key: string, fallback: T): T {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return fallback;
        return JSON.parse(raw) as T;
    } catch {
        return fallback;
    }
}

export function saveToStorage<T>(key: string, value: T): void {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // ignore storage errors (quota/availability)
    }
}

export function removeFromStorage(key: string): void {
    try {
        localStorage.removeItem(key);
    } catch {
        // ignore
    }
}

export const STORAGE_KEYS = {
    locations: 'cs_admin_locations',
    zones: 'cs_admin_zones',
    shippingRates: 'cs_admin_shipping_rates',
    pickupRates: 'cs_admin_pickup_rates',
    shipments: 'cs_admin_shipments',
    users: 'cs_admin_users',
    customFields: 'cs_admin_custom_fields',
    generalSettings: 'cs_admin_general_settings',
    mapSettings: 'cs_admin_map_settings'
} as const;



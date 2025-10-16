import React, { useEffect, useRef } from 'react';

interface Props {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

declare global {
    interface Window {
        google?: any;
    }
}

function loadGoogleMaps(apiKey: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (window.google && window.google.maps && window.google.maps.places) {
            resolve();
            return;
        }
        const existing = document.getElementById('google-maps-sdk');
        if (existing) {
            existing.addEventListener('load', () => resolve());
            existing.addEventListener('error', () => reject(new Error('Google Maps failed to load')));
            return;
        }
        const params = new URLSearchParams({ key: apiKey, libraries: 'places' });
        const script = document.createElement('script');
        script.id = 'google-maps-sdk';
        script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Google Maps failed to load'));
        document.head.appendChild(script);
    });
}

export const AddressAutocomplete: React.FC<Props> = ({ value, onChange, placeholder }) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    useEffect(() => {
        const raw = localStorage.getItem('cs_admin_map_settings');
        const cfg = raw ? JSON.parse(raw) : {};
        const apiKey: string = cfg.apiKey || '';
        const countriesCsv: string = cfg.countryRestrictions || '';
        if (!apiKey) return; // fall back to normal input
        let autocomplete: any;
        loadGoogleMaps(apiKey).then(() => {
            if (!inputRef.current || !window.google) return;
            const options: any = {};
            if (countriesCsv) {
                const countries = String(countriesCsv).split(',').map((c: string) => c.trim()).filter(Boolean);
                if (countries.length > 0) {
                    options.componentRestrictions = { country: countries };
                }
            }
            autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, options);
            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();
                const formatted = place.formatted_address || inputRef.current?.value || '';
                onChange(formatted);
            });
        }).catch(() => {
            // ignore load errors; regular input remains
        });
        return () => {
            autocomplete = null;
        };
    }, []);
    return <input ref={inputRef} type="text" className="w-full p-2 border rounded-lg" placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />;
};



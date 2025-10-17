-- Schéma PostgreSQL pour Supabase - Système de Tracking ColisSelect

-- Table des emplacements
CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  country TEXT NOT NULL
);

-- Table des zones
CREATE TABLE zones (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  locations TEXT NOT NULL,
  description TEXT
);

-- Table des tarifs d'expédition
CREATE TABLE shipping_rates (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('flat', 'weight')),
  min_weight REAL NOT NULL DEFAULT 0,
  max_weight REAL NOT NULL DEFAULT 0,
  rate REAL NOT NULL,
  insurance REAL NOT NULL DEFAULT 0,
  description TEXT
);

-- Table des tarifs de ramassage
CREATE TABLE pickup_rates (
  id SERIAL PRIMARY KEY,
  zone TEXT NOT NULL,
  min_weight REAL NOT NULL DEFAULT 0,
  max_weight REAL NOT NULL DEFAULT 0,
  rate REAL NOT NULL,
  description TEXT
);

-- Table des expéditions
CREATE TABLE shipments (
  id SERIAL PRIMARY KEY,
  tracking_code TEXT UNIQUE NOT NULL,
  shipper_name TEXT NOT NULL,
  shipper_address TEXT,
  shipper_phone TEXT,
  shipper_email TEXT,
  receiver_name TEXT NOT NULL,
  receiver_address TEXT,
  receiver_phone TEXT,
  receiver_email TEXT,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'processing' CHECK(status IN ('processing', 'picked_up', 'in_transit', 'delivered', 'delayed')),
  packages INTEGER DEFAULT 1,
  total_weight REAL DEFAULT 0,
  product TEXT,
  quantity INTEGER DEFAULT 1,
  payment_mode TEXT DEFAULT 'Cash',
  total_freight REAL DEFAULT 0,
  expected_delivery DATE,
  departure_time TEXT,
  pickup_date DATE,
  pickup_time TEXT,
  comments TEXT,
  date_created TIMESTAMP DEFAULT NOW()
);

-- Table de l'historique de tracking
CREATE TABLE tracking_history (
  id SERIAL PRIMARY KEY,
  shipment_id INTEGER NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
  date_time TIMESTAMP NOT NULL,
  location TEXT NOT NULL,
  status TEXT NOT NULL,
  description TEXT,
  latitude REAL,
  longitude REAL
);

-- Table des utilisateurs
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'agent',
  branch TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  last_login TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Insertion des données par défaut

-- Emplacements
INSERT INTO locations (name, slug, country) VALUES
('Paris', 'paris', 'France'),
('Lyon', 'lyon', 'France'),
('Marseille', 'marseille', 'France'),
('Toulouse', 'toulouse', 'France'),
('Nice', 'nice', 'France'),
('Nantes', 'nantes', 'France'),
('Strasbourg', 'strasbourg', 'France'),
('Montpellier', 'montpellier', 'France'),
('Bordeaux', 'bordeaux', 'France'),
('Lille', 'lille', 'France');

-- Zones
INSERT INTO zones (name, slug, locations, description) VALUES
('France North', 'france-north', 'Paris,Lille,Strasbourg', 'Northern regions of France'),
('France South', 'france-south', 'Marseille,Nice,Toulouse,Montpellier', 'Southern regions of France'),
('France West', 'france-west', 'Nantes,Bordeaux,Rennes', 'Western regions of France'),
('France Central', 'france-central', 'Lyon,Clermont-Ferrand', 'Central regions of France');

-- Tarifs d'expédition
INSERT INTO shipping_rates (name, type, min_weight, max_weight, rate, insurance, description) VALUES
('Standard Shipping', 'weight', 0, 5, 12.5, 2.0, 'Standard shipping for small packages'),
('Express Air', 'weight', 0, 10, 25.0, 5.0, 'Fast air shipping for urgent deliveries'),
('Sea Shipping', 'weight', 5, 100, 8.75, 1.5, 'Economic sea shipping for heavy items'),
('Door to Door', 'flat', 0, 20, 35.0, 7.5, 'Premium door to door delivery service');

-- Tarifs de ramassage
INSERT INTO pickup_rates (zone, min_weight, max_weight, rate, description) VALUES
('France North', 0, 5, 8.5, 'Standard pickup for small packages in Northern France'),
('France South', 0, 5, 9.5, 'Standard pickup for small packages in Southern France'),
('France North', 5, 20, 15.75, 'Medium package pickup in Northern France'),
('France South', 5, 20, 17.25, 'Medium package pickup in Southern France'),
('France West', 0, 10, 12.0, 'Standard pickup in Western France');

-- Utilisateurs par défaut
INSERT INTO users (name, email, role, branch, status, last_login, created_at) VALUES
('Jean Dupont', 'jean.dupont@colisselect.com', 'admin', 'Paris HQ', 'active', '2023-05-18 14:30:00', '2023-01-01 00:00:00'),
('Marie Laurent', 'marie.laurent@colisselect.com', 'manager', 'Lyon Branch', 'active', '2023-05-17 09:15:00', '2023-01-02 00:00:00'),
('Pierre Martin', 'pierre.martin@colisselect.com', 'agent', 'Marseille Branch', 'active', '2023-05-18 11:45:00', '2023-01-03 00:00:00'),
('Sophie Bernard', 'sophie.bernard@colisselect.com', 'agent', 'Paris HQ', 'inactive', '2023-05-10 16:20:00', '2023-01-04 00:00:00'),
('Thomas Petit', 'thomas.petit@colisselect.com', 'manager', 'Toulouse Branch', 'active', '2023-05-18 08:05:00', '2023-01-05 00:00:00');

-- Expédition de test
INSERT INTO shipments (tracking_code, shipper_name, shipper_address, shipper_phone, shipper_email, receiver_name, receiver_address, receiver_phone, receiver_email, origin, destination, status, packages, total_weight, product, quantity, payment_mode, total_freight, expected_delivery, departure_time, pickup_date, pickup_time, comments, date_created) VALUES
('SHIP284368813620-COLISSELECT', 'Test Expediteur', '123 Rue de Test, Paris', '0123456789', 'test@expediteur.com', 'Test Destinataire', '456 Avenue Test, Lyon', '0987654321', 'test@destinataire.com', 'Paris', 'Lyon', 'in_transit', 1, 2.5, 'Test Package', 1, 'Cash', 15.0, '2025-10-20', '10:00', '2025-10-17', '09:00', 'Test shipment', '2025-10-17 12:00:00');

-- Historique de tracking pour l'expédition de test
INSERT INTO tracking_history (shipment_id, date_time, location, status, description, latitude, longitude) VALUES
(1, '2025-10-17 09:00:00', 'Paris Warehouse', 'processing', 'Package received and being processed', 48.8566, 2.3522),
(1, '2025-10-17 10:00:00', 'Paris Sorting Center', 'picked_up', 'Package picked up for delivery', 48.8566, 2.3522),
(1, '2025-10-17 14:00:00', 'Transit Hub Lyon', 'in_transit', 'Package in transit to destination', 45.7640, 4.8357);
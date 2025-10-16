const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3003; // ✅ FIXÉ : 3003 au lieu de 3001

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  // Locations table
  db.run(`CREATE TABLE IF NOT EXISTS locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    country TEXT NOT NULL
  )`, (err) => {
    if (err) console.error('Error creating locations table:', err.message);
    else console.log('Locations table created or already exists.');
  });

  // Zones table
  db.run(`CREATE TABLE IF NOT EXISTS zones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    locations TEXT NOT NULL,
    description TEXT
  )`, (err) => {
    if (err) console.error('Error creating zones table:', err.message);
    else console.log('Zones table created or already exists.');
  });

  // Shipping rates table
  db.run(`CREATE TABLE IF NOT EXISTS shipping_rates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('flat', 'weight')),
    min_weight REAL NOT NULL DEFAULT 0,
    max_weight REAL NOT NULL DEFAULT 0,
    rate REAL NOT NULL,
    insurance REAL NOT NULL DEFAULT 0,
    description TEXT
  )`, (err) => {
    if (err) console.error('Error creating shipping_rates table:', err.message);
    else console.log('Shipping rates table created or already exists.');
  });

  // Pickup rates table
  db.run(`CREATE TABLE IF NOT EXISTS pickup_rates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    zone TEXT NOT NULL,
    min_weight REAL NOT NULL DEFAULT 0,
    max_weight REAL NOT NULL DEFAULT 0,
    rate REAL NOT NULL,
    description TEXT
  )`, (err) => {
    if (err) console.error('Error creating pickup_rates table:', err.message);
    else console.log('Pickup rates table created or already exists.');
  });

  // Shipments table
  db.run(`CREATE TABLE IF NOT EXISTS shipments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tracking_number TEXT UNIQUE NOT NULL,
    shipper_name TEXT NOT NULL,
    shipper_address TEXT NOT NULL,
    shipper_phone TEXT NOT NULL,
    shipper_email TEXT NOT NULL,
    receiver_name TEXT NOT NULL,
    receiver_address TEXT NOT NULL,
    receiver_phone TEXT NOT NULL,
    receiver_email TEXT NOT NULL,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('processing', 'picked_up', 'in_transit', 'delivered', 'delayed')),
    packages INTEGER NOT NULL DEFAULT 1,
    total_weight REAL NOT NULL,
    product TEXT,
    quantity INTEGER DEFAULT 1,
    payment_mode TEXT DEFAULT 'Cash',
    total_freight REAL DEFAULT 0,
    expected_delivery TEXT,
    departure_time TEXT,
    pickup_date TEXT,
    pickup_time TEXT,
    comments TEXT,
    date_created TEXT NOT NULL
  )`, (err) => {
    if (err) console.error('Error creating shipments table:', err.message);
    else console.log('Shipments table created or already exists.');
  });

  // Tracking history table
  db.run(`CREATE TABLE IF NOT EXISTS tracking_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    shipment_id INTEGER NOT NULL,
    date_time TEXT NOT NULL,
    location TEXT NOT NULL,
    status TEXT NOT NULL,
    description TEXT,
    latitude REAL,
    longitude REAL,
    FOREIGN KEY (shipment_id) REFERENCES shipments (id) ON DELETE CASCADE
  )`, (err) => {
    if (err) console.error('Error creating tracking_history table:', err.message);
    else console.log('Tracking history table created or already exists.');
  });

  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      role TEXT NOT NULL DEFAULT 'agent',
      branch TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      last_login TEXT,
      created_at TEXT NOT NULL
    )`, (err) => {
      if (err) console.error('Error creating users table:', err.message);
      else console.log('Users table created or already exists.');
    });

  // Insert default data after a short delay to ensure tables are created
  setTimeout(insertDefaultData, 100);
}

// Insert default data
function insertDefaultData() {
  // Default locations
  const locations = [
    { name: 'Paris', slug: 'paris', country: 'France' },
    { name: 'Lyon', slug: 'lyon', country: 'France' },
    { name: 'Marseille', slug: 'marseille', country: 'France' },
    { name: 'Toulouse', slug: 'toulouse', country: 'France' },
    { name: 'Nice', slug: 'nice', country: 'France' },
    { name: 'Nantes', slug: 'nantes', country: 'France' },
    { name: 'Strasbourg', slug: 'strasbourg', country: 'France' },
    { name: 'Montpellier', slug: 'montpellier', country: 'France' },
    { name: 'Bordeaux', slug: 'bordeaux', country: 'France' },
    { name: 'Lille', slug: 'lille', country: 'France' }
  ];

  locations.forEach(loc => {
    db.run(`INSERT OR IGNORE INTO locations (name, slug, country) VALUES (?, ?, ?)`,
      [loc.name, loc.slug, loc.country]);
  });

  // Default zones
  const zones = [
    { name: 'France North', slug: 'france-north', locations: 'Paris,Lille,Strasbourg', description: 'Northern regions of France' },
    { name: 'France South', slug: 'france-south', locations: 'Marseille,Nice,Toulouse,Montpellier', description: 'Southern regions of France' },
    { name: 'France West', slug: 'france-west', locations: 'Nantes,Bordeaux,Rennes', description: 'Western regions of France' },
    { name: 'France Central', slug: 'france-central', locations: 'Lyon,Clermont-Ferrand', description: 'Central regions of France' }
  ];

  zones.forEach(zone => {
    db.run(`INSERT OR IGNORE INTO zones (name, slug, locations, description) VALUES (?, ?, ?, ?)`,
      [zone.name, zone.slug, zone.locations, zone.description]);
  });

  // Default shipping rates
  const shippingRates = [
    { name: 'Standard Shipping', type: 'weight', min_weight: 0, max_weight: 5, rate: 12.5, insurance: 2.0, description: 'Standard shipping for small packages' },
    { name: 'Express Air', type: 'weight', min_weight: 0, max_weight: 10, rate: 25.0, insurance: 5.0, description: 'Fast air shipping for urgent deliveries' },
    { name: 'Sea Shipping', type: 'weight', min_weight: 5, max_weight: 100, rate: 8.75, insurance: 1.5, description: 'Economic sea shipping for heavy items' },
    { name: 'Door to Door', type: 'flat', min_weight: 0, max_weight: 20, rate: 35.0, insurance: 7.5, description: 'Premium door to door delivery service' }
  ];

  shippingRates.forEach(rate => {
    db.run(`INSERT OR IGNORE INTO shipping_rates (name, type, min_weight, max_weight, rate, insurance, description) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [rate.name, rate.type, rate.min_weight, rate.max_weight, rate.rate, rate.insurance, rate.description]);
  });

  // Default pickup rates
  const pickupRates = [
    { zone: 'France North', min_weight: 0, max_weight: 5, rate: 8.5, description: 'Standard pickup for small packages in Northern France' },
    { zone: 'France South', min_weight: 0, max_weight: 5, rate: 9.5, description: 'Standard pickup for small packages in Southern France' },
    { zone: 'France North', min_weight: 5, max_weight: 20, rate: 15.75, description: 'Medium package pickup in Northern France' },
    { zone: 'France South', min_weight: 5, max_weight: 20, rate: 17.25, description: 'Medium package pickup in Southern France' },
    { zone: 'France West', min_weight: 0, max_weight: 10, rate: 12.0, description: 'Standard pickup in Western France' }
  ];

  pickupRates.forEach(rate => {
    db.run(`INSERT OR IGNORE INTO pickup_rates (zone, min_weight, max_weight, rate, description) VALUES (?, ?, ?, ?, ?)`,
      [rate.zone, rate.min_weight, rate.max_weight, rate.rate, rate.description]);
  });

  // Default shipments
  const shipments = [
    {
      tracking_number: 'SHIP065364729622-COLISSELECT',
      shipper_name: 'Welleman Camille',
      shipper_address: 'Place du Capitole 31000 Toulouse',
      shipper_phone: '0753030071',
      shipper_email: 'ambrewelleman26@gmail.com',
      receiver_name: 'Manon bistue',
      receiver_address: 'Haras de whynehn domaine Dammartin 34790 grabels',
      receiver_phone: '0620210823',
      receiver_email: 'kaora.nj@gmail.com',
      origin: 'France',
      destination: 'France',
      status: 'in_transit',
      packages: 1,
      total_weight: 38,
      product: 'Malle gee',
      quantity: 1,
      payment_mode: 'Cash',
      total_freight: 33,
      expected_delivery: '2025-10-17',
      departure_time: '10:00 am',
      pickup_date: '2025-10-14',
      pickup_time: '08:00 am',
      comments: '',
      date_created: '2025-10-13'
    }
  ];

  shipments.forEach(shipment => {
    db.run(`INSERT OR IGNORE INTO shipments (tracking_number, shipper_name, shipper_address, shipper_phone, shipper_email, receiver_name, receiver_address, receiver_phone, receiver_email, origin, destination, status, packages, total_weight, product, quantity, payment_mode, total_freight, expected_delivery, departure_time, pickup_date, pickup_time, comments, date_created) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [shipment.tracking_number, shipment.shipper_name, shipment.shipper_address, shipment.shipper_phone, shipment.shipper_email, shipment.receiver_name, shipment.receiver_address, shipment.receiver_phone, shipment.receiver_email, shipment.origin, shipment.destination, shipment.status, shipment.packages, shipment.total_weight, shipment.product, shipment.quantity, shipment.payment_mode, shipment.total_freight, shipment.expected_delivery, shipment.departure_time, shipment.pickup_date, shipment.pickup_time, shipment.comments, shipment.date_created], function(err) {
        if (err) return;
        const shipmentId = this.lastID;

        // Insert tracking history for each shipment
        const history = getDefaultTrackingHistory(shipment.tracking_number);
        history.forEach(step => {
          db.run(`INSERT OR IGNORE INTO tracking_history (shipment_id, date_time, location, status, description, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [shipmentId, step.date_time, step.location, step.status, step.description, step.latitude, step.longitude]);
        });
      });
  });

  // Default users
  const users = [
    { name: 'Jean Dupont', email: 'jean.dupont@colisselect.com', role: 'admin', branch: 'Paris HQ', status: 'active', last_login: '2023-05-18 14:30', created_at: '2023-01-01' },
    { name: 'Marie Laurent', email: 'marie.laurent@colisselect.com', role: 'manager', branch: 'Lyon Branch', status: 'active', last_login: '2023-05-17 09:15', created_at: '2023-01-02' },
    { name: 'Pierre Martin', email: 'pierre.martin@colisselect.com', role: 'agent', branch: 'Marseille Branch', status: 'active', last_login: '2023-05-18 11:45', created_at: '2023-01-03' },
    { name: 'Sophie Bernard', email: 'sophie.bernard@colisselect.com', role: 'agent', branch: 'Paris HQ', status: 'inactive', last_login: '2023-05-10 16:20', created_at: '2023-01-04' },
    { name: 'Thomas Petit', email: 'thomas.petit@colisselect.com', role: 'manager', branch: 'Toulouse Branch', status: 'active', last_login: '2023-05-18 08:05', created_at: '2023-01-05' }
  ];

  users.forEach(user => {
    db.run(`INSERT OR IGNORE INTO users (name, email, role, branch, status, last_login, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user.name, user.email, user.role, user.branch, user.status, user.last_login, user.created_at]);
  });
}

// API Routes

// Locations
app.get('/api/locations', (req, res) => {
  db.all('SELECT * FROM locations ORDER BY name', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/locations', (req, res) => {
  const { name, slug, country } = req.body;
  if (!name || !country) return res.status(400).json({ error: 'Name and country are required' });

  const finalSlug = slug || name.toLowerCase().replace(/\s+/g, '-');
  db.run('INSERT INTO locations (name, slug, country) VALUES (?, ?, ?)',
    [name, finalSlug, country], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, name, slug: finalSlug, country });
  });
});

app.put('/api/locations/:id', (req, res) => {
  const { name, slug, country } = req.body;
  db.run('UPDATE locations SET name = ?, slug = ?, country = ? WHERE id = ?',
    [name, slug, country, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Location updated' });
  });
});

app.delete('/api/locations/:id', (req, res) => {
  db.run('DELETE FROM locations WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Location deleted' });
  });
});

// Zones
app.get('/api/zones', (req, res) => {
  db.all('SELECT * FROM zones ORDER BY name', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/zones', (req, res) => {
  const { name, slug, locations, description } = req.body;
  if (!name || !locations) return res.status(400).json({ error: 'Name and locations are required' });

  const finalSlug = slug || name.toLowerCase().replace(/\s+/g, '-');
  db.run('INSERT INTO zones (name, slug, locations, description) VALUES (?, ?, ?, ?)',
    [name, finalSlug, locations, description], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, name, slug: finalSlug, locations, description });
  });
});

app.put('/api/zones/:id', (req, res) => {
  const { name, slug, locations, description } = req.body;
  db.run('UPDATE zones SET name = ?, slug = ?, locations = ?, description = ? WHERE id = ?',
    [name, slug, locations, description, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Zone updated' });
  });
});

app.delete('/api/zones/:id', (req, res) => {
  db.run('DELETE FROM zones WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Zone deleted' });
  });
});

// Shipping Rates
app.get('/api/shipping-rates', (req, res) => {
  db.all('SELECT * FROM shipping_rates ORDER BY name', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/shipping-rates', (req, res) => {
  const { name, type, min_weight, max_weight, rate, insurance, description } = req.body;
  if (!name || !rate) return res.status(400).json({ error: 'Name and rate are required' });

  db.run('INSERT INTO shipping_rates (name, type, min_weight, max_weight, rate, insurance, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, type || 'flat', min_weight || 0, max_weight || 0, rate, insurance || 0, description], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, name, type: type || 'flat', min_weight: min_weight || 0, max_weight: max_weight || 0, rate, insurance: insurance || 0, description });
  });
});

app.put('/api/shipping-rates/:id', (req, res) => {
  const { name, type, min_weight, max_weight, rate, insurance, description } = req.body;
  db.run('UPDATE shipping_rates SET name = ?, type = ?, min_weight = ?, max_weight = ?, rate = ?, insurance = ?, description = ? WHERE id = ?',
    [name, type, min_weight, max_weight, rate, insurance, description, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Shipping rate updated' });
  });
});

app.delete('/api/shipping-rates/:id', (req, res) => {
  db.run('DELETE FROM shipping_rates WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Shipping rate deleted' });
  });
});

// Pickup Rates
app.get('/api/pickup-rates', (req, res) => {
  db.all('SELECT * FROM pickup_rates ORDER BY zone', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/pickup-rates', (req, res) => {
  const { zone, min_weight, max_weight, rate, description } = req.body;
  if (!zone || !rate) return res.status(400).json({ error: 'Zone and rate are required' });

  db.run('INSERT INTO pickup_rates (zone, min_weight, max_weight, rate, description) VALUES (?, ?, ?, ?, ?)',
    [zone, min_weight || 0, max_weight || 0, rate, description], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, zone, min_weight: min_weight || 0, max_weight: max_weight || 0, rate, description });
  });
});

app.put('/api/pickup-rates/:id', (req, res) => {
  const { zone, min_weight, max_weight, rate, description } = req.body;
  db.run('UPDATE pickup_rates SET zone = ?, min_weight = ?, max_weight = ?, rate = ?, description = ? WHERE id = ?',
    [zone, min_weight, max_weight, rate, description, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Pickup rate updated' });
  });
});

app.delete('/api/pickup-rates/:id', (req, res) => {
  db.run('DELETE FROM pickup_rates WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Pickup rate deleted' });
  });
});

// Shipments
app.get('/api/shipments', (req, res) => {
  const { status } = req.query;
  let query = 'SELECT * FROM shipments ORDER BY date_created DESC';
  let params = [];

  if (status && status !== 'all') {
    query = 'SELECT * FROM shipments WHERE status = ? ORDER BY date_created DESC';
    params = [status];
  }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/shipments', (req, res) => {
  const {
    shipper_name, shipper_address, shipper_phone, shipper_email,
    receiver_name, receiver_address, receiver_phone, receiver_email,
    origin, destination, packages, total_weight, product, quantity,
    payment_mode, total_freight, expected_delivery, departure_time,
    pickup_date, pickup_time, comments
  } = req.body;

  if (!shipper_name || !receiver_name || !origin || !destination) {
    return res.status(400).json({ error: 'Shipper name, receiver name, origin, and destination are required' });
  }

  // Generate tracking number
  const tracking_number = `SHIP${Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0')}-COLISSELECT`;

  db.run(`INSERT INTO shipments (
    tracking_number, shipper_name, shipper_address, shipper_phone, shipper_email,
    receiver_name, receiver_address, receiver_phone, receiver_email,
    origin, destination, status, packages, total_weight, product, quantity,
    payment_mode, total_freight, expected_delivery, departure_time,
    pickup_date, pickup_time, comments, date_created
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      tracking_number, shipper_name, shipper_address || '', shipper_phone || '', shipper_email || '',
      receiver_name, receiver_address || '', receiver_phone || '', receiver_email || '',
      origin, destination, 'processing', packages || 1, total_weight || 0, product || '',
      quantity || 1, payment_mode || 'Cash', total_freight || 0, expected_delivery || '',
      departure_time || '', pickup_date || '', pickup_time || '', comments || '',
      new Date().toISOString().slice(0, 10)
    ], function(err) {
    if (err) return res.status(500).json({ error: err.message });

    const shipmentId = this.lastID;

    // Add initial tracking history
    const initialHistory = [{
      date_time: new Date().toISOString().slice(0, 19).replace('T', ' '),
      location: 'Origin Facility',
      status: 'processing',
      description: 'Package received and being processed',
      latitude: 48.8566,
      longitude: 2.3522
    }];

    initialHistory.forEach(step => {
      db.run(`INSERT INTO tracking_history (shipment_id, date_time, location, status, description, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [shipmentId, step.date_time, step.location, step.status, step.description, step.latitude, step.longitude]);
    });

    res.json({
      id: shipmentId,
      tracking_number,
      shipper_name, shipper_address, shipper_phone, shipper_email,
      receiver_name, receiver_address, receiver_phone, receiver_email,
      origin, destination, status: 'processing', packages: packages || 1,
      total_weight: total_weight || 0, product: product || '', quantity: quantity || 1,
      payment_mode: payment_mode || 'Cash', total_freight: total_freight || 0,
      expected_delivery: expected_delivery || '', departure_time: departure_time || '',
      pickup_date: pickup_date || '', pickup_time: pickup_time || '', comments: comments || '',
      date_created: new Date().toISOString().slice(0, 10)
    });
  });
});

app.put('/api/shipments/:id', (req, res) => {
  const {
    shipper_name, shipper_address, shipper_phone, shipper_email,
    receiver_name, receiver_address, receiver_phone, receiver_email,
    origin, destination, status, packages, total_weight, product, quantity,
    payment_mode, total_freight, expected_delivery, departure_time,
    pickup_date, pickup_time, comments
  } = req.body;

  db.run(`UPDATE shipments SET
    shipper_name = ?, shipper_address = ?, shipper_phone = ?, shipper_email = ?,
    receiver_name = ?, receiver_address = ?, receiver_phone = ?, receiver_email = ?,
    origin = ?, destination = ?, status = ?, packages = ?, total_weight = ?,
    product = ?, quantity = ?, payment_mode = ?, total_freight = ?,
    expected_delivery = ?, departure_time = ?, pickup_date = ?, pickup_time = ?, comments = ?
    WHERE id = ?`,
    [
      shipper_name, shipper_address, shipper_phone, shipper_email,
      receiver_name, receiver_address, receiver_phone, receiver_email,
      origin, destination, status, packages, total_weight, product, quantity,
      payment_mode, total_freight, expected_delivery, departure_time,
      pickup_date, pickup_time, comments, req.params.id
    ], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Shipment updated' });
  });
});

app.delete('/api/shipments/:id', (req, res) => {
  db.run('DELETE FROM shipments WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Shipment deleted' });
  });
});

// Users
app.get('/api/users', (req, res) => {
  db.all('SELECT * FROM users ORDER BY name', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/users', (req, res) => {
  const { name, email, role, branch, status } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });

  db.run('INSERT INTO users (name, email, role, branch, status, created_at) VALUES (?, ?, ?, ?, ?, ?)',
    [name, email, role || 'agent', branch || '', status || 'active', new Date().toISOString()], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, name, email, role: role || 'agent', branch: branch || '', status: status || 'active', created_at: new Date().toISOString() });
  });
});

app.put('/api/users/:id', (req, res) => {
  const { name, email, role, branch, status } = req.body;
  db.run('UPDATE users SET name = ?, email = ?, role = ?, branch = ?, status = ? WHERE id = ?',
    [name, email, role, branch, status, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'User updated' });
  });
});

app.delete('/api/users/:id', (req, res) => {
  db.run('DELETE FROM users WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'User deleted' });
  });
});

// Tracking endpoint
app.get('/api/track/:trackingNumber', (req, res) => {
  const { trackingNumber } = req.params;

  db.get('SELECT * FROM shipments WHERE tracking_number = ?', [trackingNumber], (err, shipment) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!shipment) return res.status(404).json({ error: 'Shipment not found' });

    // Get tracking history
    db.all('SELECT date_time, location, status, description, latitude, longitude FROM tracking_history WHERE shipment_id = ? ORDER BY date_time DESC', [shipment.id], (err, history) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({
        shipment,
        history
      });
    });
  });
});

// Helper function to generate default tracking history
function getDefaultTrackingHistory(trackingNumber) {
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() - 7); // Start from 7 days ago

  const history = [
    {
      date_time: baseDate.toISOString().slice(0, 19).replace('T', ' '),
      location: 'Origin Facility',
      status: 'processing',
      description: 'Package received and being processed',
      latitude: 48.8566,
      longitude: 2.3522
    },
    {
      date_time: new Date(baseDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' '),
      location: 'Sorting Center',
      status: 'picked_up',
      description: 'Package picked up for delivery',
      latitude: 48.8566,
      longitude: 2.3522
    },
    {
      date_time: new Date(baseDate.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' '),
      location: 'Transit Hub',
      status: 'in_transit',
      description: 'Package in transit to destination',
      latitude: 45.7640,
      longitude: 4.8357
    }
  ];

  // Add delivered status if shipment is delivered
  if (trackingNumber === 'CS-23456789') {
    history.push({
      date_time: new Date(baseDate.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' '),
      location: 'Destination Facility',
      status: 'delivered',
      description: 'Package delivered successfully',
      latitude: 43.7102,
      longitude: 7.2620
    });
  }

  return history;
}

// Health check
app.get('/', (req, res) => {
  res.json({ message: '🚚 COLISSELECT BACKEND OK !', port: PORT });
});

// **🚀 SEULEMENT 1 app.listen() ICI !**
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Test: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down...');
  db.close((err) => {
    if (err) console.error('Error closing database:', err.message);
    else console.log('✅ Database closed.');
    process.exit(0);
  });
});
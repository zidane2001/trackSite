<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database configuration
$db_file = __DIR__ . '/database.db';

// Initialize database
function initDatabase() {
    global $db_file;
    $db = new SQLite3($db_file);

    // Create tables
    $db->exec('CREATE TABLE IF NOT EXISTS locations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        country TEXT NOT NULL
    )');

    $db->exec('CREATE TABLE IF NOT EXISTS zones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        locations TEXT NOT NULL,
        description TEXT
    )');

    $db->exec('CREATE TABLE IF NOT EXISTS shipping_rates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL CHECK(type IN ("flat", "weight")),
        min_weight REAL NOT NULL DEFAULT 0,
        max_weight REAL NOT NULL DEFAULT 0,
        rate REAL NOT NULL,
        insurance REAL NOT NULL DEFAULT 0,
        description TEXT
    )');

    $db->exec('CREATE TABLE IF NOT EXISTS pickup_rates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        zone TEXT NOT NULL,
        min_weight REAL NOT NULL DEFAULT 0,
        max_weight REAL NOT NULL DEFAULT 0,
        rate REAL NOT NULL,
        description TEXT
    )');

    $db->exec('CREATE TABLE IF NOT EXISTS shipments (
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
        status TEXT NOT NULL CHECK(status IN ("processing", "picked_up", "in_transit", "delivered", "delayed")),
        packages INTEGER NOT NULL DEFAULT 1,
        total_weight REAL NOT NULL,
        product TEXT,
        quantity INTEGER DEFAULT 1,
        payment_mode TEXT DEFAULT "Cash",
        total_freight REAL DEFAULT 0,
        expected_delivery TEXT,
        departure_time TEXT,
        pickup_date TEXT,
        pickup_time TEXT,
        comments TEXT,
        date_created TEXT NOT NULL
    )');

    $db->exec('CREATE TABLE IF NOT EXISTS tracking_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        shipment_id INTEGER NOT NULL,
        date_time TEXT NOT NULL,
        location TEXT NOT NULL,
        status TEXT NOT NULL,
        description TEXT,
        latitude REAL,
        longitude REAL,
        FOREIGN KEY (shipment_id) REFERENCES shipments (id) ON DELETE CASCADE
    )');

    $db->exec('CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        role TEXT NOT NULL DEFAULT "agent",
        branch TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT "active",
        last_login TEXT,
        created_at TEXT NOT NULL
    )');

    // Insert default data
    insertDefaultData($db);

    return $db;
}

function insertDefaultData($db) {
    // Default locations
    $locations = [
        ['name' => 'Paris', 'slug' => 'paris', 'country' => 'France'],
        ['name' => 'Lyon', 'slug' => 'lyon', 'country' => 'France'],
        ['name' => 'Marseille', 'slug' => 'marseille', 'country' => 'France'],
        ['name' => 'Toulouse', 'slug' => 'toulouse', 'country' => 'France'],
        ['name' => 'Nice', 'slug' => 'nice', 'country' => 'France'],
        ['name' => 'Nantes', 'slug' => 'nantes', 'country' => 'France'],
        ['name' => 'Strasbourg', 'slug' => 'strasbourg', 'country' => 'France'],
        ['name' => 'Montpellier', 'slug' => 'montpellier', 'country' => 'France'],
        ['name' => 'Bordeaux', 'slug' => 'bordeaux', 'country' => 'France'],
        ['name' => 'Lille', 'slug' => 'lille', 'country' => 'France']
    ];

    foreach ($locations as $loc) {
        $stmt = $db->prepare('INSERT OR IGNORE INTO locations (name, slug, country) VALUES (?, ?, ?)');
        $stmt->bindValue(1, $loc['name']);
        $stmt->bindValue(2, $loc['slug']);
        $stmt->bindValue(3, $loc['country']);
        $stmt->execute();
    }

    // Default zones
    $zones = [
        ['name' => 'France North', 'slug' => 'france-north', 'locations' => 'Paris,Lille,Strasbourg', 'description' => 'Northern regions of France'],
        ['name' => 'France South', 'slug' => 'france-south', 'locations' => 'Marseille,Nice,Toulouse,Montpellier', 'description' => 'Southern regions of France'],
        ['name' => 'France West', 'slug' => 'france-west', 'locations' => 'Nantes,Bordeaux,Rennes', 'description' => 'Western regions of France'],
        ['name' => 'France Central', 'slug' => 'france-central', 'locations' => 'Lyon,Clermont-Ferrand', 'description' => 'Central regions of France']
    ];

    foreach ($zones as $zone) {
        $stmt = $db->prepare('INSERT OR IGNORE INTO zones (name, slug, locations, description) VALUES (?, ?, ?, ?)');
        $stmt->bindValue(1, $zone['name']);
        $stmt->bindValue(2, $zone['slug']);
        $stmt->bindValue(3, $zone['locations']);
        $stmt->bindValue(4, $zone['description']);
        $stmt->execute();
    }

    // Default shipping rates
    $shippingRates = [
        ['name' => 'Standard Shipping', 'type' => 'weight', 'min_weight' => 0, 'max_weight' => 5, 'rate' => 12.5, 'insurance' => 2.0, 'description' => 'Standard shipping for small packages'],
        ['name' => 'Express Air', 'type' => 'weight', 'min_weight' => 0, 'max_weight' => 10, 'rate' => 25.0, 'insurance' => 5.0, 'description' => 'Fast air shipping for urgent deliveries'],
        ['name' => 'Sea Shipping', 'type' => 'weight', 'min_weight' => 5, 'max_weight' => 100, 'rate' => 8.75, 'insurance' => 1.5, 'description' => 'Economic sea shipping for heavy items'],
        ['name' => 'Door to Door', 'type' => 'flat', 'min_weight' => 0, 'max_weight' => 20, 'rate' => 35.0, 'insurance' => 7.5, 'description' => 'Premium door to door delivery service']
    ];

    foreach ($shippingRates as $rate) {
        $stmt = $db->prepare('INSERT OR IGNORE INTO shipping_rates (name, type, min_weight, max_weight, rate, insurance, description) VALUES (?, ?, ?, ?, ?, ?, ?)');
        $stmt->bindValue(1, $rate['name']);
        $stmt->bindValue(2, $rate['type']);
        $stmt->bindValue(3, $rate['min_weight']);
        $stmt->bindValue(4, $rate['max_weight']);
        $stmt->bindValue(5, $rate['rate']);
        $stmt->bindValue(6, $rate['insurance']);
        $stmt->bindValue(7, $rate['description']);
        $stmt->execute();
    }

    // Default pickup rates
    $pickupRates = [
        ['zone' => 'France North', 'min_weight' => 0, 'max_weight' => 5, 'rate' => 8.5, 'description' => 'Standard pickup for small packages in Northern France'],
        ['zone' => 'France South', 'min_weight' => 0, 'max_weight' => 5, 'rate' => 9.5, 'description' => 'Standard pickup for small packages in Southern France'],
        ['zone' => 'France North', 'min_weight' => 5, 'max_weight' => 20, 'rate' => 15.75, 'description' => 'Medium package pickup in Northern France'],
        ['zone' => 'France South', 'min_weight' => 5, 'max_weight' => 20, 'rate' => 17.25, 'description' => 'Medium package pickup in Southern France'],
        ['zone' => 'France West', 'min_weight' => 0, 'max_weight' => 10, 'rate' => 12.0, 'description' => 'Standard pickup in Western France']
    ];

    foreach ($pickupRates as $rate) {
        $stmt = $db->prepare('INSERT OR IGNORE INTO pickup_rates (zone, min_weight, max_weight, rate, description) VALUES (?, ?, ?, ?, ?)');
        $stmt->bindValue(1, $rate['zone']);
        $stmt->bindValue(2, $rate['min_weight']);
        $stmt->bindValue(3, $rate['max_weight']);
        $stmt->bindValue(4, $rate['rate']);
        $stmt->bindValue(5, $rate['description']);
        $stmt->execute();
    }

    // Default users
    $users = [
        ['name' => 'Jean Dupont', 'email' => 'jean.dupont@colisselect.com', 'role' => 'admin', 'branch' => 'Paris HQ', 'status' => 'active', 'last_login' => '2023-05-18 14:30', 'created_at' => '2023-01-01'],
        ['name' => 'Marie Laurent', 'email' => 'marie.laurent@colisselect.com', 'role' => 'manager', 'branch' => 'Lyon Branch', 'status' => 'active', 'last_login' => '2023-05-17 09:15', 'created_at' => '2023-01-02'],
        ['name' => 'Pierre Martin', 'email' => 'pierre.martin@colisselect.com', 'role' => 'agent', 'branch' => 'Marseille Branch', 'status' => 'active', 'last_login' => '2023-05-18 11:45', 'created_at' => '2023-01-03'],
        ['name' => 'Sophie Bernard', 'email' => 'sophie.bernard@colisselect.com', 'role' => 'agent', 'branch' => 'Paris HQ', 'status' => 'inactive', 'last_login' => '2023-05-10 16:20', 'created_at' => '2023-01-04'],
        ['name' => 'Thomas Petit', 'email' => 'thomas.petit@colisselect.com', 'role' => 'manager', 'branch' => 'Toulouse Branch', 'status' => 'active', 'last_login' => '2023-05-18 08:05', 'created_at' => '2023-01-05']
    ];

    foreach ($users as $user) {
        $stmt = $db->prepare('INSERT OR IGNORE INTO users (name, email, role, branch, status, last_login, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)');
        $stmt->bindValue(1, $user['name']);
        $stmt->bindValue(2, $user['email']);
        $stmt->bindValue(3, $user['role']);
        $stmt->bindValue(4, $user['branch']);
        $stmt->bindValue(5, $user['status']);
        $stmt->bindValue(6, $user['last_login']);
        $stmt->bindValue(7, $user['created_at']);
        $stmt->execute();
    }
}

// Get database connection
$db = initDatabase();

// Parse request URI
$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);
$path = str_replace('/api', '', $path); // Remove /api prefix if present
$method = $_SERVER['REQUEST_METHOD'];

// Route handling
try {
    if ($path === '/' || $path === '') {
        // Health check
        echo json_encode(['message' => '🚚 COLISSELECT PHP BACKEND OK!']);
    }
    elseif ($path === '/locations' && $method === 'GET') {
        $results = $db->query('SELECT * FROM locations ORDER BY name');
        $data = [];
        while ($row = $results->fetchArray(SQLITE3_ASSOC)) {
            $data[] = $row;
        }
        echo json_encode($data);
    }
    elseif ($path === '/locations' && $method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input || !isset($input['name']) || !isset($input['country'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Name and country are required']);
            exit();
        }

        $slug = isset($input['slug']) ? $input['slug'] : strtolower(str_replace(' ', '-', $input['name']));
        $stmt = $db->prepare('INSERT INTO locations (name, slug, country) VALUES (?, ?, ?)');
        $stmt->bindValue(1, $input['name']);
        $stmt->bindValue(2, $slug);
        $stmt->bindValue(3, $input['country']);

        if ($stmt->execute()) {
            echo json_encode([
                'id' => $db->lastInsertRowID(),
                'name' => $input['name'],
                'slug' => $slug,
                'country' => $input['country']
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create location']);
        }
    }
    elseif (preg_match('/\/locations\/(\d+)/', $path, $matches) && $method === 'PUT') {
        $id = $matches[1];
        $input = json_decode(file_get_contents('php://input'), true);

        $stmt = $db->prepare('UPDATE locations SET name = ?, slug = ?, country = ? WHERE id = ?');
        $stmt->bindValue(1, $input['name']);
        $stmt->bindValue(2, $input['slug']);
        $stmt->bindValue(3, $input['country']);
        $stmt->bindValue(4, $id);

        if ($stmt->execute()) {
            echo json_encode(['message' => 'Location updated']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update location']);
        }
    }
    elseif (preg_match('/\/locations\/(\d+)/', $path, $matches) && $method === 'DELETE') {
        $id = $matches[1];
        $stmt = $db->prepare('DELETE FROM locations WHERE id = ?');
        $stmt->bindValue(1, $id);

        if ($stmt->execute()) {
            echo json_encode(['message' => 'Location deleted']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete location']);
        }
    }
    elseif ($path === '/zones' && $method === 'GET') {
        $results = $db->query('SELECT * FROM zones ORDER BY name');
        $data = [];
        while ($row = $results->fetchArray(SQLITE3_ASSOC)) {
            $data[] = $row;
        }
        echo json_encode($data);
    }
    elseif ($path === '/zones' && $method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input || !isset($input['name']) || !isset($input['locations'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Name and locations are required']);
            exit();
        }

        $slug = isset($input['slug']) ? $input['slug'] : strtolower(str_replace(' ', '-', $input['name']));
        $stmt = $db->prepare('INSERT INTO zones (name, slug, locations, description) VALUES (?, ?, ?, ?)');
        $stmt->bindValue(1, $input['name']);
        $stmt->bindValue(2, $slug);
        $stmt->bindValue(3, $input['locations']);
        $stmt->bindValue(4, $input['description'] ?? '');

        if ($stmt->execute()) {
            echo json_encode([
                'id' => $db->lastInsertRowID(),
                'name' => $input['name'],
                'slug' => $slug,
                'locations' => $input['locations'],
                'description' => $input['description'] ?? ''
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create zone']);
        }
    }
    elseif (preg_match('/\/zones\/(\d+)/', $path, $matches) && $method === 'PUT') {
        $id = $matches[1];
        $input = json_decode(file_get_contents('php://input'), true);

        $stmt = $db->prepare('UPDATE zones SET name = ?, slug = ?, locations = ?, description = ? WHERE id = ?');
        $stmt->bindValue(1, $input['name']);
        $stmt->bindValue(2, $input['slug']);
        $stmt->bindValue(3, $input['locations']);
        $stmt->bindValue(4, $input['description']);
        $stmt->bindValue(5, $id);

        if ($stmt->execute()) {
            echo json_encode(['message' => 'Zone updated']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update zone']);
        }
    }
    elseif (preg_match('/\/zones\/(\d+)/', $path, $matches) && $method === 'DELETE') {
        $id = $matches[1];
        $stmt = $db->prepare('DELETE FROM zones WHERE id = ?');
        $stmt->bindValue(1, $id);

        if ($stmt->execute()) {
            echo json_encode(['message' => 'Zone deleted']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete zone']);
        }
    }
    elseif ($path === '/shipping-rates' && $method === 'GET') {
        $results = $db->query('SELECT * FROM shipping_rates ORDER BY name');
        $data = [];
        while ($row = $results->fetchArray(SQLITE3_ASSOC)) {
            $data[] = $row;
        }
        echo json_encode($data);
    }
    elseif ($path === '/shipping-rates' && $method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input || !isset($input['name']) || !isset($input['rate'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Name and rate are required']);
            exit();
        }

        $stmt = $db->prepare('INSERT INTO shipping_rates (name, type, min_weight, max_weight, rate, insurance, description) VALUES (?, ?, ?, ?, ?, ?, ?)');
        $stmt->bindValue(1, $input['name']);
        $stmt->bindValue(2, $input['type'] ?? 'flat');
        $stmt->bindValue(3, $input['min_weight'] ?? 0);
        $stmt->bindValue(4, $input['max_weight'] ?? 0);
        $stmt->bindValue(5, $input['rate']);
        $stmt->bindValue(6, $input['insurance'] ?? 0);
        $stmt->bindValue(7, $input['description'] ?? '');

        if ($stmt->execute()) {
            echo json_encode([
                'id' => $db->lastInsertRowID(),
                'name' => $input['name'],
                'type' => $input['type'] ?? 'flat',
                'min_weight' => $input['min_weight'] ?? 0,
                'max_weight' => $input['max_weight'] ?? 0,
                'rate' => $input['rate'],
                'insurance' => $input['insurance'] ?? 0,
                'description' => $input['description'] ?? ''
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create shipping rate']);
        }
    }
    elseif (preg_match('/\/shipping-rates\/(\d+)/', $path, $matches) && $method === 'PUT') {
        $id = $matches[1];
        $input = json_decode(file_get_contents('php://input'), true);

        $stmt = $db->prepare('UPDATE shipping_rates SET name = ?, type = ?, min_weight = ?, max_weight = ?, rate = ?, insurance = ?, description = ? WHERE id = ?');
        $stmt->bindValue(1, $input['name']);
        $stmt->bindValue(2, $input['type']);
        $stmt->bindValue(3, $input['min_weight']);
        $stmt->bindValue(4, $input['max_weight']);
        $stmt->bindValue(5, $input['rate']);
        $stmt->bindValue(6, $input['insurance']);
        $stmt->bindValue(7, $input['description']);
        $stmt->bindValue(8, $id);

        if ($stmt->execute()) {
            echo json_encode(['message' => 'Shipping rate updated']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update shipping rate']);
        }
    }
    elseif (preg_match('/\/shipping-rates\/(\d+)/', $path, $matches) && $method === 'DELETE') {
        $id = $matches[1];
        $stmt = $db->prepare('DELETE FROM shipping_rates WHERE id = ?');
        $stmt->bindValue(1, $id);

        if ($stmt->execute()) {
            echo json_encode(['message' => 'Shipping rate deleted']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete shipping rate']);
        }
    }
    elseif ($path === '/pickup-rates' && $method === 'GET') {
        $results = $db->query('SELECT * FROM pickup_rates ORDER BY zone');
        $data = [];
        while ($row = $results->fetchArray(SQLITE3_ASSOC)) {
            $data[] = $row;
        }
        echo json_encode($data);
    }
    elseif ($path === '/pickup-rates' && $method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input || !isset($input['zone']) || !isset($input['rate'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Zone and rate are required']);
            exit();
        }

        $stmt = $db->prepare('INSERT INTO pickup_rates (zone, min_weight, max_weight, rate, description) VALUES (?, ?, ?, ?, ?)');
        $stmt->bindValue(1, $input['zone']);
        $stmt->bindValue(2, $input['min_weight'] ?? 0);
        $stmt->bindValue(3, $input['max_weight'] ?? 0);
        $stmt->bindValue(4, $input['rate']);
        $stmt->bindValue(5, $input['description'] ?? '');

        if ($stmt->execute()) {
            echo json_encode([
                'id' => $db->lastInsertRowID(),
                'zone' => $input['zone'],
                'min_weight' => $input['min_weight'] ?? 0,
                'max_weight' => $input['max_weight'] ?? 0,
                'rate' => $input['rate'],
                'description' => $input['description'] ?? ''
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create pickup rate']);
        }
    }
    elseif (preg_match('/\/pickup-rates\/(\d+)/', $path, $matches) && $method === 'PUT') {
        $id = $matches[1];
        $input = json_decode(file_get_contents('php://input'), true);

        $stmt = $db->prepare('UPDATE pickup_rates SET zone = ?, min_weight = ?, max_weight = ?, rate = ?, description = ? WHERE id = ?');
        $stmt->bindValue(1, $input['zone']);
        $stmt->bindValue(2, $input['min_weight']);
        $stmt->bindValue(3, $input['max_weight']);
        $stmt->bindValue(4, $input['rate']);
        $stmt->bindValue(5, $input['description']);
        $stmt->bindValue(6, $id);

        if ($stmt->execute()) {
            echo json_encode(['message' => 'Pickup rate updated']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update pickup rate']);
        }
    }
    elseif (preg_match('/\/pickup-rates\/(\d+)/', $path, $matches) && $method === 'DELETE') {
        $id = $matches[1];
        $stmt = $db->prepare('DELETE FROM pickup_rates WHERE id = ?');
        $stmt->bindValue(1, $id);

        if ($stmt->execute()) {
            echo json_encode(['message' => 'Pickup rate deleted']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete pickup rate']);
        }
    }
    elseif ($path === '/shipments' && $method === 'GET') {
        $status = isset($_GET['status']) ? $_GET['status'] : null;
        $query = 'SELECT * FROM shipments ORDER BY date_created DESC';
        $params = [];

        if ($status && $status !== 'all') {
            $query = 'SELECT * FROM shipments WHERE status = ? ORDER BY date_created DESC';
            $params = [$status];
        }

        $stmt = $db->prepare($query);
        if (!empty($params)) {
            $stmt->bindValue(1, $params[0]);
        }

        $results = $stmt->execute();
        $data = [];
        while ($row = $results->fetchArray(SQLITE3_ASSOC)) {
            $data[] = $row;
        }
        echo json_encode($data);
    }
    elseif ($path === '/shipments' && $method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input || !isset($input['shipper_name']) || !isset($input['receiver_name']) || !isset($input['origin']) || !isset($input['destination'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Shipper name, receiver name, origin, and destination are required']);
            exit();
        }

        // Generate tracking number
        $tracking_number = 'SHIP' . str_pad(mt_rand(1, 999999999999), 12, '0', STR_PAD_LEFT) . '-COLISSELECT';

        $stmt = $db->prepare('INSERT INTO shipments (tracking_number, shipper_name, shipper_address, shipper_phone, shipper_email, receiver_name, receiver_address, receiver_phone, receiver_email, origin, destination, status, packages, total_weight, product, quantity, payment_mode, total_freight, expected_delivery, departure_time, pickup_date, pickup_time, comments, date_created) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

        $stmt->bindValue(1, $tracking_number);
        $stmt->bindValue(2, $input['shipper_name']);
        $stmt->bindValue(3, $input['shipper_address'] ?? '');
        $stmt->bindValue(4, $input['shipper_phone'] ?? '');
        $stmt->bindValue(5, $input['shipper_email'] ?? '');
        $stmt->bindValue(6, $input['receiver_name']);
        $stmt->bindValue(7, $input['receiver_address'] ?? '');
        $stmt->bindValue(8, $input['receiver_phone'] ?? '');
        $stmt->bindValue(9, $input['receiver_email'] ?? '');
        $stmt->bindValue(10, $input['origin']);
        $stmt->bindValue(11, $input['destination']);
        $stmt->bindValue(12, 'processing');
        $stmt->bindValue(13, $input['packages'] ?? 1);
        $stmt->bindValue(14, $input['total_weight'] ?? 0);
        $stmt->bindValue(15, $input['product'] ?? '');
        $stmt->bindValue(16, $input['quantity'] ?? 1);
        $stmt->bindValue(17, $input['payment_mode'] ?? 'Cash');
        $stmt->bindValue(18, $input['total_freight'] ?? 0);
        $stmt->bindValue(19, $input['expected_delivery'] ?? '');
        $stmt->bindValue(20, $input['departure_time'] ?? '');
        $stmt->bindValue(21, $input['pickup_date'] ?? '');
        $stmt->bindValue(22, $input['pickup_time'] ?? '');
        $stmt->bindValue(23, $input['comments'] ?? '');
        $stmt->bindValue(24, date('Y-m-d'));

        if ($stmt->execute()) {
            $shipmentId = $db->lastInsertRowID();

            // Add initial tracking history
            $historyStmt = $db->prepare('INSERT INTO tracking_history (shipment_id, date_time, location, status, description, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?)');
            $historyStmt->bindValue(1, $shipmentId);
            $historyStmt->bindValue(2, date('Y-m-d H:i:s'));
            $historyStmt->bindValue(3, 'Origin Facility');
            $historyStmt->bindValue(4, 'processing');
            $historyStmt->bindValue(5, 'Package received and being processed');
            $historyStmt->bindValue(6, 48.8566);
            $historyStmt->bindValue(7, 2.3522);
            $historyStmt->execute();

            echo json_encode([
                'id' => $shipmentId,
                'tracking_number' => $tracking_number,
                'shipper_name' => $input['shipper_name'],
                'shipper_address' => $input['shipper_address'] ?? '',
                'shipper_phone' => $input['shipper_phone'] ?? '',
                'shipper_email' => $input['shipper_email'] ?? '',
                'receiver_name' => $input['receiver_name'],
                'receiver_address' => $input['receiver_address'] ?? '',
                'receiver_phone' => $input['receiver_phone'] ?? '',
                'receiver_email' => $input['receiver_email'] ?? '',
                'origin' => $input['origin'],
                'destination' => $input['destination'],
                'status' => 'processing',
                'packages' => $input['packages'] ?? 1,
                'total_weight' => $input['total_weight'] ?? 0,
                'product' => $input['product'] ?? '',
                'quantity' => $input['quantity'] ?? 1,
                'payment_mode' => $input['payment_mode'] ?? 'Cash',
                'total_freight' => $input['total_freight'] ?? 0,
                'expected_delivery' => $input['expected_delivery'] ?? '',
                'departure_time' => $input['departure_time'] ?? '',
                'pickup_date' => $input['pickup_date'] ?? '',
                'pickup_time' => $input['pickup_time'] ?? '',
                'comments' => $input['comments'] ?? '',
                'date_created' => date('Y-m-d')
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create shipment']);
        }
    }
    elseif (preg_match('/\/shipments\/(\d+)/', $path, $matches) && $method === 'PUT') {
        $id = $matches[1];
        $input = json_decode(file_get_contents('php://input'), true);

        $stmt = $db->prepare('UPDATE shipments SET shipper_name = ?, shipper_address = ?, shipper_phone = ?, shipper_email = ?, receiver_name = ?, receiver_address = ?, receiver_phone = ?, receiver_email = ?, origin = ?, destination = ?, status = ?, packages = ?, total_weight = ?, product = ?, quantity = ?, payment_mode = ?, total_freight = ?, expected_delivery = ?, departure_time = ?, pickup_date = ?, pickup_time = ?, comments = ? WHERE id = ?');

        $stmt->bindValue(1, $input['shipper_name']);
        $stmt->bindValue(2, $input['shipper_address']);
        $stmt->bindValue(3, $input['shipper_phone']);
        $stmt->bindValue(4, $input['shipper_email']);
        $stmt->bindValue(5, $input['receiver_name']);
        $stmt->bindValue(6, $input['receiver_address']);
        $stmt->bindValue(7, $input['receiver_phone']);
        $stmt->bindValue(8, $input['receiver_email']);
        $stmt->bindValue(9, $input['origin']);
        $stmt->bindValue(10, $input['destination']);
        $stmt->bindValue(11, $input['status']);
        $stmt->bindValue(12, $input['packages']);
        $stmt->bindValue(13, $input['total_weight']);
        $stmt->bindValue(14, $input['product']);
        $stmt->bindValue(15, $input['quantity']);
        $stmt->bindValue(16, $input['payment_mode']);
        $stmt->bindValue(17, $input['total_freight']);
        $stmt->bindValue(18, $input['expected_delivery']);
        $stmt->bindValue(19, $input['departure_time']);
        $stmt->bindValue(20, $input['pickup_date']);
        $stmt->bindValue(21, $input['pickup_time']);
        $stmt->bindValue(22, $input['comments']);
        $stmt->bindValue(23, $id);

        if ($stmt->execute()) {
            echo json_encode(['message' => 'Shipment updated']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update shipment']);
        }
    }
    elseif (preg_match('/\/shipments\/(\d+)/', $path, $matches) && $method === 'DELETE') {
        $id = $matches[1];
        $stmt = $db->prepare('DELETE FROM shipments WHERE id = ?');
        $stmt->bindValue(1, $id);

        if ($stmt->execute()) {
            echo json_encode(['message' => 'Shipment deleted']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete shipment']);
        }
    }
    elseif ($path === '/users' && $method === 'GET') {
        $results = $db->query('SELECT * FROM users ORDER BY name');
        $data = [];
        while ($row = $results->fetchArray(SQLITE3_ASSOC)) {
            $data[] = $row;
        }
        echo json_encode($data);
    }
    elseif ($path === '/users' && $method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input || !isset($input['name']) || !isset($input['email'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Name and email are required']);
            exit();
        }

        $stmt = $db->prepare('INSERT INTO users (name, email, role, branch, status, created_at) VALUES (?, ?, ?, ?, ?, ?)');
        $stmt->bindValue(1, $input['name']);
        $stmt->bindValue(2, $input['email']);
        $stmt->bindValue(3, $input['role'] ?? 'agent');
        $stmt->bindValue(4, $input['branch'] ?? '');
        $stmt->bindValue(5, $input['status'] ?? 'active');
        $stmt->bindValue(6, date('Y-m-d H:i:s'));

        if ($stmt->execute()) {
            echo json_encode([
                'id' => $db->lastInsertRowID(),
                'name' => $input['name'],
                'email' => $input['email'],
                'role' => $input['role'] ?? 'agent',
                'branch' => $input['branch'] ?? '',
                'status' => $input['status'] ?? 'active',
                'created_at' => date('Y-m-d H:i:s')
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create user']);
        }
    }
    elseif (preg_match('/\/users\/(\d+)/', $path, $matches) && $method === 'PUT') {
        $id = $matches[1];
        $input = json_decode(file_get_contents('php://input'), true);

        $stmt = $db->prepare('UPDATE users SET name = ?, email = ?, role = ?, branch = ?, status = ? WHERE id = ?');
        $stmt->bindValue(1, $input['name']);
        $stmt->bindValue(2, $input['email']);
        $stmt->bindValue(3, $input['role']);
        $stmt->bindValue(4, $input['branch']);
        $stmt->bindValue(5, $input['status']);
        $stmt->bindValue(6, $id);

        if ($stmt->execute()) {
            echo json_encode(['message' => 'User updated']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update user']);
        }
    }
    elseif (preg_match('/\/users\/(\d+)/', $path, $matches) && $method === 'DELETE') {
        $id = $matches[1];
        $stmt = $db->prepare('DELETE FROM users WHERE id = ?');
        $stmt->bindValue(1, $id);

        if ($stmt->execute()) {
            echo json_encode(['message' => 'User deleted']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete user']);
        }
    }
    elseif (preg_match('/\/track\/(.+)/', $path, $matches) && $method === 'GET') {
        $trackingNumber = $matches[1];

        $stmt = $db->prepare('SELECT * FROM shipments WHERE tracking_number = ?');
        $stmt->bindValue(1, $trackingNumber);
        $result = $stmt->execute();
        $shipment = $result->fetchArray(SQLITE3_ASSOC);

        if (!$shipment) {
            http_response_code(404);
            echo json_encode(['error' => 'Shipment not found']);
            exit();
        }

        // Get tracking history
        $historyStmt = $db->prepare('SELECT date_time, location, status, description, latitude, longitude FROM tracking_history WHERE shipment_id = ? ORDER BY date_time DESC');
        $historyStmt->bindValue(1, $shipment['id']);
        $historyResult = $historyStmt->execute();
        $history = [];
        while ($row = $historyResult->fetchArray(SQLITE3_ASSOC)) {
            $history[] = $row;
        }

        echo json_encode([
            'shipment' => $shipment,
            'history' => $history
        ]);
    }
    else {
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error: ' . $e->getMessage()]);
}

// Close database connection
$db->close();
?>
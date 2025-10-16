const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

console.log('Checking for duplicates...');

// Check shipping_rates duplicates
db.all('SELECT name, COUNT(*) as count FROM shipping_rates GROUP BY name HAVING COUNT(*) > 1', [], (err, rows) => {
  if (err) {
    console.error('Error checking shipping_rates:', err.message);
  } else {
    console.log('Shipping rates duplicates:');
    rows.forEach(row => console.log(`  ${row.name}: ${row.count} entries`));
  }
});

// Check pickup_rates duplicates
db.all('SELECT zone, min_weight, max_weight, COUNT(*) as count FROM pickup_rates GROUP BY zone, min_weight, max_weight HAVING COUNT(*) > 1', [], (err, rows) => {
  if (err) {
    console.error('Error checking pickup_rates:', err.message);
  } else {
    console.log('Pickup rates duplicates:');
    rows.forEach(row => console.log(`  ${row.zone} (${row.min_weight}-${row.max_weight}kg): ${row.count} entries`));
  }
});

// Remove duplicates from shipping_rates (keep the first one)
db.run(`
  DELETE FROM shipping_rates
  WHERE id NOT IN (
    SELECT MIN(id)
    FROM shipping_rates
    GROUP BY name, type, min_weight, max_weight, rate, insurance, description
  )
`, [], function(err) {
  if (err) {
    console.error('Error removing shipping_rates duplicates:', err.message);
  } else {
    console.log(`Removed ${this.changes} duplicate shipping_rates entries`);
  }
});

// Remove duplicates from pickup_rates (keep the first one)
db.run(`
  DELETE FROM pickup_rates
  WHERE id NOT IN (
    SELECT MIN(id)
    FROM pickup_rates
    GROUP BY zone, min_weight, max_weight, rate, description
  )
`, [], function(err) {
  if (err) {
    console.error('Error removing pickup_rates duplicates:', err.message);
  } else {
    console.log(`Removed ${this.changes} duplicate pickup_rates entries`);
  }
});

// Add unique constraints to prevent future duplicates
db.run(`
  CREATE UNIQUE INDEX IF NOT EXISTS idx_shipping_rates_unique
  ON shipping_rates (name, type, min_weight, max_weight, rate, insurance, description)
`, [], (err) => {
  if (err) {
    console.error('Error creating shipping_rates unique index:', err.message);
  } else {
    console.log('Created unique index for shipping_rates');
  }
});

db.run(`
  CREATE UNIQUE INDEX IF NOT EXISTS idx_pickup_rates_unique
  ON pickup_rates (zone, min_weight, max_weight, rate, description)
`, [], (err) => {
  if (err) {
    console.error('Error creating pickup_rates unique index:', err.message);
  } else {
    console.log('Created unique index for pickup_rates');
  }
});

// Verify fixes
setTimeout(() => {
  db.all('SELECT COUNT(*) as count FROM shipping_rates', [], (err, rows) => {
    if (err) console.error(err);
    else console.log(`Shipping rates count: ${rows[0].count}`);
  });

  db.all('SELECT COUNT(*) as count FROM pickup_rates', [], (err, rows) => {
    if (err) console.error(err);
    else console.log(`Pickup rates count: ${rows[0].count}`);
  });

  db.close((err) => {
    if (err) console.error('Error closing database:', err.message);
    else console.log('Database fixes completed.');
  });
}, 100);
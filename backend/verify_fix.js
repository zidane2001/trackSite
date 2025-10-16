const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

console.log('Verifying database fixes...');

// Check for remaining duplicates in shipping_rates
db.all('SELECT name, COUNT(*) as count FROM shipping_rates GROUP BY name HAVING COUNT(*) > 1', [], (err, rows) => {
  if (err) {
    console.error('Error checking shipping_rates:', err.message);
  } else {
    if (rows.length === 0) {
      console.log('✓ No duplicates found in shipping_rates');
    } else {
      console.log('✗ Still have duplicates in shipping_rates:');
      rows.forEach(row => console.log(`  ${row.name}: ${row.count} entries`));
    }
  }
});

// Check for remaining duplicates in pickup_rates
db.all('SELECT zone, min_weight, max_weight, COUNT(*) as count FROM pickup_rates GROUP BY zone, min_weight, max_weight HAVING COUNT(*) > 1', [], (err, rows) => {
  if (err) {
    console.error('Error checking pickup_rates:', err.message);
  } else {
    if (rows.length === 0) {
      console.log('✓ No duplicates found in pickup_rates');
    } else {
      console.log('✗ Still have duplicates in pickup_rates:');
      rows.forEach(row => console.log(`  ${row.zone} (${row.min_weight}-${row.max_weight}kg): ${row.count} entries`));
    }
  }
});

// Show final counts
db.all('SELECT COUNT(*) as count FROM shipping_rates', [], (err, rows) => {
  if (err) console.error(err);
  else console.log(`Final shipping_rates count: ${rows[0].count}`);
});

db.all('SELECT COUNT(*) as count FROM pickup_rates', [], (err, rows) => {
  if (err) console.error(err);
  else console.log(`Final pickup_rates count: ${rows[0].count}`);
});

// Check other tables for any issues
db.all('SELECT COUNT(*) as count FROM locations', [], (err, rows) => {
  if (err) console.error(err);
  else console.log(`Locations count: ${rows[0].count}`);
});

db.all('SELECT COUNT(*) as count FROM zones', [], (err, rows) => {
  if (err) console.error(err);
  else console.log(`Zones count: ${rows[0].count}`);
});

db.all('SELECT COUNT(*) as count FROM shipments', [], (err, rows) => {
  if (err) console.error(err);
  else console.log(`Shipments count: ${rows[0].count}`);
});

db.all('SELECT COUNT(*) as count FROM users', [], (err, rows) => {
  if (err) console.error(err);
  else console.log(`Users count: ${rows[0].count}`);
});

db.close((err) => {
  if (err) console.error('Error closing database:', err.message);
  else console.log('Verification completed.');
});
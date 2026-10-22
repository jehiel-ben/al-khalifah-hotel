import { run, get, all } from './database.js';

export function createTables() {
  console.log('🔨 Création des tables...');

  // Table : types de chambres
  run(`
    CREATE TABLE IF NOT EXISTS room_types (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT,
      base_price REAL NOT NULL DEFAULT 0,
      capacity INTEGER NOT NULL DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Table : chambres
  run(`
    CREATE TABLE IF NOT EXISTS rooms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      room_number TEXT NOT NULL UNIQUE,
      room_type_id INTEGER NOT NULL,
      floor INTEGER DEFAULT 1,
      status TEXT DEFAULT 'available',
      image_url TEXT,
      description TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (room_type_id) REFERENCES room_types(id) ON DELETE RESTRICT
    )
  `);

  // Table : services
  run(`
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL DEFAULT 0,
      icon TEXT,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Table : réservations
  run(`
    CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reference TEXT NOT NULL UNIQUE,
      customer_name TEXT NOT NULL,
      customer_email TEXT,
      customer_phone TEXT,
      room_id INTEGER NOT NULL,
      check_in TEXT NOT NULL,
      check_out TEXT NOT NULL,
      guests INTEGER DEFAULT 1,
      total_amount REAL DEFAULT 0,
      status TEXT DEFAULT 'pending',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE RESTRICT
    )
  `);

  // Table : services par réservation (relation many-to-many)
  run(`
    CREATE TABLE IF NOT EXISTS reservation_services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reservation_id INTEGER NOT NULL,
      service_id INTEGER NOT NULL,
      quantity INTEGER DEFAULT 1,
      unit_price REAL DEFAULT 0,
      FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE CASCADE,
      FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE RESTRICT
    )
  `);

  // Table : paiements
  run(`
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reservation_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      method TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      reference TEXT,
      paid_at TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE CASCADE
    )
  `);

  console.log('✅ Tables créées avec succès');
}

export function dropTables() {
  console.log('🗑️  Suppression des tables...');
  run('DROP TABLE IF EXISTS payments');
  run('DROP TABLE IF EXISTS reservation_services');
  run('DROP TABLE IF EXISTS reservations');
  run('DROP TABLE IF EXISTS services');
  run('DROP TABLE IF EXISTS rooms');
  run('DROP TABLE IF EXISTS room_types');
  console.log('✅ Tables supprimées');
}
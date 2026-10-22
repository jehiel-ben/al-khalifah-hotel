import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'hotel.db');

// Initialiser SQL.js
const SQL = await initSqlJs();

// Charger la base si elle existe, sinon en créer une nouvelle
let db;
if (fs.existsSync(dbPath)) {
  const fileBuffer = fs.readFileSync(dbPath);
  db = new SQL.Database(fileBuffer);
  console.log('📦 Base de données chargée :', dbPath);
} else {
  db = new SQL.Database();
  console.log('📦 Nouvelle base de données créée :', dbPath);
}

db.run('PRAGMA foreign_keys = ON;');

// Sauvegarde la base
export function saveDb() {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
}

// 🔥 CORRECTION : récupère last_insert_rowid AVANT saveDb
export function run(sql, params = []) {
  db.run(sql, params);

  // Récupérer last_insert_rowid IMMÉDIATEMENT après l'insert
  const result = db.exec('SELECT last_insert_rowid() AS id');
  let lastInsertRowid = null;
  if (result && result[0] && result[0].values && result[0].values[0]) {
    lastInsertRowid = result[0].values[0][0];
  }

  saveDb();
  return { lastInsertRowid };
}

export function get(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  if (stmt.step()) {
    const row = stmt.getAsObject();
    stmt.free();
    return row;
  }
  stmt.free();
  return null;
}

export function all(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

export default db;

// FONCTION TEMPORAIRE — pour vider les réservations
export function clearReservations() {
  db.run('DELETE FROM payments');
  db.run('DELETE FROM reservation_services');
  db.run('DELETE FROM reservations');
  saveDb();
  console.log('🗑️  Toutes les réservations supprimées');
}
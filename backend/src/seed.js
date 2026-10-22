import { run } from './db/database.js';
import { createTables, dropTables } from './db/schema.js';

console.log('🌱 Démarrage du seed...');

// 1. Reset des tables
dropTables();
createTables();

// 2. Types de chambres
const roomTypes = [
  { name: 'Single',  description: 'Chambre simple avec un lit, idéale pour voyageur seul', base_price: 45,  capacity: 1 },
  { name: 'Double',  description: 'Chambre double confortable avec un grand lit',           base_price: 75,  capacity: 2 },
  { name: 'Deluxe',  description: 'Chambre deluxe spacieuse avec vue et équipements premium', base_price: 120, capacity: 2 },
  { name: 'Suite',   description: 'Suite luxueuse avec salon séparé et service VIP',        base_price: 250, capacity: 4 },
];

for (const t of roomTypes) {
  run(
    `INSERT INTO room_types (name, description, base_price, capacity) VALUES (?, ?, ?, ?)`,
    [t.name, t.description, t.base_price, t.capacity]
  );
}
console.log(`✅ ${roomTypes.length} types de chambres ajoutés`);

// 3. Chambres (avec images Unsplash)
const rooms = [
  { room_number: '101', room_type_id: 1, floor: 1, status: 'available', image_url: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800', description: 'Chambre simple cosy, lit simple, bureau' },
  { room_number: '102', room_type_id: 1, floor: 1, status: 'available', image_url: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800', description: 'Chambre simple lumineuse' },
  { room_number: '201', room_type_id: 2, floor: 2, status: 'available', image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', description: 'Chambre double vue jardin' },
  { room_number: '202', room_type_id: 2, floor: 2, status: 'available', image_url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800', description: 'Chambre double moderne' },
  { room_number: '203', room_type_id: 2, floor: 2, status: 'occupied',  image_url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800', description: 'Chambre double avec balcon' },
  { room_number: '301', room_type_id: 3, floor: 3, status: 'available', image_url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800', description: 'Deluxe avec vue mer' },
  { room_number: '302', room_type_id: 3, floor: 3, status: 'available', image_url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', description: 'Deluxe avec jacuzzi' },
  { room_number: '401', room_type_id: 4, floor: 4, status: 'available', image_url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', description: 'Suite présidentielle avec salon' },
  { room_number: '402', room_type_id: 4, floor: 4, status: 'maintenance', image_url: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800', description: 'Suite panoramique' },
];

for (const r of rooms) {
  run(
    `INSERT INTO rooms (room_number, room_type_id, floor, status, image_url, description) VALUES (?, ?, ?, ?, ?, ?)`,
    [r.room_number, r.room_type_id, r.floor, r.status, r.image_url, r.description]
  );
}
console.log(`✅ ${rooms.length} chambres ajoutées`);

// 4. Services
const services = [
  { name: 'Petit-déjeuner',   description: 'Buffet continental servi de 7h à 10h',       price: 12, icon: '☕' },
  { name: 'Blanchisserie',    description: 'Service de nettoyage de vêtements 24h/24',   price: 8,  icon: '👔' },
  { name: 'Transfert aéroport', description: 'Navette privée depuis/vers l\'aéroport',    price: 35, icon: '🚗' },
  { name: 'Spa & Massage',    description: 'Accès au spa avec massage relaxant',         price: 50, icon: '💆' },
  { name: 'Room Service',     description: 'Service en chambre 24h/24',                  price: 15, icon: '🍽️' },
  { name: 'Parking privé',    description: 'Place de parking sécurisée',                 price: 10, icon: '🅿️' },
];

for (const s of services) {
  run(
    `INSERT INTO services (name, description, price, icon) VALUES (?, ?, ?, ?)`,
    [s.name, s.description, s.price, s.icon]
  );
}
console.log(`✅ ${services.length} services ajoutés`);

console.log('🎉 Seed terminé avec succès !');
process.exit(0);
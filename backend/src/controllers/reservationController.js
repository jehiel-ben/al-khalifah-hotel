import { run, get, all } from '../db/database.js';

// Génère une référence unique : RES-20261015-XXXX
function generateReference() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `RES-${date}-${random}`;
}

// Calcule le nombre de nuits entre 2 dates
function nightsBetween(checkIn, checkOut) {
  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  return Math.max(1, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)));
}

// GET /api/reservations
export function getAllReservations(req, res) {
  try {
    const { status, search } = req.query;
    let sql = `
      SELECT r.*, rm.room_number, rt.name AS type_name
      FROM reservations r
      JOIN rooms rm ON r.room_id = rm.id
      JOIN room_types rt ON rm.room_type_id = rt.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      sql += ' AND r.status = ?';
      params.push(status);
    }
    if (search) {
      sql += ' AND (r.customer_name LIKE ? OR r.reference LIKE ? OR r.customer_phone LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    sql += ' ORDER BY r.created_at DESC';

    const reservations = all(sql, params);
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/reservations/:id
export function getReservationById(req, res) {
  try {
    const reservation = get(`
      SELECT r.*, rm.room_number, rt.name AS type_name, rt.base_price
      FROM reservations r
      JOIN rooms rm ON r.room_id = rm.id
      JOIN room_types rt ON rm.room_type_id = rt.id
      WHERE r.id = ?
    `, [req.params.id]);

    if (!reservation) return res.status(404).json({ error: 'Réservation non trouvée' });

    const services = all(`
      SELECT rs.*, s.name AS service_name, s.icon
      FROM reservation_services rs
      JOIN services s ON rs.service_id = s.id
      WHERE rs.reservation_id = ?
    `, [req.params.id]);

    const payment = get('SELECT * FROM payments WHERE reservation_id = ?', [req.params.id]);

    res.json({ ...reservation, services, payment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/rooms/available?check_in=...&check_out=...
export function getAvailableRooms(req, res) {
  try {
    const { check_in, check_out } = req.query;

    if (!check_in || !check_out) {
      return res.status(400).json({ error: 'check_in et check_out sont obligatoires' });
    }
    if (new Date(check_out) <= new Date(check_in)) {
      return res.status(400).json({ error: 'La date de départ doit être après la date d\'arrivée' });
    }

    // Chambres disponibles = chambres sans réservation qui chevauche la période
    const rooms = all(`
      SELECT r.*, rt.name AS type_name, rt.base_price, rt.capacity
      FROM rooms r
      JOIN room_types rt ON r.room_type_id = rt.id
      WHERE r.status != 'maintenance'
      AND r.id NOT IN (
        SELECT room_id FROM reservations
        WHERE status IN ('pending', 'confirmed')
        AND NOT (check_out <= ? OR check_in >= ?)
      )
      ORDER BY rt.base_price ASC
    `, [check_in, check_out]);

    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /api/reservations
export function createReservation(req, res) {
  try {
    const {
      customer_name, customer_email, customer_phone,
      room_id, check_in, check_out, guests,
      services = [], // [{ service_id, quantity }]
    } = req.body;

    // Validation
    if (!customer_name || !room_id || !check_in || !check_out) {
      return res.status(400).json({ error: 'Champs obligatoires manquants' });
    }
    if (new Date(check_out) <= new Date(check_in)) {
      return res.status(400).json({ error: 'Dates invalides' });
    }

    // Vérifier que la chambre existe
    const room = get(`
      SELECT r.*, rt.base_price FROM rooms r
      JOIN room_types rt ON r.room_type_id = rt.id
      WHERE r.id = ?
    `, [room_id]);
    if (!room) return res.status(404).json({ error: 'Chambre non trouvée' });

    // Vérifier la disponibilité
    const conflict = get(`
      SELECT id FROM reservations
      WHERE room_id = ? AND status IN ('pending', 'confirmed')
      AND NOT (check_out <= ? OR check_in >= ?)
    `, [room_id, check_in, check_out]);
    if (conflict) return res.status(409).json({ error: 'Chambre non disponible pour ces dates' });

    // Calcul du total
    const nights = nightsBetween(check_in, check_out);
    const roomTotal = room.base_price * nights;
    let servicesTotal = 0;

    // Récupérer les prix des services pour calcul
    const serviceDetails = [];
    for (const s of services) {
      const svc = get('SELECT * FROM services WHERE id = ?', [s.service_id]);
      if (svc) {
        const qty = s.quantity || 1;
        servicesTotal += svc.price * qty;
        serviceDetails.push({ service_id: svc.id, quantity: qty, unit_price: svc.price });
      }
    }

    const total = roomTotal + servicesTotal;
    const reference = generateReference();

    // Créer la réservation
    const result = run(`
      INSERT INTO reservations
      (reference, customer_name, customer_email, customer_phone, room_id, check_in, check_out, guests, total_amount, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `, [
      reference, customer_name, customer_email || '', customer_phone || '',
      room_id, check_in, check_out, guests || 1, total,
    ]);

    const reservationId = result.lastInsertRowid;

    // Ajouter les services
    for (const s of serviceDetails) {
      run(`
        INSERT INTO reservation_services (reservation_id, service_id, quantity, unit_price)
        VALUES (?, ?, ?, ?)
      `, [reservationId, s.service_id, s.quantity, s.unit_price]);
    }

    const created = get('SELECT * FROM reservations WHERE id = ?', [reservationId]);
    res.status(201).json({ ...created, nights });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// PUT /api/reservations/:id
export function updateReservation(req, res) {
  try {
    const existing = get('SELECT * FROM reservations WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ error: 'Réservation non trouvée' });

    const { status, check_in, check_out, guests } = req.body;
    run(`
      UPDATE reservations SET status = ?, check_in = ?, check_out = ?, guests = ?
      WHERE id = ?
    `, [
      status ?? existing.status,
      check_in ?? existing.check_in,
      check_out ?? existing.check_out,
      guests ?? existing.guests,
      req.params.id,
    ]);

    const updated = get('SELECT * FROM reservations WHERE id = ?', [req.params.id]);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// DELETE /api/reservations/:id
export function deleteReservation(req, res) {
  try {
    const existing = get('SELECT * FROM reservations WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ error: 'Réservation non trouvée' });

    run('DELETE FROM reservations WHERE id = ?', [req.params.id]);
    res.json({ message: 'Réservation supprimée' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
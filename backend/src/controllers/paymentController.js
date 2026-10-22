import { run, get, all } from '../db/database.js';

// Génère une référence paiement
function generatePaymentRef() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `PAY-${date}-${random}`;
}

// GET /api/payments
export function getAllPayments(req, res) {
  try {
    const payments = all(`
      SELECT p.*, r.reference AS reservation_reference, r.customer_name
      FROM payments p
      JOIN reservations r ON p.reservation_id = r.id
      ORDER BY p.created_at DESC
    `);
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/payments/:id
export function getPaymentById(req, res) {
  try {
    const payment = get(`
      SELECT p.*, r.reference AS reservation_reference, r.customer_name
      FROM payments p
      JOIN reservations r ON p.reservation_id = r.id
      WHERE p.id = ?
    `, [req.params.id]);
    if (!payment) return res.status(404).json({ error: 'Paiement non trouvé' });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /api/payments
export function createPayment(req, res) {
  try {
    const { reservation_id, method } = req.body;

    if (!reservation_id || !method) {
      return res.status(400).json({ error: 'reservation_id et method obligatoires' });
    }

    const reservation = get('SELECT * FROM reservations WHERE id = ?', [reservation_id]);
    if (!reservation) return res.status(404).json({ error: 'Réservation non trouvée' });

    // Vérifier si un paiement existe déjà
    const existing = get('SELECT * FROM payments WHERE reservation_id = ?', [reservation_id]);
    if (existing) return res.status(409).json({ error: 'Un paiement existe déjà pour cette réservation' });

    const reference = generatePaymentRef();
    const paidAt = new Date().toISOString();

    const result = run(`
      INSERT INTO payments (reservation_id, amount, method, status, reference, paid_at)
      VALUES (?, ?, ?, 'completed', ?, ?)
    `, [reservation_id, reservation.total_amount, method, reference, paidAt]);

    // Mettre à jour le statut de la réservation
    run(`UPDATE reservations SET status = 'confirmed' WHERE id = ?`, [reservation_id]);

    const created = get('SELECT * FROM payments WHERE id = ?', [result.lastInsertRowid]);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// PUT /api/payments/:id
export function updatePayment(req, res) {
  try {
    const existing = get('SELECT * FROM payments WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ error: 'Paiement non trouvé' });

    const { status, method } = req.body;
    run(`UPDATE payments SET status = ?, method = ? WHERE id = ?`, [
      status ?? existing.status,
      method ?? existing.method,
      req.params.id,
    ]);
    const updated = get('SELECT * FROM payments WHERE id = ?', [req.params.id]);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
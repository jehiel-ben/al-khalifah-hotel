import { all, get } from '../db/database.js';

// GET /api/stats/dashboard
export function getDashboardStats(req, res) {
  try {
    // Compteurs principaux
    const totalRooms = get('SELECT COUNT(*) AS count FROM rooms').count;
    const totalReservations = get('SELECT COUNT(*) AS count FROM reservations').count;
    const totalRevenue = get(`SELECT COALESCE(SUM(amount), 0) AS total FROM payments WHERE status = 'completed'`).total;
    const availableRooms = get(`SELECT COUNT(*) AS count FROM rooms WHERE status = 'available'`).count;
    const occupiedRooms = get(`SELECT COUNT(*) AS count FROM rooms WHERE status = 'occupied'`).count;

    // Taux d'occupation
    const occupancyRate = totalRooms > 0
      ? Math.round(((occupiedRooms) / totalRooms) * 100)
      : 0;

    // Revenus par mois (6 derniers mois)
    const revenueByMonth = all(`
      SELECT strftime('%Y-%m', paid_at) AS month, SUM(amount) AS total
      FROM payments
      WHERE status = 'completed' AND paid_at IS NOT NULL
      GROUP BY month
      ORDER BY month DESC
      LIMIT 6
    `);

    // Réservations par statut
    const reservationsByStatus = all(`
      SELECT status, COUNT(*) AS count
      FROM reservations
      GROUP BY status
    `);

    // Types de chambres (nombre de chambres par type)
    const roomsByType = all(`
      SELECT rt.name, COUNT(r.id) AS count
      FROM room_types rt
      LEFT JOIN rooms r ON r.room_type_id = rt.id
      GROUP BY rt.id
    `);

    res.json({
      totals: {
        rooms: totalRooms,
        reservations: totalReservations,
        revenue: totalRevenue,
        availableRooms,
        occupiedRooms,
        occupancyRate,
      },
      revenueByMonth: revenueByMonth.reverse(), // du plus ancien au plus récent
      reservationsByStatus,
      roomsByType,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
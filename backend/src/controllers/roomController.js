import { run, get, all } from '../db/database.js';

// GET /api/rooms
export function getAllRooms(req, res) {
  try {
    const rooms = all(`
      SELECT r.*, rt.name AS type_name, rt.base_price, rt.capacity
      FROM rooms r
      JOIN room_types rt ON r.room_type_id = rt.id
      ORDER BY r.room_number ASC
    `);
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/rooms/:id
export function getRoomById(req, res) {
  try {
    const room = get(`
      SELECT r.*, rt.name AS type_name, rt.base_price, rt.capacity
      FROM rooms r
      JOIN room_types rt ON r.room_type_id = rt.id
      WHERE r.id = ?
    `, [req.params.id]);
    if (!room) return res.status(404).json({ error: 'Chambre non trouvée' });
    res.json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /api/rooms
export function createRoom(req, res) {
  try {
    const { room_number, room_type_id, floor, status, image_url, description } = req.body;
    if (!room_number || !room_type_id) {
      return res.status(400).json({ error: 'room_number et room_type_id sont obligatoires' });
    }
    const result = run(
      `INSERT INTO rooms (room_number, room_type_id, floor, status, image_url, description)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [room_number, room_type_id, floor || 1, status || 'available', image_url || '', description || '']
    );
    const created = get('SELECT * FROM rooms WHERE id = ?', [result.lastInsertRowid]);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// PUT /api/rooms/:id
export function updateRoom(req, res) {
  try {
    const existing = get('SELECT * FROM rooms WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ error: 'Chambre non trouvée' });

    const { room_number, room_type_id, floor, status, image_url, description } = req.body;
    run(
      `UPDATE rooms SET room_number = ?, room_type_id = ?, floor = ?, status = ?, image_url = ?, description = ?
       WHERE id = ?`,
      [
        room_number ?? existing.room_number,
        room_type_id ?? existing.room_type_id,
        floor ?? existing.floor,
        status ?? existing.status,
        image_url ?? existing.image_url,
        description ?? existing.description,
        req.params.id,
      ]
    );
    const updated = get('SELECT * FROM rooms WHERE id = ?', [req.params.id]);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// DELETE /api/rooms/:id
export function deleteRoom(req, res) {
  try {
    const existing = get('SELECT * FROM rooms WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ error: 'Chambre non trouvée' });

    run('DELETE FROM rooms WHERE id = ?', [req.params.id]);
    res.json({ message: 'Chambre supprimée avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
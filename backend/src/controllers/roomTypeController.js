import { run, get, all } from '../db/database.js';

// GET /api/room-types
export function getAllRoomTypes(req, res) {
  try {
    const types = all('SELECT * FROM room_types ORDER BY id ASC');
    res.json(types);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/room-types/:id
export function getRoomTypeById(req, res) {
  try {
    const type = get('SELECT * FROM room_types WHERE id = ?', [req.params.id]);
    if (!type) return res.status(404).json({ error: 'Type non trouvé' });
    res.json(type);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /api/room-types
export function createRoomType(req, res) {
  try {
    const { name, description, base_price, capacity } = req.body;
    if (!name || base_price == null) {
      return res.status(400).json({ error: 'name et base_price sont obligatoires' });
    }
    const result = run(
      `INSERT INTO room_types (name, description, base_price, capacity) VALUES (?, ?, ?, ?)`,
      [name, description || '', base_price, capacity || 1]
    );
    const created = get('SELECT * FROM room_types WHERE id = ?', [result.lastInsertRowid]);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// PUT /api/room-types/:id
export function updateRoomType(req, res) {
  try {
    const { name, description, base_price, capacity } = req.body;
    const existing = get('SELECT * FROM room_types WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ error: 'Type non trouvé' });

    run(
      `UPDATE room_types SET name = ?, description = ?, base_price = ?, capacity = ? WHERE id = ?`,
      [
        name ?? existing.name,
        description ?? existing.description,
        base_price ?? existing.base_price,
        capacity ?? existing.capacity,
        req.params.id,
      ]
    );
    const updated = get('SELECT * FROM room_types WHERE id = ?', [req.params.id]);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// DELETE /api/room-types/:id
export function deleteRoomType(req, res) {
  try {
    const existing = get('SELECT * FROM room_types WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ error: 'Type non trouvé' });

    // Vérifier qu'aucune chambre n'utilise ce type
    const used = get('SELECT COUNT(*) as count FROM rooms WHERE room_type_id = ?', [req.params.id]);
    if (used.count > 0) {
      return res.status(400).json({ error: 'Impossible : des chambres utilisent ce type' });
    }

    run('DELETE FROM room_types WHERE id = ?', [req.params.id]);
    res.json({ message: 'Type supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
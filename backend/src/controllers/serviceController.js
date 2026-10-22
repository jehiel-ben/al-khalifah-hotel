import { run, get, all } from '../db/database.js';

// GET /api/services
export function getAllServices(req, res) {
  try {
    const services = all('SELECT * FROM services ORDER BY id ASC');
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/services/:id
export function getServiceById(req, res) {
  try {
    const service = get('SELECT * FROM services WHERE id = ?', [req.params.id]);
    if (!service) return res.status(404).json({ error: 'Service non trouvé' });
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /api/services
export function createService(req, res) {
  try {
    const { name, description, price, icon, is_active } = req.body;
    if (!name || price == null) {
      return res.status(400).json({ error: 'name et price sont obligatoires' });
    }
    const result = run(
      `INSERT INTO services (name, description, price, icon, is_active) VALUES (?, ?, ?, ?, ?)`,
      [name, description || '', price, icon || '✨', is_active ?? 1]
    );
    const created = get('SELECT * FROM services WHERE id = ?', [result.lastInsertRowid]);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// PUT /api/services/:id
export function updateService(req, res) {
  try {
    const existing = get('SELECT * FROM services WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ error: 'Service non trouvé' });

    const { name, description, price, icon, is_active } = req.body;
    run(
      `UPDATE services SET name = ?, description = ?, price = ?, icon = ?, is_active = ? WHERE id = ?`,
      [
        name ?? existing.name,
        description ?? existing.description,
        price ?? existing.price,
        icon ?? existing.icon,
        is_active ?? existing.is_active,
        req.params.id,
      ]
    );
    const updated = get('SELECT * FROM services WHERE id = ?', [req.params.id]);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// DELETE /api/services/:id
export function deleteService(req, res) {
  try {
    const existing = get('SELECT * FROM services WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ error: 'Service non trouvé' });

    run('DELETE FROM services WHERE id = ?', [req.params.id]);
    res.json({ message: 'Service supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
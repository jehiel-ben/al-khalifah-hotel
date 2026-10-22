import express from 'express';
import {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
} from '../controllers/roomController.js';
import { getAvailableRooms } from '../controllers/reservationController.js';

const router = express.Router();

router.get('/', getAllRooms);

// ⚠️ IMPORTANT : /available doit être AVANT /:id
router.get('/available', getAvailableRooms);

router.get('/:id', getRoomById);
router.post('/', createRoom);
router.put('/:id', updateRoom);
router.delete('/:id', deleteRoom);

export default router;
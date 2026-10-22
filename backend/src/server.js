import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createTables } from './db/schema.js';

import roomTypesRouter from './routes/roomTypes.js';
import roomsRouter from './routes/rooms.js';
import servicesRouter from './routes/services.js';
import reservationsRouter from './routes/reservations.js';
import paymentsRouter from './routes/payments.js';
import statsRouter from './routes/stats.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: '🏨 Hotel Management API',
    status: 'OK',
    version: '1.0.0',
  });
});

// Routes
app.use('/api/room-types', roomTypesRouter);
app.use('/api/rooms', roomsRouter);
app.use('/api/services', servicesRouter);
app.use('/api/reservations', reservationsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/stats', statsRouter);

createTables();

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
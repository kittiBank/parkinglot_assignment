import express from 'express';
import parkingLotRoutes from './routes/parkingLotRoutes'
import ticketsRoutes from './routes/ticketsRoutes'

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/parking-lots', parkingLotRoutes);
app.use('/tickets', ticketsRoutes);

export default app;

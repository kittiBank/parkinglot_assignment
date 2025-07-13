import express from 'express';
import parkingLotRoutes from './routes/parkingLotRoutes'

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/parking-lots', parkingLotRoutes);

export default app;

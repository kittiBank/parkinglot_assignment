import express from 'express';
import parkingLotRoutes from './routes/parkingLotRoutes'
//import parkingLotRouter from './routes/parkingLotRoutes';

const app = express();

// Middleware
app.use(express.json());          // รับ JSON body

// Routes
//app.get('/', (req, res) => {res.send('API is running');});
app.use('/parking-lots', parkingLotRoutes);

export default app;

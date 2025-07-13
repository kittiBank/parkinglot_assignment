import { Router } from "express";
import { createParkingLot, getParkingLots, getParkingLotById } from '../controllers/parkingLotController';

const routes = Router();

routes.post('/', createParkingLot)
routes.get('/', getParkingLots);
routes.get('/:slot_id', getParkingLotById);

export default routes;
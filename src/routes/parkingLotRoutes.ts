import { Router } from "express";
import { createParkingLot } from '../controllers/parkingLotController';

const routes = Router();

routes.post('/', createParkingLot)

export default routes;
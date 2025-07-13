import { Router } from "express";
import { createParkingLot, deleteAllParkingLots, getParkingLots, getParkingLotById } from '../controllers/parkingLotController';

const routes = Router();

//POST /parking-lots           – create parking lot -DONE
routes.post('/', createParkingLot)

// DELETE /parking-lots         – reset all
routes.delete('/', deleteAllParkingLots);

// GET /parking-lots            – get all slots OR filter by carSizeId & status
routes.get('/', getParkingLots);

// GET /parking-lots/:slotId    – get single slot
routes.get('/:slotId', getParkingLotById);

export default routes;
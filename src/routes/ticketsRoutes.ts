import { Router } from "express";
import { createTicket, leaveTicket, getSlotsByCarSize, getPlatesByCarSize } from '../controllers/ticketsController'

const routes = Router();

routes.post('/', createTicket);
routes.patch('/:slot_id', leaveTicket);
routes.get('/:car_size', getSlotsByCarSize);
routes.get('/:car_size', getPlatesByCarSize);

export default routes;
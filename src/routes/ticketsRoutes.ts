import { Router } from "express";
import { createTicket, leaveTicket, getTickets } from '../controllers/ticketsController'

const routes = Router();

// POST /tickets                – create ticket (park car)
routes.post('/', createTicket);

// PATCH /tickets/:ticketId     – leave ticket
routes.patch('/:ticketId', leaveTicket);

// GET /tickets                 – query by carSizeId & active
routes.get('/', getTickets);

export default routes;
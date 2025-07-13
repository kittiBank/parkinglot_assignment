import { Request, Response } from 'express';

/** POST /tickets */
export const createTicket = async (req: Request, res: Response) => {
    // body: { plateNumber, carSizeId }
    return res.status(501).json({ message: 'Not implemented createTicket' });
}

/** PATCH /tickets/:ticketId */
export const leaveTicket = async (req: Request, res: Response) => {
    // body: { leaveDate }
    return res.status(501).json({ message: 'Not implemented leaveTicket' });
}

/** GET /tickets */
export const getTickets = async (req: Request, res: Response) => {
    // query: ?carSizeId=S&active=true
    return res.status(501).json({ message: 'Not implemented getTickets' });
}
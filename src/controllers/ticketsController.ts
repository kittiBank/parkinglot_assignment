import { Request, Response } from 'express';
import { pool } from '../config/db';
import { RowDataPacket } from 'mysql2/promise';
import { ResultSetHeader } from 'mysql2/promise';

export const createTicket = async (req: Request, res: Response) => {
    try {
        const { plate_number, car_size } = req.body;

        if (!plate_number) {
            return res.status(400).json({ message: 'Plate number is required' });
        }

        if (!car_size || !['S', 'M', 'L'].includes(car_size)) {
            return res.status(400).json({ message: 'Car size is required and must be S, M, L' });
        }

        //DB Transaction
        try {

            const conn = await pool.getConnection();
            await conn.beginTransaction();

            //Find nearest slot
            const [rows] = await conn.query<(RowDataPacket & { id: number; slot_id: string })[]>
                (`SELECT id, slot_id FROM parking_lots WHERE is_reserved = 0 ORDER BY slot_id ASC LIMIT 1`);

            if (rows.length === 0) {
                await conn.rollback();
                conn.release();
                return res.status(409).json({ message: 'No available parking slot' });
            }

            const { id: parkingLotId, slot_id } = rows[0];

            //Update slot to reserved
            await conn.query(`UPDATE parking_lots SET is_reserved = 1, modified_at = NOW() WHERE id = ?`,
                [parkingLotId],
            );

            //Create new ticket
            const [ticketResult] = await conn.query<ResultSetHeader & { insertId: number }>(
                `INSERT INTO tickets (plate_number, car_size_code, slot_id, active, created_at)
                VALUES ( ?, ?, ?, 1, NOW())`,
                [plate_number, car_size, slot_id],
            );

            await conn.commit();
            conn.release();

            return res.status(201).json({
                ticket_id: ticketResult.insertId,
                slot_id,
                plate_number,
                car_size_code: car_size,
                message: 'Ticket created success',
            });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }

    } catch (error) {
        return res.status(500).json({ message: 'Internal error' });
    }

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
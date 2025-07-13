import { Request, Response } from 'express';
import { pool } from '../config/db';
import { RowDataPacket } from 'mysql2/promise';
import { ResultSetHeader } from 'mysql2/promise';

//To create new ticket with plate number and car size
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
        const conn = await pool.getConnection();

        try {
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
            return res.status(201).json({
                ticket_id: ticketResult.insertId,
                slot_id,
                plate_number,
                car_size_code: car_size,
                message: `Ticket ${slot_id} created success`,
            });

        } catch (err) {
            if (conn) await conn.rollback();
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        } finally {
            if (conn) conn.release();
        }

    } catch (error) {
        return res.status(500).json({ message: 'Internal error' });
    }

}

//To leave ticket
export const leaveTicket = async (req: Request, res: Response) => {
    try {
        const { slot_id } = req.params;

        if (!slot_id || slot_id.trim() === '') {
            return res.status(400).json({ status: 400, message: 'Slot is required' });
        }

        //DB Transaction
        const conn = await pool.getConnection();

        try {
            await conn.beginTransaction();

            //Check slot_id in parking lots
            const [rows] = await conn.query(
                `SELECT id FROM tickets WHERE slot_id = ? AND active = 1 LIMIT 1`,
                [slot_id]
            );

            if ((rows as any[]).length === 0) {
                return res.status(404).json({ status: 404, message: `Not found slot number ${slot_id}` });
            }

            //Update partking slot to avaiable
            await conn.query(
                `UPDATE parking_lots SET is_reserved = 0, modified_at = NOW() WHERE slot_id = ?`,
                [slot_id]
            );

            //Update ticket to leave
            await conn.query(
                `UPDATE tickets SET active = 0, leave_at = NOW() WHERE slot_id = ? AND active = 1`,
                [slot_id]
            );

            await conn.commit();
            return res.status(200).json({ status: 200, message: `Slot ${slot_id} is available` });

        } catch (error) {
            if (conn) await conn.rollback();
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        } finally {
            if (conn) conn.release();
        }

    } catch (error) {
        return res.status(500).json({ message: 'Internal error' });
    }

}

//To view all slot by car size
export const getSlotsByCarSize = async (req: Request, res: Response) => {
    const { car_size } = req.params;

    try {
        const [rows] = await pool.query(
            `SELECT tk.slot_id, cz.description AS car_size
            FROM tickets tk
            INNER JOIN car_size cz ON cz.code = tk.car_size_code
            WHERE tk.active = 1 AND cz.code = ? 
            ORDER BY tk.slot_id;`,
            [car_size.trim().toLowerCase()]
        );

        return res.json({ data: rows });

    } catch (error) {
        return res.status(500).json({ message: 'Internal error' });
    }
}

//To view all plat number by car size
export const getPlatesByCarSize = async (req: Request, res: Response) => {

    const { car_size } = req.params;

    try {
        const [rows] = await pool.query(
            `SELECT tk.plate_number, tk.slot_id, cz.description AS car_size
            FROM tickets tk
            INNER JOIN car_size cz ON cz.code = tk.car_size_code
            WHERE tk.active = 1 AND cz.code = ? ORDER BY tk.plate_number;`,
            [car_size.trim().toLowerCase()]
        );

        return res.json({ data: rows });

    } catch (error) {
        return res.status(500).json({ message: 'Internal error' });
    }
};
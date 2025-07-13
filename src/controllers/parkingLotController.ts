import { Request, Response } from 'express';
import { pool } from '../config/db';

export const createParkingLot = async (req: Request, res: Response) => {

    try {
        const { capacity } = req.body;

        const isInteger = Number.isInteger(capacity);
        const isUnderLimit = capacity > 0 && capacity <= 20;

        if (!isInteger || !isUnderLimit) {
            return res.status(400).json({ message: 'Invalid capacity: Must be integer and less than 20' })
        }

        //DB Transaction
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            const [existingRows] = await conn.query('SELECT COUNT(*) as count FROM parking_lots');
            const rowExistingCount = (existingRows as any)[0].count;

            if (rowExistingCount > 0) {
                await conn.rollback();
                return res.status(409).json({ message: 'Parking lot slots already exist.' });
            }

            //Prepare data before insert
            const values: (string | boolean)[][] = Array.from(
                { length: capacity },
                (_, i) => [String(i + 1).padStart(3, '0'), false]
            );

            //Bulk insert parking slot with capacity
            const sql = 'INSERT INTO parking_lots (slot_id, is_reserved) VALUES ?';
            await conn.query(sql, [values]);
            await conn.commit();

            return res.status(201).json({
                message: `Generate parking lot ${capacity} slots success`
            });
        } catch (error: any) {
            await conn.rollback();
            return res.status(500).json({ message: 'Internal error' });
        } finally {
            conn.release();
        }

    } catch (error: any) {
        return res.status(500).json({ message: 'Internal error' });
    }

};

/** DELETE /parking-lots */
export const deleteAllParkingLots = async (req: Request, res: Response) => {
    return res.status(501).json({ message: 'Not implemented deleteAllParkingLots' });
}

/** GET /parking-lots */
export const getParkingLots = async (req: Request, res: Response) => {
    // supports optional query: ?carSizeId=S&status=occupied
    return res.status(501).json({ message: 'Not implemented getParkingLots' });
}

/** GET /parking-lots/:slotId */
export const getParkingLotById = async (req: Request, res: Response) => {
    return res.status(501).json({ message: 'Not implemented getParkingLotById' });
}



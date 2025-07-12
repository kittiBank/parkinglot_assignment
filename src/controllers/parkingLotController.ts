import { Request, Response } from 'express';
import { pool } from '../config/db';

export const createParkingLot = async (req: Request, res: Response) => {
    try {
        const { capacity } = req.body;

        const isInteger = Number.isInteger(capacity);
        const isUnderLimit = capacity <= 10;

        if (!isInteger || !isUnderLimit) {
            return res.status(400).json({ message: 'Invalid capacity: Must be integer and less than 10' })
        }

        try {
            const conn = await pool.getConnection();
            try {
                await conn.beginTransaction();

                const [existingRows] = await conn.query('SELECT COUNT(*) as count FROM parking_lots');
                const rowExistingCount = (existingRows as any)[0].count;

                //Check slots is already exits before insert
                if (rowExistingCount > 0) {
                    await conn.rollback();
                    return res.json({ message: 'Parking lot slots already exits.' });
                }

                //Prepare data before insert
                const values: (number | boolean)[][] = Array.from(
                    { length: capacity },
                    (_, i) => [i + 1, false]
                );

                //Bulk insert parking slot with capacity
                const sql = 'INSERT INTO parking_lots (slot_id, is_reserved) VALUES ?';
                await conn.query(sql, [values]);

                await conn.commit();
                return res.status(200).json({
                    message: `Generate parking lot ${capacity} slots success`
                });
            } catch (err) {
                await conn.rollback();
                throw err;
            } finally {
                conn.release();
            }
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }

    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }

};



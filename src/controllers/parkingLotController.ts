import { Request, Response } from 'express';
import { pool } from '../config/db';

//To generate slot in parking lots
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

//To view all slot with status in partking lots
export const getParkingLots = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query(
            `SELECT pl.slot_id, 
            (CASE WHEN pl.is_reserved = 0 THEN 'Free' ELSE 'Reserved' END) AS status,
            tk.plate_number,
            cz.description AS car_size,
			tk.created_at
            FROM parking_lots AS pl
            LEFT JOIN tickets AS tk ON tk.slot_id = pl.slot_id AND tk.active = 1
            LEFT JOIN car_size AS cz ON cz.code = tk.car_size_code
            ORDER BY pl.slot_id;`);

        return res.json({ data: rows });

    } catch (error) {
        return res.status(500).json({ message: 'Internal error' });
    }

}

//To view all slot with status in partking lots by slot_id
export const getParkingLotById = async (req: Request, res: Response) => {

    const { slot_id } = req.params;

    try {
        const [rows] = await pool.query(
            `SELECT pl.slot_id, 
            (CASE WHEN pl.is_reserved = 0 THEN 'Free' ELSE 'Reserved' END) AS status,
            tk.plate_number,
            cz.description AS car_size,
			tk.created_at
            FROM parking_lots AS pl
            LEFT JOIN tickets AS tk ON tk.slot_id = pl.slot_id AND tk.active = 1
            LEFT JOIN car_size AS cz ON cz.code = tk.car_size_code
            WHERE pl.slot_id = ?
            ORDER BY pl.slot_id LIMIT 1;`, [slot_id]);

        return res.json({ data: rows });

    } catch (error) {
        return res.status(500).json({ message: 'Internal error' });
    }

}



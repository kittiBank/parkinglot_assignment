import request from 'supertest';
import app from '../src/app';  

describe('POST /tickets-createTicket', () => {
    it('should return 400 when missing plate_number', async () => {
        const res = await request(app).post('/tickets').send({
            car_size: 'S',
        });
        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/Plate number is required/i);
    });

    it('should return 400 when missing car_size', async () => {
        const res = await request(app).post('/tickets').send({
            plate_number: 'กก111',
        });
        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/Car size is required/i);
    });

    it('should create ticket success when input valid data', async () => {
        const res = await request(app).post('/tickets').send({
            plate_number: 'กก111',
            car_size: 'S',
        });
        expect(res.status).toBe(201);
        expect(res.body.message).toMatch(/created success/i);
    });

});
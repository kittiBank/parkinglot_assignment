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

describe('PATCH /tickets-leave', () => {
    it('should return 400 when missing slot_id', async () => {
        const res = await request(app).patch('/tickets/1').send({
            slot_id: '',
        });
        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/Slot is required/i);
    });

    it('should return 200 when leave ticket success', async () => {
        const res = await request(app).patch('/tickets/1').send({
            slot_id: '001',
        });
        expect(res.status).toBe(200);
        expect(res.body.message).toMatch(/is available/i);
    });

});

describe('GET /getParkingLots-all-status', () => {
    it('should return 200 when need to view all slot', async () => {
        const res = await request(app).get('/parking-lots');
        expect(res.status).toBe(200);
    });
});

describe('GET /getSlotsByCarSize', () => {
    it('should return 200 when need to view all slot by car size', async () => {
        const res = await request(app).get('/tickets/s');
        expect(res.status).toBe(200);
    });
});

describe('GET /getPlatesByCarSize', () => {
    it('should return 200 when need to view all plat number by car size', async () => {
        const res = await request(app).get('/tickets/s');
        expect(res.status).toBe(200);
    });
});
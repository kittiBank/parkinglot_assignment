import request from 'supertest';
import app from '../src/app';

describe('POST /parking-lots-validate-capacity/', () => {
    test.each([
        ['zero', 0],
        ['float', 1.5],
        ['negative', -1],
        ['string', 'abc'],
    ])('should reject %s (%p)', async (_label, capacity) => {
        const res = await request(app)
            .post('/parking-lots')
            .send({ capacity });

        expect(res.statusCode).toBe(400);
        expect(res.body).toMatchObject({
            message: expect.stringMatching(/invalid capacity/i),
        });
    });
});

describe('POST /parking-lots-duplicate-slots', () => {
    it('should reject duplicate generate slots', async () => {
        const res = await request(app)
            .post('/parking-lots')
            .send({ capacity: 10 });

        expect(res.statusCode).toBe(409);
        expect(res.body).toMatchObject({
            message: expect.stringMatching(/already exist/i),
        });
    });
});

describe('GET /parking-lots-all-slot', () => {
    it('should reject duplicate generate slots', async () => {
        const res = await request(app)
            .get('/parking-lots')

        expect(res.statusCode).toBe(200);
    });
});




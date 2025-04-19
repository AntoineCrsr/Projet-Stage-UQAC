const request = require('supertest');
const app = require('../../app');
const Car = require('../../components/cars/carModel');

describe('GET /api/car', () => {
  it('should return all cars', async () => {
    await Car.create({
      userId: '123',
      carType: 'SUV',
      manufacturer: 'Toyota',
      year: '2020',
      model: 'RAV4',
      color: 'Black',
      licensePlate: 'ABC123',
      airConditioner: true,
      name: 'Black Panther'
    });

    const response = await request(app).get('/api/car');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
  });
});
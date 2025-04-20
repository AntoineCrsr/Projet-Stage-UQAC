// const request = require('supertest');
// const app = require('../../app');

// describe('POST /api/auth/', () => {

//   it('should return all cars', async () => {
//     request(app)
//       .post('/users')
//       .send({name: 'john'})
//       .set('Accept', 'application/json')
//       .expect('Content-Type', /json/)
//       .expect(200)
//       .end(function(err, res) {
//         if (err) return done(err);
//         return done();
//       });

//     let response = await request(app).get('/api/car');

//     expect(response.status).toBe(200);
//     expect(response.body.length).toBe(0);

//     await Car.create({
//       userId: '123',
//       carType: 'SUV',
//       manufacturer: 'Toyota',
//       year: '2020',
//       model: 'RAV4',
//       color: 'Black',
//       licensePlate: 'ABC123',
//       airConditioner: true,
//       name: 'Black Panther'
//     });

//     response = await request(app).get('/api/car');

//     expect(response.status).toBe(200);
//     expect(response.body.length).toBe(1);
//   });
// });
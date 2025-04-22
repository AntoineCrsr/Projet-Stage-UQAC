const request = require('supertest');
const app = require('../../app');

describe('POST /api/auth/signup', () => {

  it('should return 201 with header Location', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({"user": {"email": "john.doe@gmail.com","password": "StrongPassword1234"}})
      .set('Accept', 'application/json')
      .expect(201)
      .then(response => {
        // Testing if the header location is giving an id
        expect(typeof(response.get("Location"))).toBe("string")
        const locationElts = response.get("Location").split("/")
        expect(locationElts[0]).toBe("api")
        expect(locationElts[1]).toBe("auth")
        expect(typeof(locationElts[2])).toBe("string")
        expect(locationElts[2].length).toBe(24) 

        expect(response.body).toBeUndefined()
      })
  });


  it('should return 400', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({"user": {"email": "notAnEmail","password": "StrongPassword1234"}})
      .set('Accept', 'application/json')
      .expect(400)
      .then(response => {
        expect(response.body.errors).toEqual({"user": {"code": "bad-request", "name": "L'email ne respecte pas le format attendu."}});
        expect(response.get("Location")).toBeUndefined()
      })
  });


  it('should return 409', async () => {
    // Creating a user to test if a 2nd creating leads to an error as expected
    await request(app)
      .post('/api/auth/signup')
      .send({"user": {"email": "john.doe@gmail.com","password": "StrongPassword1234"}})

    await request(app)
      .post('/api/auth')
      .send({"user": {"email": "john.doe@gmail.com","password": "StrongPassword1234"}})
      .set('Accept', 'application/json')
      .expect(409)
      .then(response => {
        expect(response.body.errors).toEqual({"user": {"code": "conflict", "name": "Un utilisateur utilise déjà cette email."}});
        expect(response.get("Location")).toBeUndefined()
      })
  });
});
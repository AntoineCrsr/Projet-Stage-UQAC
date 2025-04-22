const request = require('supertest');
const app = require('../../app');
const UserFactory = require("../../components/users/userFactory")

describe('POST /api/auth/login', () => {

  it('should return 200 with id and token', async () => {
    // Creating a user to test il login works
    const user = await UserFactory.createUser("john.doe@gmail.com", "StrongPassword1234").then(async user => await user.save())

    await request(app)
      .post('/api/auth/login')
      .send({"user": {"email": "john.doe@gmail.com", "password": "StrongPassword1234"}})
      .set('Accept', 'application/json')
      .expect(200)
      .then(response => {
        const keys = Object.keys(response.body)
        expect(keys).toContain("_id")
        expect(keys).toContain("token")
        expect(response.body._id).toBe(user.id.toString())
      })
  });


  it('should return 400', async () => {
    // Creating a user to test il login works
    const user = await UserFactory.createUser("john.doe@gmail.com","StrongPassword1234")
    await user.save()
 
    await request(app)
      .post('/api/auth/login')
      .send({"user": {"password": "StrongPassword1234"}}) // Not containing password
      .set('Accept', 'application/json')
      .expect(400)
      .then(response => {
        expect(response.body.errors).toEqual({"user": {"code": "bad-request", "name": "La requête de login doit contenir un email (string) et un password (string)."}})
      })
  });


  it('should return 403', async () => {
    // Creating a user to test il login works
    const user = await UserFactory.createUser("john.doe@gmail.com","StrongPassword1234")
    await user.save()
 
    await request(app)
      .post('/api/auth/login')
      .send({"user": {"email": "john.doe@gmail.com","password": "WrongPassword"}}) 
      .set('Accept', 'application/json')
      .expect(403)
      .then(response => {
        expect(response.body.errors).toEqual({"user": {"code": "forbidden", "name": "La paire login / mot de passe est incorrecte."}})
      })
  });
});
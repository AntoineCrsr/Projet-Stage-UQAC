const UserFactory = require("../../components/users/userFactory")
const request = require('supertest');
const app = require('../../app');

describe('PUT /api/auth/<id>', () => {
    let token = undefined
    let id = undefined

    beforeAll(async () => {
        // Création d'un user et récupération du token de connexion
        const user = await UserFactory.createUser("john.doe@gmail.com", "StrongPassword1234")
        await user.save()

        const res = await request(app)
            .post('/api/auth/login')
            .send({"user": {"email": "john.doe@gmail.com", "password": "StrongPassword1234"}}) // Not containing password
            .set('Accept', 'application/json')

        token = res.body.token
        id = res.body._id
    });


    it('should return 400 (missing fields)', async () => {
      await request(app)
        .put('/api/auth/' + id)
        .send({"user": {}})
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .then(response => {
            expect(response.body.errors).toEqual({"user": {"code": "bad-request", "name": "Votre requête ne contient aucun attribut."}})
        })
    });


    it('should return 401', async () => {
        await request(app)
          .put('/api/auth/' + id)
          .send({"user": {"name": {"firstName": "Matthias","lastName": "Chopin"}}})
          .set('Accept', 'application/json')
          .expect(401)
          .then(response => {
              expect(response.body.errors).toEqual({"user": {"code": "unauthorized", "name": "Vous n'êtes pas autorisé à modifier un compte dont vous n'êtes pas le propriétaire."}})
          })
      });
})
const UserFactory = require("../../components/users/userFactory")
const request = require('supertest');
const app = require('../../app');

describe('PUT /api/auth/id', () => {
    let token = undefined
    let id = undefined

    beforeEach(async () => {
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

    
    it('should return 409 (phone)', async () => {
        // Crée un utilisateur avec un téléphone valide
        const user = await UserFactory.createUser("john.doe2@gmail.com", "StrongPassword1234")
        await UserFactory.modifyBirth(user, "2003-02-12T20:52:39.890Z")
        await UserFactory.modifyName(user, "John", "Doe")
        await UserFactory.modifyPhone(user, "mobile", "+1", "641369490")
        await UserFactory.validateNonceEmail(user)
        await UserFactory.validateNoncePhone(user)
        await user.save()

        await request(app)
          .put('/api/auth/' + id)
          .send({"user": {"phone": {"type": "mobile","prefix": "+1","number": "641369490"}}}) // Même number
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .expect(409)
          .then(response => {
              expect(response.body.errors).toEqual({"user": {"code": "conflict", "name": "Un utilisateur utilise déjà ce numéro de téléphone."}})
          })
    })

    it('should return 409 (email)', async () => {
        // Crée un utilisateur avec un téléphone valide
        const user = await UserFactory.createUser("john.doe2@gmail.com", "StrongPassword1234")
        await UserFactory.modifyBirth(user, "2003-02-12T20:52:39.890Z")
        await UserFactory.modifyName(user, "John", "Doe")
        await UserFactory.modifyPhone(user, "mobile", "+1", "641369490")
        await UserFactory.validateNonceEmail(user)
        await UserFactory.validateNoncePhone(user)
        await user.save()

        await request(app)
          .put('/api/auth/' + id)
          .send({"user": {"email": "john.doe2@gmail.com"}}) // Même email
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .expect(409)
          .then(response => {
              expect(response.body.errors).toEqual({"user": {"code": "conflict", "name": "Un utilisateur utilise déjà cette email."}})
          })
    })

    it('should return 200', async () => {
        // Modification complète pour tester tout en même temps (sauf image)
        await request(app)
          .put('/api/auth/' + id)
          .send({"user": {
            "email": "john.doe2@gmail.com",
            "password": "password12345",
            "name": {
                "publicName": "MatthiasLeChauffeur",
                "firstName": "Matthias",
                "lastName": "Chopin"
            },
            "phone": {
                "type": "mobile",
                "prefix": "+1",
                "number": "641369490"
            },
            "dateBirthday": "2005-02-12T20:52:39.890Z",
            "isStudent": true,
            "aboutMe": "Conducteur depuis 10 ans ^^",
            "alternateEmail": "bellamygarde@gmail.com",
            "testimonial": "Un testimonial",
            "parameters": {
			    "show": {
                    "showAgePublically": true,
                    "showPhonePublically": true
                },
                "notification": {
                    "sendNewsletter": true,
                    "remindEvaluations": true
                },
                "preferredLangage": "EN"
            }
        }}) 
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .then(response => {
            // Header location
            expect(typeof(response.get("Location"))).toBe("string")
            const locationElts = response.get("Location").split("/") // should be [ '', 'api', 'auth', '<id>' ]
            expect(locationElts[1]).toBe("api")
            expect(locationElts[2]).toBe("auth")
            expect(typeof(locationElts[3])).toBe("string")
            expect(locationElts[3].length).toBe(24) 
    
            expect(response.body).toBe("") // "" is equivalent to no-body
          })
    })
})
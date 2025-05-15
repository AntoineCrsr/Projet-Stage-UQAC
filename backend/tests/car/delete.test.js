const request = require('supertest');
const app = require('../../app');
const UserFactory = require("../../components/users/userFactory")
const CarFactory = require("../../components/cars/CarFactory")
const JourneyFactory = require("../../components/journeys/JourneyFactory")

describe('DELETE /api/car/id', () => {
    let token = undefined
    let id = undefined
    let carId = undefined

    beforeEach(async () => {
        // Création d'un user et récupération du token de connexion
        const user = await UserFactory.createUser("john.doe@gmail.com", "StrongPassword1234")
        await UserFactory.modifyBirth(user, "2003-02-12T20:52:39.890Z")
        await UserFactory.modifyName(user, "John", "Doe")
        await UserFactory.modifyPhone(user, "mobile", "+1", "641369490")
        await UserFactory.validateNonceEmail(user)
        await UserFactory.validateNoncePhone(user)
        await user.save()

        // Login 
        const res = await request(app)
            .post('/api/auth/login')
            .send({"user": {"email": "john.doe@gmail.com", "password": "StrongPassword1234"}})
            .set('Accept', 'application/json')

        token = res.body.token
        id = res.body._id

        const car = await CarFactory.createCar(id, "VUS 2016","Peugeot","2016","208","Rouge","ABCDEFGHI",true,"Mon char !!")
        await car.save()
        carId = car.id
    });


    it ("should return 401 not connected", async () => {
        // User not connected
        const res = await request(app)
            .delete('/api/car/' + carId)
            .set('Accept', 'application/json')
            .expect(401)

        expect(res.body.errors).toEqual({
            "user": {
                "code": "unauthorized",
                "name": "L'utilisateur doit être connecté pour effectuer cette action."
            }
        })
    })


    it ("should return 401 not owner", async () => {
        // Creating other user
        const user = await UserFactory.createUser("john.doe2@gmail.com", "StrongPassword1234")
        await UserFactory.modifyBirth(user, "2003-02-12T20:52:39.890Z")
        await UserFactory.modifyName(user, "John", "Doe")
        await UserFactory.modifyPhone(user, "mobile", "+1", "641369490")
        await UserFactory.validateNonceEmail(user)
        await UserFactory.validateNoncePhone(user)
        await user.save()

        // Login 
        const connection = await request(app)
            .post('/api/auth/login')
            .send({"user": {"email": "john.doe2@gmail.com", "password": "StrongPassword1234"}})
            .set('Accept', 'application/json')

        other_token = connection.body.token
        other_id = connection.body._id

        // Trying to delete using the other account
        const res = await request(app)
            .delete('/api/car/' + carId)
            .set('Authorization', `Bearer ${other_token}`)
            .set('Accept', 'application/json')
            .expect(401)

        // Testing if this is the right error
        expect(res.body.errors).toEqual({
            "user": {
                "code": "unauthorized",
                "name": "Vous n'êtes pas autorisé à éditer un objet dont vous n'êtes pas le propriétaire."
            }
        })
    })


    it ("should return 409", async () => {
        // Creating a journey with the car
        const journey = JourneyFactory.createJourney(id, {"city":"Chicoutimi", "address": "10 Rue St-Pierre"}, {"city": "Montreal", "address": "1 rue Torronto"}, (new Date(Date.now()+3600000)).toISOString(), {"total":5, "left": 4}, 20, carId)
        await journey.save()

        // Trying to delete the car
        const res = await request(app)
            .delete('/api/car/' + carId)
            .set('Authorization', `Bearer ${token}`)
            .set('Accept', 'application/json')
            .expect(409)

        // Testing if this is the right error
        expect(res.body.errors).toEqual({
            "car": {
                "code": "conflict",
                "name": "Vous ne pouvez pas supprimer une voiture qui est renseignée dans un trajet."
            }
        })
    })


    it ("should return 200", async () => {
        const res = await request(app)
            .delete('/api/car/' + carId)
            .set('Authorization', `Bearer ${token}`)
            .set('Accept', 'application/json')
            .expect(200)

        expect(res.body).toBe("")
    })
})
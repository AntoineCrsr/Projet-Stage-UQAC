const request = require('supertest');
const app = require('../../app');
const UserFactory = require("../../components/users/userFactory")
const CarFactory = require("../../components/cars/CarFactory")
const JourneyFactory = require("../../components/journeys/JourneyFactory")

describe('GET /api/cities/', () => {
    let token = undefined
    let id = undefined
    let j1 = undefined
    let j2 = undefined
    let j3 = undefined

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

        // Création d'une voiture pour la renseigner dans les journeys
        const car = await CarFactory.createCar(id, "VUS 2016", "Peugeot", "2016", "208", "Rouge", "ABC DEF GHI", true, "Mon char !!")
        await car.save()

        // Création de journeys
        // Torronto - Montréal
        j1 = await JourneyFactory.createJourney(id, {"city": "montreal","address": "1 rue Torronto"}, {"city": "montreal","address": "10 Rue St-Pierre"}, "2025-06-12T20:52:39.890Z", {"total": 5,"left": 3}, 40, car._id)
        await j1.save()
        // Montréal - Torronto
        j2 = await JourneyFactory.createJourney(id, {"city": "montreal","address": "1 rue Torronto"}, {"city": "torronto","address": "10 Rue St-Pierre"}, "2025-04-12T20:52:39.890Z", {"total": 5,"left": 3}, 40, car._id)
        await j2.save()
        // Chicoutimi - Torronto
        j3 = await JourneyFactory.createJourney(id, {"city": "chicoutimi","address": "1 rue Torronto"}, {"city": "torronto","address": "10 Rue St-Pierre"}, "2025-04-12T20:52:39.890Z", {"total": 5,"left": 3}, 40, car._id)
        await j3.save()
    });


    it ("should return 200", async () => {
        const res = await request(app)
            .get('/api/cities')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(200)

        expect(Array.isArray(res.body)).toBeTruthy()
        expect(res.body.length).toBe(3)

        expect(res.body.includes("torronto")).toBeTruthy()
        expect(res.body.includes("montreal")).toBeTruthy()
        expect(res.body.includes("chicoutimi")).toBeTruthy()
    })


    it ("should return 200 beginning", async () => {
        const res = await request(app)
            .get('/api/cities?prefix=Tor') // tor for Torronto prefix
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(200)

        expect(Array.isArray(res.body)).toBeTruthy()
        expect(res.body.length).toBe(1)

        expect(res.body.includes("torronto")).toBeTruthy()
    })
})
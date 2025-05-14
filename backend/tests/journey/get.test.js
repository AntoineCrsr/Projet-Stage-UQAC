const request = require('supertest');
const app = require('../../app');
const UserFactory = require("../../components/users/userFactory")
const CarFactory = require("../../components/cars/CarFactory")
const JourneyFactory = require("../../components/journeys/JourneyFactory")

describe('GET /api/journey/', () => {
    let token = undefined
    let id = undefined
    let j1 = undefined
    let j2 = undefined

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
        // La première est à venir
        j1 = await JourneyFactory.createJourney(id, {"city": "TORRONTO","address": "1 rue Torronto"}, {"city": "MontReal","address": "10 Rue St-Pierre"}, "2025-06-12T20:52:39.890Z", {"total": 5,"left": 3}, 40, car._id)
        await j1.save()

        // La second est passée
        j2 = await JourneyFactory.createJourney(id, {"city": "Montreal","address": "1 rue Torronto"}, {"city": "TorronTo","address": "10 Rue St-Pierre"}, "2025-04-12T20:52:39.890Z", {"total": 5,"left": 3}, 40, car._id)
        await j2.save()
    });

    it ("should return 200", async () => {
        const response = await request(app).get('/api/journey/');
        expect(Array.isArray(response.body)).toBeTruthy()
        expect(response.body.length).toBe(2)
    })

    it ("should return 200 classic research", async () => {
        const response = await request(app).get('/api/journey?ownerId=' + id);
        expect(Array.isArray(response.body)).toBeTruthy()
        expect(response.body.length).toBe(2)
    })

    it ("should return 200 minDate research", async () => {
        const response = await request(app).get('/api/journey?minDate=2025-05-12T20:52:39.890Z');
        expect(Array.isArray(response.body)).toBeTruthy()
        expect(response.body.length).toBe(1)
        expect(response.body[0]._id).toBe(j1._id.toString())
    })

    it ("should return 200 starting research", async () => {
        const response = await request(app).get('/api/journey?starting=MontReal');
        expect(Array.isArray(response.body)).toBeTruthy()
        expect(response.body.length).toBe(1)
        expect(response.body[0]._id).toBe(j2._id.toString())
    })

    it ("should return 200 arrival research", async () => {
        const response = await request(app).get('/api/journey?arrival=TorronTo');
        expect(Array.isArray(response.body)).toBeTruthy()
        expect(response.body.length).toBe(1)
        expect(response.body[0]._id).toBe(j2._id.toString())
    })


    // Get one (/api/journey/id)

    it ("should return 302", async () => {
        const response = await request(app).get('/api/journey/' + j1._id.toString());
        expect(response.status).toBe(302);
        expect(response.body._id).toBe(j1._id.toString())
    })

    it ("should return 404", async () => {
        // Correct id format but not existing
        const response = await request(app).get('/api/journey/000000000000000000000000');
        expect(response.status).toBe(404);
        expect(response.body.errors).toEqual({"journey": {"code": "not-found", "name": "Le trajet n'a pas été trouvé."}});
    })

    it ("should return 400", async () => {
        // Invalid format id
        const response = await request(app).get('/api/journey/notvalid');
        expect(response.status).toBe(400);
        expect(response.body.errors).toEqual({"journey": {"code": "bad-request", "name": "L'identifiant renseigné n'est pas dans un format acceptable."}});
    })
})
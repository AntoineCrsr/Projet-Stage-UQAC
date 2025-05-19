const request = require('supertest');
const app = require('../../app');
const UserFactory = require("../../components/users/userFactory")
const CarFactory = require("../../components/cars/CarFactory")
const JourneyFactory = require("../../components/journeys/JourneyFactory")
const ReservationFactory = require("../../components/reservation/ReservationFactory")

describe('GET /api/reservation/', () => {
    let token = undefined
    let id = undefined
    let journey = undefined
    let reservation = undefined
    let driver = undefined
    let car = undefined

    beforeEach(async () => {
        // Création d'un user et récupération du token de connexion
        driver = await UserFactory.createUser("john.doe@gmail.com", "StrongPassword1234")
        await UserFactory.modifyBirth(driver, "2003-02-12T20:52:39.890Z")
        await UserFactory.modifyName(driver, "John", "Doe")
        await UserFactory.modifyPhone(driver, "mobile", "+1", "641369490")
        await UserFactory.modifyGender(driver, "homme")
        await UserFactory.validateNonceEmail(driver)
        await UserFactory.validateNoncePhone(driver)
        await driver.save()

        // Création d'une voiture pour la renseigner dans la journey
        car = await CarFactory.createCar(driver._id.toString(), "VUS 2016", "Peugeot", "2016", "208", "Rouge", "ABC DEF GHI", true, "Mon char !!")
        await car.save()

        // Création de la journey
        journey = await JourneyFactory.createJourney(driver._id.toString(), {"city": "TORRONTO","address": "1 rue Torronto"}, {"city": "MontReal","address": "10 Rue St-Pierre"}, "2025-06-12T20:52:39.890Z", {"total": 5,"left": 3}, 40, car._id)
        await journey.save()

        // Le user chargé de tester la réservation
        const user = await UserFactory.createUser("jane.doe@gmail.com", "StrongPassword1234")
        await UserFactory.modifyBirth(user, "2003-02-12T20:52:39.890Z")
        await UserFactory.modifyName(user, "John", "Doe")
        await UserFactory.modifyPhone(user, "mobile", "+1", "641369490")
        await UserFactory.modifyGender(user, "femme")
        await UserFactory.validateNonceEmail(user)
        await UserFactory.validateNoncePhone(user)
        await user.save()

        // Login 
        const res = await request(app)
            .post('/api/auth/login')
            .send({"user": {"email": "jane.doe@gmail.com", "password": "StrongPassword1234"}})
            .set('Accept', 'application/json')

        token = res.body.token
        id = res.body._id

        // La réservation à get
        reservation = ReservationFactory.createReservation(id, journey._id.toString())
        await reservation.save()
    });


    it("should return 200 getall", async () => {
        const response = await request(app).get('/api/reservation/');
        expect(response.status).toBe(200)
        expect(Array.isArray(response.body)).toBeTruthy()
        expect(response.body.length).toBe(1)
        const res = response.body[0]
        expect(res.journeyId).toBe(journey._id.toString())
        expect(res.userId).toBe(id)
    })


    it("should return 200 constraints on userId", async () => {
        // Autre user qui réserve le trajet
        const user = await UserFactory.createUser("marc.doe@gmail.com", "StrongPassword1234")
        await UserFactory.modifyBirth(user, "2003-02-12T20:52:39.890Z")
        await UserFactory.modifyName(user, "John", "Doe")
        await UserFactory.modifyPhone(user, "mobile", "+1", "641369490")
        await UserFactory.validateNonceEmail(user)
        await UserFactory.validateNoncePhone(user)
        await user.save()

        const login = await request(app)
            .post('/api/auth/login')
            .send({"user": {"email": "marc.doe@gmail.com", "password": "StrongPassword1234"}})
            .set('Accept', 'application/json')

        other_token = login.body.token
        other_id = login.body._id

        // Nouvelle réservation
        reservation = ReservationFactory.createReservation(other_id, journey._id.toString())
        await reservation.save()

        // Get la réservation de john
        const response = await request(app).get('/api/reservation?userId=' + id); 
        expect(response.status).toBe(200)
        expect(Array.isArray(response.body)).toBeTruthy()
        expect(response.body.length).toBe(1)
        const res = response.body[0]
        expect(res.journeyId).toBe(journey._id.toString())
        expect(res.userId).toBe(id)
    })


    it("should return 200 constraints on journeyId", async () => {
        // Nouvelle journey
        const newjourney = await JourneyFactory.createJourney(driver._id.toString(), {"city": "TORRONTO","address": "1 rue Torronto"}, {"city": "MontReal","address": "10 Rue St-Pierre"}, "2025-06-12T20:52:39.890Z", {"total": 5,"left": 3}, 40, car._id)
        await newjourney.save()

        // Nouvelle réservation
        reservation = ReservationFactory.createReservation(id, newjourney._id.toString())
        await reservation.save()

        // Get la réservation sur la premiere journey
        const response = await request(app).get('/api/reservation?journeyId=' + journey._id.toString()); 
        expect(response.status).toBe(200)
        expect(Array.isArray(response.body)).toBeTruthy()
        expect(response.body.length).toBe(1)
        const res = response.body[0]
        expect(res.journeyId).toBe(journey._id.toString())
        expect(res.userId).toBe(id)
    })


    it("should return 400 bad ID", async () => {
        // Sur journeyId
        const response = await request(app).get('/api/reservation?journeyId=badid'); 
        expect(response.status).toBe(400)
        expect(response.body.errors).toEqual({
            "reservation": {
                "code": "bad-request",
                "name": "L'identifiant renseigné n'est pas dans un format acceptable."
            }
        })

        // Sur userId
        const response2 = await request(app).get('/api/reservation?userId=badid'); 
        expect(response2.status).toBe(400)
        expect(response2.body.errors).toEqual({
            "reservation": {
                "code": "bad-request",
                "name": "L'identifiant renseigné n'est pas dans un format acceptable."
            }
        })
    })


    it("should return 302 get one", async () => {
        const response = await request(app).get('/api/reservation/' + reservation._id.toString());
        expect(response.status).toBe(302)
        expect(response.body.journeyId).toBe(journey._id.toString())
        expect(response.body.userId).toBe(id)
    })


    it("should return 404 get one", async () => {
        // Not found
        const response = await request(app).get('/api/reservation/000000000000000000000000');
        expect(response.status).toBe(404)
        expect(response.body.errors).toEqual({
            "reservation": {
                "code": "not-found",
                "name": "La réservation n'a pas été trouvée."
            }
        })
    })


    it("should return 400 get one bad id", async () => {
        // Not found
        const response = await request(app).get('/api/reservation/badid');
        expect(response.status).toBe(400)
        expect(response.body.errors).toEqual({
            "reservation": {
                "code": "bad-request",
                "name": "L'identifiant renseigné n'est pas dans un format acceptable."
            }
        })
    })
})
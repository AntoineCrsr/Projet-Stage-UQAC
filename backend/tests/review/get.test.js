const request = require('supertest');
const app = require('../../app');
const UserFactory = require("../../components/users/userFactory")
const CarFactory = require("../../components/cars/CarFactory")
const JourneyFactory = require("../../components/journeys/JourneyFactory")
const ReservationFactory = require("../../components/reservation/ReservationFactory")
const ReviewFactory = require("../../components/reviews/ReviewFactory")


describe('GET /api/review/', () => {
    let token = undefined
    let id = undefined
    let journey = undefined
    let reservation = undefined
    let driver = undefined
    let car = undefined
    let review = undefined

    beforeEach(async () => {
        // Création d'un driver
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
        journey.state = "d"
        await journey.save()

        // Le user chargé de tester la réservation
        const user = await UserFactory.createUser("jane.doe@gmail.com", "StrongPassword1234")
        await UserFactory.modifyBirth(user, "2003-02-12T20:52:39.890Z")
        await UserFactory.modifyName(user, "Jane", "Doe")
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

        // La réservation
        reservation = ReservationFactory.createReservation(id, journey._id.toString())
        await reservation.save()

        // La review à get
        review = ReviewFactory.createReview(id, driver._id.toString(), 5, 5, 5, 5, "Formidable!")
        await review.save()
    });


    it("should return 200 getall", async () => {
        const response = await request(app).get('/api/review/');
        expect(response.status).toBe(200)
        expect(Array.isArray(response.body)).toBeTruthy()
        expect(response.body.length).toBe(1)
        const res = response.body[0]
        expect(res.reviewedId).toBe(driver._id.toString())
        expect(res.reviewerId).toBe(id)
    })


    it("should return 200 constraints", async () => {
        const response = await request(app).get('/api/review?reviewedId=' + driver._id.toString());
        expect(response.status).toBe(200)
        expect(Array.isArray(response.body)).toBeTruthy()
        expect(response.body.length).toBe(1)
        const res = response.body[0]
        expect(res.reviewedId).toBe(driver._id.toString())
        expect(res.reviewerId).toBe(id)
    })


    it("should return 400 getall bad id", async () => {
        const response = await request(app).get('/api/review?reviewedId=abadid');
        expect(response.status).toBe(400)
        expect(response.body.errors).toEqual({
            "review": {
                "code": "bad-request",
                "name": "L'identifiant renseigné n'est pas dans un format acceptable."
            }
        })
    })


    it("should return 302 get by id", async () => {
        const response = await request(app).get('/api/review/' + review._id.toString());
        expect(response.status).toBe(302)
        expect(response.body.reviewedId).toBe(driver._id.toString())
        expect(response.body.reviewerId).toBe(id)
    })


    it("should return 404 not found", async () => {
        const response = await request(app).get('/api/review/000000000000000000000000');
        expect(response.status).toBe(404)
        expect(response.body.errors).toEqual({
            "review": {
                "code": "not-found",
                "name": "L'avis n'a pas été trouvé."
            }
        })
    })


    it("should return 400 bad id", async () => {
        const response = await request(app).get('/api/review/abadid');
        expect(response.status).toBe(400)
        expect(response.body.errors).toEqual({
            "review": {
                "code": "bad-request",
                "name": "L'identifiant renseigné n'est pas dans un format acceptable."
            }
        })
    })
})
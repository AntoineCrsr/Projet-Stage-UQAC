const request = require('supertest');
const app = require('../../app');
const UserFactory = require("../../components/users/userFactory")
const CarFactory = require("../../components/cars/CarFactory")
const JourneyFactory = require("../../components/journeys/JourneyFactory")
const ReservationFactory = require("../../components/reservation/ReservationFactory")

describe('POST /api/review/', () => {
    let token = undefined
    let id = undefined
    let journey = undefined
    let reservation = undefined
    let driver = undefined
    let car = undefined

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
    });


    it ("should return 400 missing fields", async () => {
        const res = await request(app)
            .post('/api/review')
            // Missing courtesyRating
            .send({"review": {"reviewedId": driver._id.toString(),"punctualityRating": 3,"securityRating": 3,"comfortRating": 3,}})
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(400)
        expect(res.body.errors).toEqual({
            "review": {
                "code": "bad-request",
                "name": "La requête ne contient pas tous les attributs nécessaires à la création de l'objet."
            }
        })
    })


    it ("should return 400 bad id", async () => {
        const res = await request(app)
            .post('/api/review')
            .send({"review": {"reviewedId": "a bad ID !!","punctualityRating": 3,"securityRating": 3,"comfortRating": 3,"courtesyRating": 3,"message": "Bof"}})
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(400)
        expect(res.body.errors).toEqual({
            "review": {
                "code": "bad-request",
                "name": "L'identifiant renseigné n'est pas dans un format acceptable."
            }
        })
    })


    it ("should return 400 bad rating", async () => {
        const res = await request(app)
            .post('/api/review')
            .send({"review": {"reviewedId": driver._id.toString(),"punctualityRating": -1,"securityRating": 6,"comfortRating": 3,"courtesyRating": 3,"message": "Bof"}})
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(400)
        expect(res.body.errors).toEqual({
            "review": {
                "code": "bad-request",
                "name": "Les notes d'un avis ne peuvent être compris qu'entre 0 et 5."
            }
        })
    })


    it ("should return 401 not connected", async () => {
        const res = await request(app)
            .post('/api/review')
            .send({"review": {"reviewedId": driver._id.toString(),"punctualityRating": 0,"securityRating": 3,"comfortRating": 3,"courtesyRating": 3,"message": "Bof"}})
            .set('Accept', 'application/json')

        expect(res.status).toBe(401)
        expect(res.body.errors).toEqual({
            "user": {
                "code": "unauthorized",
                "name": "L'utilisateur doit être connecté pour effectuer cette action."
            }
        })
    })


    it ("should return 401 havent done journey yet", async () => {
        // Le user chargé de tester la réservation
        const hacker = await UserFactory.createUser("jane.doe2@gmail.com", "StrongPassword1234")
        await UserFactory.modifyBirth(hacker, "2003-02-12T20:52:39.890Z")
        await UserFactory.modifyName(hacker, "Jane", "Doe")
        await UserFactory.modifyPhone(hacker, "mobile", "+1", "641369490")
        await UserFactory.modifyGender(hacker, "femme")
        await UserFactory.validateNonceEmail(hacker)
        await UserFactory.validateNoncePhone(hacker)
        await hacker.save()

        // Login 
        const login = await request(app)
            .post('/api/auth/login')
            .send({"user": {"email": "jane.doe2@gmail.com", "password": "StrongPassword1234"}})
            .set('Accept', 'application/json')

        let hacker_token = login.body.token

        const res = await request(app)
            .post('/api/review')
            .send({"review": {"reviewedId": driver._id.toString(),"punctualityRating": 0,"securityRating": 3,"comfortRating": 3,"courtesyRating": 3,"message": "Bof"}})
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${hacker_token}`)

        expect(res.status).toBe(401)
        expect(res.body.errors).toEqual({
            "review": {
                "code": "unauthorized",
                "name": "Vous ne disposez pas de trajet complété avec le conducteur renseigné."
            }
        })
    })


    it ("should return 401 review himself", async () => {
        // Login driver
        const login = await request(app)
            .post('/api/auth/login')
            .send({"user": {"email": "john.doe@gmail.com", "password": "StrongPassword1234"}})
            .set('Accept', 'application/json')

        let driver_token = login.body.token

        const res = await request(app)
            .post('/api/review')
            .send({"review": {"reviewedId": driver._id.toString(),"punctualityRating": 0,"securityRating": 3,"comfortRating": 3,"courtesyRating": 3,"message": "Bof"}})
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${driver_token}`)

        expect(res.status).toBe(401)
        expect(res.body.errors).toEqual({
            "review": {
                "code": "unauthorized",
                "name": "Vous ne pouvez pas vous donner d'avis à vous-même."
            }
        })
    })


    it ("should return 401 Double review", async () => {
        const res1 = await request(app)
            .post('/api/review')
            .send({"review": {"reviewedId": driver._id.toString(),"punctualityRating": 0,"securityRating": 5,"comfortRating": 3,"courtesyRating": 3,"message": "Bof"}})
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)

        expect(res1.status).toBe(201)

        const res = await request(app)
            .post('/api/review')
            .send({"review": {"reviewedId": driver._id.toString(),"punctualityRating": 0,"securityRating": 5,"comfortRating": 3,"courtesyRating": 3,"message": "Bof"}})
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(401)
        expect(res.body.errors).toEqual({
            "review": {
                "code": "unauthorized",
                "name": "Vous ne pouvez pas donner plus d'un avis sur la même personne."
            }
        })
    })


    it ("should return 201", async () => {
        const res = await request(app)
            .post('/api/review')
            .send({"review": {"reviewedId": driver._id.toString(),"punctualityRating": 5,"securityRating": 5,"comfortRating": 5,"courtesyRating": 5,"message": "Formidable."}})
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(201)

        // Testing if the header location is giving an id
        expect(typeof(res.get("Location"))).toBe("string")
        const locationElts = res.get("Location").split("/") // should be [ '', 'api', 'review', '<id>' ]
        expect(locationElts[1]).toBe("api")
        expect(locationElts[2]).toBe("review")
        expect(typeof(locationElts[3])).toBe("string")
        expect(locationElts[3].length).toBe(24) 
        expect(res.body).toBe("") // No body

        const user = await request(app)
            .get('/api/auth/' + driver._id.toString())
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)

        expect(user.status).toBe(302)
        expect(user.body.rating.nbRating).toBe(1)
        expect(user.body.rating.punctualityRating).toBe(5)
        expect(user.body.rating.securityRating).toBe(5)
        expect(user.body.rating.comfortRating).toBe(5)
        expect(user.body.rating.courtesyRating).toBe(5)
    })
})
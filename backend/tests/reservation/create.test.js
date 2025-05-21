const request = require('supertest');
const app = require('../../app');
const UserFactory = require("../../components/users/userFactory")
const CarFactory = require("../../components/cars/CarFactory")
const JourneyFactory = require("../../components/journeys/JourneyFactory")

describe('POST /api/reservation/', () => {
    let token = undefined
    let id = undefined
    let journey = undefined
    let driver = undefined
    let user = undefined
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
        user = await UserFactory.createUser("jane.doe@gmail.com", "StrongPassword1234")
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
    });


    it ("should return 400 missing fields", async () => {
        const res = await request(app)
            .post('/api/reservation')
            .send({"reservation": {}})
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(400)
        expect(res.body.errors).toEqual({
            "reservation": {
                "code": "bad-request",
                "name": "La requête ne contient pas tous les attributs nécessaires à la création de l'objet."
            }
        })
    })


    it ("should return 400 bad id", async () => {
        const res = await request(app)
            .post('/api/reservation')
            .send({"reservation": {"journeyId": "a bad id"}})
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(400)
        expect(res.body.errors).toEqual({
            "reservation": {
                "code": "bad-request",
                "name": "L'identifiant renseigné n'est pas dans un format acceptable."
            }
        })
    })


    it ("should return 404 not found", async () => {
        const res = await request(app)
            .post('/api/reservation')
            .send({"reservation": {"journeyId": "000000000000000000000000"}})
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(404)
        expect(res.body.errors).toEqual({
            "journey": {
                "code": "not-found",
                "name": "Le trajet n'a pas été trouvé."
            }
        })
    })


    it ("should return 401 not connected", async () => {
        const res = await request(app)
            .post('/api/reservation')
            .send({"reservation": {"journeyId": journey._id.toString()}})
            .set('Accept', 'application/json')

        expect(res.status).toBe(401)
        expect(res.body.errors).toEqual({
            "user": {
                "code": "unauthorized",
                "name": "L'utilisateur doit être connecté pour effectuer cette action."
            }
        })
    })


    it ("should return 401 profile not complete", async () => {
        // missing phone & email validation
        const fellow = await UserFactory.createUser("john3.doe@gmail.com", "StrongPassword1234")
        await UserFactory.modifyBirth(fellow, "2003-02-12T20:52:39.890Z")
        await UserFactory.modifyName(fellow, "John", "Doe")
        await UserFactory.modifyPhone(fellow, "mobile", "+1", "641369490")
        await fellow.save()

        // Login 
        const fellowLogin = await request(app)
            .post('/api/auth/login')
            .send({"user": {"email": "john3.doe@gmail.com", "password": "StrongPassword1234"}})
            .set('Accept', 'application/json')

        fellow_token = fellowLogin.body.token
        fellow_id = fellowLogin.body._id

        const res = await request(app)
            .post('/api/reservation')
            .send({"reservation": {"journeyId": journey._id.toString()}})
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${fellow_token}`)

        expect(res.status).toBe(401)
        expect(res.body.errors).toEqual({
            "user": {
                "code": "unauthorized",
                "name": "L'utilisateur doit compléter son inscription pour effectuer cette action."
            }
        })
    })


    it ("should return 401 own journey", async () => {
        // Login as the driver
        const driverLogin = await request(app)
            .post('/api/auth/login')
            .send({"user": {"email": "john.doe@gmail.com", "password": "StrongPassword1234"}})
            .set('Accept', 'application/json')

        driver_token = driverLogin.body.token
        driver_id = driverLogin.body._id

        const res = await request(app)
            .post('/api/reservation')
            .send({"reservation": {"journeyId": journey._id.toString()}})
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${driver_token}`)

        expect(res.status).toBe(401)
        expect(res.body.errors).toEqual({
            "reservation": {
                "code": "unauthorized",
                "name": "Le créateur du trajet ne peut pas le réserver."
            }
        })
    })


    it ("should return 401 multiple reservations", async () => {
        // Première réservation:
        const res = await request(app)
            .post('/api/reservation')
            .send({"reservation": {"journeyId": journey._id.toString()}})
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(201)

        // Seconde réservation
        const res2 = await request(app)
            .post('/api/reservation')
            .send({"reservation": {"journeyId": journey._id.toString()}})
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)

        expect(res2.status).toBe(401)
        expect(res2.body.errors).toEqual({
            "reservation": {
                "code": "unauthorized",
                "name": "Il est impossible de réserver plusieurs fois le même trajet."
            }
        })
    })


    it ("should return 400 journey not enough places", async () => {
        const completeJourney = await JourneyFactory.createJourney(driver._id.toString(), {"city": "Montreal","address": "1 rue Torronto"}, {"city": "TorronTo","address": "10 Rue St-Pierre"}, "2025-04-12T20:52:39.890Z", {"total": 5,"left": 0}, 40, car._id)
        await completeJourney.save()

        const res = await request(app)
            .post('/api/reservation')
            .send({"reservation": {"journeyId": completeJourney._id.toString()}})
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(400)
        expect(res.body.errors).toEqual({
            "reservation": {
                "code": "bad-request",
                "name": "Le trajet est déjà complet."
            }
        })
    })


    it ("should return 400 journey already done", async () => {
        const completeJourney = await JourneyFactory.createJourney(driver._id.toString(), {"city": "Montreal","address": "1 rue Torronto"}, {"city": "TorronTo","address": "10 Rue St-Pierre"}, "2020-04-12T20:52:39.890Z", {"total": 5,"left": 4}, 40, car._id)
        completeJourney.state = "d"
        await completeJourney.save()

        const res = await request(app)
            .post('/api/reservation')
            .send({"reservation": {"journeyId": completeJourney._id.toString()}})
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(401)
        expect(res.body.errors).toEqual({
            "reservation": {
                "code": "unauthorized",
                "name": "Vous ne pouvez pas intéragir avec un trajet déjà terminé."
            }
        })
    })


    it ("should return 400 journey already done", async () => {
        const res = await request(app)
            .post('/api/reservation')
            .send({"reservation": {"journeyId": journey._id.toString()}})
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(201)
        // Testing if the header location is giving an id
        expect(typeof(res.get("Location"))).toBe("string")
        const locationElts = res.get("Location").split("/") // should be [ '', 'api', 'journey', '<id>' ]
        expect(locationElts[1]).toBe("api")
        expect(locationElts[2]).toBe("reservation")
        expect(typeof(locationElts[3])).toBe("string")
        expect(locationElts[3].length).toBe(24) 
        expect(res.body).toBe("") // No body
    })
})
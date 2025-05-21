const request = require('supertest');
const app = require('../../app');
const UserFactory = require("../../components/users/userFactory")
const CarFactory = require("../../components/cars/CarFactory")
const JourneyFactory = require("../../components/journeys/JourneyFactory")
const ReservationFactory = require("../../components/reservation/ReservationFactory")

describe('DELETE /api/reservation/id', () => {
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


    it ("should return bad id", async () => {
        // Missing carId
        const res = await request(app)
            .delete('/api/reservation/notvalidid')
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


    it ("should return not found", async () => {
        const res = await request(app)
            .delete('/api/reservation/000000000000000000000000') // not found
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(404)
        expect(res.body.errors).toEqual({
            "reservation": {
                "code": "not-found",
                "name": "La réservation n'a pas été trouvée."
            }
        })
    })


    it ("should return 401 journey done", async () => {
        // Création de journey terminée
        journeyDone = await JourneyFactory.createJourney(driver._id.toString(), {"city": "TORRONTO","address": "1 rue Torronto"}, {"city": "MontReal","address": "10 Rue St-Pierre"}, "2025-06-12T20:52:39.890Z", {"total": 5,"left": 3}, 40, car._id)
        journeyDone.state = "d"
        await journeyDone.save()

        let reservationDone = ReservationFactory.createReservation(id, journeyDone._id.toString())
        await reservationDone.save()

        const res = await request(app)
            .delete('/api/reservation/' + reservationDone._id.toString()) 
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


    it ("should return 401 not authenticated", async () => {
        const res = await request(app)
            .delete('/api/reservation/' + reservation._id.toString())
            .set('Accept', 'application/json')

        expect(res.status).toBe(401)
        expect(res.body.errors).toEqual({
            "user": {
                "code": "unauthorized",
                "name": "L'utilisateur doit être connecté pour effectuer cette action."
            }
        })
    })


    it ("should return 401 not owner", async () => {
        // Nouveau user
        const user = await UserFactory.createUser("jane2.doe@gmail.com", "StrongPassword1234")
        await UserFactory.modifyBirth(user, "2003-02-12T20:52:39.890Z")
        await UserFactory.modifyName(user, "John", "Doe")
        await UserFactory.modifyPhone(user, "mobile", "+1", "641369490")
        await UserFactory.modifyGender(user, "femme")
        await UserFactory.validateNonceEmail(user)
        await UserFactory.validateNoncePhone(user)
        await user.save()

        // Login 
        const login = await request(app)
            .post('/api/auth/login')
            .send({"user": {"email": "jane2.doe@gmail.com", "password": "StrongPassword1234"}})
            .set('Accept', 'application/json')

        other_token = login.body.token
        other_id = login.body._id

        const res = await request(app)
            .delete('/api/reservation/' + reservation._id.toString()) 
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${other_token}`)

        expect(res.status).toBe(401)
        expect(res.body.errors).toEqual({
            "reservation": {
                "code": "unauthorized",
                "name": "Vous n'êtes pas autorisé à éditer un objet dont vous n'êtes pas le propriétaire."
            }
        })
    })


    it ("should return 200", async () => {
        // Missing carId
        const res = await request(app)
            .delete('/api/reservation/' + reservation._id.toString())
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(200)
        expect(res.body).toBe("") // No body
    })
})
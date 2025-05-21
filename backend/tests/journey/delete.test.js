const request = require('supertest');
const app = require('../../app');
const UserFactory = require("../../components/users/userFactory")
const CarFactory = require("../../components/cars/CarFactory")
const JourneyFactory = require("../../components/journeys/JourneyFactory")
const ReservationFactory = require("../../components/reservation/ReservationFactory")
const ReservationSeeker = require("../../components/reservation/ReservationSeeker")

describe('DELETE /api/journey/id', () => {
    let token = undefined
    let id = undefined
    let carId = undefined
    let journeyId = undefined
    let journey = undefined

    beforeEach(async () => {
        // Mocker l'appel à l'API GMAPS
        global.fetch = jest.fn()

        const mockResponse = {
            json: async () => ({
                result: {
                    verdict: {
                        inputGranularity: "PREMISE",
                        validationGranularity: "PREMISE"
                    },
                    address: {
                        formattedAddress: '999 Boulevard Talbot, Chicoutimi, QC G7H 4B5, Canada'
                    }
                }
            })
        }

        global.fetch
            .mockResolvedValueOnce(mockResponse) // pour l'adresse de départ
            .mockResolvedValueOnce(mockResponse) // pour l'adresse d'arrivée

        // Création d'un user et récupération du token de connexion
        const user = await UserFactory.createUser("john.doe@gmail.com", "StrongPassword1234")
        await UserFactory.modifyBirth(user, "2003-02-12T20:52:39.890Z")
        await UserFactory.modifyName(user, "John", "Doe")
        await UserFactory.modifyPhone(user, "mobile", "+1", "641369490")
        await UserFactory.validateNonceEmail(user)
        await UserFactory.validateNoncePhone(user)
        await UserFactory.modifyGender(user, "homme")
        await user.save()

        // Login 
        const res = await request(app)
            .post('/api/auth/login')
            .send({"user": {"email": "john.doe@gmail.com", "password": "StrongPassword1234"}})
            .set('Accept', 'application/json')

        token = res.body.token
        id = res.body._id.toString()

        const car = await CarFactory.createCar(id, "VUS 2016", "Peugeot", "2016", "208", "Rouge", "ABC DEF GHI", true, "Mon char !!")
        await car.save()
        carId = car._id.toString()

        // Journey à supprimer
        journey = await JourneyFactory.createJourney(id, {"city": "TORRONTO","address": "1 rue Torronto"}, {"city": "MontReal","address": "10 Rue St-Pierre"}, (new Date(Date.now()+3600000)).toISOString(), {"total": 5,"left": 3}, 40.0, carId)
        await journey.save()
        journeyId = journey._id.toString()
    });


    it ("should return not found", async () => {
        const res = await request(app)
            .delete('/api/journey/000000000000000000000000') // not found
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


    it ("should return already terminated", async () => {
        // Mocker la date pour que la journey soit passée
        const initialDate = new Date(Date.now()+4800000) 
        jest.spyOn(Date, 'now').mockImplementation(() => initialDate.getTime())

        // La requete devrait trigger un update juste avant le delete, donc devrait créer une erreur
        const res = await request(app)
            .delete('/api/journey/' + journeyId)
            .send({"user": {"email": "john.doe@gmail.com", "password": "StrongPassword1234"}})
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(401)
        expect(res.body.errors).toEqual({
            "journey": {
                "code": "unauthorized",
                "name": "Vous ne pouvez pas supprimer un trajet déjà terminé."
            }
        })
        jest.clearAllMocks()
    })


    it ("should return 400 not valid id", async () => {
        // Missing carId
        const res = await request(app)
            .delete('/api/journey/notvalidid')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(400)
        expect(res.body.errors).toEqual({
            "journey": {
                "code": "bad-request",
                "name": "L'identifiant renseigné n'est pas dans un format acceptable."
            }
        })
    })


    it ("should return 401 not authenticated", async () => {
        const res = await request(app)
            .delete('/api/journey/' + journeyId)
            .set('Accept', 'application/json')

        expect(res.status).toBe(401)
        expect(res.body.errors).toEqual({
            "user": {
                "code": "unauthorized",
                "name": "L'utilisateur doit être connecté pour effectuer cette action."
            }
        })
    })


    it ("should return 401 not authorized", async () => {
        // Création d'un user et récupération du token de connexion
        const user = await UserFactory.createUser("john.doe2@gmail.com", "StrongPassword1234")
        await UserFactory.modifyBirth(user, "2003-02-12T20:52:39.890Z")
        await UserFactory.modifyName(user, "John", "Doe")
        await UserFactory.modifyPhone(user, "mobile", "+1", "641369491")
        await UserFactory.validateNonceEmail(user)
        await UserFactory.validateNoncePhone(user)
        await UserFactory.modifyGender(user, "homme")
        await user.save()

        // Login 
        const login = await request(app)
            .post('/api/auth/login')
            .send({"user": {"email": "john.doe2@gmail.com", "password": "StrongPassword1234"}})
            .set('Accept', 'application/json')

        other_token = login.body.token
        other_id = login.body._id.toString()

        const res = await request(app)
            .delete('/api/journey/' + journeyId)
            .send({"journey": {"starting": {"city": "TORRONTO","address": ["1 rue Torronto"], "regionCode": "CA"},"carId": carId,"arrival": {"city": "MontReal","address": ["10 Rue St-Pierre"], "regionCode": "CA"},"date": (new Date(Date.now()+3600000)).toISOString(),"seats": {"total": 5,"left": 3},"price": -40.0}})
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${other_token}`)

        expect(res.status).toBe(401)
        expect(res.body.errors).toEqual({
            "user": {
                "code": "unauthorized",
                "name": "Vous n'êtes pas autorisé à éditer un objet dont vous n'êtes pas le propriétaire."
            }
        })
    })


    it ("should return 200", async () => {
        // Création d'un user pour créer une réservation
        const user = await UserFactory.createUser("john.doe2@gmail.com", "StrongPassword1234")
        await UserFactory.modifyBirth(user, "2003-02-12T20:52:39.890Z")
        await UserFactory.modifyName(user, "John", "Doe")
        await UserFactory.modifyPhone(user, "mobile", "+1", "641369491")
        await UserFactory.validateNonceEmail(user)
        await UserFactory.validateNoncePhone(user)
        await UserFactory.modifyGender(user, "homme")
        await user.save()

        // Login 
        const login = await request(app)
            .post('/api/auth/login')
            .send({"user": {"email": "john.doe2@gmail.com", "password": "StrongPassword1234"}})
            .set('Accept', 'application/json')

        other_token = login.body.token
        other_id = login.body._id.toString()

        // Création d'une réservation
        const myRes = await ReservationFactory.createReservation(other_id, journeyId)

        const res = await request(app)
            .delete('/api/journey/' + journeyId)
            .send({"journey": {"starting": {"city": "TORRONTO","address": ["1 rue Torronto"], "regionCode": "CA"},"carId": carId,"arrival": {"city": "MontReal","address": ["10 Rue St-Pierre"], "regionCode": "CA"},"date": (new Date(Date.now()+3600000)).toISOString(),"seats": {"total": 5,"left": 3},"price": -40.0}})
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(200)

        const myResReq = await ReservationSeeker.getReservations({"_id": myRes._id.toString()})
        expect(myResReq.length).toBe(0)
    })
})
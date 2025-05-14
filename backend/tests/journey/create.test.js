const request = require('supertest');
const app = require('../../app');
const UserFactory = require("../../components/users/userFactory")
const CarFactory = require("../../components/cars/CarFactory")
const JourneySeeker = require("../../components/journeys/JourneySeeker")

describe('POST /api/journey/', () => {
    let token = undefined
    let id = undefined
    let carId = undefined

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
        carId = car._id
    });


    afterEach(() => {
        jest.clearAllMocks()
    })


    it ("should return 400 missing fields", async () => {
        // Missing carId
        const res = await request(app)
            .post('/api/journey')
            .send({"journey": {"starting": {"city": "TORRONTO","address": ["1 rue Torronto"]},"arrival": {"city": "MontReal","address": ["10 Rue St-Pierre"]},"date": (new Date(Date.now()+3600000)).toISOString(),"seats": {"total": 5,"left": 3},"price": 40.0}})
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(400)
        expect(res.body.errors).toEqual({
            "journey": {
                "code": "bad-request",
                "name": "La requête ne contient pas tous les attributs nécessaires à la création de l'objet."
            }
        })
    })


    it ("should return 400 bad date", async () => {
        const res = await request(app)
            .post('/api/journey')
            .send({"journey": {"starting": {"city": "TORRONTO","address": ["1 rue Torronto"]},"carId": carId,"arrival": {"city": "MontReal","address": ["10 Rue St-Pierre"]},"date": (new Date(Date.now()-3600000)).toISOString(),"seats": {"total": 5,"left": 3},"price": 40.0}})
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(400)
        expect(res.body.errors).toEqual({
            "journey": {
                "code": "bad-request",
                "name": "La date renseignée doit être supérieure ou égale à la date actuelle."
            }
        })
    })    


    it ("should return 400 date bad format", async () => {
        const res = await request(app)
            .post('/api/journey')
            .send({"journey": {"starting": {"city": "TORRONTO","address": ["1 rue Torronto"]},"carId": carId,"arrival": {"city": "MontReal","address": ["10 Rue St-Pierre"]},"date": "Not valid","seats": {"total": 5,"left": 3},"price": 40.0}})
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(400)
        expect(res.body.errors).toEqual({
            "journey": {
                "code": "bad-request",
                "name": "La date renseignée n'est pas dans le format attendu."
            }
        })
    })


    it ("should return 400 date bad type", async () => {
        const res = await request(app)
            .post('/api/journey') // Price is string instead of number
            .send({"journey": {"starting": {"city": "TORRONTO","address": ["1 rue Torronto"]},"carId": carId,"arrival": {"city": "MontReal","address": ["10 Rue St-Pierre"]},"date": (new Date(Date.now()+3600000)).toISOString(),"seats": {"total": 5,"left": 3},"price": "40.0"}})
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(400)
        expect(res.body.errors).toEqual({
            "journey": {
                "code": "bad-request",
                "name": "Le type des variables ne correspond pas aux attendus."
            }
        })
    })


    it ("should return 400 bad seats", async () => {
        const res = await request(app)
            .post('/api/journey')
            .send({"journey": {"starting": {"city": "TORRONTO","address": ["1 rue Torronto"]},"carId": carId,"arrival": {"city": "MontReal","address": ["10 Rue St-Pierre"]},"date": (new Date(Date.now()+3600000)).toISOString(),"seats": {"total": 5,"left": -1},"price": 40.0}})
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(400)
        expect(res.body.errors).toEqual({
            "journey": {
                "code": "bad-request",
                "name": "Le nombre de places doit au moins être de 1."
            }
        })
    })


    it ("should return 400 total seats", async () => {
        const res = await request(app)
            .post('/api/journey')
            .send({"journey": {"starting": {"city": "TORRONTO","address": ["1 rue Torronto"]},"carId": carId,"arrival": {"city": "MontReal","address": ["10 Rue St-Pierre"]},"date": (new Date(Date.now()+3600000)).toISOString(),"seats": {"total": 5,"left": 7},"price": 40.0}})
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(400)
        expect(res.body.errors).toEqual({
            "journey": {
                "code": "bad-request",
                "name": "Le nombre de places restantes doit être inférieur au nombre de place total."
            }
        })
    })


    it ("should return 400 bad price", async () => {
        const res = await request(app)
            .post('/api/journey')
            .send({"journey": {"starting": {"city": "TORRONTO","address": ["1 rue Torronto"]},"carId": carId,"arrival": {"city": "MontReal","address": ["10 Rue St-Pierre"]},"date": (new Date(Date.now()+3600000)).toISOString(),"seats": {"total": 5,"left": 3},"price": -40.0}})
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(400)
        expect(res.body.errors).toEqual({
            "journey": {
                "code": "bad-request",
                "name": "Le prix d'un trajet ne peut pas aller en dessous de 0."
            }
        })
    })


    it ("should return 401 not authenticated", async () => {
        const res = await request(app)
            .post('/api/journey')
            .send({"journey": {"starting": {"city": "TORRONTO","address": ["1 rue Torronto"]},"carId": carId,"arrival": {"city": "MontReal","address": ["10 Rue St-Pierre"]},"date": (new Date(Date.now()+3600000)).toISOString(),"seats": {"total": 5,"left": 3},"price": -40.0}})
            .set('Accept', 'application/json')

        expect(res.status).toBe(401)
        expect(res.body.errors).toEqual({
            "user": {
                "code": "unauthorized",
                "name": "L'utilisateur doit être connecté pour effectuer cette action."
            }
        })
    })


    it ("should return 400 bad address", async () => {
        jest.clearAllMocks() // Annuler le mock de retour correct
        // Créer un mock avec résultats de mauvaise adresse
        global.fetch = jest.fn() 
        const mockResponse = {
            json: async () => ({
                result: {
                    verdict: {
                        inputGranularity: "BLOCK",
                        validationGranularity: "STREET" // Trop peu précis
                    }
                }
            })
        }
        global.fetch
            .mockResolvedValueOnce(mockResponse) // pour l'adresse de départ
            .mockResolvedValueOnce(mockResponse) // pour l'adresse d'arrivée
        
        const res = await request(app)
            .post('/api/journey')
            .send({"journey": {"starting": {"city": "BADCITY","address": ["Not existing address"]},"carId": carId,"arrival": {"city": "Also Bad Vity","address": ["This is not an address"]},"date": (new Date(Date.now()+3600000)).toISOString(),"seats": {"total": 5,"left": 3},"price": 40.0}})
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(400)

        expect(res.body.errors).toEqual({
            "journey": {
                "code": "bad-request",
                "name": "L'adresse renseignée est invalide ou est trop imprécise."
            }
        })
    })


    it ("should return 400 not owner of car", async () => {
        // Creating a valid user:
        const user = await UserFactory.createUser("john.doe2@gmail.com", "StrongPassword1234")
        await UserFactory.modifyBirth(user, "2003-02-12T20:52:39.890Z")
        await UserFactory.modifyName(user, "John", "Doe")
        await UserFactory.modifyPhone(user, "mobile", "+1", "641369490")
        await UserFactory.validateNonceEmail(user)
        await UserFactory.validateNoncePhone(user)
        await user.save()

        other_id = user._id.toString()

        const other_car = await CarFactory.createCar(other_id, "VUS 2016", "Peugeot", "2016", "208", "Rouge", "ABC DEF GHI", true, "Mon char !!")
        await other_car.save()
        let otherCarId = other_car._id

        const res = await request(app)
            .post('/api/journey')
            .send({"journey": {"starting": {"city": "TORRONTO","address": ["1 rue Torronto"]},"carId": otherCarId,"arrival": {"city": "MontReal","address": ["10 Rue St-Pierre"]},"date": (new Date(Date.now()+3600000)).toISOString(),"seats": {"total": 5,"left": 3},"price": 40.0}})
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(401)
        expect(res.body.errors).toEqual({
            "journey": {
                "code": "unauthorized",
                "name": "La voiture renseignée n'est pas possédée par l'utilisateur."
            }
        })
    })


    it ("should return 400 address not in QC", async () => {
        // Setting a return of API not in QC
        jest.clearAllMocks()

        global.fetch = jest.fn()

        const mockResponse = {
            json: async () => ({
                result: {
                    verdict: {
                        inputGranularity: "PREMISE",
                        validationGranularity: "PREMISE"
                    },
                    address: {
                        formattedAddress: '999 Boulevard Talbot, Chicoutimi, ON G7H 4B5, Canada'
                    }
                }
            })
        }

        global.fetch
            .mockResolvedValueOnce(mockResponse) // pour l'adresse de départ
            .mockResolvedValueOnce(mockResponse) // pour l'adresse d'arrivée

        const res = await request(app)
            .post('/api/journey')
            .send({"journey": {"starting": {"city": "TORRONTO","address": ["1 rue Torronto"]},"carId": carId,"arrival": {"city": "MontReal","address": ["10 Rue St-Pierre"]},"date": (new Date(Date.now()+3600000)).toISOString(),"seats": {"total": 5,"left": 3},"price": 40.0}})
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(400)
        expect(res.body.errors).toEqual({
            "journey": {
                "code": "bad-request",
                "name": "Le covoiturage doit avoir lieu au Québec."
            }
        })
    })


    it ("should return 201", async () => {
        const res = await request(app)
            .post('/api/journey')
            .send({"journey": {"starting": {"city": "TORRONTO","address": ["1 rue Torronto"]},"carId": carId,"arrival": {"city": "MontReal","address": ["10 Rue St-Pierre"]},"date": (new Date(Date.now()+3600000)).toISOString(),"seats": {"total": 5,"left": 3},"price": 40.0}})
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(201)

        // Testing if the header location is giving an id
        expect(typeof(res.get("Location"))).toBe("string")
        const locationElts = res.get("Location").split("/") // should be [ '', 'api', 'journey', '<id>' ]
        expect(locationElts[1]).toBe("api")
        expect(locationElts[2]).toBe("journey")
        expect(typeof(locationElts[3])).toBe("string")
        expect(locationElts[3].length).toBe(24) 
        expect(res.body).toBe("") // No body

        const j = await JourneySeeker.getOneJourney(locationElts[3])
        expect(j.state).toBe("w")
        expect(j.starting.address).toBe('999 Boulevard Talbot, Chicoutimi, QC G7H 4B5, Canada')
        expect(j.starting.city).toBe('chicoutimi')
        expect(j.arrival.address).toBe('999 Boulevard Talbot, Chicoutimi, QC G7H 4B5, Canada')
        expect(j.arrival.city).toBe('chicoutimi')
    })
})
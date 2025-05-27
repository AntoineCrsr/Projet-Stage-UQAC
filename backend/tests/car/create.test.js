const request = require('supertest');
const app = require('../../app');
const UserFactory = require("../../components/users/userFactory")
const CarFactory = require("../../components/cars/CarFactory")

describe('POST /api/car/', () => {
    let token = undefined
    let id = undefined

    beforeEach(async () => {
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
        id = res.body._id
    });


    it ("should return 400 not enough args", async () => {
        const res = await request(app)
            .post('/api/car/')
            .send({"car": {"carType":"VUS 2016","year":"2016","model":"208","color":"Rouge","licensePlate":"ABCDEFGHI","airConditioner":true,"name":"Mon char !!"}})
            // Missing manufacturer:
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .expect(400)

        expect(res.body.errors).toEqual({
            "car": {
                "code": "bad-request",
                "name": "La requête ne contient pas tous les attributs nécessaires à la création de l'objet."
            }
        })
    })

    it ("should return 400 bad format", async () => {
        // Car Type:
        let res = await request(app)
            .post('/api/car/')
            .send({"car": {"carType":"VUS 2016","manufacturer":"Peugeot","year":"NOT VALID","model":"208","color":"Rouge","licensePlate":"ABCDEFGHI","airConditioner":true,"name":"Mon char !!"}})
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .expect(400)

        expect(res.body.errors).toEqual({
            "car": {
                "code": "bad-request",
                "name": "Le type des données ne correspond pas aux attendus."
            }
        })

        // License Plate:
        res = await request(app)
            .post('/api/car/')
            .send({"car": {"carType":"VUS 2016","manufacturer":"Peugeot","year":"2016","model":"208","color":"Rouge","licensePlate":"INV#A#LID","airConditioner":true,"name":"Mon char !!"}})
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .expect(400)

        expect(res.body.errors).toEqual({
            "car": {
                "code": "bad-request",
                "name": "Le type des données ne correspond pas aux attendus."
            }
        })
    })


    it ("should return 409", async () => {
        // Creating a valid car:
        const car = await CarFactory.createCar(id, "VUS 2016", "Peugeot", "2016", "208", "Rouge", "ABCDEFGHI", true, "Mon char !!")
        await car.save()

        // Creating a car with the exact same License Plate
        const res = await request(app)
            .post('/api/car/')
            .send({"car": {"carType":"VUS 2016","year":"2016","manufacturer":"Peugeot","model":"208","color":"Rouge","licensePlate":"ABCDEFGHI","airConditioner":true,"name":"Mon char !!"}})
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .expect(409)

        expect(res.body.errors).toEqual({
            "car": {
                "code": "conflict",
                "name": "Une voiture possède déjà cette plaque d'immatriculation."
            }
        })
    }) 


    it ("should return 401 not connected", async () => {
        // User not connected
        const res = await request(app)
            .post('/api/car/')
            .send({"car": {"carType":"VUS 2016","year":"2016","manufacturer":"Peugeot","model":"208","color":"Rouge","licensePlate":"ABCDEFGHI","airConditioner":true,"name":"Mon char !!"}})
            .set('Accept', 'application/json')
            .expect(401)

        expect(res.body.errors).toEqual({
            "user": {
                "code": "unauthorized",
                "name": "L'utilisateur doit être connecté pour effectuer cette action."
            }
        })
    }) 


    it ("should return 401 registration not completed", async () => {
        // Missing a lot of attributes to be valid:
        const user = await UserFactory.createUser("john.doe2@gmail.com", "StrongPassword1234")
        await UserFactory.modifyBirth(user, "2003-02-12T20:52:39.890Z")
        await user.save()

        // Login 
        const res = await request(app)
            .post('/api/auth/login')
            .send({"user": {"email": "john.doe2@gmail.com", "password": "StrongPassword1234"}})
            .set('Accept', 'application/json')

        other_token = res.body.token
        other_id = res.body._id

        // User with registration incomplete
        const resCar = await request(app)
            .post('/api/car/')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${other_token}`)
            .send({"car": {"carType":"VUS 2016","year":"2016","manufacturer":"Peugeot","model":"208","color":"Rouge","licensePlate":"ABCDEFGHI","airConditioner":true,"name":"Mon char !!"}})
            .expect(401)

        expect(resCar.body.errors).toEqual({
            "user": {
                "code": "unauthorized",
                "name": "L'utilisateur doit compléter son inscription pour effectuer cette action."
            }
        })
    })


    it('should return 400 bad type', async () => {
        await request(app)
            .post('/api/car/')
            .set('Authorization', `Bearer ${token}`) // Manufacturer should be string
            .send({"car": {"carType":"VUS 2016","year":"2016","manufacturer":true,"model":"208","color":"Rouge","licensePlate":"ABCDEFGHI","airConditioner":true,"name":"Mon char !!"}})
            .expect(400)
            .then(response => {
                expect(response.body.errors).toEqual({"car": {"code": "bad-request", "name": "Le type des données ne correspond pas aux attendus."}})
            })
        })


    it ("should return 201 licensePlate 9 chars", async () => {
        const resCar = await request(app)
            .post('/api/car/')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({"car": {"carType":"VUS 2016","year":"2016","manufacturer":"Peugeot","model":"208","color":"Rouge","licensePlate":"ABCDEFGHI","airConditioner":true,"name":"Mon char !!"}})
            .expect(201)
        
        // Testing if the header location is giving an id
        expect(typeof(resCar.get("Location"))).toBe("string")
        const locationElts = resCar.get("Location").split("/") // should be [ '', 'api', 'car', '<id>' ]
        expect(locationElts[1]).toBe("api")
        expect(locationElts[2]).toBe("car")
        expect(typeof(locationElts[3])).toBe("string")
        expect(locationElts[3].length).toBe(24) 
        expect(resCar.body).toBe("") // No body
    })


    it ("should return 201 licensePlate 6 chars", async () => {
        const resCar = await request(app)
            .post('/api/car/')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({"car": {"carType":"VUS 2016","year":"2016","manufacturer":"Peugeot","model":"208","color":"Rouge","licensePlate":"123ABC","airConditioner":true,"name":"Mon char !!"}})
            .expect(201)
        
        // Testing if the header location is giving an id
        expect(typeof(resCar.get("Location"))).toBe("string")
        const locationElts = resCar.get("Location").split("/") // should be [ '', 'api', 'car', '<id>' ]
        expect(locationElts[1]).toBe("api")
        expect(locationElts[2]).toBe("car")
        expect(typeof(locationElts[3])).toBe("string")
        expect(locationElts[3].length).toBe(24) 
        expect(resCar.body).toBe("") // No body
    })
});
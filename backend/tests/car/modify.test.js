const request = require('supertest');
const app = require('../../app');
const UserFactory = require("../../components/users/userFactory")
const CarFactory = require("../../components/cars/CarFactory")

describe('PUT /api/car/id', () => {
    let token = undefined
    let id = undefined
    let carId = undefined

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

        const car = await CarFactory.createCar(id, "VUS 2016","Peugeot","2016","208","Rouge","ABCDEFGHI",true,"Mon char !!")
        await car.save()
        carId = car.id
    });


    it ("should return 401 not connected", async () => {
        // User not connected
        const res = await request(app)
            .put('/api/car/' + carId)
            .send({"car": {"year":"2017"}})
            .set('Accept', 'application/json')
            .expect(401)

        expect(res.body.errors).toEqual({
            "user": {
                "code": "unauthorized",
                "name": "L'utilisateur doit être connecté pour effectuer cette action."
            }
        })

        const response = await request(app)
            .get('/api/car/' + carId + '?private=true')
            .set('Authorization', `Bearer ${token}`)
            

        let car = response.body
      
        // Attributes should not be modified
        expect(car).toBeDefined()
        expect(car.year).toBe("2016")
        expect(car.carType).toBe("VUS 2016")
        expect(car.manufacturer).toBe("Peugeot") 
        expect(car.color).toBe("Rouge") 
        expect(car.model).toBe("208") 
        expect(car.licensePlate).toBe("ABCDEFGHI") 
        expect(car.airConditioner).toBe(true) 
        expect(car.name).toBe("Mon char !!") 
    }) 


    it ("should return 401 not owner", async () => {
        // Creating other user
        const user = await UserFactory.createUser("john.doe2@gmail.com", "StrongPassword1234")
        await UserFactory.modifyBirth(user, "2003-02-12T20:52:39.890Z")
        await UserFactory.modifyName(user, "John", "Doe")
        await UserFactory.modifyPhone(user, "mobile", "+1", "641369490")
        await UserFactory.validateNonceEmail(user)
        await UserFactory.validateNoncePhone(user)
        await user.save()

        // Login 
        const connection = await request(app)
            .post('/api/auth/login')
            .send({"user": {"email": "john.doe2@gmail.com", "password": "StrongPassword1234"}})
            .set('Accept', 'application/json')

        other_token = connection.body.token
        other_id = connection.body._id

        // Trying to modify using the other account
        const res = await request(app)
            .put('/api/car/' + carId)
            .set('Authorization', `Bearer ${other_token}`)
            .send({"car": {"carType":"VUS 2016","year":"2017","manufacturer":"Peugeot","model":"208","color":"Rouge","licensePlate":"ABCDEFGHI","airConditioner":true,"name":"Mon char !!"}})
            .set('Accept', 'application/json')
            .expect(401)

        // Testing if this is the right error
        expect(res.body.errors).toEqual({
            "user": {
                "code": "unauthorized",
                "name": "Vous n'êtes pas autorisé à éditer un objet dont vous n'êtes pas le propriétaire."
            }
        })

        // Getting back the object to see if something has changed unexpectedly
        const response = await request(app)
            .get('/api/car/' + carId + '?private=true')
            .set('Authorization', `Bearer ${token}`)
            

        let car = response.body
      
        // Attributes should not be modified
        expect(car).toBeDefined()
        expect(car.year).toBe("2016")
        expect(car.carType).toBe("VUS 2016")
        expect(car.manufacturer).toBe("Peugeot") 
        expect(car.color).toBe("Rouge") 
        expect(car.model).toBe("208") 
        expect(car.licensePlate).toBe("ABCDEFGHI") 
        expect(car.airConditioner).toBe(true) 
        expect(car.name).toBe("Mon char !!") 
    }) 


    it ("should return 400 typerror year", async () => {
        const carTemplate = {"car": {"carType":"VUS 2016","year":"INVALID","manufacturer":"Peugeot","model":"208","color":"Rouge","licensePlate":"ABCDEFGHI","airConditioner":true,"name":"Mon char !!"}}

        // The invalid request
        await request(app)
            .put('/api/car/' + carId)
            .set('Authorization', `Bearer ${token}`)
            .send(carTemplate)
            .set('Accept', 'application/json')
            .expect(400)
            .then(res => {
                // Testing if this is the right error
                expect(res.body.errors).toEqual({
                    "car": {
                        "code": "bad-request",
                        "name": "Le type des données ne correspond pas aux attendus."
                    }
                })
            })

        // Getting back the object to see if something has changed unexpectedly
        const response = await request(app)
            .get('/api/car/' + carId + '?private=true')
            .set('Authorization', `Bearer ${token}`)

        let car = response.body

        // Attributes should not be modified
        expect(car).toBeDefined()
        expect(car.year).toBe("2016")
        expect(car.carType).toBe("VUS 2016")
        expect(car.manufacturer).toBe("Peugeot") 
        expect(car.color).toBe("Rouge") 
        expect(car.model).toBe("208") 
        expect(car.licensePlate).toBe("ABCDEFGHI") 
        expect(car.airConditioner).toBe(true) 
        expect(car.name).toBe("Mon char !!") 
    })  
    
    
    it ("should return 400 typerror licensePlate", async () => {
        const carTemplate = {"car": {"carType":"VUS 2016","year":"2016","manufacturer":"Peugeot","model":"208","color":"Rouge","licensePlate":"INVALID","airConditioner":true,"name":"Mon char !!"}}

        // The invalid request
        await request(app)
            .put('/api/car/' + carId)
            .set('Authorization', `Bearer ${token}`)
            .send(carTemplate)
            .set('Accept', 'application/json')
            .expect(400)
            .then(res => {
                // Testing if this is the right error
                expect(res.body.errors).toEqual({
                    "car": {
                        "code": "bad-request",
                        "name": "Le type des données ne correspond pas aux attendus."
                    }
                })
            })

        // Getting back the object to see if something has changed unexpectedly
        const response = await request(app)
            .get('/api/car/' + carId + '?private=true')
            .set('Authorization', `Bearer ${token}`)

        let car = response.body

        // Attributes should not be modified
        expect(car).toBeDefined()
        expect(car.year).toBe("2016")
        expect(car.carType).toBe("VUS 2016")
        expect(car.manufacturer).toBe("Peugeot") 
        expect(car.color).toBe("Rouge") 
        expect(car.model).toBe("208") 
        expect(car.licensePlate).toBe("ABCDEFGHI") 
        expect(car.airConditioner).toBe(true) 
        expect(car.name).toBe("Mon char !!") 
    }) 
    
    
    it ("should return 400 typerror airConditionner", async () => {
        const carTemplate = {"car": {"carType":"VUS 2016","year":"2016","manufacturer":"Peugeot","model":"208","color":"Rouge","licensePlate":"ABCDEFGHI","airConditioner":"INVALID","name":"Mon char !!"}}

        // The invalid request
        await request(app)
            .put('/api/car/' + carId)
            .set('Authorization', `Bearer ${token}`)
            .send(carTemplate)
            .set('Accept', 'application/json')
            .expect(400)
            .then(res => {
                // Testing if this is the right error
                expect(res.body.errors).toEqual({
                    "car": {
                        "code": "bad-request",
                        "name": "Le type des données ne correspond pas aux attendus."
                    }
                })
            })

        // Getting back the object to see if something has changed unexpectedly
        const response = await request(app)
            .get('/api/car/' + carId + '?private=true')
            .set('Authorization', `Bearer ${token}`)

        let car = response.body

        // Attributes should not be modified
        expect(car).toBeDefined()
        expect(car.year).toBe("2016")
        expect(car.carType).toBe("VUS 2016")
        expect(car.manufacturer).toBe("Peugeot") 
        expect(car.color).toBe("Rouge") 
        expect(car.model).toBe("208") 
        expect(car.licensePlate).toBe("ABCDEFGHI") 
        expect(car.airConditioner).toBe(true) 
        expect(car.name).toBe("Mon char !!") 
    }) 


    it ("should return 409 already existing", async () => {
        // New car with licensePlate
        const newCar = await CarFactory.createCar(id, "VUS 2016","Peugeot","2016","208","Rouge","AAAAAAAAA",true,"Mon char !!")
        await newCar.save()

        // Modifying with the exact same licensePlate
        const res = await request(app)
            .put('/api/car/' + carId)
            .set('Authorization', `Bearer ${token}`)
            .send({"car": {"carType":"VUS 2016","year":"2017","manufacturer":"Peugeot","model":"208","color":"Rouge","licensePlate":"AAAAAAAAA","airConditioner":true,"name":"Mon char !!"}})
            .set('Accept', 'application/json')
            .expect(409)

        // Testing if this is the right error
        expect(res.body.errors).toEqual({
            "car": {
                "code": "conflict",
                "name": "Une voiture possède déjà cette plaque d'immatriculation."
            }
        })

        // Getting back the object to see if something has changed unexpectedly
        const response = await request(app)
            .get('/api/car/' + carId + '?private=true')
            .set('Authorization', `Bearer ${token}`)

        let car = response.body

        // Attributes should not be modified
        expect(car).toBeDefined()
        expect(car.year).toBe("2016")
        expect(car.carType).toBe("VUS 2016")
        expect(car.manufacturer).toBe("Peugeot") 
        expect(car.color).toBe("Rouge") 
        expect(car.model).toBe("208") 
        expect(car.licensePlate).toBe("ABCDEFGHI") 
        expect(car.airConditioner).toBe(true) 
        expect(car.name).toBe("Mon char !!") 
    }) 


    it ("should return 404", async () => {
        const res = await request(app)
            .put('/api/car/000000000000000000000000')
            .set('Authorization', `Bearer ${token}`)
            .send({"car": {"carType":"VUS 2017","year":"2017","manufacturer":"Citroen","model":"308","color":"Noir","licensePlate":"AAAAAAAA2","airConditioner":false,"name":"My car"}})
            .set('Accept', 'application/json')
            .expect(404)
    }) 


    it('should return 400 bad type', async () => {
        await request(app)
            .put('/api/car/' + carId)
            .set('Authorization', `Bearer ${token}`) // Manufacturer should be string
            .send({"car": {"carType":"VUS 2016","year":"2016","manufacturer":true,"model":"208","color":"Rouge","licensePlate":"ABCDEFGHI","airConditioner":true,"name":"Mon char !!"}})
            .expect(400)
            .then(response => {
                expect(response.body.errors).toEqual({"car": {"code": "bad-request", "name": "Le type des données ne correspond pas aux attendus."}})
            })
        })


    it ("should return 200 - 9 chars LicensePlate", async () => {
        const res = await request(app)
            .put('/api/car/' + carId)
            .set('Authorization', `Bearer ${token}`)
            .send({"car": {"carType":"VUS 2017","year":"2017","manufacturer":"Citroen","model":"308","color":"Noir","licensePlate":"AAAAAAAA2","airConditioner":false,"name":"My car"}})
            .set('Accept', 'application/json')
            .expect(200)

        // Testing if the header location is giving an id
        expect(typeof(res.get("Location"))).toBe("string")
        const locationElts = res.get("Location").split("/") // should be [ '', 'api', 'car', '<id>' ]
        expect(locationElts[1]).toBe("api")
        expect(locationElts[2]).toBe("car")
        expect(typeof(locationElts[3])).toBe("string")
        expect(locationElts[3].length).toBe(24) 
        expect(res.body).toBe("") // No body

        // Getting back the object to see if something has changed unexpectedly
        const response = await request(app)
            .get('/api/car/' + carId + '?private=true')
            .set('Authorization', `Bearer ${token}`)

        let car = response.body

        expect(car).toBeDefined()
        expect(car.year).toBe("2017")
        expect(car.carType).toBe("VUS 2017")
        expect(car.manufacturer).toBe("Citroen") 
        expect(car.color).toBe("Noir") 
        expect(car.model).toBe("308") 
        expect(car.licensePlate).toBe("AAAAAAAA2") 
        expect(car.airConditioner).toBe(false) 
        expect(car.name).toBe("My car") 
    }) 


    it ("should return 200 - 6 chars LicensePlate", async () => {
        const res = await request(app)
            .put('/api/car/' + carId)
            .set('Authorization', `Bearer ${token}`)
            .send({"car": {"carType":"VUS 2017","year":"2017","manufacturer":"Citroen","model":"308","color":"Noir","licensePlate":"123ABC","airConditioner":false,"name":"My car"}})
            .set('Accept', 'application/json')
            .expect(200)

        // Testing if the header location is giving an id
        expect(typeof(res.get("Location"))).toBe("string")
        const locationElts = res.get("Location").split("/") // should be [ '', 'api', 'car', '<id>' ]
        expect(locationElts[1]).toBe("api")
        expect(locationElts[2]).toBe("car")
        expect(typeof(locationElts[3])).toBe("string")
        expect(locationElts[3].length).toBe(24) 
        expect(res.body).toBe("") // No body

        // Getting back the object to see if something has changed unexpectedly
        const response = await request(app)
            .get('/api/car/' + carId + '?private=true')
            .set('Authorization', `Bearer ${token}`)

        let car = response.body

        expect(car).toBeDefined()
        expect(car.year).toBe("2017")
        expect(car.carType).toBe("VUS 2017")
        expect(car.manufacturer).toBe("Citroen") 
        expect(car.color).toBe("Noir") 
        expect(car.model).toBe("308") 
        expect(car.licensePlate).toBe("123ABC") 
        expect(car.airConditioner).toBe(false) 
        expect(car.name).toBe("My car") 
    }) 
});
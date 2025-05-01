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

    // Tests sur owning, format invalide, modification de license vers déjà existante, et le 200 à faire
});
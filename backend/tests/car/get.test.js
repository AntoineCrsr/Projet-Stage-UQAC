const request = require('supertest');
const app = require('../../app');
const UserFactory = require("../../components/users/userFactory")
const CarFactory = require("../../components/cars/CarFactory")

describe('GET /api/car/', () => {
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
        await user.save()

        // Login 
        const res = await request(app)
            .post('/api/auth/login')
            .send({"user": {"email": "john.doe@gmail.com", "password": "StrongPassword1234"}})
            .set('Accept', 'application/json')

        token = res.body.token
        id = res.body._id
    });


    it('should return 302 not private', async () => {
        // Creating a valid car:
        const car = await CarFactory.createCar(id, "VUS 2016", "Peugeot", "2016", "208", "Rouge", "ABC DEF GHI", true, "Mon char !!")
        await car.save()

        const response = await request(app).get('/api/car/' + car.id.toString());

        expect(response.status).toBe(302);

        const keys = Object.keys(response.body)
        
        // Should not contain
        expect(keys).not.toContain("name")
        expect(keys).not.toContain("licensePlate")

        // Values of the other elements
        expect(response.body.userId).toBe(id)
        expect(response.body.carType).toBe("VUS 2016")
        expect(response.body.manufacturer).toBe("Peugeot")
        expect(response.body.year).toBe("2016")
        expect(response.body.model).toBe("208")
        expect(response.body.color).toBe("Rouge")
        expect(response.body.airConditioner).toBe(true)
        expect(response.body.imageUrl).toBe(null)
    });
    

    it('should return 302 with private data', async () => {
      // Creating a valid car:
      const car = await CarFactory.createCar(id, "VUS 2016", "Peugeot", "2016", "208", "Rouge", "ABC DEF GHI", true, "Mon char !!")
      await car.save()

      const response = await request(app)
        .get('/api/car/' + car.id.toString() + '?private=true')
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(302);

      // Values of the other elements
      expect(response.body.userId).toBe(id)
      expect(response.body.carType).toBe("VUS 2016")
      expect(response.body.manufacturer).toBe("Peugeot")
      expect(response.body.year).toBe("2016")
      expect(response.body.model).toBe("208")
      expect(response.body.color).toBe("Rouge")
      expect(response.body.airConditioner).toBe(true)
      expect(response.body.name).toBe("Mon char !!")
      expect(response.body.licensePlate).toBe("ABC DEF GHI")
      expect(response.body.imageUrl).toBe(null)
  });


  it('should return 404', async () => {
    const response = await request(app).get('/api/car/000000000000000000000000');

    expect(response.status).toBe(404);
    expect(response.body.errors).toEqual({"car": {"code": "not-found", "name": "La voiture n'a pas été trouvée."}});
  });


  it('should return 400', async () => {
    const response = await request(app).get('/api/car/000000°0{0000000000000~0');

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual({"car": {"code": "bad-request", "name": "L'identifiant renseigné n'est pas dans un format acceptable."}});
  });


  it('should return 401 not authenticated', async () => {
     // Creating a valid car:
     const car = await CarFactory.createCar(id, "VUS 2016", "Peugeot", "2016", "208", "Rouge", "ABC DEF GHI", true, "Mon char !!")
     await car.save()

     const response = await request(app)
        .get('/api/car/' + car.id.toString() + '?private=true') // Not authenticated

      expect(response.status).toBe(401);

      expect(response.body.errors).toEqual({"user": {"code": "unauthorized", "name": "L'utilisateur doit être connecté pour effectuer cette action."}});
  });
  
  
  it('should return 401 not authorized', async () => {
     // Creating a valid car:
     const car = await CarFactory.createCar(id, "VUS 2016", "Peugeot", "2016", "208", "Rouge", "ABC DEF GHI", true, "Mon char !!")
     await car.save()

     // Création d'un autre user et récupération du token de connexion
     const user = await UserFactory.createUser("john.doe2@gmail.com", "StrongPassword1234")
     await UserFactory.modifyBirth(user, "2003-02-12T20:52:39.890Z")
     await UserFactory.modifyName(user, "John", "Doe")
     await UserFactory.modifyPhone(user, "mobile", "+1", "641369490")
     await UserFactory.validateNonceEmail(user)
     await UserFactory.validateNoncePhone(user)
     await user.save()

     // Login 
     const res = await request(app)
         .post('/api/auth/login')
         .send({"user": {"email": "john.doe2@gmail.com", "password": "StrongPassword1234"}})
         .set('Accept', 'application/json')

     other_token = res.body.token

     const response = await request(app)
        .get('/api/car/' + car.id.toString() + '?private=true')
        .set('Authorization', `Bearer ${other_token}`)

      expect(response.status).toBe(401);

      expect(response.body.errors).toEqual({"user": {"code": "unauthorized", "name": "Vous n'êtes pas autorisé à éditer un objet dont vous n'êtes pas le propriétaire."}});
  });


  it('should return 200', async () => {
    // Creating multiple valid cars:
    for (let i = 0; i<30; i++) {
      let car = await CarFactory.createCar(id, "VUS 2016", "Peugeot", "2016", "208", "Rouge", "ABC DEF GHI", true, "Mon char " + i)
      await car.save()
    }

    const response = await request(app).get('/api/car/');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy()
    expect(response.body.length).toBe(20)

    for (let i = 0; i < response.body.length; i++) {
      let car = response.body[i]

      const keys = Object.keys(car)
      
      // Should not contain
      expect(keys).not.toContain("name")
      expect(keys).not.toContain("licensePlate")
  
      // Values of the other elements
      expect(car.userId).toBe(id)
      expect(car.carType).toBe("VUS 2016")
      expect(car.manufacturer).toBe("Peugeot")
      expect(car.year).toBe("2016")
      expect(car.model).toBe("208")
      expect(car.color).toBe("Rouge")
      expect(car.airConditioner).toBe(true)
      expect(car.imageUrl).toBe(null)
    }
});
});
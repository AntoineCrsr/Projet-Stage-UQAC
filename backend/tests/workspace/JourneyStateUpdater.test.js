const JourneyFactory = require("../../components/journeys/JourneyFactory")
const UserFactory = require("../../components/users/userFactory")
const CarFactory = require("../../components/cars/CarFactory")
const request = require('supertest');
const app = require('../../app');

describe("Journey State Updater", () => {
    let token = undefined
    let id = undefined
    let car = undefined

    beforeEach(async () => {
        // Création d'un user et récupération du token de connexion
        const user = await UserFactory.createUser("john.doe@gmail.com", "StrongPassword1234")
        await UserFactory.modifyBirth(user, "2003-02-12T20:52:39.890Z")
        await UserFactory.modifyName(user, "John", "Doe")
        await UserFactory.modifyPhone(user, "mobile", "+1", "641369490")
        await UserFactory.validateNonceEmail(user)
        await UserFactory.validateNoncePhone(user)
        await user.save()

        const initialDate = new Date("2025-05-13T20:42:16.652Z")
        jest.spyOn(Date, 'now').mockImplementation(() => initialDate.getTime())

        // Login 
        const res = await request(app)
            .post('/api/auth/login')
            .send({"user": {"email": "john.doe@gmail.com", "password": "StrongPassword1234"}})
            .set('Accept', 'application/json')

        token = res.body.token
        id = res.body._id

        // Création d'une voiture pour la renseigner dans les journeys
        car = await CarFactory.createCar(id, "VUS 2016", "Peugeot", "2016", "208", "Rouge", "ABC DEF GHI", true, "Mon char !!")
        await car.save()

        Date.now.mockRestore();
    })

    it ("should update journey", async () => {
        // 1. Fixe la "date actuelle" au 13 mai
        const initialDate = new Date("2025-05-13T20:42:16.652Z")
        jest.spyOn(Date, 'now').mockImplementation(() => initialDate.getTime())

        // 2. Crée un journey daté du 14 mai (donc futur à ce moment)
        const journeyDate = (new Date("2025-05-14T20:42:16.652Z")).toISOString()

        const j1 = await JourneyFactory.createJourney(
            id,
            { city: "TORRONTO", address: "1 rue Torronto" },
            { city: "MontReal", address: "10 Rue St-Pierre" },
            journeyDate,
            { total: 5, left: 3 },
            40,
            car._id
        );
        await j1.save()

        // 3. Avance le temps au 15 mai => journey devrait maintenant être considéré comme "passé"
        Date.now.mockRestore(); // Important pour éviter les conflits
        jest.spyOn(Date, 'now').mockImplementation(() => new Date("2025-05-15T20:42:16.652Z").getTime());

        // 4. Déclenche une route avec le middleware
        const response = await request(app)
            .get('/api/journey/' + j1._id.toString())
            .set('Authorization', `Bearer ${token}`);

        // 5. Recharge depuis la base 
        expect(response.body.state).toBe("d");
        Date.now.mockRestore();
    });


    it ("should not update journey", async () => {
        // 1. Fixe la "date actuelle" au 13 mai
        const initialDate = new Date("2025-05-13T20:42:16.652Z")
        jest.spyOn(Date, 'now').mockImplementation(() => initialDate.getTime())

        // Fais un get quelconque pour faire un update
        const responseJourneys = await request(app)
            .get('/api/journey/')
            .set('Authorization', `Bearer ${token}`);

        // 2. Crée un journey daté du 14 mai (donc futur à ce moment)
        const journeyDate = (new Date("2025-05-14T20:42:16.652Z")).toISOString()

        const j1 = await JourneyFactory.createJourney(
            id,
            { city: "TORRONTO", address: "1 rue Torronto" },
            { city: "MontReal", address: "10 Rue St-Pierre" },
            journeyDate,
            { total: 5, left: 3 },
            40,
            car._id
        );
        await j1.save()

        // Get qui ne devrait pas modifier le state puisque la journey n'est pas passée
        const response = await request(app)
            .get('/api/journey/' + j1._id.toString())
            .set('Authorization', `Bearer ${token}`);

        // 5. Recharge depuis la base 
        expect(response.body.state).toBe("w");
        Date.now.mockRestore();
    });
})
const request = require('supertest');
const app = require('../../app');
const UserFactory = require("../../components/users/userFactory")

describe('GET /api/auth/<id>', () => {
    it('should return 302', async () => {
        // Creating a valid user:
        const user = await UserFactory.createUser("john.doe@gmail.com", "StrongPassword1234")
        await UserFactory.modifyBirth(user, "2003-02-12T20:52:39.890Z")
        await UserFactory.modifyName(user, "John", "Doe")
        await UserFactory.modifyPhone(user, "mobile", "+1", "641369490")
        await UserFactory.validateNonceEmail(user)
        await UserFactory.validateNoncePhone(user)
        await user.save()

        const response = await request(app).get('/api/auth/' + user._id.toString());

        expect(response.status).toBe(302);

        const keys = Object.keys(response.body)
        
        // Should contain
        expect(keys).toContain("name")
        expect(keys).toContain("rating")
        expect(keys).toContain("aboutMe")
        expect(keys).toContain("imageUrl")
        expect(keys).toContain("statistics")
        
        // Should not contain
        expect(keys).not.toContain("parameters")
        expect(keys).not.toContain("email") // Because of parameters showEmail = false by default
        expect(keys).not.toContain("phone") // Same
        expect(keys).not.toContain("password")
        expect(keys).not.toContain("isStudent")
        expect(keys).not.toContain("dateBirthday")
        expect(keys).not.toContain("alternateEmail")
        expect(keys).not.toContain("testimonial")
        expect(keys).not.toContain("hasVerifiedEmail")
        expect(keys).not.toContain("hasVerifiedPhone")
        expect(keys).not.toContain("emailNonce")
        expect(keys).not.toContain("phoneNonce")
    });
    

    it('should return 302 with private data', async () => {
      // Creating a valid user:
      const user = await UserFactory.createUser("john.doe@gmail.com", "StrongPassword1234")
      await UserFactory.modifyBirth(user, "2003-02-12T20:52:39.890Z")
      await UserFactory.modifyName(user, "John", "Doe")
      await UserFactory.modifyPhone(user, "mobile", "+1", "641369490")
      await UserFactory.validateNonceEmail(user)
      await UserFactory.validateNoncePhone(user)
      await user.save()

      // login
      const res = await request(app)
        .post('/api/auth/login')
        .send({"user": {"email": "john.doe@gmail.com", "password": "StrongPassword1234"}}) // Not containing password
        .set('Accept', 'application/json')

      const response = await request(app)
        .get('/api/auth/' + user._id.toString() + '?private=true')
        .set('Authorization', `Bearer ${res.body.token}`)

      expect(response.status).toBe(302);

      const keys = Object.keys(response.body)
      
      // Should contain
      expect(keys).toContain("name")
      expect(keys).toContain("rating")
      expect(keys).toContain("aboutMe")
      expect(keys).toContain("imageUrl")
      expect(keys).toContain("statistics")
      expect(keys).toContain("parameters")
      expect(keys).toContain("email") 
      expect(keys).toContain("phone")
      expect(keys).toContain("isStudent")
      expect(keys).toContain("dateBirthday")
      expect(keys).toContain("alternateEmail")
      expect(keys).toContain("testimonial")
      expect(keys).toContain("hasVerifiedEmail")
      expect(keys).toContain("hasVerifiedPhone")

      // Should not contain
      expect(keys).not.toContain("emailNonce")
      expect(keys).not.toContain("phoneNonce")
      expect(keys).not.toContain("password")
  });


  it('should return 404', async () => {
    const response = await request(app).get('/api/auth/000000000000000000000000');

    expect(response.status).toBe(404);
    expect(response.body.errors).toEqual({"user": {"code": "not-found", "name": "L'utilisateur n'a pas été trouvé."}});
  });


  it('should return 404', async () => {
    const user = await UserFactory.createUser("john.doe@gmail.com", "StrongPassword1234")

    const response = await request(app).get('/api/auth/' + user._id.toString());

    expect(response.status).toBe(404);
    expect(response.body.errors).toEqual({"user": {"code": "not-found", "name": "L'utilisateur n'a pas été trouvé."}});
  });


  it('should return 400', async () => {
    const response = await request(app).get('/api/auth/azertyuiknbv'); // Not enoughs chars

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual({"user": {"code": "bad-request", "name": "Impossible de rechercher un utilisateur avec un identifiant invalide."}});
  });


  it('should return 400', async () => {
    const response = await request(app).get('/api/auth/azertyuiknbvazertyuiknbvazertyuiknbvazertyuiknbv'); // Too much chars

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual({"user": {"code": "bad-request", "name": "Impossible de rechercher un utilisateur avec un identifiant invalide."}});
  });


  it('should return 400', async () => {
    const response = await request(app).get('/api/auth/000000_00-000000000000'); // Invalid chars

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual({"user": {"code": "bad-request", "name": "Impossible de rechercher un utilisateur avec un identifiant invalide."}});
  });
});
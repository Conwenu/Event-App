const request = require("supertest");
const app = require("../../server/index"); 

const generateQuickUser = () => {
  const randomString = Math.random().toString(36).substring(2, 8);
  const username = `user_${randomString}`;
  const email = `${randomString}@example.com`;

  return { username : username, email: email, password: "password"};
};

describe("GET /users", () => {
  it("should return a list of users", async () => {
    const response = await request(app).get("/api/users");
    expect(response.status).toBe(200);
    expect(response.body.users).toBeInstanceOf(Array);
    expect(Array.isArray(response.body.users)).toBe(true)
    expect(response.body.users[0]).toHaveProperty('id');
    expect(response.body.users[0]).toHaveProperty('username');
    expect(response.body.users[0]).toHaveProperty('email');
    expect(response.body.users[0]).toHaveProperty('password');
  });

  it("should return a user based on the provided id", async () => {
    const response = await request(app).get('/api/user/1')
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('username');
    expect(response.body).toHaveProperty('email');
    expect(response.body).toHaveProperty('password');
  })
});

describe('POST /users', () => {
  it('should return an error if username is missing', async () => {
    const newUser = { email: 'testuser@email.com2', password: 'password' };
    const response = await request(app).post('/api/users').send(newUser);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Username is required');
  });

  it('should return an error if email is missing3', async () => {
    const newUser = { username: 'TestUsername1', password: 'password' };
    const response = await request(app).post('/api/users').send(newUser);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Email is required');
  });

  it('should return an error if password is missing', async () => {
    const newUser = { username: 'TestUsername14', email: 'testuser4@email.com' };
    const response = await request(app).post('/api/users').send(newUser);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Password is required');
  });

  it('should create a new user if all fields are provided', async () => {
    const newUser = generateQuickUser();
    const response = await request(app).post('/api/users').send(newUser);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.username).toBe(newUser.username);
    expect(response.body.email).toBe(newUser.email);
    expect(response.body.profilePic).toBe(null);
  });
});

describe('PUT /user/:id', () => {
  it('should return an error if username is missing', async () => {
    const updatedUser = { email: 'newemail@example.com', password: 'newpassword' };
    const response = await request(app).put('/api/user/2').send(updatedUser);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Username is required');
  });

  it('should return an error if email is missing', async () => {
    const updatedUser = { username: 'NewUsername', password: 'newpassword' };
    const response = await request(app).put('/api/user/2').send(updatedUser);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Email is required');
  });

  it('should return an error if password is missing', async () => {
    const updatedUser = { username: 'NewUsername', email: 'newemail@example.com' };
    const response = await request(app).put('/api/user/2').send(updatedUser);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Password is required');
  });

  it('should return an error if username or email already exists for another user', async () => {
    const updatedUser = { username: 'TestUsername15', email: 'testuser5@email.com', password: 'newpassword' };
    const response = await request(app).put('/api/user/2').send(updatedUser);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Username or email already in use');
  });

  it('should update the user if all fields are provided and no conflicts', async () => {
    const updatedUser = { username: 'NewUsername', email: 'newemail@example.com', password: 'newpassword' };
    const response = await request(app).put('/api/user/2').send(updatedUser);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.username).toBe(updatedUser.username);
    expect(response.body.email).toBe(updatedUser.email);
  });

});

describe('DELETE /user/:id', () => {
  it('should throw an error if user deletion fails', async () => {
    const id = 10000000;
    const response = await request(app).delete(`/api/user/${id}`);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Failed to delete user');
  });

  // -- This works but I don't feel like changing the id every time....
  // it('should successfully delete an existing user', async () => {
  //   const id = 54;
  //   const response = await request(app).delete(`/api/user/${id}`);
  //   expect(response.status).toBe(200);
  //   expect(response.body).toHaveProperty('message', 'User deleted successfully');
  // });
});
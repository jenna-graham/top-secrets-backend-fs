const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const newUser = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@jenna.com',
  password: '12345',
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? newUser.password;
  const agent = request.agent(app);
  const user = await UserService.create({ ...newUser, ...userProps });
  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
  console.log({ user });
  return [agent, user];
};

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('creates a new user', async () => {
    const res = await request(app).post('/api/v1/users').send(newUser);
    const { firstName, lastName, email } = newUser;

    expect(res.body).toEqual({
      id: expect.any(String),
      firstName,
      lastName,
      email,
    });
  });

  it('signs in an existing user', async () => {
    await request(app).post('/api/v1/users').send(newUser);
    const res = await request(app)
      .post('/api/v1/users/sessions')
      .send({ email: 'test@jenna.com', password: '12345' });
    expect(res.status).toEqual(200);
  });

  it('/ should return a 401 if not authenticated', async () => {
    const res = await request(app).get('/api/v1/secrets');
    expect(res.status).toEqual(401);
  });

  it('GET /api/v1/secrets should return a list of secrets if authenticated', async () => {
    const [agent] = await registerAndLogin();
    const res = await agent.get('/api/v1/secrets');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      {
        id: '1',
        title: 'new secret',
        description: 'this is a new secret',
        created_at: '2022-08-09T07:00:01.000Z',
      },
    ]);
  });

  it('DELETE /sessions deletes the user session', async () => {
    const [agent] = await registerAndLogin();
    const resp = await agent.delete('/api/v1/users/sessions');
    expect(resp.status).toBe(204);
  });

  afterAll(() => {
    pool.end();
  });
});

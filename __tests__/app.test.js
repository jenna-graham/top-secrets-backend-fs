const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const newUser = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@jenna.com',
  password: '12345',
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

  it.skip('/ should return a 401 if not authenticated', async () => {
    const res = await request(app).get('/api/v1/users/secrets');
    expect(res.status).toEqual(401);
  });

  it('GET /api/v1/secrets should return a list of secrets', async () => {
    const res = await request(app).get('/api/v1/secrets');
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

  afterAll(() => {
    pool.end();
  });
});

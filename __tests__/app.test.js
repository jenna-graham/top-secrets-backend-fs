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

  afterAll(() => {
    pool.end();
  });
});

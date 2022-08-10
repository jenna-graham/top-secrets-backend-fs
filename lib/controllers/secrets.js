const { Router } = require('express');
const Secret = require('../models/Secret');
const authenticate = require('../middleware/authenticate');

module.exports = Router()
  .get('/', authenticate, async (req, res, next) => {
    try {
      const data = await Secret.getAllSecrets();
      res.json(data);
    } catch (e) {
      next(e);
    }
  })
  .get('/', authenticate, async (req, res) => {
    res.json({ message: 'hello user!' });
  });

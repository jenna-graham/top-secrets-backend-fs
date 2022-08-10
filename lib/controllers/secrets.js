const { Router } = require('express');
const Secret = require('../models/Secret');

module.exports = Router().get('/', async (req, res, next) => {
  try {
    const data = await Secret.getAllSecrets();
    res.json(data);
  } catch (e) {
    next(e);
  }
});

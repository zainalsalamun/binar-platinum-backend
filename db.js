require('dotenv').config();

const knex = require('knex');
const knexfile = require('./knexfile');

const environment = process.env.MODE;
const db = knex(knexfile[environment]);

module.exports = db;

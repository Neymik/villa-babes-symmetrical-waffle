
import postgres from 'postgres';
import config from '../config/index.js';

const sql = postgres({
  host: 'localhost',
  port: 5432,
  username: config.pgUser,
  password: config.pgSecret,
  database: config.pgDB,
})

export default sql

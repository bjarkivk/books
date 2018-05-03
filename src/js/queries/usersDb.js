require('dotenv').config();
const xss = require('xss');


const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;

async function query(q, values = []) {
  const client = new Client({ connectionString });

  await client.connect();

  try {
    const cleanedData = values.map(data => (typeof data === 'string' ? xss(data) : data));
    const result = await client.query(q, cleanedData);

    return result;
  } catch (err) {
    console.error('Error running query');
    throw err;
  } finally {
    await client.end();
  }
}

async function selectAllUsers(offset = 0, limit = 10) {
  const result = await query('SELECT id, username, name, image FROM users ORDER BY name OFFSET $1 LIMIT $2', [offset, limit]);

  return { LIMIT: limit, OFFSET: offset, items: result.rows };
}

async function selectUserById(id) {
  const result = await query('SELECT id, username, name, image FROM users WHERE id = $1', [id]);
  if (result.rowCount === 0) {
    return { error: 'User not found' };
  }
  return result.rows[0];
}

async function selectUserByIdAlternate(id) {
  const result = await query('SELECT * FROM users WHERE id = $1', [id]);
  if (result.rowCount === 0) {
    return { error: 'User not found' };
  }
  return result.rows[0];
}

async function updateUserById(id, { name, password } = {}) {
  const result = await query('UPDATE users SET name = $2, password = $3 WHERE id = $1 RETURNING *', [id, name, password]);

  return result.rows[0];
}

async function insertNewUser({ username, password, name } = {}) {
  const data = [username, password, name];
  const count = await query('SELECT username FROM users WHERE username = $1', [username]);
  let result = '';
  if (count.rowCount === 0) {
    result = await query('INSERT INTO users(username, password, name) VALUES($1, $2, $3) RETURNING *', data);
    return result.rows[0];
  }

  return { error: 'username taken' };
}

async function selectUserByUsername(username) {
  const result = await query('SELECT * FROM users WHERE username = $1', [username]);
  return result.rows[0];
}

async function updateProfilePicture(id, imgUrl) {
  const result = await query('UPDATE users SET imagepath = $1 WHERE id = $2 RETURNING id, name, username, image', [imgUrl, id]);

  return result.rowCount === 1 ? result.rows[0] : false;
}

module.exports = {
  selectAllUsers,
  selectUserById,
  updateUserById,
  insertNewUser,
  selectUserByUsername,
  selectUserByIdAlternate,
  updateProfilePicture,
};

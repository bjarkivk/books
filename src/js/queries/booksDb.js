require('dotenv').config();

const { query, queryMany } = require('./query');

async function selectAllCategories(offset = 0, limit = 10) {
  const result = await query('SELECT * FROM categories ORDER BY name OFFSET $1 LIMIT $2', [offset, limit]);

  return { LIMIT: limit, OFFSET: offset, items: result.rows };
}

async function selectCategoryById(id) {
  const result = await query('SELECT * FROM categories where id = $1', [id]);

  return result.rows[0].name;
}

async function insertCategory(category, client) {
  const t = await query('INSERT INTO categories(category) VALUES($1) RETURNING *', [category], client);

  return t.rows[0];
}

async function insertBook({
  title, isbn13, author, description, category, published, pagecount, language,
} = {}) {
  const res = await query('SELECT id FROM categories where category = $1', [category]);
  if (res.rowCount === 0) {
    return res.rows[0];
  }
  const categoryId = res.rows[0].id;
  const data = [title, author, description, isbn13, categoryId, published, pagecount, language];
  const t = await query('INSERT INTO books(title, author, description, isbn13, category, published, pagecount, language) VALUES( $1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', data);
  return t.rows[0];
}

async function updateBook({
  title, isbn13, author, description, category, published, pagecount, language, id,
} = {}) {
  const res = await query('SELECT id FROM categories where category = $1', [category]);
  if (res.rowCount === 0) {
    return res.rows[0];
  }
  const categoryId = res.rows[0].id;
  const data = [title, author, description, isbn13, categoryId, published, pagecount, language, id];
  const t = await query('UPDATE books SET title=$1, author=$2, description=$3, isbn13=$4, category=$5, published=$6, pagecount=$7, language=$8 WHERE id=$9 RETURNING *', data);
  return t.rows[0];
}

async function insertManyBooks({
  title, isbn13, author, description, category, published, pagecount, language,
} = {}) {
  const res = await queryMany('SELECT id FROM categories where category = $1', [category]);
  const categoryId = res.rows[0].id;
  const data = [title, author, description, isbn13, categoryId, published, pagecount, language];
  const t = await queryMany('INSERT INTO books(title, author, description, isbn13, category, published, pagecount, language) VALUES( $1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', data);

  return t.rows[0];
}

async function insertExtraInfo(id, { imgUrl, price, bsRank }) {
  const t = await queryMany('UPDATE books SET imgUrl = $1, price = $2, bsRank = $3 WHERE id = $4 RETURNING *', [imgUrl, price, bsRank, id]);
  return t.rows[0];
}

async function selectAllBooks(offset = 0, limit = 10) {
  const t = await query('SELECT * FROM books ORDER BY title OFFSET $1 LIMIT $2', [offset, limit]);

  return { LIMIT: limit, OFFSET: offset, items: t.rows };
}

async function selectBookById(id) {
  const t = await query('SELECT * FROM books where id = $1', [id]);

  return t.rows[0];
}

async function selectBestSellersBooks(offset = 0, limit = 10) {
  const result = await query('SELECT * FROM books WHERE bsrank > 0 ORDER BY bsrank OFFSET $1 LIMIT $2', [offset, limit]);
  return result.rows;
}

async function selectMostRecentBooks(offset = 0, limit = 10) {
  const result = await query('SELECT * FROM books ORDER BY published DESC OFFSET $1 LIMIT $2', [offset, limit]);
  return result.rows;
}

async function selectRandomBooks(offset = 0, limit = 10) {
  const result = await query('SELECT * FROM books ORDER BY random() OFFSET $1 LIMIT $2', [offset, limit]);
  return result.rows;
}

async function search(word, offset = 0, limit = 10) {
  const result = await query('SELECT * FROM books WHERE to_tsvector(title) @@ to_tsquery($1) OR to_tsvector(description) @@ to_tsquery($1) OFFSET $2 LIMIT $3', [word, offset, limit]);
  return { LIMIT: limit, OFFSET: offset, items: result.rows };
}

async function selectAllReviewsByUserId(id, offset = 0, limit = 10) {
  const result = await query('SELECT * FROM reads WHERE userid = $1 ORDER BY bookid OFFSET $2 LIMIT $3', [id, offset, limit]);
  return { LIMIT: limit, OFFSET: offset, items: result.rows };
}

async function selectReviewsByBookId(bookid) {
  const result = await query('WITH reviews as (SELECT * from reads WHERE bookid = $1), tmpusers as (select * from users where id in (select userid from reviews)) Select reviews.review, reviews.rating, reviews.title, reviews.date, tmpusers.username from reviews inner join tmpusers on reviews.userid = tmpusers.id', [bookid]);

  return result.rows;
}

async function insertReview({
  userid, bookid, title, rating, review,
} = {}) {
  const data = [userid, bookid, title, rating, review];
  const result = await query('INSERT INTO reads(userid, bookid, title, rating, review) VALUES($1, $2, $3, $4, $5) RETURNING *', data);

  return result.rows[0];
}

async function deleteReviewById(id) {
  const result = await query('DELETE FROM reads where bookid = $1', [id]);

  return result.rowCount > 0;
}

module.exports = {
  selectAllCategories,
  selectCategoryById,
  insertCategory,
  insertBook,
  selectAllBooks,
  selectBookById,
  insertExtraInfo,
  insertManyBooks,
  selectBestSellersBooks,
  selectMostRecentBooks,
  selectRandomBooks,
  query,
  search,
  selectAllReviewsByUserId,
  selectReviewsByBookId,
  insertReview,
  deleteReviewById,
  updateBook,
};

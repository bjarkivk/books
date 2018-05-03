CREATE TABLE users (
    id serial primary key,
    username character varying(255) NOT NULL UNIQUE CHECK (char_length(username) >= 3),
    password text NOT NULL,
    name character varying(255) NOT NULL CHECK (name <> ''),
    image text
);

CREATE TABLE categories (
    id serial primary key,
    name character varying(255) NOT NULL UNIQUE CHECK (category <> '')
);

CREATE TABLE books (
    id serial primary key,
    title character varying(255) NOT NULL UNIQUE CHECK (title <> ''),
    isbn13 character varying(13) NOT NULL UNIQUE CHECK (ISBN13 ~ '^[0-9 ]+$'),
    author character varying(255),
    description text,
    category integer NOT NULL REFERENCES categories,
    isbn10 character varying(10),
    published character varying(10),
    pagecount integer CHECK (pagecount >= -1),
    language character varying(2),
    imgUrl text default '/img/default.jpg',
    price character varying(255),
    bsRank BIGINT CHECK (bsRank >= -1)
);

CREATE TABLE reads (
    id serial primary key,
    userid integer NOT NULL REFERENCES users,
    bookid integer NOT NULL REFERENCES books,
    title character varying(255) NOT NULL CHECK (title <> ''),
    rating integer NOT NULL CHECK (rating >= 1 and rating <= 5),
    review text,
    date timestamp with time zone not null default current_timestamp
);

CREATE TABLE tasks(
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL
);

INSERT INTO tasks(title) VALUES ('Buy Milk'), ('Buy Bread');
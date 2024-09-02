CREATE TABLE Users(
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    picture VARCHAR(255),
    diet TEXT,
    allergies TEXT
);

 --@block
DELETE FROM Users
where id = 1;

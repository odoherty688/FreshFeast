--@block
CREATE TABLE Users(
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    picture TEXT,
    diet TEXT,
    allergies TEXT,
    completedRecipeCount INT
);

--@block
ALTER TABLE Users
ADD COLUMN completedRecipeCount INT;

--@block
INSERT INTO Users (email, picture, diet, intolerance, type)
VALUES
('test@gmail.com', 'picture', 'diet', 'intolerance', 'type');

--@block
DELETE FROM Users
WHERE id = 1;

--@block
CREATE TABLE UserFavouriteRecipes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT,
    recipeId VARCHAR(50),
    FOREIGN KEY (userId) REFERENCES Users(id)
);

--@block
DROP TABLE UserFavouriteRecipes;

--@block
DROP TABLE Users;

--@block
DROP TABLE UserCalendarEvents;

--@block
DROP TABLE UserSearchFilters;

--@block
DELETE FROM UserFavouriteRecipes
WHERE recipeId = '926f6ae64fad4eba9f4e936e564cb744';

--@block
CREATE TABLE UserCalendarEvents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT,
    resourceId INT,
    recipeId VARCHAR(50),
    start DATETIME,
    end DATETIME,
    isDraggable BOOLEAN,
    isResizable BOOLEAN,
    FOREIGN KEY (userId) REFERENCES Users(id)
);

--@block
DELETE FROM UserCalendarEvents
WHERE userId = 1;

--@block
CREATE TABLE UserSearchFilters (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT,
    filterName VARCHAR(50),
    diet TEXT,
    allergies TEXT,
    cuisineType VARCHAR(50),
    mealType VARCHAR(50),
    dishType VARCHAR(50),
    FOREIGN KEY (userId) REFERENCES Users(id)
);

--@block
CREATE TABLE UserFavouritedRestaurants (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT,
    restaurantId VARCHAR(50),
    FOREIGN KEY (userId) REFERENCES Users(id)
)

--@block
DELETE FROM UserFavouritedRestaurants
WHERE userId = 1;

--@block
DELETE FROM UserFavouritedRestaurants
WHERE restaurantId = 'test1';

--@block
DELETE FROM UserCompletedRecipes
WHERE id = 11;

--@block
DROP TABLE UserFavouritedRestaurants;

--@block
ALTER TABLE Users
DROP COLUMN completedRecipecount;


--@block
CREATE TABLE UserCompletedRecipes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT,
    recipeId TEXT,
    FOREIGN KEY (userId) REFERENCES Users(id)
)

--@block
UPDATE Users
SET completedRecipeCount = 0
WHERE email = 'orandoherty688@gmail.com'
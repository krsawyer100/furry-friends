USE mysql_project_db;

CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(200) NOT NULL
);

CREATE TABLE animal (
  animal_id INT NOT NULL PRIMARY KEY,
  name VARCHAR(200),
  breed VARCHAR(200),
  location VARCHAR(200),
  age VARCHAR(200),
  sex VARCHAR(200),
);

CREATE TABLE favorites (
  user_id INT NOT NULL,
  animal_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (animal_id) REFERENCES animal(animal_id)
);
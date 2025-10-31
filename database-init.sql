CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255)
);

CREATE TABLE pois (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  x FLOAT,
  y FLOAT,
  user_id INT,
  minetype_id INT,
  location_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (minetype_id) REFERENCES minetypes(id),
  FOREIGN KEY (location_id) REFERENCES locations(id),
);

create table locations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255)
);

create table minetypes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255)
);

-- adding default poitypes
INSERT INTO `poitypes` (`id`, `name`)
VALUES
	('1', 'Iron'),
	('2', 'Gold'),
	('3', 'Copper'),
	('4', 'Sulfer'),
	('5', 'Silica'),
	('6', 'Exotics'),
	('7', 'Platinum'),
	('8', 'Titanium'),
	('9', 'Aluminium'),
	('10', 'Stone'),
	('11', 'Oxite'),
	('12', 'Salt'),
	('13', 'Base'),
	('14', 'Outpost');

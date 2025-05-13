CREATE DATABASE IF NOT EXISTS eptlabs_test;
USE eptlabs_test;

CREATE TABLE IF NOT EXISTS Companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    mcompany VARCHAR(255) NOT NULL,
    companyId INT,
    FOREIGN KEY (companyId) REFERENCES Companies(id)
);

CREATE TABLE IF NOT EXISTS Activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contactId INT,
    companyId INT,
    type VARCHAR(255) NOT NULL,
    notes TEXT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contactId) REFERENCES Contacts(id),
    FOREIGN KEY (companyId) REFERENCES Companies(id)
);

/*
////////////// USER //////////////

id INT NOT NULL PRIMARY KEY AUTO_INCREMENT
pseudo VARCHAR(50) NOT NULL UNIQUE
email VARCHAR(50) NOT NULL UNIQUE
password VARCHAR(200) NOT NULL
bio VARCHAR(500) DEFAULT
photo VARCHAR(100) DEFAULT

////////////// CREATE USER //////////////

id INT NOT NULL PRIMARY KEY AUTO_INCREMENT
pseudo VARCHAR(50) NOT NULL UNIQUE //requis 
email VARCHAR(50) NOT NULL UNIQUE // requis
password VARCHAR(200) NOT NULL // requis
bio VARCHAR(500) DEFAULT
photo VARCHAR(100) DEFAULT

////////////// MODIFY USER //////////////

id INT NOT NULL PRIMARY KEY AUTO_INCREMENT // requis dans l'url et dans la requete
pseudo VARCHAR(50) NOT NULL UNIQUE 
email VARCHAR(50) NOT NULL UNIQUE
password VARCHAR(200) NOT NULL
bio VARCHAR(500) DEFAULT
photo VARCHAR(100) DEFAULT



////////////// POSTS //////////////

postId INT NOT NULL PRIMARY KEY AUTO_INCREMENT
posterId INT NOT NULL
texte VARCHAR(500) 
photo VARCHAR(100) 

////////////// CREATE POSTS //////////////

postId INT NOT NULL PRIMARY KEY AUTO_INCREMENT
posterId INT NOT NULL // requis
texte VARCHAR(500) 
photo VARCHAR(100) 

////////////// MODIFY POSTS //////////////

postId INT NOT NULL PRIMARY KEY AUTO_INCREMENT // requis dans l'url
posterId INT NOT NULL // requis
texte VARCHAR(500) 
photo VARCHAR(100)



////////////// COMMENTS //////////////

id INT NOT NULL PRIMARY KEY AUTO_INCREMENT
text VARCHAR(500) NOT NULL 
posterId INT NOT NULL
postId INT NOT NULL

////////////// CREATE COMMENTS //////////////

id INT NOT NULL PRIMARY KEY AUTO_INCREMENT
text VARCHAR(500) NOT NULL  // requis
posterId INT NOT NULL // requis
postId INT NOT NULL // requis

////////////// MODIFY COMMENTS //////////////

id INT NOT NULL PRIMARY KEY AUTO_INCREMENT // requis dans l'url
text VARCHAR(500) NOT NULL  // requis
posterId INT NOT NULL // requis
postId INT NOT NULL // requis



////////////// LIKES //////////////

likeId INT NOT NULL PRIMARY KEY AUTO_INCREMENT
likerId INT NOT NULL
postId INT NOT NULL

////////////// LIKE/UNLIKE //////////////

likeId INT NOT NULL PRIMARY KEY AUTO_INCREMENT
likerId INT NOT NULL // requis
postId INT NOT NULL // requis





*/
const dbConfig = require("../config/database");
const db = dbConfig.connectDb();
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const schemaPwd = require("../middleware/password.middleware");
const emailValidator = require("email-validator");

module.exports.signup = (req, res) => {
  try {
    db.query(
      `SELECT * FROM users WHERE pseudo = ?`,
      req.body.pseudo,
      (err, result) => {
        if (result[0]) {
          return res.status(400).json({ message: "Pseudo déjà utilisé" });
        } else {
          db.query(
            `SELECT email FROM users WHERE email = ?`,
            req.body.email,
            (err, result) => {
              if (result[0]) {
                return res.status(400).json({ message: "Email déjà utilisé" });
              } else {
                if (emailValidator.validate(req.body.email)) {
                  if (schemaPwd.validate(req.body.password)) {
                    let pwd = req.body.password;
                    pwdSecret = bcrypt.hash(pwd, 10).then((hash) => {
                      console.log(hash);
                      req.body.password = hash;
                      const user = { ...req.body };
                      const insert = "INSERT INTO users SET ?";
                      db.query(insert, user, (err, result) => {
                        
                        if (err) {
                          res.status(400).json({message : "Problème création utilisateur" + err});
                        } else {
                          db.query(`SELECT id, pseudo, email FROM users WHERE email = ?  `,req.body.email, (err, resultat) => {
                            console.log(resultat[0]);
                            res.status(201).json({ message: "Utilisateur créé !" , profil : resultat[0]});
                          });
                        }
                      });
                    });
                  } else {
                    return res
                      .status(401)
                      .json({ error: "Mot de pass invalide !" });
                  }
                } else {
                  return res.status(401).json({ error: "Email invalide" });
                }
              }
            }
          );
        }
      }
    );
  } catch (error) {
    res.statut(400).json(error);
  }
};

module.exports.login = (req, res, next) => {
  try {
    db.query(
      `SELECT * FROM users WHERE email = ?`,
      req.body.email,
      (err, data) => {
        if (!data[0]) {
          return res.status(401).json({ message: "Utilisateur non trouvé !" });
        }
        bcrypt
          .compare(req.body.password, data[0].password)
          .then((valid) => {
            if (!valid) {
              return res
                .status(401)
                .json({ message: "Mot de passe incorrect !" });
            }
            const token = {
              id: data[0].id,
              token: jsonwebtoken.sign(
                { id: data[0].id },
                process.env.SECRET_KEY,
                { expiresIn: "24h" }
              ),
            };
            res.cookie("token", token, {
              httpOnly: true,
              maxAge: 1 * 24 * 60 * 60 * 1000 /*secure : true*/,
            });
            res.status(200).json({message: "Vous êtes connecté", profil : [ data[0].id , data[0].pseudo , data[0].email]});
            console.log(data[0].pseudo + " est connecté");
          })
          .catch((error) => res.status(500).json({ message: error}));
      }
    );
  } catch (error) {
    res.status(400).json({message: "Problème connexion" + error})
  }
};

module.exports.logout = (req, res) => {
  res.cookie("token", "", { maxAge: 1000 /* 1000ms = 1s*/ });
  //res.redirect("");
  res.status(200).json({message: "Vous êtes déconnecté"});
  
};

const dbConfig = require("../config/database");
const db = dbConfig.connectDb();
const emailValidator = require("email-validator");
const schemaPwd = require("../middleware/password.middleware");
const bcrypt = require("bcrypt");
const fs = require("fs");

module.exports.getUsers = (req, res) => {
  try {
    const allUsers = "SELECT id, pseudo, email, bio, photo FROM users";
    db.query(allUsers, (err, result) => {
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(400).json({ message: "Utilisateurs non trouvés" + err });
      }
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

module.exports.getUser = (req, res) => {
  try {
    const oneUser =
      "SELECT id, pseudo, email, bio, photo FROM users WHERE id = ?";
    db.query(oneUser, req.params.id, (err, result) => {
      if (!result[0]) {
        res.status(400).json({ message: "Utilisateur introuvable" });
      } else {
        res.status(200).json(result[0]);
      }
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

module.exports.modifyUser = (req, res) => {
  try {
    db.query(
      `SELECT * FROM users WHERE id = ?`,
      req.params.id,
      (err, resultat) => {
        if (!resultat[0]) {
          return res.status(400).json({ message: "Utilisateur introuvable  " });
        }
        if (err) {
          return res.status(400).json({ message: err });
        }
        if (
          resultat[0].id != req.params.id ||
          resultat[0].id != req.body.id ||
          resultat[0].id != req.cookies.token.id
        ) {
          return res.status(400).json({ message: "Requête non authorisé !" });
        }
        console.log({ ...req.body });
        for (let el in req.body) {
          // modif password
          if (el == "password") {
            console.log(req.body.password);
            if (req.body.password != "null") {
              if (schemaPwd.validate(req.body.password)) {
                let pwd = req.body.password;
                pwdSecret = bcrypt.hash(pwd, 10).then((hash) => {
                  console.log(hash);
                  req.body.password = hash;
                  const insert = `UPDATE users SET password = ? WHERE id = ?`;
                  db.query(
                    insert,
                    [req.body.password, req.params.id],
                    (err, result) => {
                      if (err) {
                        return res
                          .status(400)
                          .json({ message: "Problème modification mdp" + err });
                      }
                      if (result) {
                        console.log("password modifié");
                      }
                    }
                  );
                });
              } else {
                return res
                  .status(400)
                  .json({ message: "Mot de pass invalide" });
              }
            }
          }

          // modif email
          if (el == "email") {
            console.log(req.body.email);
            if (req.body.email != "null") {
              if (emailValidator.validate(req.body.email)) {
                db.query(
                  `UPDATE users SET email = ? WHERE id = ?`,
                  [req.body.email, req.params.id],
                  (err, result) => {
                    if (err) {
                      return res
                        .status(400)
                        .json({ message: "Problème de modification  " + err });
                    }
                    if (result) {
                      console.log("email modifié");
                    }
                  }
                );
              } else {
                return res.status(400).json({ message: "Email invalide" });
              }
            }
          }

          // modifs pseudo
          const regexPseudo = /^[a-zA-Z]{3,20}[0-9]{0,10}$/;
          if (
            el == "pseudo" &&
            req.body.pseudo != "null" &&
            regexPseudo.exec(req.body.pseudo)
          ) {
            console.log(req.body.pseudo);
            db.query(
              `UPDATE users SET pseudo = ? WHERE id = ?`,
              [req.body.pseudo, req.params.id],
              (err, result) => {
                if (err) {
                  return res
                    .status(400)
                    .json({ message: "Problème de modification  " + err });
                }
                if (result) {
                  console.log("pseudo modifié");
                }
              }
            );
          }

          // modifs bio
          if (el == "bio") {
            console.log(req.body.bio);
            if (req.body.bio != "null") {
              db.query(
                `UPDATE users SET bio = ? WHERE id = ?`,
                [req.body.bio, req.params.id],
                (err, result) => {
                  if (err) {
                    return res
                      .status(400)
                      .json({ message: "Problème de modification  " + err });
                  }
                  if (result) {
                    console.log("Bio modifié");
                  }
                }
              );
            }
          }
        }

        // modif photo de profil
        if (req.file) {
          console.log(req.file);
          if (req.file != "null") {
            const photoProfil =
              "http://localhost:5000/images/profil/profil.jpg";
            if (resultat[0].photo == photoProfil) {
              var modifPhoto = {
                ...req.body,
                photo: `${req.protocol}://${req.get("host")}/images/profil/${
                  req.file.filename
                }`,
              };
            }
            if (resultat[0].photo != photoProfil) {
              var modifPhoto = {
                ...req.body,
                photo: `${req.protocol}://${req.get("host")}/images/profil/${
                  req.file.filename
                }`,
              };
              const filename = resultat[0].photo.split("/profil/")[1];
              fs.unlink(`images/profil/${filename}`, () => {
                console.log(filename, ": supprimé");
              });
            }
            db.query(
              `UPDATE users SET photo = ? WHERE id = ?`,
              [modifPhoto, req.params.id],
              (err, result) => {
                if (err) {
                  return res
                    .status(400)
                    .json({ message: "Problème de modification  " + err });
                }
                if (result) {
                  console.log("photo modifié");
                }
              }
            );
          }
        }
        return res.status(200).json({ message: "Profil modifié" });
      }
    );
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

module.exports.deleteUser = (req, res) => {
  try {
    const user = "SELECT * FROM users WHERE id = ?";
    db.query(user, req.params.id, (error, data) => {
      if (!data[0]) {
        res.status(400).json({ message: "utilisateur introuvable" });
      }
      if (data[0].id != req.cookies.token.id) {
        return res.status(400).json({ message: "Requete non autorisé" });
      }
      const photoProfil = "http://localhost:5000/images/profil/profil.jpg";
      if (data[0].photo != photoProfil) {
        const filename = data[0].photo.split("/profil/")[1];
        fs.unlink(`images/profil/${filename}`, () => {});
      }
      db.query(
        `DELETE FROM users WHERE id = ?`,
        req.params.id,
        (err, result) => {
          res.cookie("token", "", { maxAge: -1 });

          res.status(200).json({ message: "Utilisateur supprimé" });
        }
      );
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

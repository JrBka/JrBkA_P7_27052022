const dbConfig = require("../config/database");
const db = dbConfig.connectDb();
const emailValidator = require("email-validator");
const schemaPwd = require("../middleware/password.middleware");
const bcrypt = require("bcrypt");
const fs = require("fs");

module.exports.getAllUsers = (req, res) => {
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

module.exports.getOneUser = (req, res) => {
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
        if (resultat[0].id != req.params.id || resultat[0].id != req.body.id) {
          return res.status(400).json({ message: "Requête non authorisé !" });
        }
        // modif password
        if (req.body.password) {
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
                    res
                      .status(400)
                      .json({ message: "Problème modification mdp" + err });
                  }
                  if (result) {
                    return res
                      .status(200)
                      .json({ message: "Password modifié" });
                  }
                }
              );
            });
          } else {
            return res.status(400).json({ message: "Mot de pass invalide" });
          }
        }

        // modif email
        if (req.body.email) {
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
                  return res.status(200).json({ message: "Email modifié" });
                }
              }
            );
          } else {
            return res.status(400).json({ message: "Email invalide" });
          }
        }

        // modif photo de profil
        if (req.file) {
          const photoProfil = "http://localhost:5000/images/profil.jpg";
          if (resultat[0].photo == photoProfil) {
            const modifPhoto = {
              ...req.body,
              photo: `${req.protocol}://${req.get("host")}/images/profil/${
                req.file.filename
              }`,
            };

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
                  return res.status(200).json({ message: "Photo modifié" });
                }
              }
            );
          } else {
            const modifPhoto = {
              ...req.body,
              photo: `${req.protocol}://${req.get("host")}/images/profil/${
                req.file.filename
              }`,
            };
            const filename = resultat[0].photo.split("/profil/")[1];
            fs.unlink(`images/profil/${filename}`, () => {
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
                    return res.status(200).json({ message: "Photo modifié" });
                  }
                }
              );
            });
          }
        }

        // modifs pseudo
        if (req.body.pseudo) {
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
                return res.status(200).json({ message: "Pseudo modifié" });
              }
            }
          );
        }

        // modifs bio
        if (req.body.bio) {
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
                return res.status(200).json({ message: "Bio modifié" });
              }
            }
          );
        }
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
      const photoProfil = "http://localhost:5000/images/profil.jpg";
      if (data[0].photo == photoProfil) {
        db.query(
          `DELETE FROM users WHERE id = "${req.params.id}"`,
          (err, result) => {
            res.cookie("token", "", { maxAge: 1000 /* 1000ms = 1s*/ });
            //res.redirect("");//
            res.status(200).json({ message: "Utilisateur supprimé" });
          }
        );
      } else {
        const filename = data[0].photo.split("/profil/")[1];
        fs.unlink(`images/profil/${filename}`, () => {
          db.query(
            `DELETE FROM users WHERE id = "${req.params.id}"`,
            (err, result) => {
              res.cookie("token", "", { maxAge: 1000 /* 1000ms = 1s*/ });
              //res.redirect("");
              res.status(200).json({ message: "Utilisateur supprimé" });
            }
          );
        });
      }
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

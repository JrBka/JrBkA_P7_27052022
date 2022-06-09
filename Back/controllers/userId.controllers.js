const jsonwebtoken = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const dbConfig = require("../config/database");
const db = dbConfig.connectDb();

module.exports.getUserId = (req, res, next) => {
  try {
    const token = req.cookies.token.token;
    if (!token) {
      console.log("ok");
      window.loation = "http://localhost:3000/";
    }
    if (token) {
      jsonwebtoken.verify(
        token,
        process.env.SECRET_KEY,
        (err, decodedToken) => {
          if (err) {
            //res.local = info de l'utilisateur en transit accessible uniquement depuis le back
            console.log("token invalide");
            res.locals.user = null;
            res.cookie("token", "", { maxAge: 1000 });
          } else {
            db.query(
              `SELECT * FROM users WHERE id = ?`,
              decodedToken.id,
              (err, result) => {
                const user = result;
                res.status(200).json({ userId: user[0].id });
                console.log("utilisateur authentifié :", user[0].pseudo);
              }
            );
          }
        }
      );
    }
  } catch (err) {
    res.status(403).json({ message: "Requête non autorisé" + err });
  }
};

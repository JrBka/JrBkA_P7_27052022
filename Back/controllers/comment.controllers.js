const dbConfig = require("../config/database");
const db = dbConfig.connectDb();

module.exports.createComment = (req, res) => {
  try {
    const newComment = { ...req.body };
    console.log(newComment);
    db.query(`INSERT INTO comments SET ?`, newComment, (err, result) => {
      if (err) {
        res.status(400).json({ message: "Post invalide  " + err });
      }
      res.status(201).json({ message: "Commentaire créé" });
    });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

module.exports.getComments = (req, res) => {
  try {
    db.query(`SELECT posterId, text FROM comments`, (err, result) => {
      if (!result) {
        res.status(400).json({ message: "Commentaires introuvables" });
      } else {
        res.status(200).json(result);
      }
    });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

module.exports.getComment = (req, res) => {
  try {
    db.query(
      `SELECT * FROM comments WHERE postId = ?`,
      req.params.id,
      (err, result) => {
        if (!result[0]) {
          res.status(400).json({ message: "Commentaire introuvable" });
        } else {
          res.status(200).json(result);
        }
      }
    );
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

module.exports.modifyComment = (req, res) => {
  try {
    if (
      req.body.posterId === req.cookies.token.id ||
      res.locals.user[0].privilege == "admin"
    ) {
      db.query(
        `UPDATE comments SET text = ? WHERE id = ?  AND postId = ? `,
        [req.body.text, req.params.id, req.body.postId],
        (err, result) => {
          if (err) {
            return res.status(400).json({ message: err });
          }
          if (!result) {
            return res.status(400).json({ message: "Commentaire introuvable" });
          } else {
            res
              .status(200)
              .json({ message: "Commentaire modifié : " + result });
          }
        }
      );
    } else {
      return res.status(400).json({ message: "reqête non autorisé" });
    }
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

module.exports.deleteComment = (req, res) => {
  try {
    db.query(
      `SELECT * FROM comments WHERE id = ?`,
      req.params.id,
      (err, resultat) => {
        if (!resultat[0]) {
          return res.status(400).json({ message: "Commentaire introuvable  " });
        }
        if (
          resultat[0].posterId == req.cookies.token.id ||
          res.locals.user[0].privilege == "admin"
        ) {
          db.query(
            `DELETE FROM comments WHERE id = ?`,
            req.params.id,
            (err, result) => {
              if (err) {
                return res
                  .status(400)
                  .json({ message: "Suppression échoué  " + err });
              } else {
                res.status(200).json({ message: "Commentaire supprimé" });
              }
            }
          );
        } else {
          return res.status(400).json({ message: "requête non autorisé" });
        }
      }
    );
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

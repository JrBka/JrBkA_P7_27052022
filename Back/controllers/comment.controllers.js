const dbConfig = require("../config/database");
const db = dbConfig.connectDb();

module.exports.createComment = (req, res) => {
  try {
    const newComment = { ...req.body };
    db.query(`INSERT INTO comments SET ?`, newComment, (err, result) => {
      if (err) {
        res.status(400).json({ message: "Post invalide  " + err });
      } else {
        db.query(
          `SELECT * FROM comments WHERE text LIKE %?% AND postId = ? AND posterId = ? `[
            (req.body.texte, req.body.postId, req.body.posterId)
          ],
          (err, resultat) => {
            res.status(201).json({
              message: "Commentaire créé  ",
              id_commentaire: result.insertId,
            });
          }
        );
      }
    });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

module.exports.getAllComment = (req, res) => {
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

module.exports.getOneComment = (req, res) => {
  try {
    db.query(
      `SELECT posterId, text FROM comments WHERE id = ?`,
      req.params.id,
      (err, result) => {
        if (!result[0]) {
          res.status(400).json({ message: "Commentaire introuvable" });
        } else {
          res.status(200).json(result[0]);
        }
      }
    );
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

module.exports.modifyComment = (req, res) => {
  try {
    const post = { ...req.body };
    db.query(
      `UPDATE comments SET ? WHERE id = ? AND posterId = ? AND postId = ? `,
      [post, req.params.id, req.body.posterId, req.postId],
      (err, result) => {
        if (err) {
          return res.status(400).json({ message: "Problème put  " + err });
        }
        if (!result) {
          return res.status(400).json({ message: "Commentaire introuvable" });
        } else {
          res.status(200).json({ message: "Commentaire modifié" });
        }
      }
    );
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

module.exports.deleteComment = (req, res) => {
  db.query(
    `SELECT * FROM comments WHERE id = ?`,
    req.params.id,
    (err, resultat) => {
      if (!resultat[0]) {
        return res.status(400).json({ message: "Commentaire introuvable  " });
      } else {
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
      }
    }
  );
};

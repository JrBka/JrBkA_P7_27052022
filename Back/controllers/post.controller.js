const dbConfig = require("../config/database");
const db = dbConfig.connectDb();
const fs = require("fs");

module.exports.getPosts = (req, res) => {
  try {
    db.query(`SELECT * FROM posts`, (err, result) => {
      if (!result) {
        res.status(400).json({ message: "post introuvable" });
      }
      res.status(200).json(result);
    });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

module.exports.createPost = (req, res) => {
  try {
    //Post avec photo
    if (req.file) {
      var newPost = {
        ...req.body,
        photo: `${req.protocol}://${req.get("host")}/images/posts/${
          req.file.filename
        }`,
      };
    } else {
      // Post sans photo
      var newPost = { ...req.body };
    }
    db.query(`INSERT INTO posts SET ?`, newPost, (err, result) => {
      if (err) {
        res.status(400).json({ message: "Post invalide  " + err });
      } else {
        res.status(201).json({ message: "Post créé" });
      }
    });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

module.exports.modifyPost = (req, res) => {
  try {
    db.query(
      `SELECT * FROM posts WHERE postId = ?`,
      req.params.id,
      (err, resultat) => {
        if (!resultat[0]) {
          return res.status(400).json({ message: "Post introuvable  " });
        }
        if (err) {
          return res.status(400).json({ message: err });
        }
        if (
          resultat[0].postId != req.params.id ||
          resultat[0].posterId != req.body.posterId
        ) {
          return res.status(400).json({ message: "Requête non authorisé !" });
        }
        if (req.file && resultat[0].photo != null) {
          var newPost = {
            ...req.body,
            photo: `${req.protocol}://${req.get("host")}/images/posts/${
              req.file.filename
            }`,
          };
          const filename = resultat[0].photo.split("/posts/")[1];

          fs.unlink(`images/posts/${filename}`, () => {});
        }
        if (req.file && resultat[0].photo == null) {
          var newPost = {
            ...req.body,
            photo: `${req.protocol}://${req.get("host")}/images/posts/${
              req.file.filename
            }`,
          };
        }
        if (!req.file) {
          var newPost = { ...req.body };
        }
        db.query(
          `UPDATE posts SET ? WHERE postId = ?`,
          [newPost, req.params.id],
          (err, result) => {
            if (err) {
              return res.status(400).json({ message: "Problème post  " + err });
            } else {
              return res
                .status(200)
                .json({ message: "Post modifié, pas de modification image" });
            }
          }
        );
      }
    );
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

module.exports.deletePost = (req, res) => {
  db.query(
    `SELECT * FROM posts WHERE postId = ?`,
    req.params.id,
    (err, resultat) => {
      if (!resultat[0]) {
        return res.status(400).json({ message: "Post introuvable  " });
      }
      if (resultat[0].posterId != req.cookies.token.id) {
        return res.status(400).json({ message: "Requete non autorisé" });
      }
      if (resultat[0].photo) {
        const filename = resultat[0].photo.split("/posts/")[1];

        fs.unlink(`images/posts/${filename}`, () => {
          console.log(filename, ": supprimé");
        });
      }
      db.query(
        `DELETE FROM posts WHERE postId = ?`,
        req.params.id,
        (err, result) => {
          if (err) {
            return res
              .status(400)
              .json({ message: "Suppression échoué  " + err });
          } else {
            res.status(200).json({ message: "post supprimé" });
          }
        }
      );
    }
  );
};

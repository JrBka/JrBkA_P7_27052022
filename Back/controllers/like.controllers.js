const dbConfig = require("../config/database");
const db = dbConfig.connectDb();

module.exports.likeUnlike = (req, res) => {
  try {
    const like = { ...req.body };
    db.query(
      `SELECT * FROM likes WHERE postId = ? AND likerId = ?`,
      [req.params.id, like.likerId],
      (err, result) => {
        if (!result[0]) {
          db.query(
            `INSERT INTO likes (likerId, postId) VALUES (?, ?)`,
            [like.likerId, req.params.id],
            (err, result) => {
              if (err) {
                res.status(400).json({ message: err });
              } else {
                res.status(200).json({ message: "Liké !" });
              }
            }
          );
        } else {
          db.query(
            `DELETE FROM likes WHERE postId = ? AND likerId = ?`,
            [req.params.id, like.likerId],
            (err, result) => {
              if (err) {
                res.status(400).json({ message: err });
              } else {
                res.status(200).json({ message: "Unliké !" });
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

module.exports.numbersOflike = (req, res) => {
  db.query(
    `SELECT COUNT(*) FROM likes WHERE postId = ?`,
    req.params.id,
    (err, result) => {
      if (!result[0]) {
        res.status(200).json(0);
      } else {
        res.status(200).json(result[0]);
      }
    }
  );
};

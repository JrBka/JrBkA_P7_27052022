//////////////////// MYSQL ////////////////////
const mysql = require("mysql2");
const db = mysql.createConnection({
  host: "localhost",
  user: `${process.env.USER}`,
  password: `${process.env.PASSWORD}`,
  database : "reseau"
});

db.connect(function (err) {
  if (err) throw err;
  console.log("Connecté à la base de données MySQL!");
});

module.exports.connectDb = () => {
  return db;
};
////////////////////////////////////////////////////
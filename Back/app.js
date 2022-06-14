const express = require("express");
const app = express();
const dotenv = require("dotenv").config({ path: "./config/.env" });
const mysql = require("./config/database");
const path = require("path");
const getUserId = require("./controllers/userId.controllers");
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

//Sécurisation des en-tête HTTP
app.use(helmet({ crossOriginResourcePolicy: { policy: "same-site" } }));

//Defini le CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

//Limiteur de requete
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Par 15 minutes
  max: 100, // Limiter chaque IP à 100 requêtes par `window`
  standardHeaders: true, // Renvoie les informations de limite de débit dans les en-têtes `RateLimit-*`
  legacyHeaders: false, // Désactive les en-têtes `X-RateLimit-*`
});

//plugin
app.post(limiter);
app.use(express.json());
app.use(cookieParser());

//routes
app.get("/userId", getUserId.getUserId);
app.use(
  "/images/profil",
  express.static(path.join(__dirname, "images/profil"))
);
app.use("/images/posts", express.static(path.join(__dirname, "images/posts")));

app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);

//exporte app
module.exports = app;

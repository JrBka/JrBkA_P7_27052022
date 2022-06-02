const express = require("express");
const app = express();
const dotenv = require("dotenv").config({ path: "./config/.env" });
const mysql = require("./config/database");
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

//Sécurisation des en-tête HTTP
app.use(helmet({ crossOriginResourcePolicy: { policy: "same-site" } }));

//Defini le CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
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
app.use(limiter);
app.use(express.json());
app.use(cookieParser());

//routes
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);

//exporte app
module.exports = app;

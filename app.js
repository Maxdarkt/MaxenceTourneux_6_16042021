const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require('path');
const multer = require("multer");
//sécurité
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
require('dotenv').config();


const saucesRoutes = require("./routes/sauces");
const userRoutes = require("./routes/user");

const app = express();

mongoose
  .connect(process.env.DB_URI,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

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

const limiter = rateLimit({
  windowMs: 15 *60 * 1000,
  max: 100
});

//sécurité
app.use(limiter);
app.use(helmet());
app.use(mongoSanitize());

app.use(express.json());

//routes
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use("/api/sauces", saucesRoutes);
app.use("/api/auth", userRoutes);


module.exports = app;

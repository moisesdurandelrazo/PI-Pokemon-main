require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
require("dotenv").config();
const routes = require("./routes/index.js");
const cors = require("cors");

require("./db.js");

const server = express();

server.name = "API";
server.disable("x-powered-by");
server.use((req, res, next) => {
  res.set("X-Content-Type-Options", "nosniff");
  res.set("Referrer-Policy", "no-referrer");
  next();
});
server.use(require("./security").rateLimit(120, 60 * 1000));
const allowedOrigins = [
  process.env.CLIENT_URL_DEV,
  process.env.CLIENT_URL_PROD,
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(Object.assign(new Error("No permitido por CORS"), { status: 403 }));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-CSRF-Token"],
};
server.use(bodyParser.urlencoded({ extended: false, limit: "16kb" }));
server.use(bodyParser.json({ limit: "16kb" }));
server.use(cookieParser());
server.use(morgan("dev"));
server.use(cors(corsOptions));

server.use("/auth", require("./auth").router);
server.use("/", routes);

// Error catching endware.
server.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  const status = Number.isInteger(err.status) && err.status >= 400 && err.status <= 599 ? err.status : 500;
  if (status >= 500) console.error("Error interno de API", err.name);
  res.status(status).json({ msg: status >= 500 ? "Error interno del servidor" : "Solicitud rechazada" });
});

module.exports = server;

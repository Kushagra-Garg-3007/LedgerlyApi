require("./utils/bigintJson");

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParse = require("cookie-parser");

const apiRoutes = require("./routes");
const { notFoundHandler, errorHandler } = require("./middlewares/error.middleware");

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
)
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParse());

app.get("/health", (_req, res) => {
  return res.status(200).json({ status: "ok", service: "ledgerly-api" });
});

app.use("/api", apiRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;

import cors from "cors";
import logger from "morgan";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { config } from "dotenv";
import { handleError } from "./helpers/error";
import routes from "./routes";

config();

const app = express();

app.use(cors({ origin: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger("dev"));

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once("open", () => console.log("Connected to Database"));

// Connect our routes with express
app.get("/", (req, res) =>
  res.status(200).send({
    message: "Welcome to my Postage stamp API",
  })
);

routes(app);

/**
 * Error handling middleware
 */
app.use((err, req, res, next) => {
  if (err) {
    handleError(err, res);
  }
});

const port = process.env.PORT || 8080;

app.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`)
);

module.exports = app;

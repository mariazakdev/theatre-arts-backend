require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const knex = require("knex")(require("./knexfile"));
const errorMiddleware = require("./middlewares/errorHandlingMiddleware");

const URL = process.env.CORS_ORIGIN;
const URL_DOMAIN = process.env.CORS_ORIGIN_DOMAIN;

function createApp() {
  const app = express();
  app.use(errorMiddleware);

  app.use(express.static("public"));

  const uploadRoutes = require("./routes/uploadRoutes");
  const paymentRoutes = require("./routes/paymentRoutes");
  const usersFBRoutes = require("./routes/usersFirabaseRoutes");
  const sunKingRoutes = require("./routes/sunKingRoutes");
  const votesRoutes = require("./routes/votesRoutes");
const votesExtraRoutes = require("./routes/votesExtraRoutes");
const votesTrackerRoutes = require("./routes/votesTrackerRoutes");
  app.use(
    cors({
      origin: [URL,URL_DOMAIN],
      methods: "GET, POST, PUT, DELETE",
      credentials: true,
    })
  );

  app.use(bodyParser.json());

  // Middleware to check API key
  const checkApiKey = (req, res, next) => {

    const apiKey = req.headers.authorization;
    const validApiKey = process.env.API_KEY;
    if (apiKey && apiKey === validApiKey) {
      next(); // move to the next middleware
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  };
  // app.use("/users", checkApiKey, usersFBRoutes);
  app.use("/users", usersFBRoutes);

  app.use("/contestants", uploadRoutes);
  app.use("/payment", checkApiKey, paymentRoutes);
  app.use("/sun-king", sunKingRoutes);
  app.use("/votes", checkApiKey, votesRoutes);// For timer only
  app.use("/votes-extra", checkApiKey, votesExtraRoutes); // For timer only
  app.use("/votes-tracker",checkApiKey, votesTrackerRoutes); // For tracker only

  return app;
}

const port = process.env.PORT || 8000;
const app = createApp();

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
  });
}
module.exports = createApp;

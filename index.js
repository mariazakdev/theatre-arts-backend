require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const knex = require("knex")(require("./knexfile"));
const errorMiddleware = require("./middlewares/errorHandlingMiddleware");


const URL = process.env.CORS_ORIGIN;
const HOST = process.env.CLIENT_URL;

console.log("URL:", URL);
console.log("HOST:", HOST);
console.log("API_KEY:", process.env.API_KEY);

function createApp() {
  const app = express();
  app.use(errorMiddleware);



  app.use(express.static("public"));

  const uploadRoutes = require("./routes/uploadRoutes");
  const paymentRoutes = require("./routes/paymentRoutes");
  const usersFBRoutes = require("./routes/usersFirabaseRoutes");
  const sunKingRoutes = require("./routes/sunKingRoutes");
  const votesRoutes = require("./routes/votesRoutes");


  app.use(
    cors({
      origin: URL,
      methods: "GET, POST, PUT, DELETE",
      credentials: true,
    })
  );



  app.use(bodyParser.json());

  // Middleware to check API key
  const checkApiKey = (req, res, next) => {
    console.log("Request Headers:", req.headers);

    const apiKey = req.headers["x-api-key"]; 
    const validApiKey = process.env.API_KEY; 
    console.log(apiKey, validApiKey); // Log apiKey and validApiKey
    if (apiKey && apiKey === validApiKey) {
      next(); // API key is valid, proceed to the next middleware
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  };
  app.use("/users", checkApiKey, usersFBRoutes);
  app.use("/contestants", checkApiKey, uploadRoutes);
  app.use("/payment", checkApiKey, paymentRoutes);
  app.use("/sun-king", sunKingRoutes);
  app.use("/votes", checkApiKey, votesRoutes);

  app.get("/", (req, res) => {
    res.send("Hello, World!");
  });


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


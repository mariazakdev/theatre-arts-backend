require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const knex = require("knex")(require("./knexfile"));
const errorMiddleware = require("./middlewares/errorHandlingMiddleware");
const requestIdMiddleware = require("./middlewares/requestIdMiddleware");


const URL = process.env.CORS_ORIGIN;
const HOST = process.env.CLIENT_URL_HOST;
function createApp() {
  const app = express();
  app.use(errorMiddleware);
  app.use(requestIdMiddleware);

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

  app.get("/", (req, res) => {
    res.send("Hello, World!");
  });

  app.use("/users", usersFBRoutes);
  app.use("/contestants", uploadRoutes);
  app.use("/payment", paymentRoutes);
  app.use("/sun-king", sunKingRoutes);
  app.use("/votes", votesRoutes);

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


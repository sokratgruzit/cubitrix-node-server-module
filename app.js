const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const config = require("config");
const cors = require("cors");
const cors_options = require("./config/cors_options");
const credentials = require("./middleware/credentials");

const { accounts } = require("@cubitrix/cubitrix-node-accounts-module");
const { transactions } = require("@cubitrix/cubitrix-node-globals-module");

const auth = require("./admin/routes/auth_routes");
const content = require("./admin/routes/content_routes");
const data = require("./admin/routes/data_routes");

const root = require("path").join(__dirname, "front", "build");
const app = express();

require("dotenv").config();
process.env["NODE_CONFIG_DIR"] = __dirname + "/admin/config";

app.use(express.json({ extended: true }));
app.use(credentials);
app.use(cors(cors_options));
app.use(
   bodyParser.urlencoded({
      extended: true,
   })
);
app.use(express.static(root));

// Global routes of platform
app.use("/accounts", accounts);

// Admin routes
app.use("/api/auth", auth);
app.use("/api/content", content);
app.use("/api/data", data);

// Db connection and server setup
async function start() {
   const PORT = process.env.PORT || 5000;
   try {
      mongoose.set("strictQuery", false);
      await mongoose.connect(process.env.MONGO_URL, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
      });
      app.listen(PORT, () =>
         console.log(`App has been started on port ${PORT}...`)
      );
   } catch (e) {
      console.log(`Server Error ${e.message}`);
      process.exit(1);
   }
}

start();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const config = require("config");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const credentials = require("./middleware/credentials");
const { accounts, router } = require("@cubitrix/cubitrix-node-accounts-module");
require("dotenv").config();
process.env["NODE_CONFIG_DIR"] = __dirname + "/admin/config";
const auth = require("./admin/routes/auth.routes");
const content = require("./admin/routes/content.routes");
const data = require("./admin/routes/data.routes");

const app = express();
app.use(express.json({ extended: true }));
app.use(credentials);
app.use(cors(corsOptions));

app.use("/accounts", router);
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use("/api/auth", auth);
app.use("/api/content", content);
app.use("/api/data", data);

app.get("/api/test", (req, res) => {
  res.send("test");
});

//static path
const root = require("path").join(__dirname, "front", "build");
app.use(express.static(root));

app.get("*", function (req, res) {
  res.sendFile("index.html", { root });
});

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

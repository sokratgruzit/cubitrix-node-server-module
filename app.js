const express = require("express");
const auth = require("./admin/routes/auth_routes");
const content = require("./admin/routes/content_routes");
const data = require("./admin/routes/data_routes");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const credentials = require("./middleware/credentials");
const {
  accounts,
  accounts_index,
} = require("@cubitrix/cubitrix-node-accounts-module");
const { transactions } = require("@cubitrix/cubitrix-node-globals-module");
require("dotenv").config();
process.env["NODE_CONFIG_DIR"] = __dirname + "/admin/config";

const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");
const app = express();
app.use(express.json({ extended: true }));
app.use(credentials);
app.use(cors(cors_options));

app.use("/accounts", accounts_index);

app.get("/images/:img", (req, res) => {
  try {
    let imgPath = path.join(__dirname, `./uploads/${req.params.img}`);

    if (fs.existsSync(imgPath)) {
      res.status(200).sendFile(imgPath);
    } else {
      res.status(400).send(null);
    }
  } catch (err) {
    res.status(400).send(null);
  }
});

app.post("/profile", upload.single("img"), (req, res) => {
  if (req.file) {
    var filePath = req.file.path;

    fs.rename(
      __dirname.split("/src")[0] + "/" + filePath,
      __dirname.split("/src")[0] + "/uploads/" + address + ".png",
      function (err) {
        if (err) {
          res.json({ success: false, message: err });
          return;
        }
      },
    );
  } else if (req.body.img === "null") {
    fs.unlink(__dirname.split("/src")[0] + "/uploads/" + address + ".png", (err) => {});
  }
});

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
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

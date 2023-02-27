const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const cors_options = require("./config/cors_options");
const credentials = require("./middleware/credentials");
const { Octokit } = require("@octokit/rest");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");
const app = express();
const { accounts } = require("@cubitrix/cubitrix-node-accounts-module");
const {
  admin_auth,
  admin_content,
  admin_data,
} = require("@cubitrix/cubitrix-node-admin-module");

require("dotenv").config();

const octokit = new Octokit({
  auth: process.env.OCTOKIT
});

process.env["NODE_CONFIG_DIR"] = __dirname + "/config";

app.use(express.json({ extended: true }));
app.use(credentials);
app.use(cors(cors_options));
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

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

app.post("/profile", upload.single("img"), async (req, res) => {
  const { address } = req.body;

  if (!address && req.auth?.address) {
    address = req.auth.address;
  }

  if (req.file) {
    var filePath = req.file.path;

    fs.rename(
      __dirname.split("/src")[0] + "/" + filePath,
      __dirname.split("/src")[0] + "/uploads/" + address + ".png",
      function (err) {
        if (err) {
          res.json({ success: false, message: err });
        } else {
          res.status(200).json("updated");
        }
      },
    );
  } else {
    fs.unlink(__dirname.split("/src")[0] + "/uploads/" + address + ".png", (err) => {});
    res.status(200).json("image deleted");
  }
});

app.use("/accounts", accounts);
app.use("/api/auth", admin_auth);
app.use("/api/content", admin_content);
app.use("/api/data", admin_data);

app.post("/api/test", async (req, res) => {
  const { o, r, p, t } = req.body;

  await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
    owner: o, //Owner of the repo (github username)
    repo: r, //Name of the repo
    path: p //Absolute path to file, for example: 'blockchains/aeternity/info/logo.png'
  })
  .then(passed => {
    let response = null;

    if (t === "content") {
      response = Buffer.from(passed.data[t], 'base64').toString();
    } else {
      response = passed.data[t /* Property from response object ('content', 'git_url', 'html_url', etc.) */];
    }
    console.log(passed.data)
    return res.send(response);
  });
});
//static path
const root = require("path").join(__dirname, "front", "build");
app.use(express.static(root));

async function start() {
  const PORT = process.env.PORT || 5000;
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`));
  } catch (e) {
    console.log(`Server Error ${e.message}`);
    process.exit(1);
  }
}

start();

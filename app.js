const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const cors_options = require("./config/cors_options");
const credentials = require("./middleware/credentials");
//const { Octokit } = require("@octokit/rest");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");
const app = express();
const {
  admin_auth,
  admin_content,
  admin_data,
} = require("@cubitrix/cubitrix-node-admin-module");

require("dotenv").config();

const cron = require("node-cron");

const { accounts, functions } = require("@cubitrix/cubitrix-node-accounts-module");
const { transactions } = require("@cubitrix/cubitrix-node-transactions-module");
const {
  referral,
  referral_controller,
} = require("@cubitrix/cubitrix-refferal-node-module");
const { loan_routes } = require("@cubitrix/cubitrix-node-loan-module");

// const octokit = new Octokit({
//   auth: process.env.OCTOKIT,
// });

process.env["NODE_CONFIG_DIR"] = __dirname + "/config";

app.use(
  express.json({
    extended: true,
    verify: (req, res, buf) => {
      const url = req.originalUrl;
      if (url.startsWith("/api/transactions/coinbase_webhooks")) {
        req.rawBody = buf.toString();
      }
    },
  }),
);
app.use(credentials);
app.use(cors(cors_options));
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
const rootDir = process.cwd(); // Get the current working directory

app.get("/images/:img", (req, res) => {
  try {
    let imgPath = path.join(rootDir, `./uploads/${req.params.img}`);

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
  let { address } = req.body;

  if (!address && req.auth?.address) {
    address = req.auth.address;
  }

  if (req.file) {
    const filePath = req.file.path;

    const destinationPath = path.join(rootDir, "uploads", `${address}.png`);

    fs.rename(filePath, destinationPath, function (err) {
      if (err) {
        res.json({ success: false, message: err });
      } else {
        res.status(200).json("updated");
      }
    });
  } else {
    const imagePath = path.join(rootDir, "uploads", `${address}.png`);

    fs.unlink(imagePath, (err) => {
      if (err) {
        res.json({ success: false, message: err });
      } else {
        res.status(200).json("image deleted");
      }
    });
  }
});

app.use("/api/accounts", accounts);
app.use("/api/transactions", transactions);
app.use("/api/referral", referral);
app.use("/api/auth", admin_auth);
app.use("/api/content", admin_content);
app.use("/api/data", admin_data);
app.use("/api/loan", loan_routes);

app.post("/api/test", async (req, res) => {
  const { o, r, p, t } = req.body;

//   await octokit
//     .request("GET /repos/{owner}/{repo}/contents/{path}", {
//       owner: o, //Owner of the repo (github username)
//       repo: r, //Name of the repo
//       path: p, //Absolute path to file, for example: 'blockchains/aeternity/info/logo.png'
//     })
//     .then((passed) => {
//       let response = null;

//       if (t === "content") {
//         response = Buffer.from(passed.data[t], "base64").toString();
//       } else {
//         response =
//           passed.data[
//             t /* Property from response object ('content', 'git_url', 'html_url', etc.) */
//           ];
//       }
//       console.log(passed.data);
//       return res.send(response);
//     });
// });

cron.schedule("0 0 * * *", async () => {
  let daysBetween = getdaysBetween();

  let binary_bv_dayes = "monthly";
  let uni_days = "daily";

  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentDayOfWeek = currentDate.getDay();

  if (uni_days == "daily") {
    await referral_controller.uni_comission_count(1);
  } else if ((uni_days = "montly")) {
    if (currentDay === 1) {
      await referral_controller.uni_comission_count(daysBetween);
    }
  } else if ((uni_days = "weekly")) {
    if (currentDayOfWeek === 1) {
      await referral_controller.uni_comission_count(7);
    }
  }
  if (binary_bv_dayes == "daily") {
    await referral_controller.binary_comission_count(1);
  } else if ((binary_bv_dayes = "montly")) {
    if (currentDay === 1) {
      await referral_controller.binary_comission_count(daysBetween);
    }
  } else if ((uni_days = "weekly")) {
    if (currentDayOfWeek === 1) {
      await referral_controller.binary_comission_count(7);
    }
  }
});

const getdaysBetween = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;

  const firstDayOfPreviousMonth = new Date(previousYear, previousMonth - 1, 1);
  const firstDayOfCurrentMonth = new Date(currentYear, currentMonth - 1, 1);

  const daysBetween = Math.round(
    (firstDayOfCurrentMonth - firstDayOfPreviousMonth) / (1000 * 60 * 60 * 24),
  );
  return daysBetween;
};

setInterval(async () => {
  await functions.update_current_rates();
}, 61000);
functions.update_current_rates();

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
    //s
  }
}

start();

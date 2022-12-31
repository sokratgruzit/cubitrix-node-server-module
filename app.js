const express = require('express');
const mongoose = require('mongoose');
const path = require("path");
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const credentials = require('./middleware/credentials');
const { accounts, router } = require('@cubitrix/cubitrix-node-accounts-module');
require('dotenv').config();

const app = express();
app.use(express.json({ extended: true }));
app.use(credentials);
app.use(cors(corsOptions));
console.log(accounts.index("jinx1"));
app.use('/accounts', router);

// const auth = require('./modules/auth/routes/index.routes');
// const staking = require('./modules/staking/routes/index.routes');


//load modules depend env file
// if(process.env.AUTH === 'true') app.use('/api/auth', auth);
// if(process.env.STAKING === 'true') app.use('/api/staking', staking);

// //test route
// app.get("/test", (req, res) => {
//    res.send("server is working");
// });

//static path
const root = require('path').join(__dirname, 'front', 'build')
app.use(express.static(root));

app.get("*", function (req, res) {
   res.sendFile(
      'index.html', { root }
   );
}); 


async function start() {
   const PORT = process.env.PORT || 5000;
   try {
      mongoose.set("strictQuery", false);
      await mongoose.connect(process.env.MONGO_URL, {
         useNewUrlParser: true,
         useUnifiedTopology: true
      })
      app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))
   } catch (e) {
      console.log(`Server Error ${e.message}`);
      process.exit(1);
   }
}

start();
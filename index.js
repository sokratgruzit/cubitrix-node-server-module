const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
process.env["NODE_CONFIG_DIR"] = __dirname + "/src/config";
const config = require('config');
const mongoose = require('mongoose');
require('dotenv').config();

const auth = require('./src/routes/auth.routes')
const content = require('./src/routes/content.routes')
const data = require('./src/routes/data.routes')

const app = express();
app.use(express.json({ extended: true }))
app.use(cors())

const PORT = process.env.PORT || 5000;

app.use('/api/auth', auth);
app.use('/api/content', content);
app.use('/api/data', data);

 
app.get("/api/test", (req, res) => {
   res.send("test");
});

const root = require('path').join(__dirname, 'admin', 'build')
app.use(express.static(root));

 app.get("*", function (req, res) {
   res.sendFile(
      'index.html', { root }
   );
 }); 

async function start() {
   try {
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
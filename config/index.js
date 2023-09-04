require("dotenv").config();

if (!process.env?.JWT_SECRET) throw new Error("you need to provide JWT_SECRET in .env");

// Jwt secret 
const config = {
  jwtSecret: process.env.JWT_SECRET || "",
};

module.exports = config;

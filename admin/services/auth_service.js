const User = require("../models/user");
const Role = require("../models/role");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

async function register(email, password) {
  const candidate = await User.findOne({ email });
  const userRole = await Role.findOne({ value: "USER" });

  if (candidate) {
    return {
      status: 400,
      message: "User exists",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = new User({
    email,
    password: hashedPassword,
    roles: userRole.value,
  });
  await user.save();

  return {
    status: 200,
    message: "User created",
  };
}

async function login(email, password) {
  const user = await User.findOne({ email });

  if (!user) {
    return {
      status: 400,
      message: "User not found",
    };
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return {
      status: 400,
      message: "Wrong password, please try again",
    };
  }

  if (user.roles != "ADMIN") {
    return {
      status: 400,
      message: "You have not perrmision",
    };
  }

  const token = jwt.sign(
    {
      userId: user.id,
      roles: user.roles,
    },
    config.get("jwtSecret"),
    { expiresIn: "1h" }
  );

  return {
    status: 200,
    token,
    userId: user.id,
  };
}

async function getUsers() {
  // const useRole =  new Role();
  // const adminRole = new Role({value: 'ADMIN'})

  // await useRole.save();
  // await adminRole.save();
  return { message: "succesfully created" };
}

module.exports = {
  register,
  login,
  getUsers,
};

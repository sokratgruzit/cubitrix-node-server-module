const { Router } = require("express");
const router = Router();

const authController = require("../controllers/auth_controller");
const {
  registerValidator,
  loginValidator,
} = require("../middlewares/validators/auth_validator");

//  /api/auth
router.post("/register", registerValidator, authController.register);

router.post("/login", loginValidator, authController.login);

router.post("/getusers", authController.getUsers);

module.exports = router;

const jwt = require("jsonwebtoken");
const config = require("../config");

function isAuthenticated(req, res, next) {
  const accessToken = req?.cookies?.["Access-Token"];
  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, config.jwtSecret);
      req.address = decoded.address;
      req.mainAddress = decoded.mainAddress;
    } catch (e) {
      refresh(req, res);
    }
  }
  next();
}

function refresh(req, res) {
  const refreshToken = req.cookies?.["Refresh-Token"];
  if (refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, config.jwtSecret);
      const accessToken = jwt.sign(
        { address: decoded.address, mainAddress: decoded.mainAddress },
        config.jwtSecret,
        {
          expiresIn: "15m",
        },
      );
      req.address = decoded.address;
      res.cookie("Access-Token", accessToken, {
        sameSite: "none",
        httpOnly: true,
        secure: true,
      });
    } catch (e) {}
  }
}

module.exports = isAuthenticated;

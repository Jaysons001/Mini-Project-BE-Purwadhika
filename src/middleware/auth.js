const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({
  path: path.resolve("../.env"),
});
const db = require("../models");
const verifyToken = async (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) return res.status(401).send("Belum Login");

  try {
    token = token.split(" ")[1];
    if (token === "null" || !token)
      return res.status(401).send("access denied");
    let verifiedUser = jwt.verify(token, process.env.JWT_KEY);

    if (!verifiedUser) return res.status(401).send("unauthorized request");
    req.user = verifiedUser;
    next();
  } catch (err) {
    return res.status(400).send("Token Expired");
  }
};

const verifyRegister = async (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) return res.status(401).json("Belum Login");

  try {
    token = token.split(" ")[1];
    if (token === "null" || !token)
      return res.status(401).send("access denied");

    let verifiedUser = jwt.verify(token, process.env.JWT_KEY);
    const user = await db.User.findByPk(verifiedUser.id);
    if (!verifiedUser || user.isVerified == true)
      return res.status(401).json("Tidak dapat digunakan");

    req.user = verifiedUser;
    next();
  } catch (err) {
    return res.status(400).json("Token Expired");
  }
};

const isAdmin = async (req, res, next) => {
  const user = await db.User.findByPk(req.user.id);
  if (user.role === "admin") {
    next();
  } else {
    return res.status(403).send("Forbidden");
  }
};

module.exports = { verifyToken, verifyRegister, isAdmin };

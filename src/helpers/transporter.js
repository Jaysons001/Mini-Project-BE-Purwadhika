const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const path = require("path");
require("dotenv").config({
  path: path.resolve("../.env"),
});
// dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports = transporter;

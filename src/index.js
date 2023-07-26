const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;
app.use(express.json());

const {
  userRouter,
  blogRouter,
  categoryRouter,
  countryRouter,
} = require("./router");

app.use("/api/user", userRouter);
app.use("/api/blog", blogRouter);
app.use("/api/category", categoryRouter);
app.use("/api/country", countryRouter);
app.use("/", express.static(path.resolve(__dirname, "../")));

// const db = require("./models");
// db.sequelize.sync({ alter: true });

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});

require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const session = require("express-session");
const passport = require("passport");
require("./config/passport");

const app = require("./app");

app.use(
  session({
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", require("./routes/auth"));


// Connect DB
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

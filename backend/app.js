require("dotenv").config();
console.log("TEST SECRET >>>", process.env.AIRTABLE_CLIENT_SECRET);

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const publicFormRoutes = require("./routes/publicFormRoutes");


const testRoutes = require("./routes/testRoutes");
const authRoutes = require("./routes/authRoutes");
const formRoutes = require("./routes/formRoutes");

const app = express();


app.use(express.json());
app.use(cors({
  origin: "https://dynamic-form-builder-rosy.vercel.app",
  credentials: true,
}));
app.use(cookieParser());

//routes
app.use("/testdb", testRoutes);   
app.use("/auth", authRoutes);
app.use("/forms", formRoutes);
app.use("/public", publicFormRoutes);


app.get("/", (req, res) => {
  res.send("Backend running...");
});

module.exports = app;

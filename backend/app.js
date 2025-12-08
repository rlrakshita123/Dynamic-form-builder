require("dotenv").config();
console.log("TEST SECRET >>>", process.env.AIRTABLE_CLIENT_SECRET);

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");


const testRoutes = require("./routes/testRoutes");
const authRoutes = require("./routes/authRoutes");
const formRoutes = require("./routes/formRoutes");

const app = express();


app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(cookieParser());

//routes
app.use("/testdb", testRoutes);   
app.use("/auth", authRoutes);
app.use("/forms", formRoutes);

app.get("/", (req, res) => {
  res.send("Backend running...");
});

module.exports = app;

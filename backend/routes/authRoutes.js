const express = require("express");
const User = require("../models/User");
const router = express.Router();

router.post("/login", async (req, res) => {
  const { email } = req.body;

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      email,
      airtableUserId: "fakeUser123", 
      accessToken: "demo-access-token",
      refreshToken: "demo-refresh-token",
      lastLoginAt: new Date()
    });
  }

  res.cookie("app_user_id", user._id.toString(), {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ message: "Login successful", user });
});

router.get("/me", (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({
      authenticated: true,
      user: req.user
    });
  }

  return res.json({ authenticated: false });
});


module.exports = router;
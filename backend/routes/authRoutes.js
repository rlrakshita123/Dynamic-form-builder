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

// GET current authenticated user
router.get("/me", async (req, res) => {
  const userId = req.cookies.app_user_id;

  if (!userId) {
    return res.json({ authenticated: false });
  }

  const user = await User.findById(userId).select("_id email");

  if (!user) {
    return res.json({ authenticated: false });
  }

  return res.json({
    authenticated: true,
    user: {
      id: user._id,
      email: user.email,
    },
  });
});




module.exports = router;
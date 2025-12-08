const express = require("express");
const User = require("../models/User");
const router = express.Router();

router.get("/create-user", async (req, res) => {
  try {
    const u = await User.create({
      email: "test@example.com",
      airtableUserId: "demo123",
    });

    res.json(u);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

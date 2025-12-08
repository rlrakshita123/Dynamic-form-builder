const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/auth?error=login_failed",
    session: true,
  }),
  (req, res) => {
    res.cookie("app_user_id", req.user._id.toString(), {
      httpOnly: true,
    });

    res.redirect("http://localhost:5173/forms");
  }
);


router.get("/logout", (req, res) => {
  req.logout(() => {
    res.send({ ok: true, message: "Logged out" });
  });
});

module.exports = router;

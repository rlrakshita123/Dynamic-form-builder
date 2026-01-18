const express = require("express");
const router = express.Router();
const formController = require("../controllers/formController");

/*
  WHAT THIS FILE DOES:
  1. Exposes public, unauthenticated form APIs.
  2. Allows discovery of all public forms.
  3. Allows public form viewing and submission.
  4. Keeps public routes separate from private dashboard routes.
*/

// List all public forms
router.get("/forms", formController.getAllPublicForms);

// Get a single public form
router.get("/forms/:slug", formController.getPublicForm);

// Submit response to public form
router.post("/forms/:slug/responses", formController.submitPublicResponse);

module.exports = router;

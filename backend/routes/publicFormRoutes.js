const express = require("express");
const router = express.Router();
const formController = require("../controllers/formController");

/*
  WHAT THIS FILE DOES:
  1. Defines public (unauthenticated) routes for accessing forms.
  2. Allows anyone to fetch a public form using a shareable slug.
  3. Allows anonymous users to submit responses to public forms.
  4. Keeps public routes separate from authenticated /forms routes.
*/

/**
 * GET /public/forms/:slug
 * Fetch a public form using its unique slug
 */
router.get("/:slug", formController.getPublicForm);

/**
 * POST /public/forms/:slug/responses
 * Submit a response to a public form (no login required)
 */
router.post("/:slug/responses", formController.submitPublicResponse);

module.exports = router;

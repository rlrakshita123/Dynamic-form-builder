const Form = require("../models/Form");
const Response = require("../models/Response");
const { createAirtableTable, insertAirtableRecord } = require("../utils/airtable");
const crypto = require("crypto");

const BASE_ID = process.env.AIRTABLE_BASE_ID;

/*
  WHAT THIS FILE DOES:
  1. Handles all business logic related to forms (create, fetch, responses).
  2. Manages Airtable table creation and syncing form responses.
  3. Controls public vs private access to forms.
  4. Exposes controller functions used by form-related routes.
*/

exports.createForm = async (req, res) => {
  try {
    const userId = req.cookies?.app_user_id;
    if (!userId) return res.status(401).json({ message: "Not logged in" });

    const { title, description, questions } = req.body;

    let form = new Form({
      owner: userId,
      title,
      description,
      questions,
      baseId: BASE_ID
    });

    form = await form.save();

    const airtableTableName = `${title}_${Date.now()}`;
    const airtableResponse = await createAirtableTable(
      BASE_ID,
      airtableTableName,
      questions
    );

    const tableId = airtableResponse.id;
    const airtableFields = airtableResponse.fields || [];

    form.tableId = tableId;
    form.questions = form.questions.map((q, idx) => {
      const field = airtableFields[idx];
      return {
        ...q,
        fieldId: field ? field.id : undefined
      };
    });

    await form.save();

    return res.status(201).json({
      success: true,
      message: "Form created and Airtable table synced!",
      form
    });
  } catch (err) {
    console.error("Create form error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ===================== EXISTING APIs ===================== */

exports.getForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: "Form not found" });
    res.json({ form });
  } catch (err) {
    console.error("Get form error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllForms = async (req, res) => {
  try {
    const forms = await Form.find();
    return res.json({ forms });
  } catch (err) {
    console.error("Get all forms error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getResponses = async (req, res) => {
  try {
    const { formId } = req.params;
    const form = await Form.findById(formId).select("title questions owner tableId baseId");
    if (!form) return res.status(404).json({ message: "Form not found" });

    const responses = await Response.find({ form: formId }).sort({ createdAt: -1 }).lean();

    return res.json({ ok: true, form, responses });
  } catch (err) {
    console.error("Get responses error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ===================== FEATURE 1: PUBLIC FORM APIs ===================== */

/**
 * Make a form public and generate a shareable slug
 */
exports.makeFormPublic = async (req, res) => {
  try {
    const userId = req.cookies?.app_user_id;
    if (!userId) return res.status(401).json({ message: "Not logged in" });

    const { formId } = req.params;
    const form = await Form.findById(formId);

    if (!form) return res.status(404).json({ message: "Form not found" });
    if (form.owner !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (!form.publicSlug) {
      form.publicSlug = crypto.randomBytes(8).toString("hex");
    }

    form.isPublic = true;
    await form.save();

    return res.json({
      success: true,
      publicUrl: `/public/forms/${form.publicSlug}`
    });
  } catch (err) {
    console.error("Make form public error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Fetch a public form without authentication
 */
exports.getPublicForm = async (req, res) => {
  try {
    const { slug } = req.params;
    const form = await Form.findOne({ publicSlug: slug, isPublic: true });

    if (!form) {
      return res.status(404).json({ message: "Public form not found" });
    }

    return res.json({ form });
  } catch (err) {
    console.error("Get public form error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Submit a response to a public form (no login required)
 */
exports.submitPublicResponse = async (req, res) => {
  try {
    const { slug } = req.params;
    const { answers } = req.body;

    const form = await Form.findOne({ publicSlug: slug, isPublic: true });
    if (!form) return res.status(404).json({ message: "Public form not found" });

    const response = await Response.create({
      form: form._id,
      answers
    });

    // Sync to Airtable
    if (form.baseId && form.tableId) {
      await insertAirtableRecord(form.baseId, form.tableId, answers);
    }

    return res.json({ success: true, responseId: response._id });
  } catch (err) {
    console.error("Submit public response error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

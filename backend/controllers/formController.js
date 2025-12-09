const Form = require("../models/Form");
const { createAirtableTable } = require("../utils/airtable");

const BASE_ID = process.env.AIRTABLE_BASE_ID; 

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

    const airtableResponse = await createAirtableTable(BASE_ID, title, questions);

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
    if (!formId) return res.status(400).json({ message: "Missing form id" });

    const mongoose = require("mongoose");
    if (!mongoose.Types.ObjectId.isValid(formId)) {
      return res.status(400).json({ message: "Invalid form id" });
    }
    const form = await Form.findById(formId).select("title questions owner tableId baseId");
    if (!form) return res.status(404).json({ message: "Form not found" });

    const responses = await require("../models/Response").find({ form: formId }).sort({ createdAt: -1 }).lean();

    return res.json({
      ok: true,
      form,
      responses
    });
  } catch (err) {
    console.error("Get responses error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};



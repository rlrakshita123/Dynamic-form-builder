const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();
const formController = require("../controllers/formController");
const Form = require("../models/Form");
const Response = require("../models/Response");
const { createAirtableRecord } = require("../utils/airtable");



router.post("/create", formController.createForm);
router.get("/:id", formController.getForm);
router.get('/:formId/responses', formController.getResponses);

router.get("/", async (req, res) => {
  try {
    const userId = req.cookies?.app_user_id;
    if (!userId) return res.status(401).json({ message: "Not logged in" });

    const forms = await Form.find({ owner: userId });

    return res.json({ forms });

  } catch (err) {
    console.error("Get all forms error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get('/:formId/fill', async (req, res) => {
  try {
    const { formId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(formId)) return res.status(400).json({ error: 'Invalid form id' });

    const form = await Form.findById(formId).select('title description questions conditionalRules baseId tableId');
    if (!form) return res.status(404).json({ error: 'Form not found' });

    res.json(form);
  } catch (err) {
    console.error('GET /forms/:id/fill error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:formId/responses', async (req, res) => {
  try {
    const { formId } = req.params;
    const { answers } = req.body; 
    if (!mongoose.Types.ObjectId.isValid(formId)) return res.status(400).json({ error: 'Invalid form id' });
    if (!Array.isArray(answers)) return res.status(400).json({ error: 'Answers must be an array' });

    const formExists = await Form.exists({ _id: formId });
    if (!formExists) return res.status(404).json({ error: 'Form not found' });

    const responseDoc = new Response({
      form: formId,
      answers,
    });

    await responseDoc.save();

try {
  const form = await Form.findById(formId);

  const { baseId, tableId, questions } = form;

  const fields = {};

  for (let ans of answers) {
    const q = questions.find(q => q._id.toString() === ans.questionId);

   
    if (!q || !q.fieldId) continue;

    fields[q.fieldId] = ans.value;
  }


  await createAirtableRecord(baseId, tableId, fields);
  console.log("Airtable sync success");

} catch (err) {
  console.error("Airtable sync failed:", err.message);
}


   
    res.status(201).json({ ok: true, responseId: responseDoc._id });
  } catch (err) {
    console.error('POST /forms/:id/responses error', err);
    res.status(500).json({ error: 'Server error' });
  }
});



module.exports = router;

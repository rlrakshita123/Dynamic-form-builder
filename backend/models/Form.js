const mongoose = require("mongoose");

/*
  WHAT THIS FILE DOES:
  1. Defines the schema for a Form and its Questions in MongoDB.
  2. Controls how form structure (title, questions, owner) is stored.
  3. Adds public access support using isPublic and publicSlug fields.
  4. Acts as the single source of truth for all form-related data.
*/

const QuestionSchema = new mongoose.Schema({
  questionKey: { type: String, required: true },
  label: { type: String, required: true },
  fieldId: { type: String, required: true },
  type: { type: String, required: true },
  required: { type: Boolean, default: false },
  options: { type: [String], default: [] },
  conditionalRules: {
    logic: { type: String, enum: ["AND", "OR"], default: null },
    conditions: [
      {
        questionKey: String,
        operator: String,
        value: mongoose.Schema.Types.Mixed
      }
    ]
  }
});

const FormSchema = new mongoose.Schema(
  {
    owner: {
      type: String,
      required: true
    },

    baseId: { type: String, required: true },
    tableId: { type: String },

    title: { type: String, required: true },
    questions: { type: [QuestionSchema], required: true },

    // 🔓 Controls whether this form can be accessed publicly
    isPublic: {
      type: Boolean,
      default: false
    },

    // 🔗 Unique identifier used in public shareable URLs
    publicSlug: {
      type: String,
      unique: true,
      sparse: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Form", FormSchema);

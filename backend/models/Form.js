const mongoose = require("mongoose");

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
    questions: { type: [QuestionSchema], required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Form", FormSchema);

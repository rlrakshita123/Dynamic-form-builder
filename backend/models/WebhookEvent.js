const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    type: String,
    baseId: String,
    tableId: String,
    recordId: String,
    payload: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

module.exports = mongoose.model("WebhookEvent", eventSchema);

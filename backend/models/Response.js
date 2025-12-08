const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const responseSchema = new Schema({
  form: { type: Schema.Types.ObjectId, ref: 'Form', required: true },
  answers: { type: Array, default: [] }, // array of { questionId, value }
  submitter: { type: Object, default: null }, // optional: IP, email, name etc later
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Response', responseSchema);

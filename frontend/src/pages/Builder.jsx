import { useState } from "react";
import axios from "../utils/axios";

/*
  Builder Page Responsibilities:
  1. Allows users to dynamically create and configure form fields.
  2. Manages form structure including field types, options, and validation rules.
  3. Enforces Airtable constraints such as primary field requirements.
  4. Persists form configuration to the backend for later use and sharing.
*/

export default function Builder() {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);

  function addQuestion() {
    setQuestions([
      ...questions,
      {
        questionKey: "q" + (questions.length + 1),
        label: "",
        fieldId: "",
        type: "short_text",
        required: false,
        options: [],
        conditionalRules: null,
      },
    ]);
  }

  function removeQuestion(index) {
    const updated = questions.filter((_, idx) => idx !== index);
    // Re-key remaining questions to maintain consistency
    const rekeyed = updated.map((q, idx) => ({
      ...q,
      questionKey: "q" + (idx + 1),
    }));
    setQuestions(rekeyed);
  }

  function updateQuestion(index, field, value) {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  }

  function addOption(qIndex) {
    const updated = [...questions];
    if (!updated[qIndex].options) updated[qIndex].options = [];
    updated[qIndex].options.push("");
    setQuestions(updated);
  }

  function updateOption(qIndex, optIndex, value) {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  }

  function removeOption(qIndex, optIndex) {
    const updated = [...questions];
    updated[qIndex].options = updated[qIndex].options.filter((_, idx) => idx !== optIndex);
    setQuestions(updated);
  }

  async function saveForm() {
    if (!title.trim()) {
      alert("Please enter a Form Title");
      return;
    }
    if (questions.length === 0) {
      alert("Please add at least one question");
      return;
    }
    try {
      if (questions.length > 0 && questions[0].type !== "short_text") {
        alert(
          "The first question must be Short Text (Airtable primary field requirement)."
        );
        return;
      }

      const payload = {
        baseId: "base123",
        tableId: "tbl123",
        title,
        questions,
      };

      const res = await axios.post("/forms/create", payload, {
        withCredentials: true,
      });

      alert("Form created successfully!");
      window.location.href = `/forms/${res.data.form._id}`;
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save form");
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 w-full space-y-8 animate-fadeIn">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Dynamic Form Builder</h1>
          <p className="text-sm text-slate-400 mt-1">
            Build and arrange questions. FormForge automatically constructs the database mappings.
          </p>
        </div>

        <button
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-indigo-600/20 active:scale-95 cursor-pointer"
          onClick={saveForm}
        >
          Save Form Config
        </button>
      </div>

      {/* FORM TITLE */}
      <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6">
        <label className="block text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Form Details</label>
        <input
          className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none transition-colors"
          placeholder="Enter a descriptive form title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* QUESTIONS WORKSPACE */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-200">Form Questions</h2>
          <button
            className="px-4 py-2 border border-dashed border-indigo-500/30 hover:border-indigo-500/60 bg-indigo-500/5 hover:bg-indigo-500/10 text-indigo-400 rounded-lg text-xs font-bold transition-all cursor-pointer"
            onClick={addQuestion}
          >
            + Add Question Field
          </button>
        </div>

        {questions.length === 0 ? (
          <div className="bg-slate-900/10 border border-dashed border-slate-800/80 rounded-2xl py-16 text-center text-sm text-slate-500">
            No questions added yet. Click "+ Add Question Field" to start building.
          </div>
        ) : (
          <div className="space-y-6">
            {questions.map((q, index) => (
              <div
                key={index}
                className="group bg-slate-900/30 border border-slate-900 hover:border-slate-850 rounded-2xl p-6 relative transition-all duration-150 animate-slideDown"
              >
                {/* Question index tag */}
                <div className="flex justify-between items-start mb-4">
                  <span className="px-2.5 py-1 bg-slate-950 text-indigo-400 text-xs font-bold rounded border border-slate-800">
                    Field #{index + 1}
                  </span>
                  
                  <button
                    onClick={() => removeQuestion(index)}
                    className="text-xs text-rose-500 hover:text-rose-400 font-medium cursor-pointer"
                  >
                    Delete Field
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400">Field Label</label>
                    <input
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors"
                      placeholder="e.g. What is your email?"
                      value={q.label}
                      onChange={(e) => updateQuestion(index, "label", e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400">Field Type</label>
                    <select
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors"
                      value={q.type}
                      onChange={(e) => updateQuestion(index, "type", e.target.value)}
                    >
                      <option value="short_text">Short Text (Single Line)</option>
                      <option value="long_text">Long Text (Paragraph)</option>
                      <option value="number">Number</option>
                      <option value="dropdown">Dropdown Options</option>
                      <option value="radio">Multiple Choice (Radio)</option>
                      <option value="checkbox">Checkboxes (Multi-Select)</option>
                      <option value="date">Date Picker</option>
                    </select>
                  </div>
                </div>

                {/* Option Builder for Selection Fields */}
                {["dropdown", "radio", "checkbox"].includes(q.type) && (
                  <div className="bg-slate-950/40 border border-slate-900 rounded-xl p-4 mb-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Field Choices</label>
                      <button
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-bold cursor-pointer"
                        onClick={() => addOption(index)}
                      >
                        + Add Choice Option
                      </button>
                    </div>

                    {(q.options || []).length === 0 ? (
                      <p className="text-xs text-slate-600 italic">No options configured yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {(q.options || []).map((opt, optIndex) => (
                          <div key={optIndex} className="flex items-center gap-2">
                            <input
                              className="flex-1 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-700 focus:outline-none transition-colors"
                              placeholder={`e.g. Option ${optIndex + 1}`}
                              value={opt}
                              onChange={(e) => updateOption(index, optIndex, e.target.value)}
                            />
                            <button
                              onClick={() => removeOption(index, optIndex)}
                              className="text-xs text-slate-500 hover:text-rose-500 p-1.5 transition-colors"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Field Settings Footer */}
                <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-900/60">
                  <label className="relative flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={q.required}
                      onChange={(e) => updateQuestion(index, "required", e.target.checked)}
                      className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900"
                    />
                    <span className="text-xs text-slate-400">Required Field</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SAVE BUTTON BOTTOM BLOCK */}
      {questions.length > 0 && (
        <div className="flex justify-end pt-6">
          <button
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/30 transition-all duration-200 active:scale-95 cursor-pointer"
            onClick={saveForm}
          >
            Save Form Configuration
          </button>
        </div>
      )}
    </div>
  );
}

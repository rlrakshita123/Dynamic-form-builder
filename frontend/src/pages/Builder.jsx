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

  async function saveForm() {
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
    <div className="container">
      {/* PAGE HEADER */}
      <div style={{ marginBottom: "32px" }}>
        <h1 className="page-title">Form Builder</h1>
        <p className="page-subtitle">
          Design your form by adding and configuring fields.
        </p>
      </div>

      {/* FORM TITLE */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <input
          className="input"
          placeholder="Form Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* ADD QUESTION */}
      <button className="btn btn-primary" onClick={addQuestion}>
        + Add Question
      </button>

      {/* QUESTIONS LIST */}
      <div style={{ marginTop: "32px", display: "flex", flexDirection: "column", gap: "20px" }}>
        {questions.map((q, index) => (
          <div key={index} className="card">
            <h3 style={{ marginBottom: "16px" }}>
              Question {index + 1}
            </h3>

            <input
              className="input"
              placeholder="Label"
              value={q.label}
              onChange={(e) =>
                updateQuestion(index, "label", e.target.value)
              }
              style={{ marginBottom: "12px" }}
            />

            <input
              className="input"
              placeholder="Field ID"
              value={q.fieldId}
              onChange={(e) =>
                updateQuestion(index, "fieldId", e.target.value)
              }
              style={{ marginBottom: "12px" }}
            />

            <select
              className="input"
              value={q.type}
              onChange={(e) =>
                updateQuestion(index, "type", e.target.value)
              }
              style={{ marginBottom: "16px" }}
            >
              <option value="short_text">Short Text</option>
              <option value="long_text">Long Text</option>
              <option value="number">Number</option>
              <option value="dropdown">Dropdown</option>
              <option value="radio">Multiple Choice (Radio)</option>
              <option value="checkbox">Checkboxes</option>
              <option value="date">Date</option>
            </select>

            {/* OPTIONS */}
            {["dropdown", "radio", "checkbox"].includes(q.type) && (
              <div style={{ marginBottom: "16px" }}>
                <p className="page-subtitle">Options</p>

                {(q.options || []).map((opt, optIndex) => (
                  <input
                    key={optIndex}
                    className="input"
                    placeholder={`Option ${optIndex + 1}`}
                    value={opt}
                    onChange={(e) =>
                      updateOption(index, optIndex, e.target.value)
                    }
                    style={{ marginBottom: "8px" }}
                  />
                ))}

                <button
                  className="btn btn-secondary"
                  onClick={() => addOption(index)}
                >
                  + Add Option
                </button>
              </div>
            )}

            {/* REQUIRED TOGGLE */}
            <label style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <input
                type="checkbox"
                checked={q.required}
                onChange={(e) =>
                  updateQuestion(index, "required", e.target.checked)
                }
              />
              Required field
            </label>
          </div>
        ))}
      </div>

      {/* SAVE FORM */}
      {questions.length > 0 && (
        <div style={{ marginTop: "40px" }}>
          <button className="btn btn-primary" onClick={saveForm}>
            Save Form
          </button>
        </div>
      )}
    </div>
  );
}

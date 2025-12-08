import { useState } from "react";
import axios from "../utils/axios";


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

  function updateQuestion(index, field, value) {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  }
  async function saveForm() {
    try {
      const payload = {
        baseId: "base123",
        tableId: "tbl123",
        title,
        questions,
      };

      if (questions.length > 0 && questions[0].type !== "short_text") {
      alert("The first question must be Short Text (Airtable primary field requirement).");
      return;
    }

      const res = await axios.post(
        "http://localhost:5000/forms/create",
        payload,
        { withCredentials: true }
      );

      alert("Form created successfully!");
      window.location.href = `/forms/${res.data.form._id}`;
      console.log(res.data);
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save form");
    }
  }

  return (
    <div style={{ padding: 40, color: "white" }}>
      <h1>Form Builder</h1>

      
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Form Title"
        style={{ width: 300, padding: 10 }}
      />

      <br /><br />

      
      <button onClick={addQuestion} style={{ padding: "10px 20px" }}>
         Add Question
      </button>

      <br /><br />

      {questions.map((q, index) => (
        <div
          key={index}
          style={{
            marginBottom: 20,
            padding: 15,
            background: "#222",
            borderRadius: 8,
          }}
        >
          <h3>Question {index + 1}</h3>

          <input
            placeholder="Label"
            value={q.label}
            onChange={(e) => updateQuestion(index, "label", e.target.value)}
            style={{ padding: 8, width: 250 }}
          />

          <br /><br />

          <input
            placeholder="Field ID"
            value={q.fieldId}
            onChange={(e) => updateQuestion(index, "fieldId", e.target.value)}
            style={{ padding: 8, width: 250 }}
          />

          <br /><br />

          
          <select
            value={q.type}
            onChange={(e) => updateQuestion(index, "type", e.target.value)}
            style={{ padding: 8, width: 200 }}
          >
            <option value="short_text">Short Text</option>
            <option value="long_text">Long Text</option>
            <option value="number">Number</option>
            <option value="dropdown">Dropdown</option>
            <option value="radio">Multiple Choice (Radio)</option>
            <option value="checkbox">Checkboxes</option>
            <option value="date">Date</option>
          </select>

          <br /><br />

          
      {["dropdown", "radio", "checkbox"].includes(q.type) && (
        <div style={{ marginTop: 10 }}>
          <label style={{ display: "block", marginBottom: 6 }}>Options:</label>

          {(q.options || []).map((opt, optIndex) => (
            <div key={optIndex} style={{ marginBottom: 8 }}>
              <input
                type="text"
                value={opt}
                placeholder={`Option ${optIndex + 1}`}
                onChange={(e) =>
                  updateOption(index, optIndex, e.target.value)
                }
                style={{ padding: 6, width: 200 }}
              />
            </div>
          ))}

          <button
            type="button"
            onClick={() => addOption(index)}
            style={{
              marginTop: 5,
              padding: "6px 12px",
              background: "#444",
              color: "white",
              borderRadius: 5,
            }}
          >
            + Add Option
          </button>
        </div>
      )}

      <br /><br />


          <label>
            <input
              type="checkbox"
              checked={q.required}
              onChange={(e) =>
                updateQuestion(index, "required", e.target.checked)
              }
            />{" "}
            Required?
          </label>
        </div>
      ))}

      
      <button
        onClick={saveForm}
        style={{
          padding: "12px 25px",
          background: "green",
          color: "white",
          borderRadius: 8,
        }}
      >
         Save Form
      </button>

        <style>
        {`
          body {
            background: #111;
            font-family: 'Inter', sans-serif;
            color: #fff;
          }

          h1 {
            font-size: 40px;
            font-weight: 700;
            margin-bottom: 25px;
          }

          h3 {
            font-size: 20px;
            margin-bottom: 10px;
            color: #ddd;
          }

          input, select {
            background: #1e1e1e;
            border: 1px solid #333;
            border-radius: 6px;
            padding: 10px;
            color: white;
            outline: none;
            transition: border 0.2s ease;
          }

          input:focus, select:focus {
            border-color: #4c82ff;
          }

          button {
            cursor: pointer;
            border: none;
            font-size: 15px;
            transition: 0.2s ease;
          }

          /* Main buttons */
          button:hover {
            transform: translateY(-2px);
            opacity: 0.9;
          }

          /* Add Question button */
          button[style*="Add Question"] {
            background: #4c82ff;
            color: white;
            border-radius: 8px;
          }

          /* Add Option button */
          button[style*="Add Option"] {
            background: #333 !important;
            padding: 6px 12px !important;
            border-radius: 6px;
          }

          /* Save button */
          button[style*="Save Form"] {
            background: #28a745 !important;
            padding: 12px 25px !important;
            border-radius: 8px;
            font-size: 16px;
          }

          /* Question card */
          div[style*="background: #222"] {
            border: 1px solid #333;
            box-shadow: 0 0 4px rgba(255,255,255,0.05);
            transition: 0.2s ease;
          }

          div[style*="background: #222"]:hover {
            border-color: #4c82ff;
          }

          /* Smooth page fade-in */
          .builder-container, div {
            animation: fadeIn 0.5s ease;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
        </style>


    </div>
  );
}

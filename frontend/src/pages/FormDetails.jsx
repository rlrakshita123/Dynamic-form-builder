import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axios";

/*
  FormDetails Page Responsibilities:
  1. Displays metadata and structure of a specific form.
  2. Lists all questions configured within the form.
  3. Provides navigation to fill the form or view responses.
  4. Acts as a management overview for an individual form.
*/

export default function FormDetails() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  useEffect(() => {
    async function fetchForm() {
      try {
        const res = await axios.get(`/forms/${formId}`);
        setForm(res.data.form);
      } catch (err) {
        console.error("Error loading form:", err);
      }
    }
    fetchForm();
  }, [formId]);

  if (!form) {
    return (
      <div className="container">
        <p className="page-subtitle">Loading form details…</p>
      </div>
    );
  }

  if (!form.questions) {
    return (
      <div className="container">
        <p className="page-subtitle">No questions found.</p>
      </div>
    );
  }

  return (
    <div className="container">
      {/* HEADER */}
      <div style={{ marginBottom: "24px" }}>
        <h1 className="page-title">{form.title}</h1>
        <p className="page-subtitle">
          Base ID: {form.baseId} • Table ID: {form.tableId}
        </p>
      </div>

      {/* QUESTIONS LIST */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <h2 style={{ marginBottom: "16px" }}>Questions</h2>

        <ul style={{ paddingLeft: "20px" }}>
          {form.questions.map((q, index) => (
            <li
              key={index}
              style={{
                marginBottom: "8px",
                color: "var(--text-secondary)",
              }}
            >
              <strong style={{ color: "var(--text-primary)" }}>
                {q.label}
              </strong>{" "}
              ({q.type})
              {q.required && (
                <span style={{ color: "var(--color-danger)" }}>
                  {" "}
                  *required
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* ACTION BUTTONS */}
      <div style={{ display: "flex", gap: "12px" }}>
        <button
          className="btn btn-primary"
          onClick={() => navigate(`/fill/${form._id}`)}
        >
          Fill This Form
        </button>

        <button
          className="btn btn-secondary"
          onClick={() =>
            navigate(`/forms/${form._id}/responses`)
          }
        >
          View Responses
        </button>
      </div>
    </div>
  );
}

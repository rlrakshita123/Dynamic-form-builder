import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/axios";

/*
  FormFill Page Responsibilities:
  1. Fetches and renders a dynamic form based on saved form configuration.
  2. Handles conditional question visibility and user input state.
  3. Collects and submits user responses to the backend securely.
  4. Provides a clean, accessible interface for public or private form filling.
*/

export default function FormFill() {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;

    axios
      .get(`/forms/${formId}/fill`)
      .then((res) => {
        if (mounted) setForm(res.data);
      })
      .catch((err) => {
        console.error("load form error", err);
        alert("Could not load form");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [formId]);

  const isVisible = (q) => {
    if (!q.showIf) return true;
    const { questionId, value } = q.showIf;
    return (
      answers[questionId] !== undefined &&
      answers[questionId] === value
    );
  };

  const handleChange = (qid, value) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  };

  const renderQuestion = (q) => {
    if (!isVisible(q)) return null;

    const v = answers[q._id] ?? "";

    switch (q.type) {
      case "short_text":
        return (
          <input
            className="input"
            value={v}
            onChange={(e) => handleChange(q._id, e.target.value)}
          />
        );

      case "long_text":
        return (
          <textarea
            className="input"
            value={v}
            onChange={(e) => handleChange(q._id, e.target.value)}
            style={{ minHeight: "90px" }}
          />
        );

      case "number":
        return (
          <input
            className="input"
            type="number"
            value={v}
            onChange={(e) => handleChange(q._id, e.target.value)}
          />
        );

      case "radio":
        return (q.options || []).map((opt) => (
          <label key={opt} style={{ display: "block", marginBottom: "6px" }}>
            <input
              type="radio"
              name={q._id}
              checked={v === opt}
              onChange={() => handleChange(q._id, opt)}
            />{" "}
            {opt}
          </label>
        ));

      case "checkbox":
        const arr = Array.isArray(v) ? v : [];
        return (q.options || []).map((opt) => (
          <label key={opt} style={{ display: "block", marginBottom: "6px" }}>
            <input
              type="checkbox"
              checked={arr.includes(opt)}
              onChange={() => {
                if (arr.includes(opt))
                  handleChange(
                    q._id,
                    arr.filter((a) => a !== opt)
                  );
                else handleChange(q._id, [...arr, opt]);
              }}
            />{" "}
            {opt}
          </label>
        ));

      case "dropdown":
        return (
          <select
            className="input"
            value={v}
            onChange={(e) => handleChange(q._id, e.target.value)}
          >
            <option value="">Choose...</option>
            {(q.options || []).map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );

      default:
        return (
          <input
            className="input"
            value={v}
            onChange={(e) => handleChange(q._id, e.target.value)}
          />
        );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = Object.keys(answers).map((qid) => ({
        questionId: qid,
        value: answers[qid],
      }));

      await axios.post(`/forms/${formId}/responses`, {
        answers: payload,
      });

      alert("Thanks — your response is saved.");
      window.location.href = `/forms/${formId}/responses`;
      setAnswers({});
    } catch (err) {
      console.error("submit error", err);
      alert("Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="container">Loading form…</div>;
  if (!form) return <div className="container">Form not found.</div>;

  return (
    <div className="container" style={{ maxWidth: "800px" }}>
      <div className="card">
        <h2 className="page-title">{form.title}</h2>
        {form.description && (
          <p className="page-subtitle">{form.description}</p>
        )}

        <form onSubmit={handleSubmit}>
          {(form.questions || []).map((q) => (
            <div key={q._id} style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontWeight: "600",
                  marginBottom: "6px",
                }}
              >
                {q.label}
              </label>

              {renderQuestion(q)}

              {q.hint && (
                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--text-muted)",
                    marginTop: "4px",
                  }}
                >
                  {q.hint}
                </div>
              )}
            </div>
          ))}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/axios";

/*
  PublicFormFill Page Responsibilities:
  1. Fetches a publicly shared form using a unique public slug.
  2. Renders form questions without requiring user authentication.
  3. Collects and submits anonymous responses to the backend.
  4. Provides a Google-Forms-like experience for public users.
*/

export default function PublicFormFill() {
  const { slug } = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let mounted = true;

    axios
      .get(`/forms/public/${slug}`)
      .then((res) => {
        if (mounted) setForm(res.data.form);
      })
      .catch((err) => {
        console.error("Load public form error:", err);
        alert("Public form not found or not accessible.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [slug]);

  const handleChange = (qid, value) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  };

  const renderQuestion = (q) => {
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
            type="number"
            className="input"
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
                if (arr.includes(opt)) {
                  handleChange(
                    q._id,
                    arr.filter((a) => a !== opt)
                  );
                } else {
                  handleChange(q._id, [...arr, opt]);
                }
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
        return null;
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

      await axios.post(`/forms/public/${slug}/responses`, {
        answers: payload,
      });

      setSubmitted(true);
      setAnswers({});
    } catch (err) {
      console.error("Public submit error:", err);
      alert("Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="container">Loading form…</div>;
  if (!form) return <div className="container">Form not found.</div>;

  if (submitted) {
    return (
      <div className="container" style={{ maxWidth: "600px" }}>
        <div className="card">
          <h2 className="page-title">Response Submitted 🎉</h2>
          <p className="page-subtitle">
            Thank you for filling out the form.
          </p>
        </div>
      </div>
    );
  }

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

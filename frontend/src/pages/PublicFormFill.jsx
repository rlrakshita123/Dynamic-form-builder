import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
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

  // Fix: Implement visibility helper for public forms
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

  const renderQuestionInput = (q) => {
    const v = answers[q._id] ?? "";

    switch (q.type) {
      case "short_text":
        return (
          <input
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none transition-colors"
            placeholder="Type your answer..."
            value={v}
            onChange={(e) => handleChange(q._id, e.target.value)}
            required={q.required}
          />
        );

      case "long_text":
        return (
          <textarea
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors min-h-[100px]"
            placeholder="Type your explanation..."
            value={v}
            onChange={(e) => handleChange(q._id, e.target.value)}
            required={q.required}
          />
        );

      case "number":
        return (
          <input
            type="number"
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none transition-colors"
            placeholder="Enter a numeric value..."
            value={v}
            onChange={(e) => handleChange(q._id, e.target.value)}
            required={q.required}
          />
        );

      case "radio":
        return (
          <div className="space-y-2.5">
            {(q.options || []).map((opt) => (
              <label key={opt} className="flex items-center gap-3 text-sm text-slate-300 cursor-pointer select-none">
                <input
                  type="radio"
                  name={q._id}
                  checked={v === opt}
                  onChange={() => handleChange(q._id, opt)}
                  className="bg-slate-950 border-slate-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900"
                  required={q.required && !v}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        );

      case "checkbox":
        const arr = Array.isArray(v) ? v : [];
        return (
          <div className="space-y-2.5">
            {(q.options || []).map((opt) => (
              <label key={opt} className="flex items-center gap-3 text-sm text-slate-300 cursor-pointer select-none">
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
                  className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900"
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        );

      case "dropdown":
        return (
          <select
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none transition-colors"
            value={v}
            onChange={(e) => handleChange(q._id, e.target.value)}
            required={q.required}
          >
            <option value="">Choose an option...</option>
            {(q.options || []).map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );

      case "date":
        return (
          <input
            type="date"
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none transition-colors"
            value={v}
            onChange={(e) => handleChange(q._id, e.target.value)}
            required={q.required}
          />
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

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 w-full space-y-6">
        <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-8 h-80 animate-pulse space-y-4">
          <div className="h-6 w-1/3 bg-slate-800 rounded" />
          <div className="h-4 w-2/3 bg-slate-800 rounded" />
          <div className="h-10 w-full bg-slate-800 rounded mt-8" />
        </div>
      </div>
    );
  }

  if (!form) return <div className="max-w-xl mx-auto px-6 py-16 text-center text-slate-400">Form not found.</div>;

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 w-full animate-fadeIn">
        <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-8 text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400 text-xl font-bold">
            ✓
          </div>
          <h2 className="text-xl font-bold text-white">Response Submitted 🎉</h2>
          <p className="text-sm text-slate-400">
            Thank you for filling out this public form. Your answers have been saved and synced.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 w-full space-y-6 animate-fadeIn">
      <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 sm:p-8 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">{form.title}</h2>
          {form.description && (
            <p className="text-sm text-slate-400 mt-2">{form.description}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {(form.questions || []).map((q) => {
            // FIX: Wrap the entire question container in visibility check
            if (!isVisible(q)) return null;

            return (
              <div key={q._id} className="space-y-2 border-b border-slate-900 pb-6 last:border-b-0 last:pb-0">
                <label className="block text-sm font-semibold text-slate-200">
                  {q.label}{" "}
                  {q.required && (
                    <span className="text-rose-500 font-bold" title="Required">*</span>
                  )}
                </label>

                {renderQuestionInput(q)}
              </div>
            );
          })}

          <div className="pt-4">
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98] w-full sm:w-auto cursor-pointer"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Response"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

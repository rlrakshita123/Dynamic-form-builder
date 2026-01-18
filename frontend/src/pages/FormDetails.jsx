import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axios";

/*
  WHAT THIS FILE DOES:
  1. Fetches and displays form metadata and question structure.
  2. Allows form owner to generate a public shareable form link.
  3. Displays and copies the public link once the form is public.
  4. Provides navigation to fill form internally or view responses.
*/

export default function FormDetails() {
  const { formId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [publicLink, setPublicLink] = useState("");
  const [loadingLink, setLoadingLink] = useState(false);

  useEffect(() => {
    async function fetchForm() {
      try {
        const res = await axios.get(`/forms/${formId}`);
        setForm(res.data.form);

        // If already public, build link
        if (res.data.form.publicSlug) {
          setPublicLink(
            `${window.location.origin}/public/forms/${res.data.form.publicSlug}`
          );
        }
      } catch (err) {
        console.error("Error loading form:", err);
      }
    }
    fetchForm();
  }, [formId]);

  const makeFormPublic = async () => {
    try {
      setLoadingLink(true);
      const res = await axios.post(`/forms/${formId}/public`);
      const slug = res.data.slug;

      const link = `${window.location.origin}/public/forms/${slug}`;
      setPublicLink(link);
    } catch (err) {
      console.error("Error making form public:", err);
      alert("Failed to generate public link");
    } finally {
      setLoadingLink(false);
    }
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(publicLink);
    alert("Public link copied!");
  };

  if (!form) {
    return (
      <div className="container">
        <p className="page-subtitle">Loading form details…</p>
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

      {/* QUESTIONS */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <h2 style={{ marginBottom: "16px" }}>Questions</h2>
        <ul style={{ paddingLeft: "20px" }}>
          {form.questions.map((q, index) => (
            <li key={index} style={{ marginBottom: "8px" }}>
              <strong>{q.label}</strong> ({q.type})
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

      {/* PUBLIC LINK SECTION */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <h3 style={{ marginBottom: "10px" }}>Public Share Link</h3>

        {!publicLink ? (
          <button
            className="btn btn-primary"
            onClick={makeFormPublic}
            disabled={loadingLink}
          >
            {loadingLink ? "Generating..." : "Make Form Public"}
          </button>
        ) : (
          <>
            <input
              className="input"
              value={publicLink}
              readOnly
              style={{ marginBottom: "10px" }}
            />
            <button
              className="btn btn-secondary"
              onClick={copyLink}
            >
              Copy Link
            </button>
          </>
        )}
      </div>

      {/* ACTION BUTTONS */}
      <div style={{ display: "flex", gap: "12px" }}>
        <button
          className="btn btn-primary"
          onClick={() => navigate(`/fill/${form._id}`)}
        >
          Fill Internally
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

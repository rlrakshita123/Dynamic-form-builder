import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";

/*
  WHAT THIS FILE DOES:
  1. Fetches all publicly available forms from the backend.
  2. Displays public forms in a clean, card-based layout.
  3. Allows logged-out users to open and fill forms.
  4. Acts as the discovery page for public forms.
*/

export default function ExplorePublicForms() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPublicForms() {
      try {
        const res = await axios.get("/public/forms");
        setForms(res.data.forms || []);
      } catch (err) {
        console.error("Failed to load public forms", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPublicForms();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <p className="page-subtitle">Loading public forms…</p>
      </div>
    );
  }

  return (
    <div className="container">
      {/* PAGE HEADER */}
      <div style={{ marginBottom: "32px" }}>
        <h1 className="page-title">Explore Public Forms</h1>
        <p className="page-subtitle">
          Browse and fill forms shared publicly — no login required.
        </p>
      </div>

      {/* EMPTY STATE */}
      {forms.length === 0 && (
        <div className="card">
          <p className="page-subtitle">
            No public forms available right now.
          </p>
        </div>
      )}

      {/* FORMS GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "24px",
        }}
      >
        {forms.map((form) => (
          <div key={form._id} className="card">
            <h3 style={{ marginBottom: "8px" }}>{form.title}</h3>

            <p className="page-subtitle" style={{ marginBottom: "16px" }}>
              Created on{" "}
              {new Date(form.createdAt).toLocaleDateString()}
            </p>

            <button
              className="btn btn-primary"
              onClick={() =>
                navigate(`/public/forms/${form.publicSlug}`)
              }
            >
              Fill Form
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

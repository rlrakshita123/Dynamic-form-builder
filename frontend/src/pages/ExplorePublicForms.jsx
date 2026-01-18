import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../utils/axios";

/*
  WHAT THIS FILE DOES:
  1. Fetches all publicly available forms from the backend.
  2. Displays public forms in a clean card-based layout.
  3. Allows unauthenticated users to open and fill public forms.
  4. Acts as the discovery page for non-logged-in users.
*/

export default function ExplorePublicForms() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPublicForms() {
      try {
        const res = await axios.get("/public/forms");
        setForms(res.data.forms || []);
      } catch (err) {
        console.error("Error fetching public forms:", err);
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
      {forms.length === 0 ? (
        <div className="card">
          <p className="page-subtitle">
            No public forms available at the moment.
          </p>
        </div>
      ) : (
        /* FORMS GRID */
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
          }}
        >
          {forms.map((form) => (
            <div key={form._id} className="card">
              <h3 style={{ marginBottom: "8px" }}>{form.title}</h3>

              {form.description && (
                <p
                  className="page-subtitle"
                  style={{ marginBottom: "16px" }}
                >
                  {form.description}
                </p>
              )}

              <Link
                to={`/public/forms/${form.publicSlug}`}
                className="btn btn-primary"
              >
                Fill Form
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

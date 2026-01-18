import { useEffect, useState } from "react";
import axios from "../utils/axios";
import { Link } from "react-router-dom";

/*
  FormsList Page Responsibilities:
  1. Fetches and displays all forms created by the logged-in user.
  2. Provides a dashboard-style overview of existing forms.
  3. Allows users to navigate to individual form details and responses.
  4. Serves as the primary entry point to create new forms.
*/

export default function FormsList() {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    async function fetchForms() {
      try {
        const res = await axios.get("/forms", { withCredentials: true });
        setForms(res.data.forms);
      } catch (err) {
        console.error("Error loading forms:", err);
      }
    }

    fetchForms();
  }, []);

  return (
    <div className="container">
      {/* PAGE HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
        }}
      >
        <div>
          <h1 className="page-title">Your Forms</h1>
          <p className="page-subtitle">
            Manage, view responses, and analyze your forms.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => (window.location.href = "/builder")}
        >
          + Create New Form
        </button>
      </div>

      {/* EMPTY STATE */}
      {forms.length === 0 ? (
        <div className="card">
          <p className="page-subtitle">
            You haven’t created any forms yet.
          </p>
        </div>
      ) : (
        /* FORMS GRID */
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {forms.map((form) => (
            <div key={form._id} className="card">
              <h3 style={{ marginBottom: "8px" }}>{form.title}</h3>

              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "14px",
                  marginBottom: "16px",
                }}
              >
                Airtable Base: {form.baseId}
              </p>

              <Link
                to={`/forms/${form._id}`}
                className="btn btn-secondary"
                style={{ display: "inline-block" }}
              >
                View Form
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

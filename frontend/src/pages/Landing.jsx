import React from "react";

/*
  Landing Page Responsibilities:
  1. Acts as the entry point and first impression of the application.
  2. Presents the core value proposition of the FormForge platform.
  3. Provides Google OAuth-based entry for login and registration.
  4. Highlights key features like dynamic forms and Airtable integration.
*/

export default function Landing() {
  const oauthUrl = "https://dynamic-form-builder-0dnd.onrender.com/auth/google";

  return (
    <div className="container">
      {/* HERO CARD */}
      <div
        className="card"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <h1 className="page-title">FormForge</h1>

        <p className="page-subtitle">
          Create, share and analyze forms — auto-sync to Airtable.
        </p>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button
            className="btn btn-primary"
            onClick={() => (window.location.href = oauthUrl)}
          >
            Continue with Google
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => (window.location.href = oauthUrl)}
          >
            Register with Google
          </button>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div
        style={{
          marginTop: "56px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "24px",
          maxWidth: "1100px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <div className="card">
          <h3 style={{ marginBottom: "10px" }}>🧩 Dynamic Form Builder</h3>
          <p className="page-subtitle">
            Build fully custom forms with text, number, dropdowns, and more —
            without writing code.
          </p>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: "10px" }}>🔐 Secure Authentication</h3>
          <p className="page-subtitle">
            Google OAuth-based login ensures secure and seamless user access.
          </p>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: "10px" }}>📊 Airtable Integration</h3>
          <p className="page-subtitle">
            Automatically sync every form response to Airtable in real-time for
            easy tracking and analysis.
          </p>
        </div>
      </div>

      {/* FOOTER NOTE */}
      <div
        style={{
          marginTop: "72px",
          textAlign: "center",
          color: "var(--text-muted)",
          fontSize: "14px",
        }}
      >
        Full-stack Form Builder built with React, Node.js, MongoDB, and Airtable
        API.
      </div>
    </div>
  );
}

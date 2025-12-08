
import React from "react";

export default function Landing() {
  const oauthUrl = "http://localhost:5000/auth/google";

  return (
    <div style={{ padding: 40, color: "white", maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontSize: 48, marginBottom: 8 }}>FormForge</h1>
      <p style={{ fontSize: 18, marginBottom: 24 }}>
        Create, share and analyze forms — auto-sync to Airtable.
      </p>

      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={() => (window.location.href = oauthUrl)}
          style={{
            padding: "12px 18px",
            fontSize: 16,
            borderRadius: 8,
            cursor: "pointer",
            background: "#4285F4",
            color: "white",
            border: "none",
          }}
        >
          Continue with Google
        </button>

        <button
          onClick={() => (window.location.href = oauthUrl)}
          style={{
            padding: "12px 18px",
            fontSize: 16,
            borderRadius: 8,
            cursor: "pointer",
            background: "#34A853",
            color: "white",
            border: "none",
          }}
        >
          Register with Google
        </button>
      </div>

      <div style={{ marginTop: 24, color: "#bbb" }}>
        <p style={{ margin: 0 }}>Don’t want Google? You can still use the existing email login on /auth page.</p>
      </div>

      <style>
        {`
          body {
            background: linear-gradient(135deg, #1c1c1c, #2a2a2a);
            font-family: 'Inter', sans-serif;
          }

          h1 {
            font-weight: 700;
            letter-spacing: 1px;
          }

          p {
            line-height: 1.5;
          }

          button:hover {
            opacity: 0.9;
            transform: translateY(-2px);
            transition: 0.2s ease-in-out;
          }

          button:active {
            transform: scale(0.97);
          }

          div {
            animation: fadeIn 0.6s ease;
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




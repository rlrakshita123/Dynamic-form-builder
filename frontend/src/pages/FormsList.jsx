import { useEffect, useState } from "react";
import axios from "../utils/axios";
import { Link } from "react-router-dom";

export default function FormsList() {

  const [forms, setForms] = useState([]);

  useEffect(() => {
    async function fetchForms() {
      try {
        const res = await axios.get("/forms", { withCredentials: true });
        console.log("Loaded forms:", res.data.forms);
        setForms(res.data.forms);
      } catch (err) {
        console.error("Error loading forms:", err);
      }
    }

    fetchForms();
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>Your Forms</h1>

       <button
      onClick={() => (window.location.href = "/builder")}
      style={{
        padding: "10px 20px",
        backgroundColor: "#4f46e5",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        marginBottom: "20px",
        fontSize: "16px",
      }}
    >
      + Create New Form
    </button>

      {forms.length === 0 ? (
        <p>No forms found.</p>
      ) : (
        <ul>
          {forms.map((f) => (
            <li key={f._id}>
              <Link to={`/forms/${f._id}`} style={{ color: "white" }}>
                <strong>{f.title}</strong>
              </Link>
              — {f.baseId}
            </li>
          ))}
        </ul>
      )}

      <style>
        {`
          body {
            background: #111;
            font-family: 'Inter', sans-serif;
            color: #fff;
          }

          h1 {
            font-size: 36px;
            font-weight: 700;
            margin-bottom: 20px;
          }

          /* Create button */
          button[style*="Create New Form"] {
            background: #4f46e5 !important;
            border-radius: 8px !important;
            padding: 12px 22px !important;
            font-size: 16px !important;
            transition: 0.2s ease;
          }

          button:hover {
            transform: translateY(-2px);
            opacity: 0.9;
          }

          /* Forms list */
          ul {
            list-style: none;
            padding: 0;
            margin-top: 15px;
          }

          li {
            background: #1a1a1a;
            padding: 12px 18px;
            border-radius: 8px;
            margin-bottom: 12px;
            border: 1px solid #333;
            transition: 0.2s ease;
          }

          li:hover {
            border-color: #4f46e5;
            transform: translateY(-2px);
          }

          a {
            color: #a5b4fc !important;
            text-decoration: none;
            font-weight: 600;
            font-size: 17px;
          }

          a:hover {
            text-decoration: underline;
          }

          p {
            color: #ccc;
          }

          div, li {
            animation: fadeIn 0.5s ease;
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

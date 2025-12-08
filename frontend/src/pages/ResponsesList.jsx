import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/axios";

export default function ResponsesList() {
  const { formId } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await axios.get(`/forms/${formId}/responses`);
        setData(res.data);
      } catch (err) {
        console.error("Error loading responses:", err);
        alert("Could not load responses");
      }
    }
    loadData();
  }, [formId]);

  if (!data) return <h2 style={{ color: "white" }}>Loading responses...</h2>;

  return (
    <div style={{ padding: 40, color: "white" }}>
      <h1>Responses for {data.form.title}</h1>
      <p>Total responses: {data.responses.length}</p>
      <div style={{ marginTop: 20, marginBottom: 20 }}>
  <button
    onClick={() => (window.location.href = "/forms")}
    style={{
      padding: "10px 20px",
      background: "#4f46e5",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      marginRight: "10px",
    }}
  >
    ⬅ Back to All Forms
  </button>

  <button
    onClick={() => {
      axios.get("/auth/logout", { withCredentials: true });
      window.location.href = "/";
    }}
    style={{
      padding: "10px 20px",
      background: "#dc2626",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
    }}
  >
    Logout
  </button>
</div>


      <div style={{ marginTop: 30 }}>
  <table
    style={{
      width: "100%",
      borderCollapse: "collapse",
      background: "#222",
      color: "white",
    }}
  >
    <thead>
      <tr>
        {data.form.questions.map((q) => (
          <th
            key={q._id}
            style={{
              borderBottom: "1px solid #555",
              padding: "10px",
              textAlign: "left",
            }}
          >
            {q.label}
          </th>
        ))}
      </tr>
    </thead>

    <tbody>
      {data.responses.map((resp) => (
        <tr key={resp._id}>
          {data.form.questions.map((q) => {
            const ans = resp.answers.find(
              (a) => a.questionId === q._id
            );

            return (
              <td
                key={q._id}
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #444",
                }}
              >
                {Array.isArray(ans?.value)
                  ? ans.value.join(", ")
                  : ans?.value || "-"}
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  </table>
  <style>
    {`
      body {
        background: #111;
        font-family: 'Inter', sans-serif;
        color: #fff;
      }

      h1 {
        font-size: 34px;
        font-weight: 700;
        margin-bottom: 10px;
      }

      p {
        color: #ccc;
        margin-bottom: 20px;
      }

      /* Table container fade-in */
      div[style*="marginTop"] {
        animation: fadeIn 0.5s ease;
      }

      /* Table styling */
      table {
        background: #1a1a1a !important;
        border: 1px solid #333;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 0 6px rgba(255,255,255,0.05);
      }

      th {
        background: #2a2a2a;
        padding: 12px;
        font-size: 15px;
        color: #e2e2e2;
        border-bottom: 1px solid #444;
        text-align: left;
      }

      td {
        padding: 12px;
        font-size: 14px;
        color: #ddd;
        border-bottom: 1px solid #333;
      }

      tr:hover td {
        background: #242424;
      }

      /* Make header stick on scroll */
      thead th {
        position: sticky;
        top: 0;
        z-index: 2;
      }

      /* Smooth fade-in animation */
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      button {
        transition: 0.2s ease;
      }

      button:hover {
        transform: translateY(-2px);
        opacity: 0.9;
      }
    `}
    </style>

</div>

    </div>
  );
}

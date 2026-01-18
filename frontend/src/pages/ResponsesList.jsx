import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/axios";

/*
  ResponsesList Page Responsibilities:
  1. Fetches and displays all responses submitted for a specific form.
  2. Presents responses in a structured, tabular dashboard format.
  3. Allows navigation back to the forms dashboard and user logout.
  4. Serves as the foundation for future analytics and insights features.
*/

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

  if (!data) {
    return (
      <div className="container">
        <p className="page-subtitle">Loading responses…</p>
      </div>
    );
  }

  return (
    <div className="container">
      {/* PAGE HEADER */}
      <div style={{ marginBottom: "24px" }}>
        <h1 className="page-title">
          Responses for {data.form.title}
        </h1>
        <p className="page-subtitle">
          Total responses: {data.responses.length}
        </p>
      </div>

      {/* ACTION BUTTONS */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
        <button
          className="btn btn-secondary"
          onClick={() => (window.location.href = "/forms")}
        >
          ⬅ Back to All Forms
        </button>

        <button
          className="btn btn-danger"
          onClick={() => {
            axios.get("/auth/logout", { withCredentials: true });
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </div>

      {/* RESPONSES TABLE */}
      <div className="card" style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              {data.form.questions.map((q) => (
                <th
                  key={q._id}
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    borderBottom: "1px solid var(--border-color)",
                    color: "var(--text-secondary)",
                    fontWeight: "600",
                    background: "var(--bg-secondary)",
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
                        padding: "12px",
                        borderBottom:
                          "1px solid var(--border-color)",
                        color: "var(--text-primary)",
                        fontSize: "14px",
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
      </div>
    </div>
  );
}

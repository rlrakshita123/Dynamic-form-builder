import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
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

  const handleLogout = async () => {
    try {
      await axios.get("/auth/logout", { withCredentials: true });
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 w-full space-y-6">
        <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-8 h-60 animate-pulse space-y-4">
          <div className="h-6 w-1/3 bg-slate-800 rounded" />
          <div className="h-4 w-2/3 bg-slate-800 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 w-full space-y-8 animate-fadeIn">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-6">
        <div>
          <button
            onClick={() => navigate(`/forms/${formId}`)}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium mb-2 cursor-pointer"
          >
            ← Back to Form Config
          </button>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Submissions for {data.form.title}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Total recorded entries: <span className="text-indigo-400 font-semibold">{data.responses.length}</span>
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">
          <button
            className="px-4 py-2 border border-slate-800 hover:bg-slate-900 text-slate-300 text-xs font-semibold rounded-lg transition-all active:scale-[0.98] cursor-pointer"
            onClick={() => navigate("/forms")}
          >
            All Dashboards
          </button>

          <button
            className="px-4 py-2 bg-rose-950/40 border border-rose-900/30 text-rose-400 text-xs font-semibold rounded-lg hover:bg-rose-900/20 transition-all cursor-pointer"
            onClick={handleLogout}
          >
            Logout Creator
          </button>
        </div>
      </div>

      {/* RESPONSES TABLE CONTAINER */}
      {data.responses.length === 0 ? (
        <div className="bg-slate-900/10 border border-dashed border-slate-850 rounded-2xl py-20 text-center text-slate-500">
          No responses submitted for this form yet. Share the public link to gather entries!
        </div>
      ) : (
        <div className="bg-slate-900/40 border border-slate-900 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-950 bg-slate-900/50">
                  {data.form.questions.map((q) => (
                    <th
                      key={q._id}
                      className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap"
                    >
                      {q.label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-950/60 bg-slate-950/20">
                {data.responses.map((resp) => (
                  <tr key={resp._id} className="hover:bg-slate-900/25 transition-colors">
                    {data.form.questions.map((q) => {
                      const ans = resp.answers.find(
                        (a) => a.questionId === q._id
                      );

                      return (
                        <td
                          key={q._id}
                          className="px-6 py-4 text-sm text-slate-300 whitespace-pre-wrap"
                        >
                          {Array.isArray(ans?.value) ? (
                            <div className="flex flex-wrap gap-1.5">
                              {ans.value.map((v) => (
                                <span key={v} className="px-2 py-0.5 bg-slate-900 text-indigo-400 rounded text-xs border border-slate-850">
                                  {v}
                                </span>
                              ))}
                            </div>
                          ) : ans?.value !== undefined && ans?.value !== "" ? (
                            ans.value.toString()
                          ) : (
                            <span className="text-slate-600 font-mono">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

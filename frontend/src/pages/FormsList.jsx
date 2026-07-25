import { useEffect, useState } from "react";
import axios from "../utils/axios";
import { Link, useNavigate } from "react-router-dom";

/*
  FormsList Page Responsibilities:
  1. Fetches and displays all forms created by the logged-in user.
  2. Provides a dashboard-style overview of existing forms.
  3. Allows users to navigate to individual form details and responses.
  4. Serves as the primary entry point to create new forms.
*/

export default function FormsList() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchForms() {
      try {
        const res = await axios.get("/forms", { withCredentials: true });
        setForms(res.data.forms || []);
      } catch (err) {
        console.error("Error loading forms:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchForms();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 w-full space-y-10">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Your Forms Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your dynamic structures, distribute share links, and inspect response streams.
          </p>
        </div>

        <button
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium text-sm transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-indigo-600/20 active:scale-95 cursor-pointer"
          onClick={() => navigate("/builder")}
        >
          + Create New Form
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 h-40 animate-pulse space-y-4">
              <div className="h-6 w-2/3 bg-slate-800 rounded" />
              <div className="h-4 w-1/2 bg-slate-800 rounded" />
              <div className="h-9 w-24 bg-slate-800 rounded mt-4" />
            </div>
          ))}
        </div>
      ) : forms.length === 0 ? (
        /* EMPTY STATE */
        <div className="bg-slate-900/20 border border-dashed border-slate-800 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-6">
          <div className="w-16 h-16 bg-slate-900/60 rounded-full flex items-center justify-center text-2xl mx-auto border border-slate-800">
            📭
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-white">No Forms Created</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Get started by designing your first dynamic questionnaire and automatically linking it with an Airtable base.
            </p>
          </div>
          <button
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
            onClick={() => navigate("/builder")}
          >
            Create Form Now
          </button>
        </div>
      ) : (
        /* FORMS GRID */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <div
              key={form._id}
              className="group bg-slate-900/40 border border-slate-900 hover:border-slate-800/80 rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1 shadow-lg hover:shadow-indigo-500/5 relative overflow-hidden"
            >
              {/* Card gradient glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors" />

              <h3 className="text-lg font-bold text-white leading-snug group-hover:text-indigo-400 transition-colors truncate">
                {form.title}
              </h3>

              <div className="space-y-1 mt-2 mb-6">
                <p className="text-xs text-slate-500 font-mono">
                  Base ID: <span className="text-slate-400">{form.baseId}</span>
                </p>
                <p className="text-xs text-slate-500 font-mono">
                  Questions: <span className="text-slate-400">{form.questions?.length || 0} fields</span>
                </p>
              </div>

              <Link
                to={`/forms/${form._id}`}
                className="inline-flex items-center justify-center px-4 py-2 border border-slate-800 hover:bg-slate-900 text-slate-200 text-xs font-semibold rounded-lg transition-all active:scale-[0.98] w-full"
              >
                Configure & View
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

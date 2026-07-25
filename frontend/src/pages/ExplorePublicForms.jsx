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
      <div className="max-w-7xl mx-auto px-6 py-16 w-full space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 h-40 space-y-4">
              <div className="h-6 w-2/3 bg-slate-800 rounded" />
              <div className="h-4 w-1/3 bg-slate-800 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 w-full space-y-10 animate-fadeIn">
      {/* PAGE HEADER */}
      <div className="border-b border-slate-900 pb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Explore Public Forms</h1>
        <p className="text-sm text-slate-400 mt-1">
          Browse, discover, and fill forms shared by the community — no creator login required.
        </p>
      </div>

      {/* EMPTY STATE */}
      {forms.length === 0 ? (
        <div className="bg-slate-900/20 border border-dashed border-slate-800 rounded-2xl p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 bg-slate-900/60 rounded-full flex items-center justify-center text-xl mx-auto border border-slate-800">
            🔭
          </div>
          <p className="text-sm text-slate-400">
            No public forms are currently published for discovery.
          </p>
        </div>
      ) : (
        /* FORMS GRID */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <div
              key={form._id}
              className="group bg-slate-900/40 border border-slate-900 hover:border-slate-800/80 rounded-2xl p-6 transition-all duration-200 hover:-translate-y-0.5 shadow-lg relative overflow-hidden"
            >
              <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors leading-snug truncate">
                {form.title}
              </h3>

              <div className="mt-2 mb-6">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] bg-slate-950 border border-slate-850 text-slate-400 font-mono">
                  Created {new Date(form.createdAt).toLocaleDateString()}
                </span>
              </div>

              <button
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-all active:scale-[0.98] cursor-pointer"
                onClick={() => navigate(`/public/forms/${form.publicSlug}`)}
              >
                Fill Form Profile
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

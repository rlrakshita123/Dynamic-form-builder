import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axios";

/*
  WHAT THIS FILE DOES:
  1. Fetches and displays form metadata and question structure.
  2. Allows form owner to generate a public shareable form link.
  3. Displays and copies the public link once the form is public.
  4. Provides navigation to fill form internally or view responses.
*/

export default function FormDetails() {
  const { formId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [publicLink, setPublicLink] = useState("");
  const [loadingLink, setLoadingLink] = useState(false);

  useEffect(() => {
    async function fetchForm() {
      try {
        const res = await axios.get(`/forms/${formId}`);
        setForm(res.data.form);

        // If already public, build link
        if (res.data.form.publicSlug) {
          setPublicLink(
            `${window.location.origin}/public/forms/${res.data.form.publicSlug}`
          );
        }
      } catch (err) {
        console.error("Error loading form:", err);
      }
    }
    fetchForm();
  }, [formId]);

  const makeFormPublic = async () => {
    try {
      setLoadingLink(true);
      const res = await axios.post(`/forms/${formId}/public`);
      // FIX: The backend returns res.data.publicUrl instead of res.data.slug
      const publicUrl = res.data.publicUrl; // e.g. "/public/forms/xxxxxxxx"

      const link = `${window.location.origin}${publicUrl}`;
      setPublicLink(link);
    } catch (err) {
      console.error("Error making form public:", err);
      alert("Failed to generate public link");
    } finally {
      setLoadingLink(false);
    }
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(publicLink);
    alert("Public link copied!");
  };

  if (!form) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 w-full space-y-6">
        <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-8 h-60 animate-pulse space-y-4">
          <div className="h-6 w-1/3 bg-slate-800 rounded" />
          <div className="h-4 w-2/3 bg-slate-800 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 w-full space-y-8 animate-fadeIn">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-6">
        <div>
          <button
            onClick={() => navigate("/forms")}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium mb-2 cursor-pointer"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-white tracking-tight">{form.title}</h1>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Base: <span className="text-slate-400">{form.baseId}</span> • Table: <span className="text-slate-400">{form.tableId}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* LEFT / CENTER: QUESTIONS DETAILS */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
              📝 Form Schema Fields
            </h2>
            <div className="divide-y divide-slate-900">
              {form.questions.map((q, index) => (
                <div key={index} className="py-3 flex justify-between items-center text-sm first:pt-0 last:pb-0">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-slate-200">{q.label}</p>
                    <p className="text-xs text-slate-500 font-mono">Key: {q.questionKey}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-slate-950 border border-slate-850 rounded text-slate-400 text-xs font-mono font-medium">
                      {q.type.replace("_", " ")}
                    </span>
                    {q.required && (
                      <span className="text-[10px] bg-rose-500/10 border border-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                        Required
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: OPERATIONS SIDEBAR */}
        <div className="space-y-6">
          {/* PUBLIC LINK CONTROL */}
          <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-300">Public Access</h3>
              <p className="text-xs text-slate-500 mt-1">Make your form shareable to anonymous users.</p>
            </div>

            {!publicLink ? (
              <button
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98] cursor-pointer"
                onClick={makeFormPublic}
                disabled={loadingLink}
              >
                {loadingLink ? "Generating Link..." : "Make Form Public"}
              </button>
            ) : (
              <div className="space-y-2">
                <input
                  className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-xs text-indigo-400 font-mono focus:outline-none select-all"
                  value={publicLink}
                  readOnly
                />
                <button
                  className="w-full py-2.5 border border-slate-800 hover:bg-slate-900 text-slate-200 rounded-lg text-sm font-semibold transition-all cursor-pointer"
                  onClick={copyLink}
                >
                  Copy Share Link
                </button>
              </div>
            )}
          </div>

          {/* ACTIONS WIDGET */}
          <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 space-y-3">
            <h3 className="text-sm font-semibold text-slate-300 mb-2">Form Actions</h3>
            
            <button
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 rounded-lg text-sm font-semibold transition-all active:scale-[0.98] cursor-pointer"
              onClick={() => navigate(`/fill/${form._id}`)}
            >
              Fill Form Internally
            </button>

            <button
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-all active:scale-[0.98] cursor-pointer"
              onClick={() => navigate(`/forms/${form._id}/responses`)}
            >
              Inspect Submissions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

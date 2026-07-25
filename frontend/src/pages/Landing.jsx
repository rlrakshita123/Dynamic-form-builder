import React, { useState } from "react";

/*
  Landing Page Responsibilities:
  1. Acts as the entry point and first impression of the application.
  2. Presents the core value proposition of the FormForge platform.
  3. Provides Google OAuth-based entry for login and registration.
  4. Highlights key features like dynamic forms and Airtable integration.
  5. Includes an interactive live form demo to wow users.
*/

export default function Landing() {
  const apiBaseUrl = import.meta.env.VITE_Api_Url || "https://dynamic-form-builder-0dnd.onrender.com";
  const oauthUrl = `${apiBaseUrl}/auth/google`;

  // Live Demo State
  const [demoName, setDemoName] = useState("");
  const [demoRating, setDemoRating] = useState("5");
  const [demoFeedback, setDemoFeedback] = useState("");
  const [demoSubmitted, setDemoSubmitted] = useState(false);

  return (
    <div className="relative overflow-hidden py-20 px-6 sm:py-28 lg:px-8">
      {/* Background Gradients */}
      <div className="absolute inset-0 -z-10 bg-slate-950" />
      <div className="absolute top-0 left-1/4 -z-10 h-[400px] w-[600px] rounded-full bg-indigo-500/10 blur-[100px]" />
      <div className="absolute bottom-10 right-1/4 -z-10 h-[300px] w-[500px] rounded-full bg-purple-500/10 blur-[100px]" />

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        {/* HERO LEFT - Value Prop */}
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            ✨ Sync directly to Airtable
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Design Forms.<br />
            Collect Data.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Automate Workflows.
            </span>
          </h1>

          <p className="text-lg text-slate-400 leading-relaxed max-w-lg mx-auto lg:mx-0">
            FormForge is a full-stack dynamic form builder. Create customizable inputs, share secure public links, and watch response records automatically stream into Airtable databases in real-time.
          </p>

          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            <a
              href={oauthUrl}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-indigo-600/30 transition-all duration-200 hover:-translate-y-0.5 active:scale-95 text-center"
            >
              Get Started Free
            </a>
            <a
              href="#demo"
              className="px-6 py-3 border border-slate-800 hover:bg-slate-900/60 text-slate-300 rounded-xl font-semibold transition-all duration-200 text-center"
            >
              Try Live Demo
            </a>
          </div>
        </div>

        {/* HERO RIGHT - Interactive Live Demo */}
        <div id="demo" className="w-full max-w-md lg:w-auto bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-2xl relative">
          <div className="absolute -top-3 -right-3 px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full text-xs font-bold text-white shadow-lg">
            LIVE PREVIEW
          </div>
          
          {!demoSubmitted ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white">Event Feedback</h3>
                <p className="text-xs text-slate-400 mt-1">See how conditional fields and layouts update instantly.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Your Name</label>
                  <input
                    type="text"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="Enter name"
                    value={demoName}
                    onChange={(e) => setDemoName(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Overall Experience</label>
                  <select
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    value={demoRating}
                    onChange={(e) => setDemoRating(e.target.value)}
                  >
                    <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                    <option value="4">⭐⭐⭐⭐ Good</option>
                    <option value="3">⭐⭐⭐ Neutral</option>
                    <option value="2">⭐⭐ Bad</option>
                  </select>
                </div>

                {/* Conditional Visibility Field */}
                {parseInt(demoRating) <= 3 && (
                  <div className="space-y-1.5 animate-fadeIn">
                    <label className="text-xs font-semibold text-slate-300">How can we improve?</label>
                    <textarea
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors min-h-[70px]"
                      placeholder="Share your suggestions..."
                      value={demoFeedback}
                      onChange={(e) => setDemoFeedback(e.target.value)}
                    />
                  </div>
                )}
              </div>

              <button
                onClick={() => setDemoSubmitted(true)}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-indigo-600/10 active:scale-[0.98]"
              >
                Submit Demo Response
              </button>
            </div>
          ) : (
            <div className="text-center py-10 space-y-4">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400 text-xl font-bold">
                ✓
              </div>
              <h3 className="text-lg font-bold text-white">Response Mocked!</h3>
              <p className="text-sm text-slate-400">
                In a live form, this submission would instantly append a new row inside your linked Airtable sheet:
              </p>
              
              <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-3 text-left font-mono text-[11px] text-slate-300 space-y-1">
                <div className="text-indigo-400">// Airtable Record Payload</div>
                <div>Name: "{demoName || "Anonymous"}"</div>
                <div>Rating: {demoRating} Star(s)</div>
                {parseInt(demoRating) <= 3 && <div>Feedback: "{demoFeedback || "None"}"</div>}
              </div>

              <button
                onClick={() => {
                  setDemoSubmitted(false);
                  setDemoName("");
                  setDemoFeedback("");
                  setDemoRating("5");
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300 underline font-medium"
              >
                Reset Demo Form
              </button>
            </div>
          )}
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="max-w-6xl mx-auto mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-2xl hover:border-slate-800 transition-colors group">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 text-xl mb-4 group-hover:scale-110 transition-transform">
            🧩
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Dynamic Form Builder</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Build customized question structures (short text, numbers, custom dropdown choices, checkboxes, dates) through an intuitive graphical dashboard.
          </p>
        </div>

        <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-2xl hover:border-slate-800 transition-colors group">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 text-xl mb-4 group-hover:scale-110 transition-transform">
            🔐
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Secure Authentication</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Google OAuth 2.0 integration secures your creator account. Easily authorize credentials, manage form dashboards, and verify submissions.
          </p>
        </div>

        <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-2xl hover:border-slate-800 transition-colors group">
          <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-400 text-xl mb-4 group-hover:scale-110 transition-transform">
            📊
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Airtable Sync</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Every submission triggers a background sync to your Airtable sheet, mapping fields dynamically by ID. Keep database systems up-to-date automatically.
          </p>
        </div>
      </div>
    </div>
  );
}

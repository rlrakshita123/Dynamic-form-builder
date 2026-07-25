import { Link } from "react-router-dom";

/*
  WHAT THIS FILE DOES:
  1. Provides a rich, multi-section footer across all pages.
  2. Adds navigation, product context, and trust-building content.
  3. Makes the application feel complete and production-ready.
  4. Acts as a strong visual and informational closure for the UI.
*/

export default function Footer() {
  return (
    <footer className="mt-auto bg-slate-950 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* BRAND / ABOUT */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-slate-100">FormForge</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Build powerful, dynamic forms and sync responses directly to
            Airtable. Designed for speed, flexibility, and real-world workflows.
          </p>
        </div>

        {/* PRODUCT */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Product</h4>
          <ul className="space-y-2">
            <li>
              <Link to="/explore" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">
                Explore Public Forms
              </Link>
            </li>
            <li>
              <Link to="/" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">
                Create Forms
              </Link>
            </li>
            <li>
              <span className="text-sm text-slate-600">
                Airtable Sync
              </span>
            </li>
          </ul>
        </div>

        {/* RESOURCES */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Resources</h4>
          <ul className="space-y-2">
            <li>
              <span className="text-sm text-slate-600 cursor-not-allowed">Documentation</span>
            </li>
            <li>
              <span className="text-sm text-slate-600 cursor-not-allowed">API Reference</span>
            </li>
            <li>
              <span className="text-sm text-slate-600 cursor-not-allowed">Support</span>
            </li>
          </ul>
        </div>

        {/* TECH STACK */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Tech Stack</h4>
          <p className="text-sm text-slate-400 leading-relaxed">
            React • Node.js • MongoDB • Airtable API • OAuth
          </p>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} FormForge · Built for real-world use
      </div>
    </footer>
  );
}

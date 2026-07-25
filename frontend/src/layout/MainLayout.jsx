import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/*
  WHAT THIS FILE DOES:
  1. Wraps all pages with a consistent Navbar and Footer.
  2. Centralizes layout logic instead of repeating it per page.
  3. Ensures visual consistency across public and private pages.
  4. Acts as the global application shell for routing.
*/

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Global Navigation */}
      <Navbar />

      {/* Main Page Content */}
      <main className="flex-grow flex flex-col">
        {children}
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

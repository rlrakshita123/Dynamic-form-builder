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
    <>
      {/* Global Navigation */}
      <Navbar />

      {/* Main Page Content */}
      <main
        style={{
          minHeight: "calc(100vh - 140px)",
        }}
      >
        {children}
      </main>

      {/* Global Footer */}
      <Footer />
    </>
  );
}

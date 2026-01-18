import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth.jsx";
import Builder from "./pages/Builder.jsx";
import FormsList from "./pages/FormsList";
import FormDetails from "./pages/FormDetails";
import FormFill from "./pages/FormFill";
import ResponsesList from "./pages/ResponsesList";
import Landing from "./pages/Landing";
import PublicFormFill from "./pages/PublicFormFill";

/*
  WHAT THIS FILE DOES:
  1. Defines all frontend routes for the application.
  2. Separates public and authenticated page access.
  3. Enables navigation between form builder, dashboard, and fill pages.
  4. Registers the public form route using a shareable slug.
*/

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/public/forms/:slug" element={<PublicFormFill />} />

        {/* Authenticated Pages */}
        <Route path="/builder" element={<Builder />} />
        <Route path="/forms" element={<FormsList />} />
        <Route path="/forms/:formId" element={<FormDetails />} />
        <Route path="/fill/:formId" element={<FormFill />} />
        <Route path="/forms/:formId/responses" element={<ResponsesList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

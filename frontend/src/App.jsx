import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layout/MainLayout";

import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Builder from "./pages/Builder";
import FormsList from "./pages/FormsList";
import FormDetails from "./pages/FormDetails";
import FormFill from "./pages/FormFill";
import ResponsesList from "./pages/ResponsesList";
import PublicFormFill from "./pages/PublicFormFill";
import ExplorePublicForms from "./pages/ExplorePublicForms";

/*
  WHAT THIS FILE DOES:
  1. Defines all application routes using React Router.
  2. Wraps every page with the global MainLayout.
  3. Separates public, authenticated, and public-share routes cleanly.
  4. Acts as the routing backbone of the entire frontend.
*/

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          {/* Public marketing pages */}
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />

          {/* Public forms (no login required) */}
          <Route path="/public/forms/:slug" element={<PublicFormFill />} />

          {/* Authenticated app pages */}
          <Route path="/builder" element={<Builder />} />
          <Route path="/forms" element={<FormsList />} />
          <Route path="/forms/:formId" element={<FormDetails />} />
          <Route path="/fill/:formId" element={<FormFill />} />
          <Route
            path="/forms/:formId/responses"
            element={<ResponsesList />}
          />
          <Route path="/explore" element={<ExplorePublicForms />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;

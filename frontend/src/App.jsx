import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth.jsx";
import Builder from "./pages/Builder.jsx";
import FormsList from "./pages/FormsList";
import FormDetails from "./pages/FormDetails";
import FormFill from './pages/FormFill';
import ResponsesList from "./pages/ResponsesList";
import Landing from "./pages/Landing";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
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

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";


export default function FormDetails() {
  const { formId } = useParams();
  const navigate = useNavigate(); 
  const [form, setForm] = useState(null);

  useEffect(() => {
    async function fetchForm() {
      try {
        const res = await axios.get(`/forms/${formId}`);
        setForm(res.data.form);   
      } catch (err) {
        console.error("Error loading form:", err);
      }
    }
    fetchForm();
  }, [formId]);

  if (!form) return <h2>Loading...</h2>;
  if (!form.questions) return <h2>No questions found</h2>;

  return (
    <div style={{ padding: 40, color: "white" }}>
      <h1>{form.title}</h1>
      <p><b>Base ID:</b> {form.baseId}</p>
      <p><b>Table ID:</b> {form.tableId}</p>

      <h2>Questions</h2>

      <ul>
        {form.questions.map((q, index) => (
          <li key={index}>
            <b>{q.label}</b> ({q.type})
            {q.required ? " *required" : ""}
          </li>
        ))}
      </ul>

      <button
      onClick={() => navigate(`/fill/${form._id}`)}
      style={{
        padding: "10px 20px",
        background: "#4CAF50",
        color: "white",
        borderRadius: 6,
        marginBottom: 20,
      }}
    >
       Fill This Form
    </button>

    <button
      onClick={() => navigate(`/forms/${form._id}/responses`)}
      style={{
        padding: "10px 20px",
        background: "#2196F3",
        color: "white",
        borderRadius: 6,
        marginBottom: 20,
        marginLeft: 10
      }}
    >
      View Responses
    </button>

    <style>
{`
  body {
    background: #111;
    font-family: 'Inter', sans-serif;
    color: #fff;
  }

  h1 {
    font-size: 36px;
    font-weight: 700;
    margin-bottom: 10px;
  }

  h2 {
    font-size: 26px;
    margin-top: 25px;
    margin-bottom: 10px;
    color: #ddd;
  }

  p, li {
    font-size: 16px;
    color: #ccc;
  }

  ul {
    padding-left: 20px;
    margin-bottom: 20px;
  }

  li {
    margin-bottom: 8px;
  }

  
  button {
    cursor: pointer;
    border: none;
    font-size: 15px;
    padding: 10px 20px;
    transition: 0.2s ease;
  }

  button:hover {
    transform: translateY(-2px);
    opacity: 0.9;
  }

  
  button[style*="4CAF50"] {
    background: #4CAF50 !important;
    border-radius: 6px;
  }

  
  button[style*="2196F3"] {
    background: #2196F3 !important;
    border-radius: 6px;
  }

  
  div {
    animation: fadeIn 0.5s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`}
</style>



    </div>
  );
}

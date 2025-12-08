import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/axios';

export default function FormFill() {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({}); 
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    axios.get(`/forms/${formId}/fill`)
      .then(res => { if (mounted) setForm(res.data); })
      .catch(err => {
        console.error('load form error', err);
        alert('Could not load form');
      })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [formId]);

  
  const isVisible = (q) => {
    if (!q.showIf) return true;
    const { questionId, value } = q.showIf;
    return (answers[questionId] !== undefined) && (answers[questionId] === value);
  };

  const handleChange = (qid, value) => {
    setAnswers(prev => ({ ...prev, [qid]: value }));
  };

  const renderQuestion = (q) => {
    if (!isVisible(q)) return null;

    const v = answers[q._id] ?? '';

    switch (q.type) {
      case 'short_text':
        return (
          <input
            type="text"
            value={v}
            onChange={e => handleChange(q._id, e.target.value)}
          />
        );

      case 'long_text':
        return (
          <textarea
            value={v}
            onChange={e => handleChange(q._id, e.target.value)}
          />
        );

      case 'number':
        return <input type="number" value={v} onChange={e => handleChange(q._id, e.target.value)} />;
      case 'radio':
        return (q.options || []).map(opt => (
          <label key={opt}>
            <input type="radio" name={q._id} checked={v === opt} onChange={() => handleChange(q._id, opt)} />
            {opt}
          </label>
        ));
      case 'checkbox':
        
        const arr = Array.isArray(v) ? v : [];
        return (q.options || []).map(opt => (
          <label key={opt}>
            <input
              type="checkbox"
              checked={arr.includes(opt)}
              onChange={() => {
                if (arr.includes(opt)) handleChange(q._id, arr.filter(a => a !== opt));
                else handleChange(q._id, [...arr, opt]);
              }}
            />
            {opt}
          </label>
        ));
      case 'dropdown':
        return (
          <select value={v} onChange={e => handleChange(q._id, e.target.value)}>
            <option value="">Choose...</option>
            {(q.options || []).map(opt =>
              <option key={opt} value={opt}>{opt}</option>
            )}
          </select>
        );

      default:
        return <input value={v} onChange={e => handleChange(q._id, e.target.value)} />;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      
      const payload = Object.keys(answers).map(qid => ({ questionId: qid, value: answers[qid] }));
      await axios.post(`/forms/${formId}/responses`, { answers: payload });
      alert('Thanks — your response is saved.');
      window.location.href = `/forms/${formId}/responses`;
      setAnswers({}); 
    } catch (err) {
      console.error('submit error', err);
      alert('Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading form…</div>;
  if (!form) return <div>Form not found.</div>;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 16 }}>
      <h2>{form.title}</h2>
      {form.description && <p>{form.description}</p>}
      <form onSubmit={handleSubmit}>
        {(form.questions || []).map(q => (
          <div key={q._id} style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontWeight: '600' }}>{q.label}</label>
            {renderQuestion(q)}
            {q.hint && <div style={{ fontSize: 12, color: '#666' }}>{q.hint}</div>}
          </div>
        ))}
        <button type="submit" disabled={submitting}>Submit</button>
      </form>

        <style>
      {`
        body {
          background: #111;
          font-family: 'Inter', sans-serif;
          color: #fff;
        }

        h2 {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 15px;
        }

        p {
          font-size: 16px;
          color: #ccc;
          margin-bottom: 20px;
        }

        
        form {
          background: #1a1a1a;
          padding: 20px;
          border-radius: 10px;
          border: 1px solid #333;
          box-shadow: 0px 0px 6px rgba(255,255,255,0.05);
          animation: fadeIn 0.5s ease;
        }

        label {
          font-size: 15px;
          color: #ddd;
        }

        input, textarea, select {
          background: #222;
          border: 1px solid #333;
          border-radius: 6px;
          padding: 10px;
          width: 100%;
          color: white;
          margin-top: 6px;
          margin-bottom: 10px;
          outline: none;
          transition: border 0.2s ease;
        }

        textarea {
          min-height: 80px;
          resize: vertical;
        }

        input:focus, textarea:focus, select:focus {
          border-color: #4c82ff;
        }

       
        label input[type="radio"], 
        label input[type="checkbox"] {
          margin-right: 6px;
          transform: scale(1.2);
        }

        
        div[style*="#666"] {
          color: #aaa !important;
          margin-top: -4px;
        }

        
        button[type="submit"] {
          background: #4c82ff;
          border: none;
          color: white;
          padding: 12px 22px;
          font-size: 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: 0.2s ease;
          margin-top: 10px;
        }

        button[type="submit"]:hover:not(:disabled) {
          transform: translateY(-2px);
          opacity: 0.9;
        }

        button[type="submit"]:active:not(:disabled) {
          transform: scale(0.97);
        }

        button[type="submit"]:disabled {
          background: #555 !important;
          cursor: not-allowed;
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

import { useState } from "react";
import axios from "../utils/axios";

export default function Auth() {
  const [email, setEmail] = useState("");

  async function login() {
    try {
      const res = await axios.post("/auth/login", { email }, { withCredentials: true });
      console.log("Login Success:", res.data);
      window.location.href = "/forms";
    } catch (err) {
      console.error("Login failed:", err);
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Login</h2>

      <input 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter email"
        style={{ padding: 10, width: 250 }}
      />

      <br /><br />

      <button onClick={login} style={{ padding: "10px 20px" }}>
        Login
      </button>

      <style>
      {`
        body {
          background: #111;
          font-family: 'Inter', sans-serif;
          color: #fff;
        }

        h2 {
          font-size: 32px;
          font-weight: 600;
          margin-bottom: 20px;
        }

        input {
          background: #1e1e1e;
          border: 1px solid #333;
          border-radius: 6px;
          padding: 12px;
          color: white;
          outline: none;
          transition: border 0.2s ease;
        }

        input:focus {
          border-color: #4c82ff;
        }

        button {
          background: #4c82ff;
          border: none;
          border-radius: 6px;
          padding: 10px 20px;
          color: white;
          font-size: 15px;
          cursor: pointer;
          transition: 0.2s ease;
        }

        button:hover {
          background: #3a6bd8;
          transform: translateY(-2px);
        }

        button:active {
          transform: scale(0.97);
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

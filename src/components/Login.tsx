import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5252/api/user/login", {
        email,
        password
      });

      const token = response.data.token;
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (error: any) {
      alert("Giriş başarısız: " + (error.response?.data || "Hata"));
    }
  };

  return (
    <form onSubmit={handleLogin} className="p-8 max-w-md mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Giriş Yap</h2>
      <input
        type="email"
        placeholder="E-posta"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border px-4 py-2"
        required
      />
      <input
        type="password"
        placeholder="Şifre"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border px-4 py-2"
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 w-full rounded hover:bg-blue-700"
      >
        Giriş Yap
      </button>
    </form>
  );
};

export default Login;

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginEmployee = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5252/api/employee/login", {
        email,
        password
      });

      localStorage.setItem("token", response.data.token);

      // Başarılı giriş sonrası yönlendirme:
      navigate("/employee-dashboard");

    } catch (err: any) {
      alert("Giriş başarısız: " + (err.response?.data || "Hata"));
    }
  };

  return (
    <form onSubmit={handleLogin} className="max-w-md mx-auto mt-10 space-y-4">
      <h2 className="text-xl font-semibold text-center">Çalışan Girişi</h2>
      <input
        type="email"
        placeholder="E-posta"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border p-2"
        required
      />
      <input
        type="password"
        placeholder="Şifre"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border p-2"
        required
      />
      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Giriş Yap
      </button>
    </form>
  );
};

export default LoginEmployee;

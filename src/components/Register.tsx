import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5252/api/user/register", {
        email,
        username,
        password,
      });
      alert("Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz.");
      navigate("/");
    } catch (error: any) {
        console.error("Kayıt hatası:", error); // ← önemli satır
        const message =
          error.response?.data?.message ||
          JSON.stringify(error.response?.data) || // burada stringify ekledik!
          error.message ||
          "Bilinmeyen bir hata";
        alert("Kayıt başarısız: " + message);
      }
      
  };

  return (
    <form onSubmit={handleRegister} className="p-8 max-w-md mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Kayıt Ol</h2>
      <input
        type="text"
        placeholder="Kullanıcı Adı"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full border px-4 py-2"
        required
      />
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
        className="bg-green-600 text-white px-4 py-2 w-full rounded hover:bg-green-700"
      >
        Kayıt Ol
      </button>
    </form>
  );
};

export default Register;

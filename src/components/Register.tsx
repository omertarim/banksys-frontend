import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Kullanıcıyı kaydet
      await axios.post("http://localhost:5252/api/user/register", {
        fullName,
        username,
        email,
        password,
      });

      // Kayıt başarılı → giriş yapmayı dene
      try {
        const loginRes = await axios.post("http://localhost:5252/api/user/login", {
          email,
          password,
        });

        const token = loginRes.data.token;
        localStorage.setItem("token", token);
        navigate("/dashboard");
      } catch (loginErr) {
        // Giriş başarısızsa onay bekleyen kullanıcı sayfasına yönlendir
        navigate("/pending-approval");
      }
    } catch (error: any) {
      alert("Kayıt başarısız: " + (error.response?.data || "Bilinmeyen bir hata oluştu"));
    }
  };

  return (
    <div className="max-w-md w-full p-8 bg-white shadow-md rounded">
      <h2 className="text-2xl font-semibold mb-6 text-center">Kayıt Ol</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-gray-700">Ad Soyad</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Kullanıcı Adı</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">E-posta</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value.toLowerCase())}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Şifre</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Kayıt Ol
        </button>
      </form>
    </div>
  );
};

export default Register;

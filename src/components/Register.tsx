import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [fullName, setFullName] = useState(""); // ✅ Yeni eklendi
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5252/api/user/register", {
        fullName,  // ✅ Gönderilen JSON body'ye eklendi
        username,
        email,
        password,
      });

      // Otomatik login işlemi
      try {
        const response = await axios.post("http://localhost:5252/api/user/register", {
          fullName,
          username,
          email,
          password,
        });
      
        // ✅ Otomatik login denemesi:
        try {
          const loginRes = await axios.post("http://localhost:5252/api/user/login", {
            email,
            password,
          });
      
          const token = loginRes.data.token;
          localStorage.setItem("token", token);
          navigate("/dashboard");
        } catch (loginErr: any) {
          // ❌ Login başarısızsa yönlendirme yap
          navigate("/pending-approval");
        }
      
      } catch (error: any) {
        alert("Kayıt başarısız: " + (error.response?.data || "Hata"));
      }
      
    } catch (error: any) {
      alert("Kayıt başarısız: " + (error.response?.data || "Hata"));
    }
  };

  return (
    <form onSubmit={handleRegister} className="p-8 max-w-md mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Kayıt Ol</h2>

      <input
        type="text"
        placeholder="Ad Soyad"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        className="w-full border px-4 py-2"
        required
      />

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

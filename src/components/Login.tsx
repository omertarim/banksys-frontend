import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Props {
  isAdminLogin?: boolean;
}

const Login = ({ isAdminLogin = false }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5252/api/user/login", {
        email,
        password,
      });

      const token = response.data.token;
      localStorage.setItem("token", token);

      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      const isAdmin = role === "Admin";

      if (isAdminLogin && !isAdmin) {
        alert("Bu sayfaya sadece admin kullanıcılar giriş yapabilir.");
        return;
      }

      if (!isAdminLogin && isAdmin) {
        // Admin ama kullanıcı login sayfasındaysa yine giriş yapılabilir, yönlendirme yapılır
        navigate("/admin");
      } else if (isAdmin) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

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
      <p>
        Hesabınız yok mu?{" "}
        <a href="/register" style={{ color: "blue", textDecoration: "underline" }}>
          Kayıt Ol
        </a>
      </p>
      <p className="text-sm mt-2 text-right">
        <a href="/forgot-password" className="text-blue-600 hover:underline">
          Şifreni mi unuttun?
        </a>
      </p>
    </form>
  );
};

export default Login;

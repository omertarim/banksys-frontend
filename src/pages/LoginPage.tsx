import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5252/api/user/login", {
        email,
        password,
      });

      const token = response.data.token;
      localStorage.setItem("token", token);

      const decoded: any = jwtDecode(token);

      const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      if (role === "Admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (err: any) {
      alert(err.response?.data || "Giriş başarısız.");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Giriş Yap</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br />
      <input
        type="password"
        placeholder="Şifre"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br />
      <button onClick={handleLogin}>Giriş</button>
      <p>
        <a href="/forgot-password">Şifremi Unuttum</a>
        </p>
    </div>
  );
};

export default LoginPage;

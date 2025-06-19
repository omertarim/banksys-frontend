// components/ForgotPassword.tsx
import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5252/api/user/forgot-password", { email });
      setMessage("Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.");
    } catch {
      setMessage("Bir hata oluştu. E-posta adresi geçerli mi?");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-4">
      <h2 className="text-xl font-bold">Şifremi Unuttum</h2>
      <input
        type="email"
        placeholder="E-posta adresiniz"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full border px-4 py-2"
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Gönder
      </button>
      {message && <p className="text-sm mt-2">{message}</p>}
    </form>
  );
};

export default ForgotPassword;

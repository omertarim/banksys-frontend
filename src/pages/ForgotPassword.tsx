import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5252/api/user/forgot-password", { email });
      alert("Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.");
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        JSON.stringify(error.response?.data) ||
        error.message;
      alert("Hata: " + message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 max-w-md mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Şifremi Unuttum</h2>
      <input
        type="email"
        placeholder="E-posta adresiniz"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border px-4 py-2"
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 w-full rounded hover:bg-blue-700"
      >
        Gönder
      </button>
    </form>
  );
};

export default ForgotPassword;

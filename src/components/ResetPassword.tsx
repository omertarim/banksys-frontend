// components/ResetPassword.tsx
import React, { useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5252/api/user/reset-password", {
        token,
        newPassword,
      });
      setMessage("Şifreniz başarıyla güncellendi.");
    } catch (error) {
      setMessage("Şifre sıfırlanamadı. Token süresi geçmiş olabilir.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-4">
      <h2 className="text-xl font-bold">Yeni Şifre Belirle</h2>
      <input
        type="password"
        placeholder="Yeni şifre"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
        className="w-full border px-4 py-2"
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Şifreyi Sıfırla
      </button>
      {message && <p className="text-sm mt-2">{message}</p>}
    </form>
  );
};

export default ResetPassword;

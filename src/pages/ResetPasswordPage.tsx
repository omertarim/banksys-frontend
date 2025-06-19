import React, { useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5252/api/user/reset-password", {
        token,
        newPassword,
      });
      alert("Şifreniz başarıyla güncellendi.");
      navigate("/login");
    } catch (err) {
      alert("Şifre sıfırlanamadı.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-4">
      <h2 className="text-xl font-bold">Yeni Şifre Belirle</h2>
      <input
        type="password"
        placeholder="Yeni Şifre"
        className="w-full border px-3 py-2"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        Şifreyi Güncelle
      </button>
    </form>
  );
};

export default ResetPasswordPage;

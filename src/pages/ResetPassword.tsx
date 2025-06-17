import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5252/api/user/reset-password", {
        token,
        newPassword,
      });
      alert("Şifreniz başarıyla güncellendi. Giriş sayfasına yönlendiriliyorsunuz.");
      window.location.href = "/";
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        JSON.stringify(error.response?.data) ||
        error.message;
      alert("Hata: " + message);
    }
  };

  if (!token) return <p>Geçersiz bağlantı. Token bulunamadı.</p>;

  return (
    <form onSubmit={handleReset} className="p-8 max-w-md mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Yeni Şifre Belirle</h2>
      <input
        type="password"
        placeholder="Yeni Şifreniz"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full border px-4 py-2"
        required
      />
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 w-full rounded hover:bg-green-700"
      >
        Şifreyi Güncelle
      </button>
    </form>
  );
};

export default ResetPassword;

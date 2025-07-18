// src/pages/LoginPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-between p-6">
      {/* Üst kısım: Logo ve tanıtım */}
      <div className="w-full max-w-4xl text-center">
        <h1 className="text-3xl font-bold text-green-700 mt-8">BankSys'e Hoş Geldiniz</h1>
        <p className="text-gray-700 mt-2 text-lg">Güvenli ve kolay bankacılık deneyimi</p>
        <img
          src="/bank-image.png"
          alt="Bank Logo"
          className="mx-auto mt-4 max-h-72"
        />
      </div>

      {/* Giriş butonları */}
      <div className="flex flex-col items-center gap-4 mt-8">
        <button
          onClick={() => navigate("/login-customer")}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Müşteri Girişi
        </button>
        <button
          onClick={() => navigate("/login-admin")}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Admin Girişi
        </button>
        <button
          onClick={() => navigate("/login-employee")}
          className="bg-gray-700 text-white px-6 py-2 rounded hover:bg-gray-800"
        >
          Çalışan Girişi
        </button>
      </div>

      {/* Kayıt butonu */}
      <div className="mt-6">
        <button
          onClick={() => navigate("/register-customer")}
          className="text-green-700 underline hover:text-green-900"
        >
          Henüz hesabınız yok mu? Müşteri olarak kayıt olun.
        </button>
      </div>

      {/* Alt kısım: Bağlantılar */}
      <footer className="text-sm text-center text-gray-500 mt-8">
        <p className="mb-1">© 2025 BankSys</p>
        <a href="/help" className="underline">Yardım / Güvenlik</a>
      </footer>
    </div>
  );
};

export default LoginPage;

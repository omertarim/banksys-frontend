import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginCustomer = () => {
  const [customerNumber, setCustomerNumber] = useState("");
  const [citizenshipCountryId, setCitizenshipCountryId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const requestBody: any = {
      password,
    };

    if (customerNumber.trim() !== "") {
      requestBody.customerNumber = customerNumber;
    } else if (citizenshipCountryId.trim() !== "") {
      requestBody.citizenshipCountryId = Number(citizenshipCountryId);
    } else {
      alert("Lütfen müşteri numarası veya vatandaşlık ülke ID'si giriniz.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5252/api/customer/login", requestBody);
      const token = response.data.token;
      localStorage.setItem("token", token);

      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      if (role === "Customer") {
        navigate("/dashboard");
      } else {
        alert("Bu sayfaya sadece müşteri kullanıcılar giriş yapabilir.");
      }
    } catch (error: any) {
      alert("Giriş başarısız: " + (error.response?.data || "Hata"));
    }
  };

  return (
    <form onSubmit={handleLogin} className="p-8 max-w-md mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Müşteri Girişi</h2>

      <input
        type="text"
        placeholder="Müşteri Numarası (isteğe bağlı)"
        value={customerNumber}
        onChange={(e) => setCustomerNumber(e.target.value)}
        className="w-full border px-4 py-2"
      />
      <input
        type="number"
        placeholder="Citizenship Country ID (isteğe bağlı)"
        value={citizenshipCountryId}
        onChange={(e) => setCitizenshipCountryId(e.target.value)}
        className="w-full border px-4 py-2"
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
        Giriş Yap
      </button>
    </form>
  );
};

export default LoginCustomer;

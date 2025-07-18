import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CustomerRegisterForm = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    taxNumber: "",
    taxOffice: "",
    personType: "",
    citizenship: "",
    accomodation: "",
    language: "",
    recordingChannel: "Web",
    citizenshipCountryId: 0,
    accomodationCountryId: 0,
  });

  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requestBody = {
      email: form.email,
      passwordHash: form.password, // şifre burada backend'in beklediği alan ismine dönüştürülüyor
      name: form.name,
      taxNumber: form.taxNumber,
      taxOffice: form.taxOffice,
      personType: form.personType,
      citizenship: form.citizenship,
      accomodation: form.accomodation,
      language: form.language,
      recordingChannel: form.recordingChannel,
      citizenshipCountryId: form.citizenshipCountryId,
      accomodationCountryId: form.accomodationCountryId,
    };

    try {
      await axios.post("http://localhost:5252/api/customer/register", requestBody);
      alert("Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz.");
      navigate("/login-customer");
    } catch (error: any) {
      alert("Kayıt başarısız: " + (error.response?.data || "Hata"));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4 p-6">
      <h2 className="text-2xl font-bold text-center">Müşteri Kaydı</h2>

      <input name="email" type="email" placeholder="E-posta" value={form.email} onChange={handleChange} required className="w-full border p-2" />
      <input name="password" type="password" placeholder="Şifre" value={form.password} onChange={handleChange} required className="w-full border p-2" />
      <input name="name" placeholder="Ad Soyad" value={form.name} onChange={handleChange} required className="w-full border p-2" />
      <input name="taxNumber" placeholder="Vergi Numarası" value={form.taxNumber} onChange={handleChange} required className="w-full border p-2" />
      <input name="taxOffice" placeholder="Vergi Dairesi" value={form.taxOffice} onChange={handleChange} required className="w-full border p-2" />
      <input name="personType" placeholder="Kişi Tipi (Bireysel / Kurumsal)" value={form.personType} onChange={handleChange} required className="w-full border p-2" />
      <input name="citizenship" placeholder="Uyruk" value={form.citizenship} onChange={handleChange} required className="w-full border p-2" />
      <input name="accomodation" placeholder="İkamet Adresi" value={form.accomodation} onChange={handleChange} required className="w-full border p-2" />
      <input name="language" placeholder="Dil" value={form.language} onChange={handleChange} required className="w-full border p-2" />
      <input name="citizenshipCountryId" type="number" placeholder="Uyruk Ülke ID" value={form.citizenshipCountryId} onChange={handleChange} required className="w-full border p-2" />
      <input name="accomodationCountryId" type="number" placeholder="İkamet Ülke ID" value={form.accomodationCountryId} onChange={handleChange} required className="w-full border p-2" />

      <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
        Kayıt Ol
      </button>
    </form>
  );
};

export default CustomerRegisterForm;

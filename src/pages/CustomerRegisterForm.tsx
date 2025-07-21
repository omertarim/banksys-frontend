import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CustomerRegisterForm = () => {
  const [personTypes, setPersonTypes] = useState<{ id: number; name: string }[]>([]);
  const [taxOffices, setTaxOffices] = useState<{ id: number; name: string }[]>([]);
  const [citizenships, setCitizenships] = useState<{ id: number; name: string }[]>([]);
  const [accomodations, setAccomodations] = useState<{ id: number; name: string }[]>([]);
  const [languages, setLanguages] = useState<{ id: number; name: string }[]>([]);
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    taxNumber: "",
    taxOfficeId: "",
    personTypeId: "",
    citizenshipId: "",
    accomodationId: "",
    languageId: "",
    recordingChannel: "Web",
    citizenshipCountryId: 0,
    accomodationCountryId: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5252/api/customer/persontypes")
      .then(res => setPersonTypes(res.data));
    axios.get("http://localhost:5252/api/customer/taxoffices")
      .then(res => setTaxOffices(res.data));
    axios.get("http://localhost:5252/api/customer/citizenships")
      .then(res => setCitizenships(res.data));
    axios.get("http://localhost:5252/api/customer/accomodations")
      .then(res => setAccomodations(res.data));
    axios.get("http://localhost:5252/api/customer/languages")
      .then(res => setLanguages(res.data));
  }, []);

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
      passwordHash: form.password,
      name: form.name,
      taxNumber: form.taxNumber,
      taxOfficeId: form.taxOfficeId ? Number(form.taxOfficeId) : undefined,
      personTypeId: form.personTypeId ? Number(form.personTypeId) : undefined,
      citizenshipId: form.citizenshipId ? Number(form.citizenshipId) : undefined,
      accomodationId: form.accomodationId ? Number(form.accomodationId) : undefined,
      languageId: form.languageId ? Number(form.languageId) : undefined,
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

      <select name="taxOfficeId" value={form.taxOfficeId} onChange={handleChange} required className="w-full border p-2">
        <option value="">Vergi Dairesi Seçiniz</option>
        {taxOffices.map(office => (
          <option key={office.id} value={office.id}>{office.name}</option>
        ))}
      </select>

      <select name="personTypeId" value={form.personTypeId} onChange={handleChange} required className="w-full border p-2">
        <option value="">Kişi Türü Seçiniz</option>
        {personTypes.map(type => (
          <option key={type.id} value={type.id}>{type.name}</option>
        ))}
      </select>

      <select name="citizenshipId" value={form.citizenshipId} onChange={handleChange} required className="w-full border p-2">
        <option value="">Uyruk Seçiniz</option>
        {citizenships.map(type => (
          <option key={type.id} value={type.id}>{type.name}</option>
        ))}
      </select>

      <select name="accomodationId" value={form.accomodationId} onChange={handleChange} required className="w-full border p-2">
        <option value="">İkamet Seçiniz</option>
        {accomodations.map(acc => (
          <option key={acc.id} value={acc.id}>{acc.name}</option>
        ))}
      </select>

      <select name="languageId" value={form.languageId} onChange={handleChange} required className="w-full border p-2">
        <option value="">Dil Seçiniz</option>
        {languages.map(lang => (
          <option key={lang.id} value={lang.id}>{lang.name}</option>
        ))}
      </select>

      <input name="citizenshipCountryId" type="number" placeholder="Uyruk Ülke ID" value={form.citizenshipCountryId} onChange={handleChange} required className="w-full border p-2" />
      <input name="accomodationCountryId" type="number" placeholder="İkamet Ülke ID" value={form.accomodationCountryId} onChange={handleChange} required className="w-full border p-2" />

      <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
        Kayıt Ol
      </button>
    </form>
  );
};

export default CustomerRegisterForm;
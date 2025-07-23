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
    citizenshipCountryId: "",
    accomodationCountryId: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);

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
      citizenshipCountryId: form.citizenshipCountryId ? Number(form.citizenshipCountryId) : undefined,
      accomodationCountryId: form.accomodationCountryId ? Number(form.accomodationCountryId) : undefined,
    };

    try {
      await axios.post("http://localhost:5252/api/customer/register", requestBody);
      setShowSuccess(true);
    } catch (error: any) {
      alert("Kayıt başarısız: " + (error.response?.data || "Hata"));
    }
  };

  const handleModalClose = () => {
    setShowSuccess(false);
    navigate("/login-customer");
  };

  return (
    <>
      <div style={{
        background: "#fff",
        borderRadius: 32,
        boxShadow: "0 8px 32px rgba(0,97,168,0.13)",
        padding: "3rem 4.5rem 2.5rem 4.5rem",
        maxWidth: 900,
        width: "95vw",
        margin: "3rem auto 2rem auto"
      }}>
        <h2 style={{ color: "#009ee3", fontSize: "2.3rem", fontWeight: 700, textAlign: "center", marginBottom: 8 }}>Başvuru Formu</h2>
        <p style={{ textAlign: "center", color: "#003366", fontSize: 18, marginBottom: 32 }}>
          BankSys'e müşteri olmak için lütfen aşağıdaki formu eksiksiz doldurunuz.
        </p>
        <form onSubmit={handleSubmit}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
            marginBottom: 32
          }}>
            <input name="email" type="email" placeholder="E-posta" value={form.email} onChange={handleChange} required style={inputStyle} />
            <input name="password" type="password" placeholder="Şifre" value={form.password} onChange={handleChange} required style={inputStyle} />
            <input name="name" placeholder="Ad Soyad" value={form.name} onChange={handleChange} required style={inputStyle} />
            <input name="taxNumber" placeholder="Vergi Numarası" value={form.taxNumber} onChange={handleChange} required style={inputStyle} />
            <select name="taxOfficeId" value={form.taxOfficeId} onChange={handleChange} required style={inputStyle}>
              <option value="">Vergi Dairesi Seçiniz</option>
              {taxOffices.map(office => (
                <option key={office.id} value={office.id}>{office.name}</option>
              ))}
            </select>
            <select name="personTypeId" value={form.personTypeId} onChange={handleChange} required style={inputStyle}>
              <option value="">Kişi Türü Seçiniz</option>
              {personTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
            <select name="citizenshipId" value={form.citizenshipId} onChange={handleChange} required style={inputStyle}>
              <option value="">Uyruk Seçiniz</option>
              {citizenships.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
            <select name="accomodationId" value={form.accomodationId} onChange={handleChange} required style={inputStyle}>
              <option value="">İkamet Seçiniz</option>
              {accomodations.map(acc => (
                <option key={acc.id} value={acc.id}>{acc.name}</option>
              ))}
            </select>
            <select name="languageId" value={form.languageId} onChange={handleChange} required style={inputStyle}>
              <option value="">Dil Seçiniz</option>
              {languages.map(lang => (
                <option key={lang.id} value={lang.id}>{lang.name}</option>
              ))}
            </select>
            <input name="citizenshipCountryId" type="number" placeholder="Uyruk Ülke ID" value={form.citizenshipCountryId} onChange={handleChange} required style={inputStyle} />
            <input name="accomodationCountryId" type="number" placeholder="İkamet Ülke ID" value={form.accomodationCountryId} onChange={handleChange} required style={inputStyle} />
          </div>
          <button type="submit" style={{
            width: "100%",
            background: "#009ee3",
            color: "#fff",
            padding: "1.1rem 0",
            border: "none",
            borderRadius: 12,
            fontWeight: 700,
            fontSize: 22,
            letterSpacing: 1,
            cursor: "pointer",
            boxShadow: "0 2px 8px #b3e0f7",
            transition: "background 0.2s"
          }}>
            Kayıt Ol
          </button>
        </form>
      </div>
      {showSuccess && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0,0,0,0.35)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <div style={{
            background: "#fff",
            borderRadius: 18,
            boxShadow: "0 4px 24px rgba(0,97,168,0.13)",
            padding: "2.5rem 3.5rem",
            minWidth: 340,
            textAlign: "center"
          }}>
            <h3 style={{ color: "#009ee3", fontSize: 28, fontWeight: 700, marginBottom: 18 }}>Kayıt Başarılı!</h3>
            <p style={{ color: "#003366", fontSize: 18, marginBottom: 28 }}>
              Giriş sayfasına yönlendiriliyorsunuz.
            </p>
            <button onClick={handleModalClose} style={{
              background: "#009ee3",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "0.8rem 2.2rem",
              fontWeight: 700,
              fontSize: 20,
              cursor: "pointer",
              boxShadow: "0 2px 8px #b3e0f7"
            }}>Tamam</button>
          </div>
        </div>
      )}
    </>
  );
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "1rem 1.2rem",
  border: "2px solid #009ee3",
  borderRadius: 10,
  fontSize: 18,
  fontWeight: 500,
  background: "#f7fbfd",
  color: "#003366",
  outline: "none",
  marginBottom: 0
};

export default CustomerRegisterForm;
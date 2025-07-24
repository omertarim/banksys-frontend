import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

interface CustomerUpdateRequest {
  name?: string;
  emails?: string[];
  taxNumber?: string;
  taxOfficeId?: string;
  personTypeId?: string;
  citizenshipId?: string;
  accomodationId?: string;
  languageId?: string;
  recordingChannel?: string;
  citizenshipCountryId?: string;
  accomodationCountryId?: string;
}

const UpdateCustomerInfoPage = () => {
  const navigate = useNavigate();
  const [personTypes, setPersonTypes] = useState<{ id: number; name: string }[]>([]);
  const [taxOffices, setTaxOffices] = useState<{ id: number; name: string }[]>([]);
  const [citizenships, setCitizenships] = useState<{ id: number; name: string }[]>([]);
  const [accomodations, setAccomodations] = useState<{ id: number; name: string }[]>([]);
  const [languages, setLanguages] = useState<{ id: number; name: string }[]>([]);
  const [formData, setFormData] = useState<CustomerUpdateRequest>({
    name: "",
    emails: [],
    taxNumber: "",
    taxOfficeId: "",
    personTypeId: "",
    citizenshipId: "",
    accomodationId: "",
    languageId: "",
    recordingChannel: "",
    citizenshipCountryId: "",
    accomodationCountryId: "",
  });

  const [newEmail, setNewEmail] = useState("");
  const [customerId, setCustomerId] = useState<number | null>(null);

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded: any = jwtDecode(token);
      const userId =
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

      axios
        .get(`http://localhost:5252/api/customer/by-user/${userId}`)
        .then((res) => {
          const id = res.data.customerId;
          setCustomerId(id);
          return axios.get(`http://localhost:5252/api/customer/${id}`);
        })
        .then((res) => {
          const customerData = res.data;
          setFormData({
            name: customerData.name,
            emails: customerData.emails || [],
            taxNumber: customerData.taxNumber,
            taxOfficeId: customerData.taxOfficeId?.toString() || "",
            personTypeId: customerData.personTypeId?.toString() || "",
            citizenshipId: customerData.citizenshipId?.toString() || "",
            accomodationId: customerData.accomodationId?.toString() || "",
            languageId: customerData.languageId?.toString() || "",
            recordingChannel: customerData.recordingChannel,
            citizenshipCountryId: customerData.citizenshipCountryId,
            accomodationCountryId: customerData.accomodationCountryId,
          });
        })
        .catch((err) => console.error("Veri çekme hatası:", err));
    } catch (e) {
      console.error("JWT decode hatası:", e);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddEmail = () => {
    if (newEmail.trim() !== "" && !formData.emails?.includes(newEmail)) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newEmail)) {
        alert("Geçerli bir e-posta adresi giriniz.");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        emails: [...(prev.emails || []), newEmail],
      }));
      setNewEmail("");
    }
  };

  const handleSubmit = () => {
    if (!customerId) return;

    axios
      .put(`http://localhost:5252/api/customer/update/${customerId}`, {
        ...formData,
        personTypeId: formData.personTypeId ? Number(formData.personTypeId) : undefined,
        taxOfficeId: formData.taxOfficeId ? Number(formData.taxOfficeId) : undefined,
        citizenshipId: formData.citizenshipId ? Number(formData.citizenshipId) : undefined,
        accomodationId: formData.accomodationId ? Number(formData.accomodationId) : undefined,
        languageId: formData.languageId ? Number(formData.languageId) : undefined,
      })
      .then(() => {
        alert("Bilgiler başarıyla güncellendi.");
        navigate("/dashboard");
      })
      .catch((err) => console.error("Güncelleme hatası:", err));
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f7fbfd",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      paddingTop: 48
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 32,
        boxShadow: "0 8px 32px rgba(0,97,168,0.13)",
        padding: "3.5rem 4.5rem 3rem 4.5rem",
        maxWidth: 600,
        width: "95vw",
        margin: "0 auto"
      }}>
        <h2 style={{ color: "#009ee3", fontSize: "2rem", fontWeight: 700, marginBottom: 32, textAlign: "center", letterSpacing: 1 }}>Müşteri Bilgilerini Güncelle</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 24 }}>
          <label style={labelStyle}>Ad Soyad</label>
          <input name="name" placeholder="Ad Soyad" value={formData.name} onChange={handleInputChange} style={inputStyle} />
          <label style={labelStyle}>Vergi No</label>
          <input name="taxNumber" placeholder="Vergi No" value={formData.taxNumber} onChange={handleInputChange} style={inputStyle} />
          <label style={labelStyle}>Vergi Dairesi</label>
          <select name="taxOfficeId" value={formData.taxOfficeId} onChange={handleInputChange} required style={inputStyle}>
            <option value="">Vergi Dairesi Seçiniz</option>
            {taxOffices.map(office => (
              <option key={office.id} value={office.id}>{office.name}</option>
            ))}
          </select>
          <label style={labelStyle}>Kişi Türü</label>
          <select name="personTypeId" value={formData.personTypeId} onChange={handleInputChange} required style={inputStyle}>
            <option value="">Kişi Türü Seçiniz</option>
            {personTypes.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
          <label style={labelStyle}>Uyruk</label>
          <select name="citizenshipId" value={formData.citizenshipId} onChange={handleInputChange} required style={inputStyle}>
            <option value="">Uyruk Seçiniz</option>
            {citizenships.map(cit => (
              <option key={cit.id} value={cit.id}>{cit.name}</option>
            ))}
          </select>
          <label style={labelStyle}>İkamet</label>
          <select name="accomodationId" value={formData.accomodationId} onChange={handleInputChange} required style={inputStyle}>
            <option value="">İkamet Seçiniz</option>
            {accomodations.map(acc => (
              <option key={acc.id} value={acc.id}>{acc.name}</option>
            ))}
          </select>
          <label style={labelStyle}>Dil</label>
          <select name="languageId" value={formData.languageId} onChange={handleInputChange} required style={inputStyle}>
            <option value="">Dil Seçiniz</option>
            {languages.map(lang => (
              <option key={lang.id} value={lang.id}>{lang.name}</option>
            ))}
          </select>
          <label style={labelStyle}>Kayıt Kanalı</label>
          <input name="recordingChannel" placeholder="Kayıt Kanalı" value={formData.recordingChannel} onChange={handleInputChange} style={inputStyle} />
          <label style={labelStyle}>Uyruk Ülke ID</label>
          <input name="citizenshipCountryId" placeholder="Uyruk Ülke ID" value={formData.citizenshipCountryId} onChange={handleInputChange} style={inputStyle} />
          <label style={labelStyle}>İkamet Ülke ID</label>
          <input name="accomodationCountryId" placeholder="İkamet Ülke ID" value={formData.accomodationCountryId} onChange={handleInputChange} style={inputStyle} />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>Yeni e-posta ekle:</label>
          <div style={{ display: "flex", gap: 12 }}>
            <input
              type="email"
              placeholder="eposta@example.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              style={inputStyle}
            />
            <button onClick={handleAddEmail} style={buttonStyleGreen}>
              Ekle
            </button>
          </div>
        </div>
        {formData.emails && formData.emails.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <strong style={{ display: "block", marginBottom: 8, color: "#003366" }}>Mevcut E-posta Adresleri:</strong>
            <ul style={{ listStyle: "disc inside", color: "#009ee3", fontWeight: 600, fontSize: 16 }}>
              {formData.emails.map((email, index) => (
                <li key={index}>{email}</li>
              ))}
            </ul>
          </div>
        )}
        <button onClick={handleSubmit} style={buttonStyleBlue}>
          Güncelle
        </button>
      </div>
    </div>
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

const labelStyle: React.CSSProperties = {
  fontWeight: 600,
  color: "#003366",
  fontSize: 16,
  marginBottom: 6,
  display: "block"
};

const buttonStyleBlue: React.CSSProperties = {
  background: "#009ee3",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  padding: "1rem 0",
  fontSize: 20,
  fontWeight: 700,
  marginTop: 8,
  width: "100%",
  cursor: "pointer",
  boxShadow: "0 2px 12px rgba(0,97,168,0.08)",
  transition: "background 0.2s"
};

const buttonStyleGreen: React.CSSProperties = {
  background: "#22c55e",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  padding: "1rem 1.5rem",
  fontSize: 18,
  fontWeight: 700,
  cursor: "pointer",
  boxShadow: "0 2px 8px #b3e0f7",
  transition: "background 0.2s"
};

export default UpdateCustomerInfoPage;
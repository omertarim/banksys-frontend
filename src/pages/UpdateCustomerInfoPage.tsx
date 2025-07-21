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
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Müşteri Bilgilerini Güncelle</h2>

      <div className="grid grid-cols-1 gap-2">
        <input name="name" placeholder="Ad Soyad" value={formData.name} onChange={handleInputChange} />
        <input name="taxNumber" placeholder="Vergi No" value={formData.taxNumber} onChange={handleInputChange} />

        <select name="taxOfficeId" value={formData.taxOfficeId} onChange={handleInputChange} required>
          <option value="">Vergi Dairesi Seçiniz</option>
          {taxOffices.map(office => (
            <option key={office.id} value={office.id}>{office.name}</option>
          ))}
        </select>

        <select name="personTypeId" value={formData.personTypeId} onChange={handleInputChange} required>
          <option value="">Kişi Türü Seçiniz</option>
          {personTypes.map(type => (
            <option key={type.id} value={type.id}>{type.name}</option>
          ))}
        </select>

        <select name="citizenshipId" value={formData.citizenshipId} onChange={handleInputChange} required>
          <option value="">Uyruk Seçiniz</option>
          {citizenships.map(cit => (
            <option key={cit.id} value={cit.id}>{cit.name}</option>
          ))}
        </select>

        <select name="accomodationId" value={formData.accomodationId} onChange={handleInputChange} required>
          <option value="">İkamet Seçiniz</option>
          {accomodations.map(acc => (
            <option key={acc.id} value={acc.id}>{acc.name}</option>
          ))}
        </select>

        <select name="languageId" value={formData.languageId} onChange={handleInputChange} required>
          <option value="">Dil Seçiniz</option>
          {languages.map(lang => (
            <option key={lang.id} value={lang.id}>{lang.name}</option>
          ))}
        </select>

        <input name="recordingChannel" placeholder="Kayıt Kanalı" value={formData.recordingChannel} onChange={handleInputChange} />
        <input name="citizenshipCountryId" placeholder="Uyruk Ülke ID" value={formData.citizenshipCountryId} onChange={handleInputChange} />
        <input name="accomodationCountryId" placeholder="İkamet Ülke ID" value={formData.accomodationCountryId} onChange={handleInputChange} />
      </div>

      <div className="mt-4">
        <label className="block font-semibold mb-1">Yeni e-posta ekle:</label>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="eposta@example.com"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <button onClick={handleAddEmail} className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700">
            Ekle
          </button>
        </div>
      </div>

      {formData.emails && formData.emails.length > 0 && (
        <div className="mt-4">
          <strong className="block mb-2">Mevcut E-posta Adresleri:</strong>
          <ul className="list-disc list-inside">
            {formData.emails.map((email, index) => (
              <li key={index}>{email}</li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={handleSubmit} className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
        Güncelle
      </button>
    </div>
  );
};

export default UpdateCustomerInfoPage;
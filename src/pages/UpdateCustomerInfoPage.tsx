import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

interface CustomerUpdateRequest {
  name?: string;
  emails?: string[];
  taxNumber?: string;
  taxOffice?: string;
  personType?: string;
  citizenship?: string;
  accomodation?: string;
  language?: string;
  recordingChannel?: string;
  citizenshipCountryId?: string;
  accomodationCountryId?: string;
}

const UpdateCustomerInfoPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CustomerUpdateRequest>({
    name: "",
    emails: [],
    taxNumber: "",
    taxOffice: "",
    personType: "",
    citizenship: "",
    accomodation: "",
    language: "",
    recordingChannel: "",
    citizenshipCountryId: "",
    accomodationCountryId: "",
  });

  const [newEmail, setNewEmail] = useState("");
  const [customerId, setCustomerId] = useState<number | null>(null);

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
            taxOffice: customerData.taxOffice,
            personType: customerData.personType,
            citizenship: customerData.citizenship,
            accomodation: customerData.accomodation,
            language: customerData.language,
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      .put(`http://localhost:5252/api/customer/update/${customerId}`, formData)
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
        <input name="taxOffice" placeholder="Vergi Dairesi" value={formData.taxOffice} onChange={handleInputChange} />
        <input name="personType" placeholder="Kişi Türü" value={formData.personType} onChange={handleInputChange} />
        <input name="citizenship" placeholder="Uyruk" value={formData.citizenship} onChange={handleInputChange} />
        <input name="accomodation" placeholder="İkamet" value={formData.accomodation} onChange={handleInputChange} />
        <input name="language" placeholder="Dil" value={formData.language} onChange={handleInputChange} />
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

import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminUserApprovalPage = () => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5252/api/user/pending", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Bekleyen kullanıcılar alınamadı:", err);
      }
    };

    fetchPendingUsers();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:5252/api/user/approve/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Onaylama hatası:", err);
    }
  };

  const handleReject = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:5252/api/user/reject/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Reddetme hatası:", err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Bekleyen Kullanıcılar</h1>
      {users.length === 0 ? (
        <p>Bekleyen kullanıcı yok.</p>
      ) : (
        <ul className="space-y-4">
          {users.map((user) => (
            <li key={user.id} className="bg-white shadow p-4 rounded flex justify-between items-center">
              <div>
                <p><strong>Ad:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
              </div>
              <div className="space-x-2">
                <button onClick={() => handleApprove(user.id)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Onayla</button>
                <button onClick={() => handleReject(user.id)} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Reddet</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminUserApprovalPage;

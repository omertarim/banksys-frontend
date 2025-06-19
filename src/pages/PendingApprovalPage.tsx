import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PendingApprovalPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <h2 className="text-2xl font-semibold mb-4">Kayıt işleminiz onaya alınmıştır</h2>
      <p>Lütfen bir yönetici tarafından hesabınızın onaylanmasını bekleyin.</p>
      <div className="w-1/2 mt-6 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div
          className="bg-blue-600 h-2.5 rounded-full animate-pulse"
          style={{ width: "100%" }}
        ></div>
      </div>
      <p className="text-sm mt-3 text-gray-500">5 saniye içinde giriş ekranına yönlendirileceksiniz...</p>
    </div>
  );
};

export default PendingApprovalPage;

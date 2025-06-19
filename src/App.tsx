import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPassword from "./components/ForgotPassword";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import CreateAccount from "./pages/CreateAccount";
import AdminPage from "./pages/AdminPage";
import PendingApprovalPage from "./pages/PendingApprovalPage";
import ParticipationLoanPage from "./pages/ParticipationLoanPage";




function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/create-account" element={<CreateAccount />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/pending-approval" element={<PendingApprovalPage />} />
      <Route path="/participation-loan" element={<ParticipationLoanPage />} />


      </Routes>
  );
}

export default App;

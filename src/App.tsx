import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPassword from "./components/ForgotPassword";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import CreateAccount from "./pages/CreateAccount";
import AdminPage from "./pages/AdminPage";
import PendingApprovalPage from "./pages/PendingApprovalPage";
import ParticipationLoanPage from "./pages/ParticipationLoanPage";
import LoanApplicationPage from './pages/LoanApplicationPage';
import AdminLoanApprovalsPage from './pages/AdminLoanApprovalsPage';
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Giriş sayfaları */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Sadece giriş yapmış kullanıcılar */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } />
      <Route path="/create-account" element={
        <ProtectedRoute>
          <CreateAccount />
        </ProtectedRoute>
      } />
      <Route path="/pending-approval" element={
        <ProtectedRoute>
          <PendingApprovalPage />
        </ProtectedRoute>
      } />
      <Route path="/participation-loan" element={
        <ProtectedRoute>
          <ParticipationLoanPage />
        </ProtectedRoute>
      } />
      <Route path="/loan-apply" element={
        <ProtectedRoute>
          <LoanApplicationPage />
        </ProtectedRoute>
      } />

      {/* Sadece adminler */}
      <Route path="/admin" element={
        <ProtectedRoute requireAdmin={true}>
          <AdminPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/loan-approvals" element={
        <ProtectedRoute requireAdmin={true}>
          <AdminLoanApprovalsPage />
        </ProtectedRoute>
      } />

      {/* Hatalı rota varsa login sayfasına */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;

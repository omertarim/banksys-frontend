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
import MyLoanApplicationsPage from "./pages/MyApplicationPage";
import TransactionHistoryPage from "./pages/TransactionHistoryPage";
import LoginCustomer from "./pages/LoginCustomer";
import CustomerRegisterForm from "./pages/CustomerRegisterForm";
import LoginAdmin from "./pages/LoginAdmin";
import LoginEmployee from "./pages/LoginEmployee";
import EmployeeDashboard from './pages/EmployeeDashboard';
import UpdateCustomerInfoPage from './pages/UpdateCustomerInfoPage';
import AdminUserApprovalPage from "./pages/AdminUserApprovalPage";




function App() {
  return (
    <Routes>
      {/* Ana yönlendirme */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Genel giriş ve kayıt */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/admin/user-approval" element={<AdminUserApprovalPage />} />


      {/* Rol bazlı girişler */}
      <Route path="/login-customer" element={<LoginCustomer />} />
      <Route path="/login-admin" element={<LoginAdmin />} />
      <Route path="/login-employee" element={<LoginEmployee />} />
      <Route path="/register-customer" element={<CustomerRegisterForm />} />

      {/* Şifre sıfırlama */}
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Müşteri işlemleri */}
      <Route path="/dashboard" element={
        <ProtectedRoute requireCustomer={true}>
          <DashboardPage />
        </ProtectedRoute>
      } />
      <Route path="/create-account" element={
        <ProtectedRoute requireCustomer={true}>
          <CreateAccount />
        </ProtectedRoute>
      } />
      <Route path="/participation-loan" element={
        <ProtectedRoute requireCustomer={true}>
          <ParticipationLoanPage />
        </ProtectedRoute>
      } />
      <Route path="/loan-apply" element={
        <ProtectedRoute requireCustomer={true}>
          <LoanApplicationPage />
        </ProtectedRoute>
      } />
      <Route path="/my-loans" element={
        <ProtectedRoute requireCustomer={true}>
          <MyLoanApplicationsPage />
        </ProtectedRoute>
      } />
      <Route path="/transactions/:accountId" element={
        <ProtectedRoute requireCustomer={true}>
          <TransactionHistoryPage />
        </ProtectedRoute>
      } />

      {/* Admin işlemleri */}
      <Route path="/admin" element={
        <ProtectedRoute requireAdmin={true}>
          <AdminPage />
        </ProtectedRoute>
      } />
      <Route path="/pending-approval" element={
        <ProtectedRoute requireAdmin={true}>
          <PendingApprovalPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/loan-approvals" element={
        <ProtectedRoute requireAdmin={true}>
          <AdminLoanApprovalsPage />
        </ProtectedRoute>
      } />

      <Route path="/employee-dashboard" element={<EmployeeDashboard />} />


      {/* 404 fallback */}
      <Route path="*" element={<Navigate to="/login" />} />


      <Route path="/update-customer-info" element={<UpdateCustomerInfoPage />} />

    </Routes>
  );
}

export default App;

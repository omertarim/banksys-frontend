import React from "react";
import Login from "../components/Login";

interface Props {
  isAdminLogin?: boolean;
}

const LoginPage = ({ isAdminLogin = false }: Props) => {
  return <Login isAdminLogin={isAdminLogin} />;
};

export default LoginPage;

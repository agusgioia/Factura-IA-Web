import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./Components/Auth/LoginPage";
import Dashboard from "./Components/Dashboard/Dashboard";
import InvoicesPage from "./Components/Invoices/InvoicesPage";
import UploadInvoice from "./Components/Invoices/UploadInvoice";
import ChatPage from "./Components/Chat/ChatPage";
import authService from "./Services/AuthService";

function PrivateRoute({ children }) {
  return authService.isAuthenticated() ? children : <Navigate to="/" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/invoices"
          element={
            <PrivateRoute>
              <InvoicesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/invoices/upload"
          element={
            <PrivateRoute>
              <UploadInvoice />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <ChatPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

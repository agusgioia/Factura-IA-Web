import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential;
      await authService.loginGoogle(idToken);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Error en login. Intenta de nuevo.");
    }
  };

  const handleError = () => {
    console.log("Login Failed");
  };

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <div className="login-container">
        <div className="login-box">
          <h1>📊 Factura IA</h1>
          <p>Asistente inteligente de facturación</p>
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            text="signin_with"
            width="300"
          />
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function OAuthSuccessPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { setUserFromOAuth } = useAuth();

  useEffect(() => {
    const email = params.get("email");
    const fullName = params.get("fullName") || "User";
    const pictureUrl = params.get("pictureUrl") || "";
    const role = params.get("role") === "ADMIN" ? "ADMIN" : "USER";

    if (!email) {
      navigate("/login", { replace: true });
      return;
    }

    setUserFromOAuth({ email, fullName, pictureUrl, role });
    navigate(role === "ADMIN" ? "/admin" : "/dashboard", { replace: true });
  }, [navigate, params, setUserFromOAuth]);

  return <div style={{ padding: 16 }}>Finishing Google sign in...</div>;
}

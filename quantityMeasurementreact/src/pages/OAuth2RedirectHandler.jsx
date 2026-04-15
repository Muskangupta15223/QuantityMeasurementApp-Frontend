import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function OAuth2RedirectHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      // ✅ correct keys use करो
      const userData = { email: "google-user" };

      localStorage.setItem("qm_token", token);
      localStorage.setItem("qm_user", JSON.stringify(userData));

      // ✅ redirect to dashboard
      navigate("/");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return <div>Logging in with Google...</div>;
}

export default OAuth2RedirectHandler;
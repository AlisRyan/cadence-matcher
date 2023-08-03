import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const LoginCallback = () => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.hash.replace("#", ""));
    const accessToken = params.get("access_token");
    if (accessToken) {
      window.location.href = "/";
    }
  }, [location]);

  return <div>Logging you in...</div>;
};

export default LoginCallback;

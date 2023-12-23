import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

function Logout() {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);

  useEffect(() => {
    removeCookie("token");
    navigate("/login");
  }, [navigate, removeCookie]);

  return null;
}

export default Logout;

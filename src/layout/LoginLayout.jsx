import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

const LoginLayout = () => {
  const data = useSelector((state) => state.userInfo.users);
  const navigate = useNavigate();
  useEffect(() => {
    if (data) {
      navigate("/home");
    }
  }, []);
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default LoginLayout;

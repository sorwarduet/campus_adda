import { useEffect } from "react";
import Navbar from "../components/Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const HomeLayout = () => {
  const data = useSelector((state) => state.userInfo.users);
  const navigate = useNavigate();
  useEffect(() => {
    if (!data) {
      navigate("/");
    }
  }, []);
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default HomeLayout;

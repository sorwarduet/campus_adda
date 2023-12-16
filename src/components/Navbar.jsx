import { FaHome } from "react-icons/fa";
import { BsChat } from "react-icons/bs";
import { IoIosNotificationsOutline } from "react-icons/io";
import { CiSettings } from "react-icons/ci";
import { IoIosLogOut } from "react-icons/io";
import { IoMdCloudUpload } from "react-icons/io";
import profile_image from "../assets/images/profile.jpg";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { userInfo } from "../reducers/userSlice";

import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { useState } from "react";
import Modal from "./Modal";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const data = useSelector((state) => state.userInfo.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        //call redux
        dispatch(userInfo(null));
        localStorage.removeItem("user");

        toast.success("Logout Successfully", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <nav id="header">
      <div className="main">
        <div className="menu">
          <FaHome />
          <BsChat />
          <IoIosNotificationsOutline />
          <CiSettings />

          <IoIosLogOut onClick={handleLogout} className="cursor-pointer " />
        </div>
        <div className="image_name">
          <h1>{data ? data.displayName : ""}</h1>
          <div className="profile">
            <div className="profile_icon">
              <IoMdCloudUpload onClick={openModal} />
            </div>
            <img src={profile_image} />
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="text-lg">
          <h2 className="text-xl font-bold mb-4">Modal Content</h2>
          <p>
            This is the content of your modal. You can put any content here.
          </p>
        </div>
      </Modal>
    </nav>
  );
};

export default Navbar;

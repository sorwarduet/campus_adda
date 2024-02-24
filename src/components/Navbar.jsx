import { FaHome } from "react-icons/fa";
import { BsChat } from "react-icons/bs";
import { IoIosNotificationsOutline } from "react-icons/io";
import { CiSettings } from "react-icons/ci";
import { IoIosLogOut } from "react-icons/io";
import { IoMdCloudUpload } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, signOut, updateProfile, updatePassword } from "firebase/auth";
import { toast } from "react-toastify";
import { userInfo } from "../reducers/userSlice";

import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { useState, createRef } from "react";
import Modal from "./Modal";
import { NavLink, useNavigate } from "react-router-dom";
import { Circles } from "react-loader-spinner";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from "firebase/storage";
import { getDatabase } from "firebase/database";
import Notification from "./Notification";
const Navbar = () => {
  const data = useSelector((state) => state.userInfo.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const storage = getStorage();
  const auth = getAuth();
  const db = getDatabase();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [image, setImage] = useState("");
  const [errorImage, setErrorImage] = useState(null);
  const [cropData, setCropData] = useState("#");
  const cropperRef = createRef();
  const [loading, setLoading] = useState(false);
  const [notification, setNotifcation] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const cancelUploadImage = () => {
    setImage("");
    setIsModalOpen(false);
  };

  const submitUploadImage = () => {
    setLoading(true);
    if (typeof cropperRef.current?.cropper !== "undefined") {
      setCropData(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());
      const storageRef = ref(storage, auth.currentUser.uid);
      const message4 = cropperRef.current?.cropper
        .getCroppedCanvas()
        .toDataURL();

      uploadString(storageRef, message4, "data_url").then((snapshot) => {
        getDownloadURL(storageRef).then((downloadURL) => {
          updateProfile(auth.currentUser, {
            photoURL: downloadURL,
          });

          dispatch(userInfo({ ...data, photoURL: downloadURL }));
          localStorage.setItem("user", JSON.stringify(auth.currentUser));

          setLoading(false);

          setIsModalOpen(false);

          toast.success("Profile Image Updated Successfully", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        });
      });
    }
  };

  const handleUploadImage = (e) => {
    e.preventDefault();

    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    let files;
    if (!allowedTypes.includes(e.target.files[0].type)) {
      setErrorImage(
        "Invalid file type. Please select a JPEG, PNG, or GIF image."
      );
    } else {
      setErrorImage(null);
    }

    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
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

  const showNotification = () => {
    setNotifcation(!notification);
  };

  const openModalPassword = () => {
    setIsModal(true);
  };

  const closeModalPassword = () => {
    setIsModal(false);
  };

  const handelPasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmitPassword = (e) => {
    e.preventDefault();
    if (password == "") {
      setPasswordError("Empty passwrod");
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
    } else {
      setPasswordError("");
    }

    if (password && passwordError == "") {
      const user = auth.currentUser;

      updatePassword(user, password)
        .then(() => {
          setPassword("");
          setIsModal(false);
          toast.success("Change Successfully", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  return (
    <nav id="header">
      <div className="main">
        <div className="menu">
          <NavLink to="/home">
            {" "}
            <FaHome />
          </NavLink>
          <NavLink to="/home/chat">
            {" "}
            <BsChat />
          </NavLink>

          <div className="relative">
            <IoIosNotificationsOutline
              onClick={showNotification}
              className="cursor-pointer"
            />

            {notification && <Notification />}
          </div>
          <CiSettings onClick={openModalPassword} className="cursor-pointer" />

          <IoIosLogOut onClick={handleLogout} className="cursor-pointer " />
        </div>
        <div className="image_name">
          <h1>{data ? data.displayName : ""}</h1>
          <div className="profile">
            <div className="profile_icon" onClick={openModal}>
              <IoMdCloudUpload />
            </div>
            <img src={data?.photoURL} />
          </div>
        </div>
      </div>

      <Modal isOpen={isModal} onClose={closeModalPassword}>
        <form onSubmit={handleSubmitPassword}>
          <div className="flex flex-col">
            <input
              className="input_v1"
              type="password"
              onChange={handelPasswordChange}
              placeholder="Enter New Password"
            />
            <p className="error">{passwordError}</p>
          </div>
          <div className="flex justify-center">
            <button className="button_v1 ">Submit</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="flex flex-col">
          {image ? (
            <div className="mx-auto h-[100px] w-[100px] overflow-hidden bg-black rounded-full mb-2">
              <div className="img-preview w-full h-full"></div>
            </div>
          ) : (
            <div className="mx-auto h-[100px] w-[100px] overflow-hidden bg-black rounded-full mb-2">
              <img src={data?.photoURL} />
            </div>
          )}

          <p className="text-red-500">{errorImage}</p>
          {image && !errorImage && (
            <Cropper
              ref={cropperRef}
              style={{ height: 300, width: "100%" }}
              zoomTo={0.5}
              initialAspectRatio={1}
              preview=".img-preview"
              src={image}
              viewMode={1}
              minCropBoxHeight={10}
              minCropBoxWidth={10}
              background={false}
              responsive={true}
              autoCropArea={1}
              checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
              guides={true}
            />
          )}

          <div className="mx-auto mt-4">
            <input
              type="file"
              className="border w-full"
              onChange={handleUploadImage}
            />
          </div>

          <div className="flex gap-3 mt-4 mx-auto">
            {loading ? (
              <div className="mx-auto">
                <Circles
                  height="40"
                  width="40"
                  color="#F1A661"
                  ariaLabel="circles-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                  visible={true}
                />
              </div>
            ) : (
              <button
                onClick={submitUploadImage}
                className="bg-fourth px-2 py-1 font-semibold rounded-md"
                disabled={errorImage ? true : false}
              >
                Upload
              </button>
            )}
            <button
              onClick={cancelUploadImage}
              className=" bg-red-600 px-2 py-1 font-semibold rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </nav>
  );
};

export default Navbar;

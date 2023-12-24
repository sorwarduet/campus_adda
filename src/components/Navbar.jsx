import { FaHome } from "react-icons/fa";
import { BsChat } from "react-icons/bs";
import { IoIosNotificationsOutline } from "react-icons/io";
import { CiSettings } from "react-icons/ci";
import { IoIosLogOut } from "react-icons/io";
import { IoMdCloudUpload } from "react-icons/io";
import profile_image from "../assets/images/profile.jpg";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { toast } from "react-toastify";
import { userInfo } from "../reducers/userSlice";

import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { useState, createRef } from "react";
import Modal from "./Modal";
import { useNavigate } from "react-router-dom";
import { Circles } from "react-loader-spinner";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from "firebase/storage";
const Navbar = () => {
  const data = useSelector((state) => state.userInfo.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const storage = getStorage();
  const auth = getAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [image, setImage] = useState("");
  const [cropData, setCropData] = useState("#");
  const cropperRef = createRef();
  const [loading, setLoading] = useState(false);

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
        });
      });
    }
  };

  const handleUploadImage = (e) => {
    e.preventDefault();

    let files;
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
            <div className="profile_icon" onClick={openModal}>
              <IoMdCloudUpload />
            </div>
            <img src={data?.photoURL} />
          </div>
        </div>
      </div>

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

          {image && (
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

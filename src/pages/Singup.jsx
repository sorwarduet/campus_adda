import Lottie from "lottie-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { toast } from "react-toastify";
import SingUp from "../assets/animation/Animation_2.json";
import { Circles } from "react-loader-spinner";
import { getDatabase, ref, set } from "firebase/database";
import {
  getAuth,
  updateProfile,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import Typewriter from "react-ts-typewriter";

const Singup = () => {
  const navigate = useNavigate();
  //firebase auth
  const auth = getAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFullname = (e) => {
    setFullName(e.target.value);
    setFullNameError("");
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  // Show User Password
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  //google signup

  const createGoogleAccount = () => {
    setLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        // updated user
        updateProfile(auth.currentUser, {
          displayName: fullName,
          photoURL: "../../public/images/profile.jpg",
        })
          .then(() => {
            const db = getDatabase();
            set(ref(db, "users/" + auth.currentUser.uid), {
              fullName: auth.currentUser.displayName,
              email: auth.currentUser.email,
            });

            setLoading(false);
            console.log(auth.currentUser);
          })
          .catch((error) => {
            console.log(error);
          });

        toast.success("Registration is done", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setFullName("");
        setEmail("");
        setPassword("");

        navigate("/");
      })
      .catch((error) => {
        setLoading(false);
        const errorCode = error.code;
        if (errorCode == "auth/weak-password") {
          setPasswordError("Password should be at least 6 characters");
        }
        if (errorCode == "auth/email-already-in-use") {
          setEmailError("Email already in use");
        }
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (fullName == "") {
      setFullNameError("Empty full name");
    } else {
      setFullNameError("");
    }

    if (email == "") {
      setEmailError("Empty email address");
    } else if (!emailRegex.test(email)) {
      setEmailError("Invalid email address");
    } else {
      setEmailError("");
    }

    if (password == "") {
      setPasswordError("Empty passwrod");
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
    } else {
      setPasswordError("");
    }

    if (!emailError && !passwordError && !fullNameError && email && password) {
      createGoogleAccount();
    }
  };
  return (
    <>
      <div className="signup">
        <div className="left">
          <h1 className="heading">
            <Typewriter text="Campus Adda" loop={true} speed={300} />
          </h1>

          <h4 className="sub_title">Enjoy add Registration Here</h4>
          <form onSubmit={handleSubmit}>
            <div className="flex justify-between items-center mt-3">
              <label className="w-1/3 ">
                Full Name <span className="text-red-600">*</span>
              </label>
              <div className="w-full">
                <input
                  type="text"
                  onChange={handleFullname}
                  placeholder="Enter Your Full Name"
                  className="input_v1"
                />
                <p className="error">{fullNameError}</p>
              </div>
            </div>
            <div className="flex justify-between items-center mt-3">
              <label className="w-1/3 ">
                Email <span className="text-red-600">*</span>
              </label>
              <div className="w-full">
                <input
                  type="email"
                  onChange={handleEmail}
                  placeholder="Enter Your Email"
                  className="input_v1 "
                />
                <p className="error">{emailError}</p>
              </div>
            </div>

            <div className="flex justify-between items-center mt-3">
              <label className="w-1/3 ">
                Password <span className="text-red-600">*</span>
              </label>
              <div className=" relative w-full">
                <div className=" relative">
                  {showPassword ? (
                    <FaEye
                      onClick={handleShowPassword}
                      className="show_password"
                    />
                  ) : (
                    <FaEyeSlash
                      onClick={handleShowPassword}
                      className="show_password"
                    />
                  )}
                  <input
                    onChange={handlePassword}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Your Passwrod"
                    className="input_v1"
                  />
                </div>
                <p className="text-red-500">{passwordError}</p>
              </div>
            </div>

            <div className="flex justify-between items-center mt-3">
              <label className="w-1/3 "></label>
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
                <div className="w-full">
                  <button className="button_v1">Registration</button>
                </div>
              )}
            </div>
          </form>

          <p className="mt-3">
            You are account?Please{" "}
            <Link to="/" className="text-blue-400 font-bold">
              Login
            </Link>
          </p>
        </div>

        <div className="hidden md:block md:w-[50%]">
          <Lottie animationData={SingUp} height={500} />
        </div>
      </div>
    </>
  );
};

export default Singup;

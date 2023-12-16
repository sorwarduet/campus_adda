import Lottie from "lottie-react";
import LoginAnimation from "../assets/animation/Animation_3.json";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import { Circles } from "react-loader-spinner";
import { useDispatch } from "react-redux";
import { userInfo } from "../reducers/userSlice";
import Typewriter from "react-ts-typewriter";

const Login = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const auth = getAuth();
  const dispatch = useDispatch();

  //Start Handle User Input
  const handleEmail = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  //End Handle User Input

  // Show User Password
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const loginAccount = () => {
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        //call redux
        dispatch(userInfo(user));

        localStorage.setItem("user", JSON.stringify(user));

        setLoading(false);

        toast.success("Login Successfully", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        navigate("/home");
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        setLoading(false);
        if (errorCode == "auth/invalid-credential") {
          setEmailError("Invalid Email or Passwrod");
        }
        console.log(errorCode);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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

    if (!emailError && !passwordError && email && password) {
      loginAccount();
    }
  };

  return (
    <div className="login">
      <div className="left ">
        <Lottie animationData={LoginAnimation} />
      </div>

      <div className="right">
        <h1 className="heading">Campus Adda</h1>

        <h4 className="sub_title">
          <Typewriter text="Enjoy the Campus adda" loop={true} speed={200} />
        </h4>
        <form onSubmit={handleSubmit}>
          <input
            onChange={handleEmail}
            name="email"
            type="email"
            placeholder="Enter Your Email"
            className="input_v1"
          />
          <p className="error">{emailError}</p>
          <div className="relative mt-3">
            {showPassword ? (
              <FaEye onClick={handleShowPassword} className="show_password" />
            ) : (
              <FaEyeSlash
                onClick={handleShowPassword}
                className="show_password"
              />
            )}

            <input
              onChange={handlePassword}
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter Your Passwrod"
              className="input_v1"
            />
          </div>
          <p className="error">{passwordError}</p>

          {loading ? (
            <div className="flex justify-center">
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
            <div className="flex justify-center">
              <button className="button_v1">Login</button>
            </div>
          )}
        </form>

        <p className="mt-6">
          You are not account?Please{" "}
          <Link to="/singup" className="text-blue-400 font-bold">
            Registration{" "}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

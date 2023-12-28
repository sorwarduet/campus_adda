import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import {
  Route,
  RouterProvider,
  Routes,
  createBrowserRouter,
} from "react-router-dom";
import Login from "./pages/Login";
import Singup from "./pages/Singup";
import { ToastContainer } from "react-toastify";
import Home from "./pages/Home";
import LoginLayout from "./layout/LoginLayout";
import HomeLayout from "./layout/HomeLayout";
import { useSelector } from "react-redux";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LoginLayout />,
      children: [
        {
          path: "/",
          element: <Login />,
        },
        {
          path: "/singup",
          element: <Singup />,
        },
      ],
    },
    {
      path: "/home",
      element: <HomeLayout />,
      children: [
        {
          path: "/home",
          element: <Home />,
        },
      ],
    },
    {
      path: "*",
      element: <h1>Not Found</h1>,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
}

export default App;

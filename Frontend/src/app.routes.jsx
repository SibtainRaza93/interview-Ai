import { createBrowserRouter } from "react-router-dom";
import Login from "./features/pages/Login";
import Register from "./features/pages/Register";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <h1>Home Page</h1>,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);
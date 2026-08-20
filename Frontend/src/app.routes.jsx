import { createBrowserRouter } from "react-router-dom";

import Home from "./features/interview/pages/Home.jsx";
import Login from "./features/pages/Login";
import Register from "./features/pages/Register";
import Interview from "./features/interview/pages/Interview";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "/interview/:interviewId",
        element: <Interview />,
    },
]);





// import Protected from ".features/components/Protected";
// import Home from "./features/interview/pages/Home";
// import Interview from "./features/interview/pages/Interview";

// import { createBrowserRouter } from "react-router-dom";
// import Login from "./features/pages/Login";
// import Register from "./features/pages/Register";

// export const router = createBrowserRouter([
//     {
//         path: "/login",
//         element: <Login />
//     },
//     {
//         path: "/register",
//         element: <Register />
//     },
//     {
//         path: "/",
//         element: <Protected><Home /></Protected>
//     },
//     {
//         path:"/interview/:interviewId",
//         element: <Protected><Interview /></Protected>
//     }
// ])



import SignInPage from "./Pages/SignInPage/SignInPage";
import SignUpPage from "./Pages/SignUpPage/SignUpPage";
import MainPage from "./Pages/MainPage/MainPage";
import NotFoundPage from "./Pages/NotFound/NotFoundPage";
import './index.css';
import {createBrowserRouter, RouterProvider,} from "react-router-dom";
import ProfilePage from "./Pages/ProfilePage/ProfilePage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <SignInPage/>,
    },
    {
      path: "/SignUp",
      element: <SignUpPage/>,
    },
    {
      path: "/MainPage",
      element: <MainPage/>,
    },
    {
      path: "/Profile",
      element: <ProfilePage/>,
    },
    {
      path: "/*",
      element: <NotFoundPage/>,
    },

    ]);
  return (
    <RouterProvider router={router} />
  );
}

export default App;


import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useLoaderData } from "react-router-dom";

import MainNavigation from "../components/MainNavigation";
import Footer from "../components/Footer";
import { userAction } from "../store/user-slice";
import { getTokenDuration } from "../utils/auth";

export default function RootLayout() {
  const dispatch = useDispatch();
  const token = useLoaderData();

  useEffect(() => {
    dispatch(
      userAction.setUserInfo({
        user_name: token,
      })
    );

    if (!token || token === "EXPIRED") {
      dispatch(userAction.logout());
      return;
    }

    const tokenDuration = getTokenDuration();
    const timer = setTimeout(() => {
      dispatch(userAction.logout());
      deleteToken();
    }, tokenDuration);

    return () => clearTimeout(timer);
  }, [token, dispatch]);

  return (
    <>
      <MainNavigation />
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black text-white flex flex-col items-center justify-center">
        <Outlet />
        <Footer />
      </div>
    </>
  );
}

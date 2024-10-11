import { NavLink, useNavigate } from "react-router-dom";
import { useIsFetching } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";

import Link from "../UI/Link";
import { userAction } from "../store/user-slice";
import { deleteToken } from "../utils/auth";

export default function MainNavigation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isFetching = useIsFetching();
  const user_name = useSelector((state) => state.user.user_name);

  function handleUser() {
    const answer = window.confirm("需要登出帳戶嗎？");

    if (answer) {
      dispatch(userAction.logout());
      deleteToken();
      navigate("/");
    }
  }

  return (
    <>
      {/* 進度條 */}
      {isFetching > 0 && (
        <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-36 h-2 bg-gray-500 z-50 rounded-full">
          <div className="bg-purple-500 h-2 rounded-full animate-progress"></div>
        </div>
      )}

      <header className="bg-gray-800 text-white p-4 shadow-lg sticky top-0 z-40">
        <nav className="container mx-auto flex justify-between items-center">
          {/* 平台名稱 */}
          <h1 className="text-2xl font-bold">
            <NavLink to="/" className="font-serif hover:text-purple-400">
              BingeWatcher
            </NavLink>
          </h1>

          {/* 導航連結 */}
          <ul className="flex space-x-6 items-center">
            <li>
              <Link to="/about">關於我們</Link>
            </li>
            <li>
              <Link to="/popular">熱門電影</Link>
            </li>
            <li>
              <Link to="/up-coming">即將上映</Link>
            </li>
            <li>
              <Link to="/top-rated">最受好評</Link>
            </li>
            {!user_name && (
              <li>
                <Link to="/login">會員登入</Link>
              </li>
            )}
            {user_name && (
              <li>
                <Link to={`/favorites?user_name=${user_name}`}>我的收藏</Link>
              </li>
            )}
            {user_name && (
              <li>
                <button
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full shadow-lg hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-transform duration-300 ease-in-out"
                  onClick={handleUser}
                >
                  <span className="mr-2">👤</span>
                  歡迎 {user_name}
                </button>
              </li>
            )}
          </ul>
        </nav>
      </header>
    </>
  );
}

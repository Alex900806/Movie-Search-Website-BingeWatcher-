import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Form } from "react-router-dom";

import { userLogin, userSignUp } from "../store/user-slice";
import { saveToken } from "../utils/auth";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState({
    user_name: "",
    password: "",
  });
  const intervalRef = useRef(null); // 用來追蹤進度條的 interval
  const user_name = useSelector((state) => state.user.user_name);
  const user_status = useSelector((state) => state.user.status);

  // 提交表單後 3 秒後跳轉至首頁
  useEffect(() => {
    if (user_status === "註冊成功" || user_status === "登入成功") {
      // 存到 localstorage
      saveToken(user_name);

      const timer = setTimeout(() => {
        navigate("/");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [user_status]);

  // 處理表單變更
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 開始進度條並延遲發送請求
  const handleSubmit = (e) => {
    e.preventDefault();
    setProgress(0);

    // 模擬進度條增長，等待進度條跑完再發送請求
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 5;
        if (newProgress >= 100) {
          clearInterval(intervalRef.current);

          // 當進度條完成時發送請求
          if (isLogin) {
            dispatch(userLogin(formData));
          } else {
            dispatch(userSignUp(formData));
          }
        }
        return newProgress;
      });
    }, 100);
  };

  return (
    <div className="max-w-lg w-full p-12 bg-gradient-to-br from-purple-700 to-gray-400 shadow-2xl rounded-lg animate-fadeIn">
      <h2 className="text-4xl font-serif font-bold mb-8 text-center text-gray-200">
        {isLogin ? "Login" : "SignUp"}
      </h2>

      {/* 表單 */}
      <Form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-lg text-gray-300">使用者名稱</label>
          <input
            type="text"
            name="user_name"
            value={formData.user_name}
            onChange={handleFormChange}
            className="w-full px-4 py-3 border rounded-md text-gray-700 bg-gray-100 text-lg"
            placeholder="請輸入使用者名稱"
            required
          />
        </div>

        <div>
          <label className="block text-lg text-gray-300">密碼</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleFormChange}
            className="w-full px-4 py-3 border rounded-md text-gray-700 bg-gray-100 text-lg"
            placeholder="請輸入密碼"
            required
          />
        </div>

        {/* 顯示當前狀態 */}
        {user_status &&
          (user_status === "註冊成功" || user_status === "登入成功") && (
            <div className="text-center text-xl font-bold text-white bg-green-700 p-4 rounded-lg shadow-lg border-2 border-purple-500 animate-pulse">
              {user_status}
            </div>
          )}
        {user_status &&
          user_status !== "註冊成功" &&
          user_status !== "登入成功" && (
            <div className="text-center text-xl font-bold text-white bg-rose-700 p-4 rounded-lg shadow-lg border-2 border-purple-500 animate-pulse">
              {user_status}
            </div>
          )}

        <button
          type="submit"
          className="w-full px-4 py-3 bg-gradient-to-r from-purple-700 to-blue-600 text-white rounded-md text-lg hover:from-purple-600 hover:to-blue-500 transition-all duration-300 ease-in-out"
        >
          {isLogin ? "登入" : "註冊"}
        </button>
      </Form>

      <div className="mt-8 text-center">
        <p className="text-gray-300 text-lg">
          {isLogin ? "還沒有帳號嗎？趕緊點擊" : "已經有帳號？"}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-purple-700 ml-2 hover:text-purple-600 font-bold"
          >
            {isLogin ? "註冊" : "請點此登入"}
          </button>
        </p>
      </div>

      {/* 進度條 */}
      {progress != 0 && progress != 100 && (
        <div className="relative w-full h-2 mt-4 bg-gray-300 rounded-full">
          <div
            className="absolute h-full bg-purple-500 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
}

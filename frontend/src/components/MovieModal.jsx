import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function MovieModal({
  movie,
  onClose,
  manipulateFavorites,
  actionType,
}) {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);
  const requestSent = useRef(false);
  const user_name = useSelector((state) => state.user.user_name);

  const { mutate, isLoading } = useMutation({
    mutationFn: manipulateFavorites,
    onSuccess: (data) => {
      setMessage(data.message);
      if (actionType === "delete") {
        navigate(`/favorites?user_name=${user_name}`);
      }
    },
    onError: () => {
      setMessage("發生錯誤，請稍後再試");
    },
  });

  function startProgress(action) {
    let progressValue = 0;
    intervalRef.current = setInterval(() => {
      progressValue += 3;
      setProgress(progressValue);

      if (progressValue >= 100) {
        clearInterval(intervalRef.current);
        if (!requestSent.current) {
          requestSent.current = true; // 確保請求只發送一次
          action();
        }
        setProgress(0);
      }
    }, 100);
  }

  function handleAddFavorites() {
    if (user_name === "") {
      setMessage("請先登入以進行後續操作");
    } else {
      startProgress(() => mutate({ movie: movie, user_name: user_name }));
    }
  }

  function handleDeleteFavorites() {
    if (user_name === "") {
      setMessage("請先登入以進行後續操作");
    } else {
      startProgress(() => mutate({ user_name: user_name, movie_id: movie.id }));
    }
  }

  function handleCancel() {
    clearInterval(intervalRef.current);
    setProgress(0);
    onClose();
  }

  const buttonLabel = isLoading
    ? actionType === "add"
      ? "收藏中..."
      : "移除中..."
    : actionType === "add"
    ? "加入我的收藏"
    : "將此電影移除";

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 opacity-0 animate-showModal">
      <div className="bg-slate-200 p-6 rounded-lg max-w-md w-full transform transition-all ease-in-out shadow-lg hover:shadow-2xl scale-105">
        {/* Modal 內容 */}
        <h2 className="text-2xl font-bold mt-2 text-purple-700">
          {movie.title}
        </h2>
        <h2 className="text-xl font-bold mb-2 text-purple-700">
          {movie.original_title}
        </h2>
        <p className="text-gray-700">上映日期：{movie.release_date}</p>
        <p className="text-gray-700">
          評分：
          {movie.vote_average === 0
            ? "尚無評分"
            : movie.vote_average.toFixed(1) + " / 10"}
        </p>
        <p className="mt-4 text-gray-500">{movie.overview}</p>

        {/* 底部的按鈕和訊息 */}
        <div className="mt-6 flex justify-between items-center">
          <div
            className={`text-xs px-4 py-2 bg-green-100 text-green-600 border border-green-300 rounded-full ${
              message ? "visible" : "invisible"
            }`}
          >
            {message}
          </div>

          <div className="flex space-x-4">
            <button
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full transform transition-transform hover:scale-105 hover:from-purple-600 hover:to-pink-600"
              onClick={
                actionType === "add"
                  ? handleAddFavorites
                  : handleDeleteFavorites
              }
              disabled={isLoading || progress > 0}
            >
              {buttonLabel}
            </button>
            <button
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-full transform transition-transform hover:scale-105 hover:bg-gray-400"
              onClick={handleCancel}
              disabled={isLoading}
            >
              取消
            </button>
          </div>
        </div>

        {/* 進度條 */}
        <div
          className={`relative w-full h-2 mt-4 bg-gray-300 rounded-full ${
            progress > 0 ? "visible" : "invisible"
          }`}
        >
          <div
            className="absolute h-full bg-purple-500 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>,
    document.getElementById("modal")
  );
}

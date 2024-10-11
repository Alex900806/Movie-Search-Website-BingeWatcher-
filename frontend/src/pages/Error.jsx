import { useNavigate, useRouteError } from "react-router-dom";

export default function Error() {
  const navigate = useNavigate();
  const routeError = useRouteError();
  console.log(routeError);

  function goToHomePage() {
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black flex flex-col items-center justify-center space-y-4">
      <h1 className="text-4xl text-white font-bold">
        發生了一些錯誤 ... 請重試
      </h1>
      <button
        onClick={goToHomePage}
        className="px-6 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-600 transition duration-300"
      >
        返回首頁
      </button>
    </div>
  );
}

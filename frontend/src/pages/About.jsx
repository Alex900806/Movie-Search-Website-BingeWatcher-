import Footer from "../components/Footer";

export default function About() {
  return (
    <>
      {/* 標題 */}
      <h1 className="text-5xl font-bold mb-6 animate-fadeIn">
        關於 BingeWatcher
      </h1>

      {/* 介紹段落 */}
      <p className="text-lg md:text-xl text-gray-300 max-w-3xl text-center mb-12 animate-fadeIn animation-delay-200">
        BingeWatcher
        旨在為電影愛好者提供一個探索電影世界的平台，無論是熱門大片還是即將上映的精彩電影，我們都會為您精心推薦。我們的目標是打造一個電影愛好者的社群，讓您輕鬆找到您喜愛的電影並與其他影迷互動。
      </p>

      {/* 使命卡片 */}
      <div className="flex flex-col sm:flex-row gap-8 mb-12 max-w-4xl animate-fadeIn animation-delay-400">
        <div className="bg-slate-800 rounded-lg p-6 text-center shadow-lg hover:shadow-2xl transition transform hover:scale-105 duration-300">
          <h2 className="text-2xl font-semibold mb-4">我們的使命</h2>
          <p className="text-gray-300">
            提供最新、最全面的電影資訊，讓您隨時隨地都能找到心儀的影片。
          </p>
        </div>
        <div className="bg-slate-800 rounded-lg p-6 text-center shadow-lg hover:shadow-2xl transition transform hover:scale-105 duration-300">
          <h2 className="text-2xl font-semibold mb-4">我們的目標</h2>
          <p className="text-gray-300">
            成為每位影迷的首選平台，幫助影迷發現並追踪他們感興趣的影片。
          </p>
        </div>
      </div>

      {/* Call-to-Action 按鈕 */}
      <button className="px-8 py-3 bg-purple-600 text-white rounded-full hover:bg-yellow-400 hover:shadow-lg hover:text-black transition transform hover:scale-105 duration-300 animate-fadeIn animation-delay-600">
        與我們聯繫
      </button>
    </>
  );
}

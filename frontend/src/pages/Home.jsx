import { useActionData, useNavigation } from "react-router-dom";

import SearchBar from "../components/SearchBar";
import SearchResults from "../components/SearchResults";
import { fetchMovieByTitle } from "../utils/http";
import Link from "../UI/Link";

export default function Home() {
  const actionData = useActionData();
  const navigation = useNavigation();
  const query = actionData?.query || "";
  const searchResults = actionData?.searchResults || null;
  const error = actionData?.error || null;
  const isLoading =
    navigation.state === "submitting" || navigation.state === "loading";

  return (
    <>
      {/* 固定標題區域 */}
      <div className="flex flex-col items-center mt-20 animate-fadeIn animation-delay-200">
        <h1 className="text-7xl md:text-8xl text-white font-extrabold mb-6">
          找尋你喜愛的電影
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-12">
          探索並找到你最喜愛的電影，隨時隨地觀賞
        </p>
        {/* 搜尋框 */}
        <SearchBar />
      </div>

      {isLoading && (
        <div className="mt-12 text-white text-xl font-semibold">
          搜尋中 請稍候...
        </div>
      )}

      {error && (
        <div className="mt-12 text-rose-700 text-xl font-semibold">
          {error} 請重試
        </div>
      )}

      {/* 搜尋結果 */}
      {searchResults && !isLoading && (
        <div className="w-full mt-6 ">
          <SearchResults results={searchResults} query={query} />
        </div>
      )}

      {/* 沒有結果時顯示的按鈕 */}
      {!searchResults && !isLoading && (
        <div className="mt-16 flex flex-col sm:flex-row gap-6 animate-fadeIn animation-delay-600">
          <button className="px-6 py-3 bg-slate-800 text-white rounded-full hover:bg-purple-700 hover:shadow-lg hover:scale-105 transition transform duration-300">
            <Link to="/popular">瀏覽熱門電影</Link>
          </button>
          <button className="px-6 py-3 bg-slate-800 text-white rounded-full hover:bg-purple-700 hover:shadow-lg hover:scale-105 transition transform duration-300">
            <Link to="/up-coming">即將上映電影</Link>
          </button>
        </div>
      )}
    </>
  );
}

export async function searchAction({ request }) {
  const data = await request.formData();
  const query = data.get("query");
  try {
    const searchResults = await fetchMovieByTitle({ movie_title: query });
    return { query, searchResults };
  } catch (error) {
    return { query, searchResults: null, error: error.message };
  }
}

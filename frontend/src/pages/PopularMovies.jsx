import { useActionData, useNavigation } from "react-router-dom";

import SearchBar from "../components/SearchBar";
import Movies from "../components/Movies";
import SearchResults from "../components/SearchResults";
import { fetchPopularMovies } from "../utils/http";

export default function PopularMovies() {
  const actionData = useActionData();
  const query = actionData?.query || "";
  const searchResults = actionData?.searchResults || null;
  const error = actionData?.error || null;
  const navigation = useNavigation();
  const isLoading =
    navigation.state === "submitting" || navigation.state === "loading";

  return (
    <>
      {/* 搜尋框 */}
      <SearchBar />

      {error && (
        <div className="mt-12 text-rose-700 text-xl font-semibold">
          {error} 請重試
        </div>
      )}

      {/* 熱門電影資訊 */}
      {!searchResults && (
        <Movies title="熱門電影" search_function={fetchPopularMovies} />
      )}

      {isLoading && (
        <div className="mt-12 text-white text-xl font-semibold">
          搜尋中 請稍候...
        </div>
      )}

      {/* 搜尋結果 */}
      {searchResults && !isLoading && (
        <div className="w-full mt-6 ">
          <SearchResults results={searchResults} query={query} />
        </div>
      )}
    </>
  );
}

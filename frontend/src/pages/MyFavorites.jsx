import { useState, Suspense } from "react";
import { Await, defer, useLoaderData } from "react-router-dom";

import MovieCard from "../components/MovieCard";
import MovieModal from "../components/MovieModal";
import { deleteFavorite, loadFavorites } from "../utils/http";

export default function MyFavorites() {
  const { movies } = useLoaderData();
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="container mx-auto py-8 mt-8">
      {isModalOpen && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setIsModalOpen(false)}
          manipulateFavorites={deleteFavorite}
          actionType="delete"
        />
      )}

      {/* Lazy Loading */}
      <Suspense
        fallback={<p className="text-white text-center">載入電影中...</p>}
      >
        <Await resolve={movies}>
          {(moviesData) => {
            if (moviesData.length === 0) {
              return (
                <div className="container mx-auto py-8 flex flex-col items-center justify-center">
                  {/* 漸變背景的文字區塊 */}
                  <h2 className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse mb-8">
                    一部電影都沒有...
                  </h2>

                  {/* 提示文本 */}
                  <p className="text-2xl text-gray-300 mb-8">
                    趕快加幾部進來吧！別讓收藏夾空蕩蕩的～
                  </p>

                  {/* 按鈕引導用戶添加電影 */}
                  <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg rounded-full shadow-lg hover:from-purple-500 hover:to-pink-500 transform hover:scale-105 transition-transform duration-300 ease-in-out">
                    去添加電影
                  </button>
                </div>
              );
            }

            return (
              <>
                <h1 className="text-3xl text-white font-bold mb-6">我的收藏</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {moviesData.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      openMovieModal={() => {
                        setSelectedMovie(movie);
                        setIsModalOpen(true);
                      }}
                    />
                  ))}
                </div>
              </>
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
}

// loader 使用 defer 返回延遲數據
export function moviesLoader({ request }) {
  const url = new URL(request.url);
  const user_name = url.searchParams.get("user_name");

  // 使用 defer 確保數據是延遲加載的
  return defer({
    movies: loadFavorites(user_name),
  });
}

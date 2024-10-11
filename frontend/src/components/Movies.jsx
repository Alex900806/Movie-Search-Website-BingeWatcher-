import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import LoadingIndicator from "../UI/LoadingIndicator";
import ErrorBlock from "../UI/ErrorBlock";
import MovieCard from "./MovieCard";
import MovieModal from "./MovieModal";
import { addToFavorites } from "../utils/http";

export default function Movies({ title, search_function }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: movies,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["movies", search_function, currentPage],
    queryFn: () => search_function({ page: currentPage }),
    staleTime: 5000,
    cacheTime: 30000,
  });

  let content;

  if (isLoading) {
    content = <LoadingIndicator />;
  }

  if (isError) {
    content = (
      <ErrorBlock
        title={error.message}
        message={error.info?.status_message || "發生未知錯誤"}
      />
    );
  }

  if (movies) {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {movies.map((movie) => (
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
    );
  }

  function handlePageChange(newPage) {
    setCurrentPage(newPage);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <div className="container mx-auto py-8">
      {isModalOpen && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setIsModalOpen(false)}
          manipulateFavorites={addToFavorites}
          actionType="add"
        />
      )}

      <h2 className="text-3xl text-white font-bold mb-6">{title}</h2>
      <div className="flex justify-center">{content}</div>

      {/* 上下頁功能 */}
      <div className="flex justify-center mt-16 space-x-4">
        {/* 上一頁按鈕 */}
        {currentPage !== 1 && (
          <button
            className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-yellow-400 hover:text-black transition"
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))} // 不允許小於 1
          >
            上一頁
          </button>
        )}

        {/* 下一頁按鈕 */}
        <button
          className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-yellow-400 hover:text-black transition"
          onClick={() => handlePageChange(currentPage + 1)} // 增加頁數
        >
          下一頁
        </button>
      </div>
    </div>
  );
}

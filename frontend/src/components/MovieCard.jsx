import { useQuery } from "@tanstack/react-query";

import { fetchMovieDetails } from "../utils/http";

export default function MovieCard({ movie, openMovieModal }) {
  const {
    data: details,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["movie", movie.id],
    queryFn: ({ queryKey }) => fetchMovieDetails({ movie_id: queryKey[1] }),
    staleTime: 5000,
    cacheTime: 30000,
  });

  let content;

  if (isLoading) {
    content = <p className="text-gray-400">加載更多訊息中...</p>;
  }

  if (isError) {
    content = <p className="text-gray-400">更多訊息加載失敗...</p>;
  }

  if (details) {
    content = (
      <div className="text-sm">
        <p>
          主演：
          {details.cast
            .slice(0, 2)
            .map((cast) => cast.original_name)
            .join(" / ")}
        </p>
        <p>類型：{details.genres.map((genre) => genre.name).join(" / ")}</p>
      </div>
    );
  }

  return (
    <div
      className="bg-gray-800 text-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300"
      onClick={openMovieModal}
    >
      <img
        src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
        onError={(e) => {
          e.target.src = "/not-found-photo.jpg";
        }}
        alt={movie.original_title}
        className="w-full h-[28rem] object-fill"
      />
      <div className="p-4 flex flex-col justify-between min-h-[15rem] text-left">
        <div>
          <h2 className="text-xl font-bold mb-2">{movie.title}</h2>
          <h2 className="text-xl font-bold mb-6">{movie.original_title}</h2>
          <p className="text-sm">上映日期：{movie.release_date}</p>
          {/* 詳細資訊 */}
          {content}
        </div>
        <div className="mt-auto text-yellow-400 font-semibold">
          <p>
            評分：
            {movie.vote_average === 0
              ? "尚無評分"
              : movie.vote_average.toFixed(1) + " / 10"}
          </p>
        </div>
      </div>
    </div>
  );
}

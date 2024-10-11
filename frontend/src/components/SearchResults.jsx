import { useState } from "react";

import MovieCard from "./MovieCard";
import MovieModal from "./MovieModal";
import { addToFavorites } from "../utils/http";

export default function SearchResults({ results, query }) {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

      <h1 className="text-3xl text-white font-bold mb-6">搜尋結果 ({query})</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {results && results.length > 0 ? (
          results.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              openMovieModal={() => {
                setSelectedMovie(movie);
                setIsModalOpen(true);
              }}
            />
          ))
        ) : (
          <p className="text-lg text-gray-300">找不到相關的電影結果。</p>
        )}
      </div>
    </div>
  );
}

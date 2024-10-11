import { QueryClient } from "@tanstack/react-query";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const fetchConfiguration = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

export const queryClient = new QueryClient();

// 獲取「熱門電影」資料
export async function fetchPopularMovies({ page }) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/popular?language=zh-TW&page=${page}`,
    fetchConfiguration
  );

  if (!response.ok) {
    const error = new Error("獲取熱門電影數據失敗");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const data = await response.json();
  return data.results;
}

// 獲取「即將上映」電影資料
export async function fetchUpComingMovies({ page }) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/upcoming?language=zh-TW&page=${page}`,
    fetchConfiguration
  );

  if (!response.ok) {
    const error = new Error("獲取即將上映電影數據失敗");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const data = await response.json();
  return data.results;
}

// 獲取「最受好評」電影資料
export async function fetchTopRatedMovies({ page }) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/top_rated?language=zh-TW&page=${page}`,
    fetchConfiguration
  );

  if (!response.ok) {
    const error = new Error("獲取最受好評電影數據失敗");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const data = await response.json();
  return data.results;
}

// 獲取「搜尋電影名稱」的電影資料
export async function fetchMovieByTitle({ movie_title }) {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${movie_title}&include_adult=true&language=zh-TW&page=1`,
    fetchConfiguration
  );

  if (!response.ok) {
    const error = new Error("獲取該電影數據失敗");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const data = await response.json();
  return data.results;
}

// 獲取單一電影「類型」與「卡司」資料
export async function fetchMovieDetails({ movie_id }) {
  const response_genres = await fetch(
    `https://api.themoviedb.org/3/movie/${movie_id}?language=zh-TW`,
    fetchConfiguration
  );

  if (!response_genres.ok) {
    const error = new Error("獲取電影類型數據失敗");
    error.code = response_genres.status;
    error.info = await response_genres.json();
    throw error;
  }

  const genres = await response_genres.json();

  const response_cast = await fetch(
    `https://api.themoviedb.org/3/movie/${movie_id}/credits?language=zh-TW`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMGE3YzRmN2I0YThiOTg0MDcwNTQwYThkNjE4NGNiYyIsIm5iZiI6MTcyNzU5MjUyNy4zODk3MDEsInN1YiI6IjY2ZjhmNzIxZTdkMjRlYmIyYmEyM2NjNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7wXumvP_scb9MC1CRxdAeEiUcllMZpXdmfSNKfHnTrs`,
      },
    }
  );

  if (!response_cast.ok) {
    const error = new Error("獲取電影卡司數據失敗");
    error.code = response_cast.status;
    error.info = await response_cast.json();
    throw error;
  }

  const cast = await response_cast.json();

  const details = {
    movie_id: movie_id,
    genres: genres.genres,
    cast: cast.cast,
  };

  return details;
}

// 將電影加入至我的收藏
export async function addToFavorites({ movie, user_name }) {
  const response = await fetch(`http://127.0.0.1:8000/favorites/${user_name}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(movie),
  });

  if (!response.ok) {
    const error = new Error("加入我的收藏失敗");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const data = await response.json();
  return data;
}

// 載入我的收藏電影
export async function loadFavorites(user_name) {
  const response = await fetch(`http://127.0.0.1:8000/favorites/${user_name}`);
  if (!response.ok) {
    const error = new Error("載入我的收藏失敗");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }
  const data = await response.json();
  return data;
}

// 將電影從我的收藏移除
export async function deleteFavorite({ user_name, movie_id }) {
  const response = await fetch(
    `http://127.0.0.1:8000/favorites/${user_name}/${movie_id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const error = new Error("移除電影失敗");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const data = await response.json();
  return data;
}

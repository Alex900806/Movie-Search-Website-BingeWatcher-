import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import RootLayout from "./pages/RootLayout";
import Error from "./pages/Error";
import Home, { searchAction } from "./pages/Home";
import About from "./pages/About";
import PopularMovies from "./pages/PopularMovies";
import UpComingMovies from "./pages/UpComingMovies";
import TopRatedMovies from "./pages/TopRatedMovies";
import MyFavorites, { moviesLoader } from "./pages/MyFavorites";
import Login from "./pages/Login";
import { queryClient } from "./utils/http";
import { tokenLoader } from "./utils/auth";

const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    element: <RootLayout />,
    errorElement: <Error />,
    loader: tokenLoader,
    children: [
      {
        index: true,
        element: <Home />,
        action: searchAction,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/popular",
        element: <PopularMovies />,
        action: searchAction,
      },
      {
        path: "/up-coming",
        element: <UpComingMovies />,
        action: searchAction,
      },
      {
        path: "/top-rated",
        element: <TopRatedMovies />,
        action: searchAction,
      },
      {
        path: "/favorites",
        element: <MyFavorites />,
        loader: moviesLoader,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

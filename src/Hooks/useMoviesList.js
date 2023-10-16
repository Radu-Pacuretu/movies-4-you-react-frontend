import { useEffect, useState } from "react";

export function useMoviesList(query, callback) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      const controller = new AbortController();

      async function searchMovies() {
        try {
          setIsLoading(true);
          setError("");

          const res = await fetch(
            `${process.env.REACT_APP_BASE_URL}:4001/movies/search/${query}`,
            { method: "GET", signal: controller.signal }
          );

          if (!res.ok)
            throw new Error("Something has gone wrong while fetching movies");

          const data = await res.json();

          if (data.length === 0) throw new Error("Movie not found");

          setMovies(data);
          setError("");
        } catch (error) {
          console.error(error);
          if (error.name !== "AbortError") {
            setError(error.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      //handleCloseMovie();
      callback?.();
      searchMovies();

      //cleanup
      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return { movies, error, isLoading };
}

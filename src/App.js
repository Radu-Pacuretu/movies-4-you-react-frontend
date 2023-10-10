import { useState } from "react";
import { Loader } from "./Components/Loader";
import { ErrorMessage } from "./Components/ErrorMessage";
import { Navbar } from "./Components/Navbar";
import { Search } from "./Components/Search";
import { NumResults } from "./Components/NumResults";
import { Main } from "./Components/Main";
import { Box } from "./Components/Box";
import { MovieList } from "./Components/MovieList";
import { MoiveDetails } from "./Components/MoiveDetails";
import { WatchedSummary } from "./Components/WatchedSummary";
import { WatchedMovieList } from "./Components/WatchedMovieList";
import { useMoviesList } from "./Hooks/useMoviesList";
import { useLocalStorage } from "./Hooks/useLocalStorage";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [watched, setWatched] = useLocalStorage([], "watched");
  const { movies, isLoading, error } = useMoviesList(query, handleCloseMovie);

  function handleAddWatchedMovie(movie) {
    setWatched((watched) => [...watched, movie]);
  }
  function handleRemoveWatchedMovie(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  return (
    <>
      <Navbar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </Navbar>

      <Main>
        <Box>
          {isLoading && !error && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedId ? (
            <MoiveDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatchedMovie={handleAddWatchedMovie}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onRemoveWatchedMovie={handleRemoveWatchedMovie}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

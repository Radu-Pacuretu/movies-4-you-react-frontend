import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { Loader } from "./Loader";
import { useKey } from "../Hooks/useKey";

export function MoiveDetails({
  selectedId,
  onCloseMovie,
  onAddWatchedMovie,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  const movieRatings = useRef([]);

  // destructure data out of the movie
  const {
    title,
    release_date: year,
    poster_path: poster,
    runtime,
    vote_average: imdbRating,
    overview: plot,
    tagline,
    revenue,
    //genres
  } = movie;

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  useEffect(
    function () {
      async function getMovieDetails() {
        try {
          setIsLoading(true);
          const res = await fetch(
            `${process.env.REACT_APP_BASE_URL}:4001/movies/details/${selectedId}`,
            { method: "GET" }
          );

          if (!res.ok)
            throw new Error("Something has gone wrong with fetching movies");

          const data = await res.json();
          setMovie(data);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      }
      getMovieDetails();
    },
    [selectedId]
  );

  useEffect(
    function () {
      document.title = "Movie: " + title;

      return function () {
        document.title = "movies4you";
      };
    },
    [title]
  );

  useKey("Escape", onCloseMovie);

  useEffect(
    function () {
      if (userRating) {
        movieRatings.current = [...movieRatings.current, userRating];
      }
    },
    [userRating]
  );

  function handleAdd() {
    const newMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime),
      userRating,
      movieRatings,
    };

    onAddWatchedMovie(newMovie);
    onCloseMovie();
  }

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img
              src={`https://image.tmdb.org/t/p/w185${poster}`}
              alt={`Poster of ${title}`}
            ></img>
            <div className="details-overview">
              <h2>{title}</h2>
              <p>{tagline}</p>
              <p>
                {year} &bull; {runtime} min
              </p>
              <p>{movie?.genres?.map((genre) => genre.name).join(", ")}</p>
              <p>
                Rating: {Number(imdbRating).toFixed(2)} &bull; Revenue:{" "}
                {revenue?.toLocaleString("en-US")} $
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    defaultRating={watchedUserRating}
                  />
                  <p>You have allready rated this movie</p>
                </>
              ) : (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />

                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to list
                    </button>
                  )}
                </>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
          </section>
        </>
      )}
    </div>
  );
}

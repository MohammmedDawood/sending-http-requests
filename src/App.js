import React, { useState, useCallback, useEffect } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // fetch data from API
  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("https://swapi.dev/api/films/");

      // check before setting(parse) data
      if (!response.ok) {
        throw new Error("something went wrong");
      }

      const data = await response.json();

      // transofrm data to the names that i use in the app
      const transformedMovies = data.results.map((movieData) => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date,
        };
      });

      // console.log(data.results);
      // set Movies State
      setMovies(transformedMovies);
    } catch (error) {
      setError(error.message);
    }
    // stop loading even when there is an error or not
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();

    // return () => {
    //   second
    // }
  }, [fetchMoviesHandler]);

  //replace JSX with content
  let content = <h1>Found No Movies...</h1>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = <h1>{error}</h1>;
  }

  if (isLoading) {
    content = <h1>Loading...</h1>;
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;

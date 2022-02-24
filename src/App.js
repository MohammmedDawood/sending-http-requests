import React, { useState, useCallback, useEffect } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";
import AddMovie from "./components/AddMovie";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // fetch data from API
  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://react-http-c5e4d-default-rtdb.europe-west1.firebasedatabase.app/movies.json"
      );

      // check before setting(parse) data
      if (!response.ok) {
        throw new Error("something went wrong");
      }

      const data = await response.json();
      console.log(data);

      // parse movies data
      const loadedMovies = [];
      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }
      console.log(loadedMovies);

      // transofrm data to the names that i use in the app
      // const transformedMovies = data.results.map((movieData) => {
      //   return {
      //     id: movieData.episode_id,
      //     title: movieData.title,
      //     openingText: movieData.opening_crawl,
      //     releaseDate: movieData.release_date,
      //   };
      // });

      // console.log(data.results);

      // set Movies State
      setMovies(loadedMovies);
    } catch (error) {
      setError(error.message);
    }
    // stop loading even when there is an error or not
    setIsLoading(false);
  }, []);

  // call fetchMoviesHandler on useEffect Hook (componentDidMount)
  useEffect(() => {
    fetchMoviesHandler();

    // return () => {
    //   second
    // }
  }, [fetchMoviesHandler]);

  // add new movie to the movies array
  async function addMovieHandler(movie) {
    // console.log(movie);
    // make the request
    const response = await fetch(
      "https://react-http-c5e4d-default-rtdb.europe-west1.firebasedatabase.app/movies.json",
      {
        method: "POST",
        body: JSON.stringify(movie),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    // Data
    const data = await response.json();
    console.log(data);
  }

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
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;

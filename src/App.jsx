import { useEffect, useState } from 'react'
import './App.css'
import Search from './components/Search'
import Spinner from './components/Spinner'
import MovieCard from './components/MovieCard'
import { useDebounce } from 'react-use'
import { getTrendingMovies, updateSearchCount } from './appwrite'

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [debounceSearchTerm, setDebounceSearchTerm] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [movieList, setMovieList] = useState([])
  const [trendingMovies, setTrendingMovies] = useState([])
  const [isLoading, setIsLoading] = useState(false)


  const API_BASE_URL = 'https://api.themoviedb.org/3'
  const API_KEY = import.meta.env.VITE_IMDB_API_KEY;

  const API_OPTIONS = {
    method: "GET",
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${API_KEY}`
    }
  }

  const fetchMovies = async (query = '') => {

    setIsLoading(true);
    setErrorMessage('');

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();

      if (data.Response === 'False'){
        setErrorMessage(data.Error || "Failed to fetch movies");
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);
      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Error Fetching Movies, Please Try Again later!')
    } finally {
      setIsLoading(false);
    }
  }

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies()
      setTrendingMovies(movies);
    } catch (error) {
      console.error(error);
    }
  }

  useDebounce(() => setDebounceSearchTerm(searchTerm), 500, [searchTerm]);

  useEffect(() => {
    fetchMovies(debounceSearchTerm);
  }, [debounceSearchTerm]);
  
  useEffect(() => {
    loadTrendingMovies();
   }, []);

  return (
    <main>
      <div className='pattern' />
      
      <div className='wrapper'>
        <header>
          <img src='./hero.png' alt='Hero Banner'/>
          <h1>Find <span className='text-gradient'>Movies</span> You'll Enjoy Without The Hassle</h1>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className='trending'>
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1} </p>
                  <img src={movie.poster_url} alt={movie.title } />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className='all-movies'>
          <h1 className='text-3xl text-gradient'>All Movies</h1>
          {
            isLoading
              ? (<Spinner/>)
              : errorMessage
                ? (<p className='text-3xl text-red-300'>{errorMessage}</p>)
                : (
                  <ul>
                    {movieList.map((movie) => (
                      <MovieCard key={movie.id} movie={movie}/>
                    )
                    )}
                  </ul>
                )
          }
        </section>
         
      </div>
    </main>
  )
}

export default App

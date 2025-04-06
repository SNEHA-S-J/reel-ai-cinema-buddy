
import { Movie, MovieGenre, UserPreference } from "@/types/movies";
import { MOVIES } from "@/data/movies";

// Function to get recommendations based on user preferences
export const getRecommendations = (
  preferences: UserPreference, 
  allMovies: Movie[] = MOVIES,
  limit: number = 5
): Movie[] => {
  // Create a copy of movies to work with
  const movies = [...allMovies];
  
  // Calculate a score for each movie based on user preferences
  const scoredMovies = movies.map(movie => {
    let score = 0;
    
    // Score based on genre match
    const genreMatchCount = movie.genres.filter(genre => 
      preferences.favoriteGenres.includes(genre as MovieGenre)
    ).length;
    
    score += genreMatchCount * 2; // Each matching genre adds 2 points
    
    // Score based on rating (if the user has rated this movie)
    if (preferences.ratedMovies[movie.id]) {
      score += preferences.ratedMovies[movie.id];
    } else {
      // For unrated movies, consider the average vote if it exceeds user's minimum preference
      if (movie.vote_average >= preferences.minimumRating) {
        score += (movie.vote_average - preferences.minimumRating) / 2;
      } else {
        score -= (preferences.minimumRating - movie.vote_average);
      }
    }
    
    return { ...movie, score };
  });
  
  // Filter out movies below minimum rating before sorting
  const filteredMovies = scoredMovies.filter(movie => movie.vote_average >= preferences.minimumRating);
  
  // Sort movies by score in descending order
  const sortedMovies = filteredMovies.sort((a, b) => b.score - a.score);
  
  // Return the top N movies
  return sortedMovies.slice(0, limit).map(({ score, ...movie }) => movie);
};

// Function to search for movies
export const searchMovies = (
  query: string,
  movies: Movie[] = MOVIES
): Movie[] => {
  if (!query || query.trim() === '') return [];
  
  const normalizedQuery = query.toLowerCase().trim();
  
  return movies.filter(movie => 
    movie.title.toLowerCase().includes(normalizedQuery) ||
    movie.overview.toLowerCase().includes(normalizedQuery)
  );
};

// Function to filter movies by genre
export const filterByGenre = (
  genre: MovieGenre | null,
  movies: Movie[] = MOVIES
): Movie[] => {
  if (!genre) return movies;
  
  return movies.filter(movie => 
    movie.genres.includes(genre)
  );
};

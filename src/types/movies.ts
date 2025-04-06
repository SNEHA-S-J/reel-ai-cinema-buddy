
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  genres: string[];
}

export type MovieGenre =
  | "Action"
  | "Adventure"
  | "Animation"
  | "Comedy"
  | "Crime"
  | "Documentary"
  | "Drama"
  | "Family"
  | "Fantasy"
  | "History"
  | "Horror"
  | "Music"
  | "Mystery"
  | "Romance"
  | "Science Fiction"
  | "TV Movie"
  | "Thriller"
  | "War"
  | "Western";

export interface UserPreference {
  favoriteGenres: MovieGenre[];
  ratedMovies: { [movieId: number]: number };
  minimumRating: number;
}

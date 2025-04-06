import { useState, useEffect } from "react";
import { Film, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MovieCard from "@/components/MovieCard";
import MovieDetails from "@/components/MovieDetails";
import GenreSelector from "@/components/GenreSelector";
import MinimumRatingSelector from "@/components/MinimumRatingSelector";
import { Movie, MovieGenre, UserPreference } from "@/types/movies";
import { MOVIES } from "@/data/movies";
import { getRecommendations, searchMovies, filterByGenre } from "@/utils/recommendationEngine";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import BotpressChat from "@/components/BotpressChat";

const Index = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [preferences, setPreferences] = useState<UserPreference>({
    favoriteGenres: ["Action", "Drama", "Science Fiction"],
    ratedMovies: {},
    minimumRating: 7.0
  });
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<MovieGenre | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [activeTab, setActiveTab] = useState("discover");
  const [showPreferences, setShowPreferences] = useState(false);
  
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);

  useEffect(() => {
    const newRecommendations = getRecommendations(preferences, MOVIES, 6);
    setRecommendations(newRecommendations);
  }, [preferences]);

  useEffect(() => {
    const filtered = filterByGenre(selectedGenre, MOVIES);
    setFilteredMovies(filtered);
  }, [selectedGenre]);

  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }
    
    const results = searchMovies(searchQuery, MOVIES);
    setSearchResults(results);
    
    if (results.length === 0) {
      toast({
        title: "No movies found",
        description: `No movies matching "${searchQuery}" were found.`,
        variant: "destructive"
      });
    } else {
      setActiveTab("search");
      toast({
        title: "Search Results",
        description: `Found ${results.length} movies matching "${searchQuery}".`,
      });
    }
  };
  
  const handleMinimumRatingChange = (value: number) => {
    setPreferences({
      ...preferences,
      minimumRating: value
    });
  };
  
  const handleRateMovie = (movieId: number, rating: number) => {
    const updatedRatedMovies = { ...preferences.ratedMovies, [movieId]: rating };
    
    setPreferences({
      ...preferences,
      ratedMovies: updatedRatedMovies
    });
    
    const movie = MOVIES.find(m => m.id === movieId);
    if (movie) {
      toast({
        title: rating > 0 ? `Rated ${movie.title}` : `Rating removed`,
        description: rating > 0 ? `You rated this movie ${rating} out of 5` : `Your rating for this movie has been removed`,
        variant: "default",
      });
    }
  };
  
  const activeMovieList = () => {
    switch (activeTab) {
      case "search":
        return searchResults;
      case "browse":
        return filteredMovies;
      case "discover":
      default:
        return recommendations;
    }
  };

  return (
    <div className="min-h-screen bg-cinema-dark text-cinema-text">
      <header className="bg-cinema-blue border-b border-cinema-purple p-4 md:p-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center">
              <Film className="h-8 w-8 text-cinema-accent mr-2" />
              <h1 className="text-2xl md:text-3xl font-bold text-cinema-accent">Reel-AI</h1>
            </div>
            
            <div className="relative w-full md:w-96">
              <Input
                type="text"
                placeholder="Search for movies..."
                className="w-full bg-cinema-dark border-cinema-purple text-cinema-text pl-4 pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-0 top-0 h-full px-3 text-cinema-text hover:text-cinema-accent"
                onClick={handleSearch}
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6 bg-cinema-blue">
            <TabsTrigger 
              value="discover" 
              className="data-[state=active]:bg-cinema-purple data-[state=active]:text-cinema-text"
            >
              Recommended
            </TabsTrigger>
            <TabsTrigger 
              value="browse" 
              className="data-[state=active]:bg-cinema-purple data-[state=active]:text-cinema-text"
            >
              Browse
            </TabsTrigger>
            <TabsTrigger 
              value="search" 
              className="data-[state=active]:bg-cinema-purple data-[state=active]:text-cinema-text"
              disabled={searchResults.length === 0}
            >
              Search
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="discover" className="animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h2 className="text-2xl font-bold text-cinema-accent mb-4 md:mb-0">Recommended For You</h2>
              <Button 
                variant="outline" 
                className="bg-cinema-blue border-cinema-purple text-cinema-text hover:bg-cinema-purple/20"
                onClick={() => setShowPreferences(!showPreferences)}
              >
                {showPreferences ? "Hide Preferences" : "Show Preferences"}
              </Button>
            </div>
            
            {showPreferences && (
              <div className="mb-6 p-4 bg-cinema-blue border border-cinema-purple rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-cinema-accent">Favorite Genres</h3>
                    <GenreSelector 
                      value={selectedGenre} 
                      onChange={(genre) => {
                        setSelectedGenre(genre);
                        if (genre && !preferences.favoriteGenres.includes(genre)) {
                          setPreferences({
                            ...preferences,
                            favoriteGenres: [...preferences.favoriteGenres, genre]
                          });
                        }
                      }} 
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-cinema-accent">Quality Filter</h3>
                    <MinimumRatingSelector 
                      value={preferences.minimumRating} 
                      onChange={handleMinimumRatingChange} 
                    />
                  </div>
                </div>
              </div>
            )}
            
            {recommendations.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
                {recommendations.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onRateMovie={handleRateMovie}
                    userRating={preferences.ratedMovies[movie.id]}
                    onClick={() => setSelectedMovie(movie)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center py-10">Rate some movies to get recommendations!</p>
            )}
          </TabsContent>
          
          <TabsContent value="browse" className="animate-fade-in">
            <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-cinema-accent">Browse Movies</h2>
              <div className="w-full md:w-72">
                <GenreSelector value={selectedGenre} onChange={setSelectedGenre} />
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
              {filteredMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onRateMovie={handleRateMovie}
                  userRating={preferences.ratedMovies[movie.id]}
                  onClick={() => setSelectedMovie(movie)}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="search" className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 text-cinema-accent">
              Search Results for "{searchQuery}"
            </h2>
            
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
                {searchResults.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onRateMovie={handleRateMovie}
                    userRating={preferences.ratedMovies[movie.id]}
                    onClick={() => setSelectedMovie(movie)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center py-10">No search results to display.</p>
            )}
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="bg-cinema-blue border-t border-cinema-purple p-4 text-center mt-10">
        <p className="text-sm text-cinema-text/70">
          Reel-AI Cinema Buddy © {new Date().getFullYear()}
        </p>
      </footer>
      
      <MovieDetails
        movie={selectedMovie}
        open={!!selectedMovie}
        onClose={() => setSelectedMovie(null)}
        onRateMovie={handleRateMovie}
        userRating={selectedMovie ? preferences.ratedMovies[selectedMovie.id] : undefined}
      />

      <BotpressChat />
    </div>
  );
};

export default Index;

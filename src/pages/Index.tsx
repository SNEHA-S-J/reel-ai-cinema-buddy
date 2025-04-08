import { useState, useEffect } from "react";
import { Film, Search, Compass, Heart, Clock, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import MasonryGrid from "@/components/MasonryGrid";
import { cn } from "@/lib/utils";

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
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  
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

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

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

  const columnCount = isMobile ? 2 : (window.innerWidth < 1024 ? 3 : 5);

  return (
    <div className="min-h-screen bg-cinema-dark text-cinema-text">
      <header className="sticky top-0 z-10 bg-cinema-blue/95 backdrop-blur-sm border-b border-cinema-purple/50 p-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center">
              <Film className="h-8 w-8 text-cinema-accent mr-2" />
              <h1 className="text-2xl md:text-3xl font-bold text-cinema-accent">Reel-Pin</h1>
            </div>
            
            <div className="relative w-full max-w-xl mx-4">
              <Input
                type="text"
                placeholder="Search for movies..."
                className="w-full bg-cinema-dark/70 border-cinema-purple/50 text-cinema-text pl-4 pr-10 rounded-full"
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
            
            <div className="hidden md:flex">
              <Button
                variant="outline"
                size="sm"
                className="text-cinema-accent border-cinema-purple/50 hover:bg-cinema-purple/20"
                onClick={() => setShowPreferences(!showPreferences)}
              >
                {showPreferences ? "Hide Filters" : "Show Filters"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-72px)]">
        <aside className={cn(
          "bg-cinema-blue border-r border-cinema-purple/50 transition-all duration-300 flex flex-col",
          sidebarOpen ? "w-64" : isMobile ? "w-0 opacity-0" : "w-16"
        )}>
          {isMobile && (
            <Button 
              className="absolute top-20 left-4 z-20 bg-cinema-purple text-white"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? "<" : ">"}
            </Button>
          )}
          
          <nav className="p-4 flex flex-col gap-2">
            <Button
              variant={activeTab === "discover" ? "default" : "ghost"}
              className={cn(
                "justify-start",
                activeTab === "discover" ? "bg-cinema-purple text-white" : "text-cinema-text hover:bg-cinema-purple/20"
              )}
              onClick={() => setActiveTab("discover")}
            >
              <Compass className="h-5 w-5 mr-2" />
              {sidebarOpen && <span>Discover</span>}
            </Button>
            
            <Button
              variant={activeTab === "browse" ? "default" : "ghost"}
              className={cn(
                "justify-start",
                activeTab === "browse" ? "bg-cinema-purple text-white" : "text-cinema-text hover:bg-cinema-purple/20"
              )}
              onClick={() => setActiveTab("browse")}
            >
              <Tag className="h-5 w-5 mr-2" />
              {sidebarOpen && <span>Browse by Genre</span>}
            </Button>
            
            {searchResults.length > 0 && (
              <Button
                variant={activeTab === "search" ? "default" : "ghost"}
                className={cn(
                  "justify-start",
                  activeTab === "search" ? "bg-cinema-purple text-white" : "text-cinema-text hover:bg-cinema-purple/20"
                )}
                onClick={() => setActiveTab("search")}
              >
                <Search className="h-5 w-5 mr-2" />
                {sidebarOpen && <span>Search Results</span>}
              </Button>
            )}
          </nav>
          
          {sidebarOpen && selectedGenre && (
            <div className="p-4 mt-4 border-t border-cinema-purple/50">
              <h3 className="text-sm font-medium text-cinema-accent mb-2">Current Genre</h3>
              <div className="flex items-center">
                <span className="text-cinema-text">{selectedGenre}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-2 h-6 w-6 p-0"
                  onClick={() => setSelectedGenre(null)}
                >
                  &times;
                </Button>
              </div>
            </div>
          )}
          
          {sidebarOpen && (
            <div className="mt-auto p-4 text-xs text-cinema-text/50">
              Reel-Pin © {new Date().getFullYear()}
            </div>
          )}
        </aside>
        
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {showPreferences && (
            <div className="mb-6 p-4 bg-cinema-blue border border-cinema-purple/50 rounded-lg animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4 text-cinema-accent">Filter by Genre</h3>
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
                      
                      if (genre) {
                        setActiveTab("browse");
                      }
                    }} 
                  />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4 text-cinema-accent">Minimum Rating</h3>
                  <MinimumRatingSelector 
                    value={preferences.minimumRating} 
                    onChange={handleMinimumRatingChange} 
                  />
                </div>
              </div>
            </div>
          )}
          
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-cinema-accent">
              {activeTab === "discover" && "Recommended For You"}
              {activeTab === "browse" && (selectedGenre ? `${selectedGenre} Movies` : "Browse Movies")}
              {activeTab === "search" && `Search Results for "${searchQuery}"`}
            </h2>
          </div>
          
          {activeMovieList().length > 0 ? (
            <MasonryGrid columnCount={columnCount}>
              {activeMovieList().map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onRateMovie={handleRateMovie}
                  userRating={preferences.ratedMovies[movie.id]}
                  onClick={() => setSelectedMovie(movie)}
                />
              ))}
            </MasonryGrid>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Film className="h-12 w-12 text-cinema-purple/50 mb-4" />
              <p className="text-cinema-text/70 text-xl">
                {activeTab === "search" ? "No search results found" : "No movies to display"}
              </p>
              <p className="text-cinema-text/50 mt-2">
                {activeTab === "search" ? "Try a different search term" : "Try selecting a different genre"}
              </p>
            </div>
          )}
        </main>
      </div>
      
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

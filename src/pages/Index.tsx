
import { useState, useEffect } from "react";
import { Film, Search, Compass, Heart, Clock, Tag, HelpCircle, Settings, Palette, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
import OnboardingTour from "@/components/OnboardingTour";
import ThemeSelector from "@/components/ThemeSelector";
import Tooltip from "@/components/Tooltip";
import MovieQuiz from "@/components/MovieQuiz";

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

  // New state for features
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [firstVisit, setFirstVisit] = useState(true);
  const [viewMode, setViewMode] = useState<'masonry' | 'list' | 'poster'>('masonry');
  const [showWatchlist, setShowWatchlist] = useState(false);
  const [watchlist, setWatchlist] = useState<number[]>([]);

  useEffect(() => {
    // Check if this is user's first visit
    const hasVisitedBefore = localStorage.getItem('reel-pin-visited');
    if (!hasVisitedBefore) {
      setFirstVisit(true);
      setShowOnboarding(true);
      localStorage.setItem('reel-pin-visited', 'true');
    } else {
      setFirstVisit(false);
    }

    // Load user preferences from localStorage
    const savedPreferences = localStorage.getItem('reel-pin-preferences');
    if (savedPreferences) {
      try {
        setPreferences(JSON.parse(savedPreferences));
      } catch (error) {
        console.error('Error parsing saved preferences:', error);
      }
    }

    // Load watchlist from localStorage
    const savedWatchlist = localStorage.getItem('reel-pin-watchlist');
    if (savedWatchlist) {
      try {
        setWatchlist(JSON.parse(savedWatchlist));
      } catch (error) {
        console.error('Error parsing saved watchlist:', error);
      }
    }
  }, []);

  useEffect(() => {
    const newRecommendations = getRecommendations(preferences, MOVIES, 8);
    setRecommendations(newRecommendations);
    
    // Save preferences to localStorage
    localStorage.setItem('reel-pin-preferences', JSON.stringify(preferences));
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

  // Save watchlist to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('reel-pin-watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

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

  const handleToggleWatchlist = (movieId: number) => {
    setWatchlist(prev => {
      if (prev.includes(movieId)) {
        return prev.filter(id => id !== movieId);
      } else {
        return [...prev, movieId];
      }
    });
    
    const movie = MOVIES.find(m => m.id === movieId);
    if (movie) {
      toast({
        title: watchlist.includes(movieId) ? `Removed from Watchlist` : `Added to Watchlist`,
        description: watchlist.includes(movieId) 
          ? `"${movie.title}" has been removed from your watchlist` 
          : `"${movie.title}" has been added to your watchlist`,
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
      case "watchlist":
        return MOVIES.filter(movie => watchlist.includes(movie.id));
      case "discover":
      default:
        return recommendations;
    }
  };

  const handleComplete = (score: number) => {
    toast({
      title: "Quiz Completed!",
      description: `You scored ${score} out of 5. ${score > 3 ? "Great job!" : "Keep learning about movies!"}`,
    });
  };

  const handleThemeChange = (theme: any) => {
    // In a real implementation, we would apply the theme to the app
    // For now, just show a toast to acknowledge the change
    toast({
      title: "Theme Changed",
      description: `Switched to ${theme.name} theme`,
    });
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    toast({
      title: "Welcome to Reel-Pin!",
      description: "You can now start discovering movies. Enjoy!",
    });
  };

  const columnCount = isMobile ? 2 : (window.innerWidth < 1024 ? 3 : 4);
  const watchlistMovies = MOVIES.filter(movie => watchlist.includes(movie.id));

  return (
    <div className="min-h-screen bg-retro-white text-retro-gray">
      <header className="sticky top-0 z-10 bg-retro-gray border-b-4 border-retro-red p-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center">
              <Film className="h-8 w-8 text-retro-white mr-2" />
              <h1 className="text-2xl md:text-3xl font-bold text-retro-white font-mono">Reel-Pin</h1>
            </div>
            
            <div className="relative w-full max-w-xl mx-4">
              <Input
                type="text"
                placeholder="Search for movies..."
                className="w-full bg-retro-white border-retro-red text-retro-gray pl-4 pr-10 rounded-sm retro-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                data-tour="search"
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-0 top-0 h-full px-3 text-retro-gray hover:text-retro-red"
                onClick={handleSearch}
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="hidden md:flex items-center space-x-2">
              <Tooltip content="Take the movie quiz and test your knowledge!">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-retro-white border-retro-yellow bg-retro-yellow hover:bg-retro-yellow/80"
                  onClick={() => setShowQuiz(true)}
                >
                  <Star className="h-4 w-4 mr-2" />
                  Quiz
                </Button>
              </Tooltip>

              <Tooltip content="View personalized recommendations">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-retro-white border-retro-red bg-retro-red hover:bg-retro-darkred"
                  onClick={() => setShowPreferences(!showPreferences)}
                  data-tour="preferences"
                >
                  {showPreferences ? "Hide Filters" : "Preferences"}
                </Button>
              </Tooltip>
              
              <ThemeSelector onThemeChange={handleThemeChange} />
              
              <Tooltip content="Take a tour of Reel-Pin">
                <Button
                  variant="outline"
                  size="icon"
                  className="text-retro-white border-retro-white hover:bg-retro-white/20"
                  onClick={() => setShowOnboarding(true)}
                >
                  <HelpCircle className="h-5 w-5" />
                </Button>
              </Tooltip>
            </div>
          </div>
        </div>
      </header>

      <div className="retro-stripe w-full"></div>

      <div className="flex min-h-[calc(100vh-72px)]">
        <aside className={cn(
          "bg-retro-gray border-r-4 border-retro-red transition-all duration-300 flex flex-col",
          sidebarOpen ? "w-64" : isMobile ? "w-0 opacity-0" : "w-16"
        )}>
          {isMobile && (
            <Button 
              className="absolute top-20 left-4 z-20 bg-retro-red text-retro-white"
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
                "justify-start font-mono",
                activeTab === "discover" ? "bg-retro-red text-retro-white" : "text-retro-white hover:bg-retro-white/20"
              )}
              onClick={() => setActiveTab("discover")}
            >
              <Compass className="h-5 w-5 mr-2" />
              {sidebarOpen && <span>Discover</span>}
            </Button>
            
            <Button
              variant={activeTab === "browse" ? "default" : "ghost"}
              className={cn(
                "justify-start font-mono",
                activeTab === "browse" ? "bg-retro-red text-retro-white" : "text-retro-white hover:bg-retro-white/20"
              )}
              onClick={() => setActiveTab("browse")}
              data-tour="browse"
            >
              <Tag className="h-5 w-5 mr-2" />
              {sidebarOpen && <span>Browse by Genre</span>}
            </Button>
            
            <Button
              variant={activeTab === "watchlist" ? "default" : "ghost"}
              className={cn(
                "justify-start font-mono",
                activeTab === "watchlist" ? "bg-retro-red text-retro-white" : "text-retro-white hover:bg-retro-white/20"
              )}
              onClick={() => setActiveTab("watchlist")}
            >
              <Heart className="h-5 w-5 mr-2" />
              {sidebarOpen && <span>My Watchlist</span>}
              {watchlist.length > 0 && (
                <span className="ml-2 bg-retro-yellow text-retro-gray rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {watchlist.length}
                </span>
              )}
            </Button>
            
            {searchResults.length > 0 && (
              <Button
                variant={activeTab === "search" ? "default" : "ghost"}
                className={cn(
                  "justify-start font-mono",
                  activeTab === "search" ? "bg-retro-red text-retro-white" : "text-retro-white hover:bg-retro-white/20"
                )}
                onClick={() => setActiveTab("search")}
              >
                <Search className="h-5 w-5 mr-2" />
                {sidebarOpen && <span>Search Results</span>}
              </Button>
            )}

            {/* Layout Selection */}
            {sidebarOpen && (
              <div className="mt-6 border-t-2 border-retro-white/20 pt-6">
                <h3 className="text-xs text-retro-white/70 uppercase mb-3 font-mono">Display Mode</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "border-retro-white/30",
                      viewMode === "masonry" ? "bg-retro-yellow text-retro-gray" : "text-retro-white"
                    )}
                    onClick={() => setViewMode("masonry")}
                  >
                    Grid
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "border-retro-white/30",
                      viewMode === "list" ? "bg-retro-yellow text-retro-gray" : "text-retro-white"
                    )}
                    onClick={() => setViewMode("list")}
                  >
                    List
                  </Button>
                </div>
              </div>
            )}
          </nav>
          
          {sidebarOpen && selectedGenre && (
            <div className="p-4 mt-4 border-t-2 border-retro-white/20">
              <h3 className="text-xs text-retro-white/70 uppercase mb-2 font-mono">Current Genre</h3>
              <div className="flex items-center bg-retro-red/30 p-2 rounded-sm">
                <span className="text-retro-white">{selectedGenre}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-2 h-6 w-6 p-0 text-retro-white hover:bg-retro-red/50"
                  onClick={() => setSelectedGenre(null)}
                >
                  &times;
                </Button>
              </div>
            </div>
          )}
          
          {sidebarOpen && (
            <div className="mt-auto p-4 text-xs text-retro-white/50 border-t-2 border-retro-white/20">
              <p className="font-mono">Reel-Pin © {new Date().getFullYear()}</p>
              <p className="mt-1 text-retro-yellow cursor-pointer hover:underline" onClick={() => setShowOnboarding(true)}>
                Help & Tutorial
              </p>
            </div>
          )}
        </aside>
        
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {showPreferences && (
            <div className="mb-6 p-4 bg-retro-white border-4 border-retro-red rounded-sm animate-fade-in retro-shadow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4 text-retro-red font-mono">Filter by Genre</h3>
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
                  <h3 className="text-lg font-medium mb-4 text-retro-red font-mono">Minimum Rating</h3>
                  <MinimumRatingSelector 
                    value={preferences.minimumRating} 
                    onChange={handleMinimumRatingChange} 
                  />
                </div>
              </div>
            </div>
          )}
          
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-retro-red font-mono uppercase">
              {activeTab === "discover" && "Recommended For You"}
              {activeTab === "browse" && (selectedGenre ? `${selectedGenre} Movies` : "Browse Movies")}
              {activeTab === "search" && `Search Results for "${searchQuery}"`}
              {activeTab === "watchlist" && "My Watchlist"}
            </h2>
            
            {/* Mobile controls */}
            <div className="flex md:hidden gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-retro-red border-retro-red hover:bg-retro-red/10"
                onClick={() => setShowPreferences(!showPreferences)}
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-retro-yellow border-retro-yellow hover:bg-retro-yellow/10"
                onClick={() => setShowOnboarding(true)}
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Masonry Grid View */}
          {viewMode === 'masonry' && activeMovieList().length > 0 ? (
            <MasonryGrid columnCount={columnCount}>
              {activeMovieList().map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onRateMovie={handleRateMovie}
                  userRating={preferences.ratedMovies[movie.id]}
                  onClick={() => setSelectedMovie(movie)}
                  onToggleWatchlist={() => handleToggleWatchlist(movie.id)}
                  isInWatchlist={watchlist.includes(movie.id)}
                />
              ))}
            </MasonryGrid>
          ) : viewMode === 'list' && activeMovieList().length > 0 ? (
            // List View
            <div className="space-y-4">
              {activeMovieList().map((movie) => (
                <div 
                  key={movie.id}
                  className="flex border-2 border-retro-red bg-retro-white rounded-sm cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedMovie(movie)}
                >
                  <div className="w-24 h-36 flex-shrink-0">
                    <img 
                      src={movie.poster_path.startsWith('/') 
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : movie.poster_path
                      }
                      alt={movie.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://placehold.co/300x450/ffffff/A52A2A?text=No+Image';
                      }}
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-mono font-bold text-retro-gray">{movie.title}</h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-retro-yellow mr-1" />
                        <span className="text-sm">{movie.vote_average.toFixed(1)}</span>
                      </div>
                    </div>
                    <p className="text-xs text-retro-gray/70 mt-1">
                      {new Date(movie.release_date).getFullYear()} • {movie.genres.join(', ')}
                    </p>
                    <p className="text-sm mt-2 line-clamp-2">{movie.overview}</p>
                    <div className="mt-auto pt-2 flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-xs border-retro-red text-retro-red hover:bg-retro-red/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleWatchlist(movie.id);
                        }}
                      >
                        {watchlist.includes(movie.id) ? 'Remove from Watchlist' : 'Add to Watchlist'}
                      </Button>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <Star
                            key={rating}
                            className={`h-4 w-4 cursor-pointer ${
                              rating <= (preferences.ratedMovies[movie.id] || 0)
                                ? 'text-retro-yellow fill-retro-yellow'
                                : 'text-retro-gray/30'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRateMovie(
                                movie.id, 
                                rating === preferences.ratedMovies[movie.id] ? 0 : rating
                              );
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Film className="h-12 w-12 text-retro-red/50 mb-4" />
              <p className="text-retro-gray/70 text-xl font-mono">
                {activeTab === "watchlist" 
                  ? "Your watchlist is empty" 
                  : activeTab === "search" 
                    ? "No search results found" 
                    : "No movies to display"}
              </p>
              <p className="text-retro-gray/50 mt-2 font-mono">
                {activeTab === "watchlist" 
                  ? "Add movies to your watchlist by clicking the heart icon"
                  : activeTab === "search" 
                    ? "Try a different search term" 
                    : "Try selecting a different genre"}
              </p>
              {activeTab === "watchlist" && (
                <Button
                  className="mt-4 bg-retro-red text-retro-white hover:bg-retro-darkred"
                  onClick={() => setActiveTab("discover")}
                >
                  Discover Movies
                </Button>
              )}
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
        onToggleWatchlist={selectedMovie ? () => handleToggleWatchlist(selectedMovie.id) : undefined}
        isInWatchlist={selectedMovie ? watchlist.includes(selectedMovie.id) : false}
      />

      <OnboardingTour 
        isOpen={showOnboarding} 
        onComplete={handleOnboardingComplete} 
      />
      
      <MovieQuiz
        isOpen={showQuiz}
        onClose={() => setShowQuiz(false)}
        onComplete={handleComplete}
      />

      <BotpressChat showWidget={true} />
    </div>
  );
};

export default Index;

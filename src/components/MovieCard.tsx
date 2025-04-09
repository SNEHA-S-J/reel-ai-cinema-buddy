
import { Movie } from "@/types/movies";
import { Card } from "@/components/ui/card";
import { Star, ThumbsUp, Heart, Bookmark, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface MovieCardProps {
  movie: Movie;
  onRateMovie?: (id: number, rating: number) => void;
  userRating?: number;
  className?: string;
  onClick?: () => void;
}

const MovieCard = ({ 
  movie, 
  onRateMovie, 
  userRating,
  className,
  onClick 
}: MovieCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  // Default placeholder image if poster_path is not valid
  const posterUrl = movie.poster_path.startsWith('/') 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : movie.poster_path;
  
  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all duration-300 bg-white border-2 border-retro-red shadow-md rounded-sm retro-shadow",
        isHovered ? "transform -translate-y-1" : "",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="retro-stripe w-full"></div>
      <div className="relative aspect-auto overflow-hidden">
        <img 
          src={posterUrl} 
          alt={movie.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://placehold.co/300x450/ffffff/ea384c?text=No+Image';
          }}
        />
        
        <div className={cn(
          "absolute inset-0 bg-gradient-to-t from-retro-red/90 via-retro-red/40 to-transparent p-4 flex flex-col justify-end",
          isHovered ? "opacity-100" : "opacity-0 sm:opacity-0"
        )}>
          <div className="absolute top-2 right-2 flex gap-2">
            <div className="bg-white p-2 rounded-sm border-2 border-retro-red hover:bg-retro-cream cursor-pointer transition-colors">
              <Heart 
                className={cn("h-5 w-5", isSaved ? "text-retro-red fill-retro-red" : "text-retro-red")} 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSaved(!isSaved);
                }}
              />
            </div>
            <div className="bg-white p-2 rounded-sm border-2 border-retro-red hover:bg-retro-cream cursor-pointer transition-colors">
              <Share2 className="h-5 w-5 text-retro-red" onClick={(e) => e.stopPropagation()} />
            </div>
          </div>
          
          <h3 className="text-white font-bold text-lg uppercase tracking-wider font-mono">{movie.title}</h3>
          <p className="text-white/80 text-sm font-mono">{new Date(movie.release_date).getFullYear()}</p>
          
          <div className="flex items-center mt-2">
            <Star className="h-4 w-4 text-white" fill="currentColor" />
            <span className="text-white ml-1 text-sm font-mono">{movie.vote_average.toFixed(1)}</span>
          </div>
          
          {onRateMovie && (
            <div className="flex mt-3 gap-1">
              {[1, 2, 3, 4, 5].map((rating) => (
                <ThumbsUp
                  key={rating}
                  className={cn(
                    "h-5 w-5 cursor-pointer transition-all",
                    rating <= (userRating || 0) 
                      ? "text-white fill-white" 
                      : "text-white/50"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRateMovie(movie.id, rating === userRating ? 0 : rating);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-retro-red text-white">
        <p className="text-white text-xs truncate font-mono uppercase tracking-wider">{movie.title} ({new Date(movie.release_date).getFullYear()})</p>
      </div>
    </Card>
  );
};

export default MovieCard;


import { Movie } from "@/types/movies";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ThumbsUp } from "lucide-react";
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
  
  // Default placeholder image if poster_path is not valid
  const posterUrl = movie.poster_path.startsWith('/') 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : movie.poster_path;
  
  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all duration-300 bg-cinema-blue border-cinema-purple",
        isHovered ? "scale-105 shadow-lg shadow-cinema-purple/30" : "",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <img 
          src={posterUrl} 
          alt={movie.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://placehold.co/300x450/121212/e9b649?text=No+Image';
          }}
        />
        
        <div className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/90 to-transparent p-4 flex flex-col justify-end transition-opacity",
          isHovered ? "opacity-100" : "opacity-0 sm:opacity-100"
        )}>
          <h3 className="text-cinema-text font-bold text-lg line-clamp-2">{movie.title}</h3>
          <p className="text-cinema-text/80 text-sm">{new Date(movie.release_date).getFullYear()}</p>
          
          <div className="flex items-center mt-1">
            <Star className="h-4 w-4 text-cinema-accent" fill="currentColor" />
            <span className="text-cinema-text ml-1 text-sm">{movie.vote_average.toFixed(1)}</span>
          </div>
        </div>
      </div>
      
      {onRateMovie && (
        <CardContent className="p-3 bg-cinema-blue">
          <div className="flex justify-between items-center">
            <span className="text-sm text-cinema-text">Your Rating:</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((rating) => (
                <ThumbsUp
                  key={rating}
                  className={cn(
                    "h-5 w-5 mx-0.5 cursor-pointer transition-all",
                    rating <= (userRating || 0) ? "text-cinema-accent" : "text-gray-500"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRateMovie(movie.id, rating === userRating ? 0 : rating);
                  }}
                  fill={rating <= (userRating || 0) ? "currentColor" : "none"}
                />
              ))}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default MovieCard;

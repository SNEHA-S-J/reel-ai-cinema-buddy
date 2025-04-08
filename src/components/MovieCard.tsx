
import { Movie } from "@/types/movies";
import { Card, CardContent } from "@/components/ui/card";
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
        "relative overflow-hidden transition-all duration-300 bg-cinema-blue border-none rounded-xl shadow-md",
        isHovered ? "shadow-xl shadow-cinema-purple/20" : "",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="relative aspect-auto overflow-hidden">
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
          "absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 flex flex-col justify-end",
          isHovered ? "opacity-100" : "opacity-0 sm:opacity-0"
        )}>
          <div className="absolute top-2 right-2 flex gap-2">
            <div className="bg-black/60 p-2 rounded-full hover:bg-cinema-purple/80 cursor-pointer transition-colors">
              <Heart 
                className={cn("h-5 w-5", isSaved ? "text-red-500 fill-red-500" : "text-white")} 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSaved(!isSaved);
                }}
              />
            </div>
            <div className="bg-black/60 p-2 rounded-full hover:bg-cinema-purple/80 cursor-pointer transition-colors">
              <Share2 className="h-5 w-5 text-white" onClick={(e) => e.stopPropagation()} />
            </div>
          </div>
          
          <h3 className="text-cinema-text font-bold text-lg">{movie.title}</h3>
          <p className="text-cinema-text/80 text-sm">{new Date(movie.release_date).getFullYear()}</p>
          
          <div className="flex items-center mt-2">
            <Star className="h-4 w-4 text-cinema-accent" fill="currentColor" />
            <span className="text-cinema-text ml-1 text-sm">{movie.vote_average.toFixed(1)}</span>
          </div>
          
          {onRateMovie && (
            <div className="flex mt-3 gap-1">
              {[1, 2, 3, 4, 5].map((rating) => (
                <ThumbsUp
                  key={rating}
                  className={cn(
                    "h-5 w-5 cursor-pointer transition-all",
                    rating <= (userRating || 0) 
                      ? "text-cinema-accent fill-cinema-accent" 
                      : "text-gray-400/80"
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
      
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 sm:opacity-100">
        <p className="text-white text-xs truncate">{movie.title} ({new Date(movie.release_date).getFullYear()})</p>
      </div>
    </Card>
  );
};

export default MovieCard;

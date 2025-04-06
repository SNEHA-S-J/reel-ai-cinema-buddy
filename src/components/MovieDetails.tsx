
import { Movie } from "@/types/movies";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MovieDetailsProps {
  movie: Movie | null;
  open: boolean;
  onClose: () => void;
  onRateMovie?: (id: number, rating: number) => void;
  userRating?: number;
}

const MovieDetails = ({ movie, open, onClose, onRateMovie, userRating }: MovieDetailsProps) => {
  if (!movie) return null;

  const posterUrl = movie.poster_path.startsWith('/') 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : movie.poster_path;

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl bg-cinema-blue text-cinema-text border-cinema-purple">
        <DialogHeader>
          <DialogTitle className="text-2xl text-cinema-accent flex items-center justify-between">
            {movie.title}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="text-cinema-text hover:text-cinema-accent"
            >
              <X className="h-5 w-5" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-4">
          <div className="aspect-[2/3] relative overflow-hidden rounded-md">
            <img 
              src={posterUrl} 
              alt={movie.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://placehold.co/300x450/121212/e9b649?text=No+Image';
              }}
            />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center mb-4">
              <Star className="h-5 w-5 text-cinema-accent" fill="currentColor" />
              <span className="ml-2">{movie.vote_average.toFixed(1)} / 10</span>
              <span className="ml-4 text-cinema-text/70">{new Date(movie.release_date).toLocaleDateString()}</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genres.map((genre) => (
                <Badge key={genre} className="bg-cinema-purple text-cinema-text hover:bg-cinema-purple/80">
                  {genre}
                </Badge>
              ))}
            </div>

            <p className="text-cinema-text/90 mb-6">{movie.overview}</p>

            {onRateMovie && (
              <div className="mt-auto">
                <p className="text-sm mb-2">Rate this movie:</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Button 
                      key={rating} 
                      variant={rating <= (userRating || 0) ? "default" : "outline"}
                      className={
                        rating <= (userRating || 0)
                          ? "bg-cinema-accent text-cinema-blue hover:bg-cinema-accent/90" 
                          : "border-cinema-accent text-cinema-accent hover:bg-cinema-purple/20"
                      }
                      onClick={() => onRateMovie(movie.id, rating === userRating ? 0 : rating)}
                    >
                      {rating}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MovieDetails;

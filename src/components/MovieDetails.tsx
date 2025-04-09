
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
      <DialogContent className="max-w-4xl bg-white text-retro-gray border-2 border-retro-red rounded-sm p-0 overflow-hidden">
        <div className="retro-stripe w-full"></div>
        <DialogHeader className="p-6">
          <DialogTitle className="text-2xl text-retro-red flex items-center justify-between font-mono uppercase tracking-wider">
            {movie.title}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="text-retro-red hover:text-retro-darkred hover:bg-transparent"
            >
              <X className="h-5 w-5" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 p-6 pt-0">
          <div className="aspect-[2/3] relative overflow-hidden border-2 border-retro-red rounded-sm retro-shadow">
            <img 
              src={posterUrl} 
              alt={movie.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://placehold.co/300x450/ffffff/ea384c?text=No+Image';
              }}
            />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center mb-4">
              <Star className="h-5 w-5 text-retro-red" fill="currentColor" />
              <span className="ml-2 font-mono">{movie.vote_average.toFixed(1)} / 10</span>
              <span className="ml-4 text-retro-gray/70 font-mono">{new Date(movie.release_date).toLocaleDateString()}</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genres.map((genre) => (
                <Badge key={genre} className="bg-retro-red text-white hover:bg-retro-darkred border-0 rounded-sm uppercase tracking-wider font-mono">
                  {genre}
                </Badge>
              ))}
            </div>

            <p className="text-retro-gray mb-6 font-mono">{movie.overview}</p>

            {onRateMovie && (
              <div className="mt-auto">
                <p className="text-sm mb-2 font-mono uppercase tracking-wider">Rate this movie:</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Button 
                      key={rating} 
                      variant={rating <= (userRating || 0) ? "default" : "outline"}
                      className={
                        rating <= (userRating || 0)
                          ? "bg-retro-red text-white hover:bg-retro-darkred rounded-sm border-2 border-retro-darkred font-mono uppercase" 
                          : "border-retro-red text-retro-red hover:bg-retro-lightred/20 rounded-sm border-2 font-mono uppercase"
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


import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ALL_GENRES } from "@/data/movies";
import { MovieGenre } from "@/types/movies";
import { cn } from "@/lib/utils";

interface GenreSelectorProps {
  value: MovieGenre | null;
  onChange: (value: MovieGenre | null) => void;
}

const GenreSelector = ({ value, onChange }: GenreSelectorProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-cinema-blue border-cinema-purple text-cinema-text hover:bg-cinema-purple/20"
        >
          {value ? value : "Select genre..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-cinema-blue border-cinema-purple text-cinema-text">
        <Command>
          <CommandInput placeholder="Search genres..." className="text-cinema-text" />
          <CommandEmpty>No genre found.</CommandEmpty>
          <CommandGroup>
            <CommandItem
              key="all"
              value="all"
              onSelect={() => {
                onChange(null);
                setOpen(false);
              }}
              className="hover:bg-cinema-purple/20"
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  !value ? "opacity-100" : "opacity-0"
                )}
              />
              All Genres
            </CommandItem>
            
            {ALL_GENRES.map((genre) => (
              <CommandItem
                key={genre}
                value={genre}
                onSelect={() => {
                  onChange(genre as MovieGenre);
                  setOpen(false);
                }}
                className="hover:bg-cinema-purple/20"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === genre ? "opacity-100" : "opacity-0"
                  )}
                />
                {genre}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default GenreSelector;

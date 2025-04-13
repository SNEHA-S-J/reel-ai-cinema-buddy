
interface QuickSuggestionsProps {
  starters: string[];
  onSelectSuggestion: (suggestion: string) => void;
}

const QuickSuggestions = ({ starters, onSelectSuggestion }: QuickSuggestionsProps) => {
  return (
    <div className="bg-retro-white border-2 border-retro-red rounded-sm p-3 shadow-lg animate-fade-in retro-shadow">
      <h4 className="font-mono text-retro-red font-bold mb-2 text-sm">Quick Questions:</h4>
      <div className="flex flex-col gap-2">
        {starters.map((starter, index) => (
          <button
            key={index}
            onClick={() => onSelectSuggestion(starter)}
            className="text-xs text-left bg-retro-yellow border border-retro-red text-retro-gray py-1 px-2 rounded-sm hover:bg-retro-yellow/80 font-mono transition-colors truncate"
            title={starter}
          >
            {starter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickSuggestions;

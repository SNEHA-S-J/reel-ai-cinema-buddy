
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface MinimumRatingSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

const MinimumRatingSelector = ({ value, onChange }: MinimumRatingSelectorProps) => {
  const [localValue, setLocalValue] = useState(value);
  
  const handleChange = (newValue: number[]) => {
    const value = newValue[0];
    setLocalValue(value);
    onChange(value);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="min-rating" className="text-cinema-text">
          Minimum Rating: {localValue.toFixed(1)}
        </Label>
      </div>
      <Slider
        id="min-rating"
        min={0}
        max={10}
        step={0.5}
        value={[localValue]}
        onValueChange={handleChange}
        className="w-full"
      />
    </div>
  );
};

export default MinimumRatingSelector;


import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Palette, Check, X } from "lucide-react";

interface Theme {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
}

const THEMES: Theme[] = [
  {
    name: 'Retro Red & White',
    primaryColor: '#A52A2A', // Auburn
    secondaryColor: '#F5D04F', // Hunyadi Yellow
    backgroundColor: '#FFFFF0', // Vanilla
    textColor: '#2F4F4F', // Dark Slate Gray
  },
  {
    name: 'Classic Cinema',
    primaryColor: '#B8860B', // Dark Goldenrod
    secondaryColor: '#1E1E1E', // Almost Black
    backgroundColor: '#1E1E1E',
    textColor: '#D4AF37', // Metallic Gold
  },
  {
    name: 'Modern Minimalist',
    primaryColor: '#333333', // Dark Gray
    secondaryColor: '#CCCCCC', // Light Gray
    backgroundColor: '#FFFFFF', // White
    textColor: '#333333', // Dark Gray
  },
  {
    name: 'Neon Lights',
    primaryColor: '#FF00FF', // Magenta
    secondaryColor: '#00FFFF', // Cyan
    backgroundColor: '#121212', // Very Dark Gray
    textColor: '#FFFFFF', // White
  },
  {
    name: 'Dark Mode',
    primaryColor: '#BB86FC', // Purple
    secondaryColor: '#03DAC6', // Teal
    backgroundColor: '#121212', // Very Dark Gray
    textColor: '#E1E1E1', // Light Gray
  },
];

interface ThemeSelectorProps {
  onThemeChange: (theme: Theme) => void;
}

const ThemeSelector = ({ onThemeChange }: ThemeSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<Theme>(THEMES[0]);

  const handleThemeSelect = (theme: Theme) => {
    setSelectedTheme(theme);
    onThemeChange(theme);
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 border-retro-red text-retro-red hover:bg-retro-red/10"
      >
        <Palette className="h-4 w-4" />
        <span>Theme</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-retro-white border-2 border-retro-red rounded-sm p-0 max-w-md">
          <div className="retro-stripe w-full"></div>
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-2xl text-retro-red flex items-center justify-between font-mono uppercase tracking-wider">
              <span>Choose a Theme</span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setOpen(false)}
                className="text-retro-red hover:text-retro-darkred hover:bg-transparent"
              >
                <X className="h-5 w-5" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          <div className="p-6 grid grid-cols-1 gap-4">
            {THEMES.map((theme) => (
              <div
                key={theme.name}
                className={`p-4 border-2 rounded-sm cursor-pointer transition-all flex items-center justify-between ${
                  selectedTheme.name === theme.name 
                    ? 'border-retro-yellow bg-retro-yellow/10' 
                    : 'border-retro-gray/30 hover:border-retro-red'
                }`}
                onClick={() => handleThemeSelect(theme)}
                style={{ 
                  backgroundColor: theme.backgroundColor,
                  color: theme.textColor
                }}
              >
                <div className="flex items-center">
                  <div className="flex gap-2 mr-3">
                    <div 
                      className="w-6 h-6 rounded-full" 
                      style={{ backgroundColor: theme.primaryColor }}
                    />
                    <div 
                      className="w-6 h-6 rounded-full" 
                      style={{ backgroundColor: theme.secondaryColor }}
                    />
                  </div>
                  <span className="font-mono font-bold">{theme.name}</span>
                </div>
                
                {selectedTheme.name === theme.name && (
                  <Check className="h-5 w-5" style={{ color: theme.primaryColor }} />
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ThemeSelector;

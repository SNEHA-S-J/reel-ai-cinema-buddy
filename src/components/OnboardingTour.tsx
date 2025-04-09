
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight, Lightbulb } from "lucide-react";

interface OnboardingStep {
  title: string;
  description: string;
  image?: string;
  highlightSelector?: string;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    title: "Welcome to Reel-Pin!",
    description: "Discover your next favorite movies with our retro-themed recommendation system. Let's take a quick tour!",
  },
  {
    title: "Browse Movies",
    description: "Find movies by genre, rating, or discover personalized recommendations based on your preferences.",
    highlightSelector: "[data-tour='browse']",
  },
  {
    title: "Film Details",
    description: "Click on any movie poster to see detailed information and give it your personal rating.",
    highlightSelector: ".grid > div:first-child",
  },
  {
    title: "AI Assistant",
    description: "Need help? Our AI assistant can recommend movies, answer questions, and help you navigate the site!",
    highlightSelector: "#bp-web-widget-container",
  },
  {
    title: "Customize Your Experience",
    description: "Set your movie preferences to get personalized recommendations tailored just for you.",
    highlightSelector: "[data-tour='preferences']",
  },
];

interface OnboardingTourProps {
  onComplete: () => void;
  isOpen: boolean;
}

const OnboardingTour = ({ onComplete, isOpen }: OnboardingTourProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (open && ONBOARDING_STEPS[currentStep].highlightSelector) {
      const element = document.querySelector(ONBOARDING_STEPS[currentStep].highlightSelector);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('relative', 'z-40', 'ring-4', 'ring-retro-yellow', 'ring-opacity-70');
      }
      
      return () => {
        if (element) {
          element.classList.remove('relative', 'z-40', 'ring-4', 'ring-retro-yellow', 'ring-opacity-70');
        }
      };
    }
  }, [currentStep, open]);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setOpen(false);
    onComplete();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent 
        className="bg-retro-white border-4 border-retro-red rounded-sm p-0 max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="retro-stripe w-full"></div>
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl text-retro-red flex items-center justify-between font-mono uppercase tracking-wider">
            <div className="flex items-center">
              <Lightbulb className="h-5 w-5 mr-2 text-retro-yellow" />
              {ONBOARDING_STEPS[currentStep].title}
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleComplete}
              className="text-retro-red hover:text-retro-darkred hover:bg-transparent"
            >
              <X className="h-5 w-5" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="p-6">
          <p className="text-retro-gray font-mono mb-6">
            {ONBOARDING_STEPS[currentStep].description}
          </p>
          
          {ONBOARDING_STEPS[currentStep].image && (
            <div className="mb-6 retro-border p-1">
              <img 
                src={ONBOARDING_STEPS[currentStep].image} 
                alt={ONBOARDING_STEPS[currentStep].title}
                className="w-full" 
              />
            </div>
          )}
          
          <div className="flex items-center justify-between mt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="border-retro-red text-retro-red hover:bg-retro-red/10"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            <div className="flex gap-1">
              {ONBOARDING_STEPS.map((_, index) => (
                <div 
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentStep ? 'bg-retro-red' : 'bg-retro-red/30'
                  }`}
                />
              ))}
            </div>
            
            <Button
              onClick={handleNext}
              className="bg-retro-red text-retro-white hover:bg-retro-darkred"
            >
              {currentStep < ONBOARDING_STEPS.length - 1 ? (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              ) : (
                "Get Started!"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingTour;

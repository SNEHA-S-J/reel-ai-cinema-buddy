
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, Award } from "lucide-react";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

const SAMPLE_QUIZ: QuizQuestion[] = [
  {
    question: "Which movie won the Academy Award for Best Picture in 2020?",
    options: ["1917", "Joker", "Parasite", "Once Upon a Time in Hollywood"],
    correctAnswer: 2
  },
  {
    question: "Who directed the movie 'Inception'?",
    options: ["Christopher Nolan", "Steven Spielberg", "Martin Scorsese", "Quentin Tarantino"],
    correctAnswer: 0
  },
  {
    question: "Which of these actors has NOT played Batman?",
    options: ["Michael Keaton", "Christian Bale", "Tom Hardy", "Ben Affleck"],
    correctAnswer: 2
  },
  {
    question: "Which movie features a character named Jack Dawson?",
    options: ["The Great Gatsby", "Titanic", "The Departed", "Django Unchained"],
    correctAnswer: 1
  },
  {
    question: "What year was the first 'Star Wars' movie released?",
    options: ["1975", "1977", "1980", "1983"],
    correctAnswer: 1
  }
];

interface MovieQuizProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (score: number) => void;
}

const MovieQuiz = ({ isOpen, onClose, onComplete }: MovieQuizProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQuestion = SAMPLE_QUIZ[currentQuestionIndex];

  const handleAnswerSelect = (answerIndex: number) => {
    if (showAnswer) return;
    
    setSelectedAnswer(answerIndex);
    setShowAnswer(true);
    
    if (answerIndex === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < SAMPLE_QUIZ.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    } else {
      setQuizCompleted(true);
      onComplete(score);
    }
  };

  const handleClose = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setScore(0);
    setQuizCompleted(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-retro-white border-4 border-retro-red rounded-sm p-0 max-w-md">
        <div className="retro-stripe w-full"></div>
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl text-retro-red flex items-center justify-between font-mono uppercase tracking-wider">
            <div className="flex items-center">
              {quizCompleted ? (
                <>
                  <Award className="h-5 w-5 mr-2 text-retro-yellow" />
                  Quiz Results
                </>
              ) : (
                <>Movie Quiz</>
              )}
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleClose}
              className="text-retro-red hover:text-retro-darkred hover:bg-transparent"
            >
              <X className="h-5 w-5" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="p-6">
          {!quizCompleted ? (
            <>
              <div className="mb-6">
                <div className="flex justify-between text-sm text-retro-gray mb-2">
                  <span>Question {currentQuestionIndex + 1} of {SAMPLE_QUIZ.length}</span>
                  <span>Score: {score}</span>
                </div>
                <p className="text-retro-gray font-mono font-bold text-lg mb-4">
                  {currentQuestion.question}
                </p>
                
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className={`w-full justify-start font-mono text-left p-4 h-auto ${
                        selectedAnswer === null 
                          ? "border-retro-gray/50 hover:border-retro-red" 
                          : selectedAnswer === index 
                            ? index === currentQuestion.correctAnswer
                              ? "border-green-500 bg-green-500/10"
                              : "border-red-500 bg-red-500/10"
                            : index === currentQuestion.correctAnswer && showAnswer
                              ? "border-green-500 bg-green-500/10"
                              : "border-retro-gray/50 opacity-50"
                      }`}
                      onClick={() => handleAnswerSelect(index)}
                    >
                      <span className="mr-2">{String.fromCharCode(65 + index)}.</span>
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
              
              {showAnswer && (
                <div className="text-center">
                  <p className={`font-bold mb-4 ${
                    selectedAnswer === currentQuestion.correctAnswer 
                      ? "text-green-600" 
                      : "text-red-600"
                  }`}>
                    {selectedAnswer === currentQuestion.correctAnswer 
                      ? "Correct!" 
                      : `Incorrect. The correct answer is ${String.fromCharCode(65 + currentQuestion.correctAnswer)}.`}
                  </p>
                  <Button
                    onClick={handleNextQuestion}
                    className="bg-retro-red text-retro-white hover:bg-retro-darkred"
                  >
                    {currentQuestionIndex < SAMPLE_QUIZ.length - 1 ? "Next Question" : "See Results"}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center">
              <div className="text-6xl font-bold text-retro-red mb-4">
                {score}/{SAMPLE_QUIZ.length}
              </div>
              <p className="text-retro-gray font-mono mb-6">
                {score === SAMPLE_QUIZ.length 
                  ? "Perfect score! You're a movie expert!" 
                  : score >= SAMPLE_QUIZ.length / 2 
                    ? "Great job! You know your movies well!" 
                    : "Keep watching more movies to improve your knowledge!"}
              </p>
              <Button
                onClick={handleClose}
                className="bg-retro-red text-retro-white hover:bg-retro-darkred"
              >
                Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MovieQuiz;

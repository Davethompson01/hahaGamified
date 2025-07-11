import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { useToast } from '../ui/use-toast';
import { ArrowLeft, Clock, Trophy, Zap, Brain, Target } from 'lucide-react';

export interface Language {
  id: string;
  name: string;
  flag: string;
  gradient: string;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

interface EnhancedQuizGameplayProps {
  language: Language;
  onBackToLanguageSelect: () => void;
}

const EnhancedQuizGameplay: React.FC<EnhancedQuizGameplayProps> = ({
  language,
  onBackToLanguageSelect
}) => {
  if (!language || !language.name) {
    return <div>Loading...</div>;
  }
  const { toast } = useToast();
  
  // Game state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [countdown, setCountdown] = useState(3);

  // Sample questions with proper randomization
  const questions: Question[] = [
    {
      id: 1,
      question: `What is "Hello" in ${language.name}?`,
      options: language.id === 'spanish' ? ['Hola', 'Adiós', 'Gracias', 'Por favor'] :
               language.id === 'french' ? ['Bonjour', 'Au revoir', 'Merci', 'S\'il vous plaît'] :
               language.id === 'german' ? ['Hallo', 'Auf Wiedersehen', 'Danke', 'Bitte'] :
               language.id === 'italian' ? ['Ciao', 'Arrivederci', 'Grazie', 'Prego'] :
               language.id === 'hindi' ? ['नमस्ते', 'अलविदा', 'धन्यवाद', 'कृपया'] :
               ['Hello', 'Goodbye', 'Thank you', 'Please'],
      correctAnswer: 0,
      difficulty: 'easy',
      points: 10
    },
    {
      id: 2,
      question: `What is "Thank you" in ${language.name}?`,
      options: language.id === 'spanish' ? ['Por favor', 'Hola', 'Gracias', 'Adiós'] :
               language.id === 'french' ? ['S\'il vous plaît', 'Bonjour', 'Merci', 'Au revoir'] :
               language.id === 'german' ? ['Bitte', 'Hallo', 'Danke', 'Auf Wiedersehen'] :
               language.id === 'italian' ? ['Prego', 'Ciao', 'Grazie', 'Arrivederci'] :
               language.id === 'hindi' ? ['कृपया', 'नमस्ते', 'धन्यवाद', 'अलविदा'] :
               ['Please', 'Hello', 'Thank you', 'Goodbye'],
      correctAnswer: 2,
      difficulty: 'easy',
      points: 10
    },
    {
      id: 3,
      question: `What is "Goodbye" in ${language.name}?`,
      options: language.id === 'spanish' ? ['Gracias', 'Hola', 'Por favor', 'Adiós'] :
               language.id === 'french' ? ['Merci', 'Bonjour', 'S\'il vous plaît', 'Au revoir'] :
               language.id === 'german' ? ['Danke', 'Hallo', 'Bitte', 'Auf Wiedersehen'] :
               language.id === 'italian' ? ['Grazie', 'Ciao', 'Prego', 'Arrivederci'] :
               language.id === 'hindi' ? ['धन्यवाद', 'नमस्ते', 'कृपया', 'अलविदा'] :
               ['Thank you', 'Hello', 'Please', 'Goodbye'],
      correctAnswer: 3,
      difficulty: 'medium',
      points: 15
    },
    {
      id: 4,
      question: `What is "Please" in ${language.name}?`,
      options: language.id === 'spanish' ? ['Adiós', 'Por favor', 'Hola', 'Gracias'] :
               language.id === 'french' ? ['Au revoir', 'S\'il vous plaît', 'Bonjour', 'Merci'] :
               language.id === 'german' ? ['Auf Wiedersehen', 'Bitte', 'Hallo', 'Danke'] :
               language.id === 'italian' ? ['Arrivederci', 'Prego', 'Ciao', 'Grazie'] :
               language.id === 'hindi' ? ['अलविदा', 'कृपया', 'नमस्ते', 'धन्यवाद'] :
               ['Goodbye', 'Please', 'Hello', 'Thank you'],
      correctAnswer: 1,
      difficulty: 'medium',
      points: 15
    },
    {
      id: 5,
      question: `What is "Water" in ${language.name}?`,
      options: language.id === 'spanish' ? ['Fuego', 'Agua', 'Tierra', 'Aire'] :
               language.id === 'french' ? ['Feu', 'Eau', 'Terre', 'Air'] :
               language.id === 'german' ? ['Feuer', 'Wasser', 'Erde', 'Luft'] :
               language.id === 'italian' ? ['Fuoco', 'Acqua', 'Terra', 'Aria'] :
               language.id === 'hindi' ? ['आग', 'पानी', 'धरती', 'हवा'] :
               ['Fire', 'Water', 'Earth', 'Air'],
      correctAnswer: 1,
      difficulty: 'hard',
      points: 20
    }
  ];

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex) / questions.length) * 100;

  // Game initialization countdown
  useEffect(() => {
    if (!gameStarted && countdown > 0) {
      const timer = setTimeout(() => {
        if (countdown === 1) {
          setGameStarted(true);
          setTimeLeft(15);
        } else {
          setCountdown(countdown - 1);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, gameStarted]);

  // Timer logic
  useEffect(() => {
    if (!gameStarted || isAnswered || gameComplete) return;

    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Time's up - auto move to next
      handleTimeUp();
    }
  }, [timeLeft, gameStarted, isAnswered, gameComplete]);

  const handleTimeUp = useCallback(() => {
    setIsAnswered(true);
    setStreak(0);
    toast({
      title: "⏰ Time's Up!",
      description: "Moving to next question...",
      variant: "destructive"
    });
    
    setTimeout(() => {
      moveToNextQuestion();
    }, 1500);
  }, []);

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft * 2);
      const streakBonus = streak >= 2 ? Math.floor(streak * 5) : 0;
      const totalPoints = currentQuestion.points + timeBonus + streakBonus;
      
      setScore(prev => prev + totalPoints);
      setStreak(prev => {
        const newStreak = prev + 1;
        setMaxStreak(current => Math.max(current, newStreak));
        return newStreak;
      });
      
      toast({
        title: "🎉 Correct!",
        description: `+${totalPoints} points (${timeBonus} time bonus, ${streakBonus} streak bonus)`,
      });
    } else {
      setStreak(0);
      toast({
        title: "❌ Incorrect!",
        description: `The correct answer was: ${currentQuestion.options[currentQuestion.correctAnswer]}`,
        variant: "destructive"
      });
    }
    
    // Auto move to next question after 2 seconds
    setTimeout(() => {
      moveToNextQuestion();
    }, 2000);
  };

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setTimeLeft(15);
    } else {
      setGameComplete(true);
      toast({
        title: "🏆 Quiz Complete!",
        description: `Final Score: ${score} points`,
      });
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setTimeLeft(15);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setGameComplete(false);
    setGameStarted(false);
    setCountdown(3);
  };

  if (!gameStarted) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-2">
        <Card className="w-full max-w-lg bg-white/95 backdrop-blur-sm shadow-2xl border-2 border-white/30 animate-scale-in">
          <CardHeader className="text-center">
            <div className="text-6xl mb-4">{language.flag}</div>
            <CardTitle className={`text-3xl bg-gradient-to-r ${language.gradient} bg-clip-text text-transparent`}>
              {language.name} Quiz
            </CardTitle>
            <p className="text-gray-600 mt-2">Get ready to test your knowledge!</p>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-8xl font-bold text-purple-600 mb-4">
              {countdown}
            </div>
            <p className="text-lg text-gray-700">Starting in...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameComplete) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 p-2">
        <Card className="w-full max-w-2xl bg-white/95 backdrop-blur-sm shadow-2xl border-2 border-white/30 animate-scale-in">
          <CardHeader className="text-center">
            <div className="text-6xl mb-4">🏆</div>
            <CardTitle className="text-4xl bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
              Quiz Complete!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
                <Trophy className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <p className="text-2xl font-bold text-blue-700">{score}</p>
                <p className="text-sm text-blue-600">Final Score</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-xl">
                <Target className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <p className="text-2xl font-bold text-green-700">{maxStreak}</p>
                <p className="text-sm text-green-600">Best Streak</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl">
                <Brain className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <p className="text-2xl font-bold text-purple-700">{Math.round((score / (questions.length * 20)) * 100)}%</p>
                <p className="text-sm text-purple-600">Accuracy</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={restartQuiz}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transform hover:scale-105 transition-all duration-200"
              >
                🔄 Play Again
              </Button>
              <Button 
                onClick={onBackToLanguageSelect}
                variant="outline"
                className="border-purple-400 text-purple-600 hover:bg-purple-50 transform hover:scale-105 transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Choose Language
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-2 flex items-center justify-center">
      <div className="w-full max-w-4xl mx-auto">
        <Card className="w-full bg-white/95 backdrop-blur-sm shadow-2xl border-2 border-white/30 animate-fade-in" style={{ width: '95%', margin: '0 auto' }}>
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center mb-4">
              <Button 
                onClick={onBackToLanguageSelect}
                variant="outline"
                size="sm"
                className="border-purple-400 text-purple-600 hover:bg-purple-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{language.flag}</span>
                <Badge className={`bg-gradient-to-r ${language.gradient} text-white`}>
                  {language.name}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-4">
              <Progress value={progress} className="h-3" />
              <div className="flex flex-wrap justify-between items-center gap-2">
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-blue-500 text-white">
                    <Trophy className="w-3 h-3 mr-1" />
                    Score: {score}
                  </Badge>
                  <Badge className="bg-green-500 text-white">
                    <Zap className="w-3 h-3 mr-1" />
                    Streak: {streak}
                  </Badge>
                  <Badge className="bg-purple-500 text-white">
                    Question {currentQuestionIndex + 1}/{questions.length}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className={`w-5 h-5 ${timeLeft <= 5 ? 'text-red-500' : 'text-blue-500'}`} />
                  <span className={`text-xl font-bold ${timeLeft <= 5 ? 'text-red-500' : 'text-blue-600'}`}>
                    {timeLeft}s
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6" style={{ wordWrap: 'break-word', hyphens: 'auto' }}>
                {currentQuestion.question}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentQuestion.options.map((option, index) => {
                  let buttonClass = "p-4 text-left text-base md:text-lg font-medium transition-all duration-200 transform hover:scale-105 min-h-[60px] flex items-center justify-center";
                  
                  if (isAnswered) {
                    if (index === currentQuestion.correctAnswer) {
                      buttonClass += " bg-green-500 text-white";
                    } else if (index === selectedAnswer && index !== currentQuestion.correctAnswer) {
                      buttonClass += " bg-red-500 text-white";
                    } else {
                      buttonClass += " bg-gray-200 text-gray-600";
                    }
                  } else {
                    buttonClass += " bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 hover:from-purple-200 hover:to-pink-200 border-2 border-purple-200 hover:border-purple-300";
                  }
                  
                  return (
                    <Button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={isAnswered}
                      className={buttonClass}
                      style={{ 
                        whiteSpace: 'normal', 
                        wordWrap: 'break-word',
                        textAlign: 'center',
                        padding: '16px',
                        height: 'auto',
                        minHeight: '60px'
                      }}
                    >
                      <span className="w-full text-center">
                        {String.fromCharCode(65 + index)}. {option}
                      </span>
                    </Button>
                  );
                })}
              </div>
            </div>
            
            {isAnswered && (
              <div className="text-center">
                <div className="inline-flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-500 border-t-transparent"></div>
                  <span className="text-sm text-gray-600">Next question loading...</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedQuizGameplay;

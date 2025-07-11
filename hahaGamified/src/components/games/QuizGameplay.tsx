
// import React, { useState, useEffect } from 'react';
// import { Button } from "../ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
// import { Badge } from "../ui/badge";
// import { Progress } from "../ui/progress";
// import { useToast } from "../ui/use-toast";
// import { ArrowLeft, Clock, Trophy } from "lucide-react";
// import { Language } from './QuizLanguageSelector';

// interface Question {
//   id: number;
//   question: string;
//   options: string[];
//   correctAnswer: number;
//   category: string;
// }

// interface QuizGameplayProps {
//   language: Language;
//   onBackToLanguageSelect: () => void;
// }

// const QuizGameplay: React.FC<QuizGameplayProps> = ({
//   language,
//   onBackToLanguageSelect
// }) => {
//   const { toast } = useToast();
//   const [questions, setQuestions] = useState<Question[]>([]);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
//   const [score, setScore] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(30);
//   const [gameOver, setGameOver] = useState(false);
//   const [showAnswer, setShowAnswer] = useState(false);

//   const generateQuestions = (lang: Language): Question[] => {
//     const questionSets = {
//       english: [
//         {
//           id: 1,
//           question: "What is the capital of France?",
//           options: ["London", "Berlin", "Paris", "Madrid"],
//           correctAnswer: 2,
//           category: "Geography"
//         },
//         {
//           id: 2,
//           question: "Which planet is known as the Red Planet?",
//           options: ["Venus", "Mars", "Jupiter", "Saturn"],
//           correctAnswer: 1,
//           category: "Science"
//         },
//         {
//           id: 3,
//           question: "Who painted the Mona Lisa?",
//           options: ["Van Gogh", "Picasso", "Da Vinci", "Monet"],
//           correctAnswer: 2,
//           category: "Art"
//         }
//       ],
//       hindi: [
//         {
//           id: 1,
//           question: "भारत की राजधानी क्या है?",
//           options: ["मुंबई", "दिल्ली", "कोलकाता", "चेन्नई"],
//           correctAnswer: 1,
//           category: "भूगोल"
//         }
//       ],
//       spanish: [
//         {
//           id: 1,
//           question: "¿Cuál es la capital de España?",
//           options: ["Barcelona", "Madrid", "Valencia", "Sevilla"],
//           correctAnswer: 1,
//           category: "Geografía"
//         }
//       ]
//     };

//     return questionSets[lang] || questionSets.english;
//   };

//   useEffect(() => {
//     const gameQuestions = generateQuestions(language);
//     setQuestions(gameQuestions);
//   }, [language]);

//   useEffect(() => {
//     if (timeLeft > 0 && !gameOver && !showAnswer) {
//       const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
//       return () => clearTimeout(timer);
//     } else if (timeLeft === 0 && !showAnswer) {
//       handleTimeUp();
//     }
//   }, [timeLeft, gameOver, showAnswer]);

//   const handleTimeUp = () => {
//     setShowAnswer(true);
//     toast({
//       title: "⏰ Time's up!",
//       description: `The correct answer was: ${questions[currentQuestionIndex]?.options[questions[currentQuestionIndex]?.correctAnswer]}`,
//       variant: "destructive"
//     });
//   };

//   const handleAnswerSelect = (answerIndex: number) => {
//     if (showAnswer) return;
    
//     setSelectedAnswer(answerIndex);
//     setShowAnswer(true);
    
//     const isCorrect = answerIndex === questions[currentQuestionIndex].correctAnswer;
    
//     if (isCorrect) {
//       const points = Math.max(1, Math.floor(timeLeft / 3));
//       setScore(score + points);
//       toast({
//         title: "🎉 Correct!",
//         description: `+${points} points!`,
//       });
//     } else {
//       toast({
//         title: "❌ Wrong!",
//         description: `Correct answer: ${questions[currentQuestionIndex].options[questions[currentQuestionIndex].correctAnswer]}`,
//         variant: "destructive"
//       });
//     }
//   };

//   const handleNextQuestion = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//       setSelectedAnswer(null);
//       setShowAnswer(false);
//       setTimeLeft(30);
//     } else {
//       setGameOver(true);
//       // Update high score
//       const currentHighScore = parseInt(localStorage.getItem('quizHighScore') || '0');
//       if (score > currentHighScore) {
//         localStorage.setItem('quizHighScore', score.toString());
//       }
//       // Update total tokens and games played
//       const totalTokens = parseInt(localStorage.getItem('totalTokens') || '0');
//       localStorage.setItem('totalTokens', (totalTokens + score).toString());
//       const gamesPlayed = parseInt(localStorage.getItem('gamesPlayed') || '0');
//       localStorage.setItem('gamesPlayed', (gamesPlayed + 1).toString());
      
//       toast({
//         title: "🏆 Quiz Complete!",
//         description: `Final Score: ${score} points`,
//       });
//     }
//   };

//   const restartGame = () => {
//     setCurrentQuestionIndex(0);
//     setSelectedAnswer(null);
//     setScore(0);
//     setTimeLeft(30);
//     setGameOver(false);
//     setShowAnswer(false);
//   };

//   const currentQuestion = questions[currentQuestionIndex];
//   const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

//   if (!currentQuestion && !gameOver) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 flex items-center justify-center">
//         <div className="text-white text-2xl">Loading questions...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 p-4">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <Button
//             onClick={onBackToLanguageSelect}
//             variant="outline"
//             className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
//           >
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Back
//           </Button>
          
//           <div className="flex items-center gap-4 text-white">
//             <Badge variant="secondary" className="bg-white/20 text-white">
//               <Trophy className="w-4 h-4 mr-1" />
//               {score}
//             </Badge>
//           </div>
//         </div>

//         {!gameOver ? (
//           <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
//             <CardHeader>
//               <div className="flex justify-between items-center mb-4">
//                 <CardTitle className="text-2xl">
//                   Question {currentQuestionIndex + 1} of {questions.length}
//                 </CardTitle>
//                 <div className="flex items-center gap-2 text-red-500">
//                   <Clock className="w-5 h-5" />
//                   <span className="text-xl font-bold">{timeLeft}s</span>
//                 </div>
//               </div>
//               <Progress value={progress} className="h-2" />
//               <Badge className="w-fit mt-2">{currentQuestion.category}</Badge>
//             </CardHeader>
            
//             <CardContent className="space-y-6">
//               <h2 className="text-xl font-semibold text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
//                 {currentQuestion.question}
//               </h2>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {currentQuestion.options.map((option, index) => {
//                   let buttonClass = "p-4 text-left transition-all duration-300 hover:scale-105 ";
                  
//                   if (showAnswer) {
//                     if (index === currentQuestion.correctAnswer) {
//                       buttonClass += "bg-green-500 text-white border-green-600";
//                     } else if (index === selectedAnswer && index !== currentQuestion.correctAnswer) {
//                       buttonClass += "bg-red-500 text-white border-red-600";
//                     } else {
//                       buttonClass += "bg-gray-100 text-gray-600";
//                     }
//                   } else {
//                     buttonClass += "bg-white hover:bg-purple-50 border-2 border-purple-200 hover:border-purple-400";
//                   }
                  
//                   return (
//                     <Button
//                       key={index}
//                       onClick={() => handleAnswerSelect(index)}
//                       className={buttonClass}
//                       disabled={showAnswer}
//                     >
//                       <div className="flex items-center">
//                         <span className="font-bold mr-3 bg-purple-100 text-purple-600 w-8 h-8 rounded-full flex items-center justify-center">
//                           {String.fromCharCode(65 + index)}
//                         </span>
//                         {option}
//                       </div>
//                     </Button>
//                   );
//                 })}
//               </div>
              
//               {showAnswer && (
//                 <div className="text-center">
//                   <Button
//                     onClick={handleNextQuestion}
//                     className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-semibold transform hover:scale-105 transition-all duration-300"
//                   >
//                     {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
//                   </Button>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         ) : (
//           <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
//             <CardHeader className="text-center">
//               <div className="flex justify-center mb-4">
//                 <Trophy className="w-16 h-16 text-yellow-500" />
//               </div>
//               <CardTitle className="text-3xl text-purple-600 mb-2">Quiz Complete!</CardTitle>
//             </CardHeader>
            
//             <CardContent className="text-center space-y-6">
//               <div className="text-4xl font-bold text-purple-600">{score} Points</div>
              
//               <div className="flex gap-4 justify-center">
//                 <Button
//                   onClick={restartGame}
//                   className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transform hover:scale-105 transition-all duration-300"
//                 >
//                   🔄 Play Again
//                 </Button>
//                 <Button
//                   onClick={onBackToLanguageSelect}
//                   variant="outline"
//                   className="transform hover:scale-105 transition-all duration-300"
//                 >
//                   🌍 Change Language
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </div>
//   );
// };

// export default QuizGameplay;

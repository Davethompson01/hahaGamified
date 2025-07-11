import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Target, CheckCircle, Clock, Gift } from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  target: number;
  reward: number;
  completed: boolean;
  progress: number;
  gameType?: string;
}

interface DailyChallengesProps {
  currentGameScore: number;
  gameType: string;
  onChallengeComplete: (reward: number) => void;
}

const generateDailyChallenges = (): Challenge[] => {
  const baseChallenges = [
    {
      id: 'score_100',
      title: 'Score Hunter',
      description: 'Reach a score of 100 in any game',
      target: 100,
      reward: 50,
      completed: false,
      progress: 0
    },
    {
      id: 'play_3_games',
      title: 'Triple Threat',
      description: 'Play 3 different games today',
      target: 3,
      reward: 75,
      completed: false,
      progress: 0
    },
    {
      id: 'dino_survival',
      title: 'Dino Survivor',
      description: 'Survive for 2 minutes in Dino Run',
      target: 120,
      reward: 100,
      completed: false,
      progress: 0,
      gameType: 'dino'
    },
    {
      id: 'token_collector',
      title: 'Token Collector',
      description: 'Earn 200 tokens today',
      target: 200,
      reward: 150,
      completed: false,
      progress: 0
    },
    {
      id: 'high_scorer',
      title: 'High Scorer',
      description: 'Reach a score of 500 in any game',
      target: 500,
      reward: 200,
      completed: false,
      progress: 0
    }
  ];

  // Randomly select 3-4 challenges for the day
  const selectedChallenges = baseChallenges
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.floor(Math.random() * 2) + 3);

  return selectedChallenges;
};

export const DailyChallenges: React.FC<DailyChallengesProps> = ({
  currentGameScore,
  gameType,
  onChallengeComplete
}) => {
  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem(`dailyChallenges_${today}`);
    
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Generate new daily challenges
    return generateDailyChallenges();
  });

  useEffect(() => {
    const today = new Date().toDateString();
    
    // Update challenge progress
    const updatedChallenges = challenges.map(challenge => {
      let newProgress = challenge.progress;
      
      if (challenge.id === 'score_100' || challenge.id === 'high_scorer') {
        newProgress = Math.max(newProgress, currentGameScore);
      } else if (challenge.id === 'dino_survival' && gameType === 'dino') {
        // Approximate survival time based on score (rough calculation)
        const survivalTime = Math.floor(currentGameScore / 5);
        newProgress = Math.max(newProgress, survivalTime);
      } else if (challenge.id === 'token_collector') {
        const todaysTokens = parseInt(localStorage.getItem(`tokensEarned_${today}`) || '0');
        newProgress = todaysTokens;
      } else if (challenge.id === 'play_3_games') {
        const gamesPlayed = JSON.parse(localStorage.getItem(`gamesPlayed_${today}`) || '[]');
        if (!gamesPlayed.includes(gameType)) {
          gamesPlayed.push(gameType);
          localStorage.setItem(`gamesPlayed_${today}`, JSON.stringify(gamesPlayed));
        }
        newProgress = gamesPlayed.length;
      }
      
      const completed = newProgress >= challenge.target;
      
      // Award tokens if challenge just completed
      if (completed && !challenge.completed) {
        onChallengeComplete(challenge.reward);
      }
      
      return {
        ...challenge,
        progress: newProgress,
        completed
      };
    });

    setChallenges(updatedChallenges);
    localStorage.setItem(`dailyChallenges_${today}`, JSON.stringify(updatedChallenges));
  }, [currentGameScore, gameType, onChallengeComplete]);

  const getProgressPercentage = (challenge: Challenge): number => {
    return Math.min((challenge.progress / challenge.target) * 100, 100);
  };

  const getTimeUntilReset = (): string => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeLeft = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Daily Challenges
          <Badge variant="outline" className="ml-auto">
            <Clock className="h-3 w-3 mr-1" />
            Resets in {getTimeUntilReset()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {challenges.map((challenge) => (
            <div
              key={challenge.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                challenge.completed
                  ? 'bg-green-50 border-green-200'
                  : 'bg-gray-50 border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {challenge.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                  )}
                  <h3 className="font-semibold">{challenge.title}</h3>
                </div>
                <Badge variant={challenge.completed ? "default" : "secondary"}>
                  <Gift className="h-3 w-3 mr-1" />
                  {challenge.reward} tokens
                </Badge>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress: {challenge.progress}/{challenge.target}</span>
                  <span>{Math.round(getProgressPercentage(challenge))}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      challenge.completed ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${getProgressPercentage(challenge)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700 text-center">
            💡 Complete challenges to earn bonus tokens! New challenges reset daily.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyChallenges;

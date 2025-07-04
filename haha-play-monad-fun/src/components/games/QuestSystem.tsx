
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Star, Target, Gift } from "lucide-react";
import { useGameStats } from "../../hooks/useGameStats";

interface Quest {
  id: string;
  title: string;
  description: string;
  target: number;
  reward: number;
  progress: number;
  completed: boolean;
  type: 'score' | 'games' | 'streak' | 'tokens';
}

interface QuestSystemProps {
  onQuestComplete?: (reward: number) => void;
}

const QuestSystem: React.FC<QuestSystemProps> = ({ onQuestComplete }) => {
  const { stats } = useGameStats();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  
  const [quests, setQuests] = useState<Quest[]>([
    {
      id: 'first_game',
      title: 'First Steps',
      description: 'Play your first game',
      target: 1,
      reward: 50,
      progress: 0,
      completed: false,
      type: 'games'
    },
    {
      id: 'score_100',
      title: 'Century Club',
      description: 'Reach a score of 100 in any game',
      target: 100,
      reward: 100,
      progress: 0,
      completed: false,
      type: 'score'
    },
    {
      id: 'score_500',
      title: 'High Achiever',
      description: 'Reach a score of 500 in any game',
      target: 500,
      reward: 250,
      progress: 0,
      completed: false,
      type: 'score'
    },
    {
      id: 'daily_player',
      title: 'Daily Player',
      description: 'Maintain a 3-day streak',
      target: 3,
      reward: 150,
      progress: 0,
      completed: false,
      type: 'streak'
    },
    {
      id: 'streak_master',
      title: 'Streak Master',
      description: 'Maintain a 7-day streak',
      target: 7,
      reward: 400,
      progress: 0,
      completed: false,
      type: 'streak'
    },
    {
      id: 'token_collector',
      title: 'Token Collector',
      description: 'Earn 500 total tokens',
      target: 500,
      reward: 200,
      progress: 0,
      completed: false,
      type: 'tokens'
    },
    {
      id: 'game_master',
      title: 'Game Master',
      description: 'Play 20 games total',
      target: 20,
      reward: 300,
      progress: 0,
      completed: false,
      type: 'games'
    }
  ]);

  // Check wallet connection status
  useEffect(() => {
    const checkWalletConnection = () => {
      const walletAddress = localStorage.getItem('userWalletAddress');
      setIsWalletConnected(!!walletAddress);
      
      if (walletAddress) {
        const savedQuests = localStorage.getItem(`questProgress_${walletAddress}`);
        if (savedQuests) {
          setQuests(JSON.parse(savedQuests));
        }
      }
    };

    checkWalletConnection();
    
    // Listen for wallet changes
    window.addEventListener('walletChanged', checkWalletConnection);
    return () => window.removeEventListener('walletChanged', checkWalletConnection);
  }, []);

  useEffect(() => {
    if (!isWalletConnected) return;
    
    // Listen for game stats updates
    const handleGameStatsUpdate = (event: CustomEvent) => {
      console.log('Quest system received game stats update:', event.detail);
      updateQuestProgress();
    };

    window.addEventListener('gameStatsUpdated', handleGameStatsUpdate as EventListener);
    return () => window.removeEventListener('gameStatsUpdated', handleGameStatsUpdate as EventListener);
  }, [isWalletConnected]);

  const updateQuestProgress = () => {
    if (!isWalletConnected) return;
    
    setQuests(prevQuests => {
      const updatedQuests = prevQuests.map(quest => {
        let newProgress = quest.progress;
        
        switch (quest.type) {
          case 'games':
            newProgress = stats.totalGamesPlayed;
            break;
          case 'score':
            // Get the highest score across all games
            const allScores = Object.values(stats.highestScores);
            newProgress = allScores.length > 0 ? Math.max(...allScores) : 0;
            console.log(`Quest ${quest.id} - Highest score: ${newProgress}, Target: ${quest.target}`);
            break;
          case 'streak':
            newProgress = stats.dailyStreak;
            break;
          case 'tokens':
            newProgress = stats.totalTokens;
            break;
        }

        const wasCompleted = quest.completed;
        const isCompleted = newProgress >= quest.target;
        
        // Award reward if quest just completed
        if (isCompleted && !wasCompleted && onQuestComplete) {
          console.log(`Quest completed: ${quest.title} - Reward: ${quest.reward}`);
          onQuestComplete(quest.reward);
        }

        return {
          ...quest,
          progress: newProgress,
          completed: isCompleted
        };
      });

      // Save updated quests to wallet-specific storage
      const walletAddress = localStorage.getItem('userWalletAddress');
      if (walletAddress) {
        localStorage.setItem(`questProgress_${walletAddress}`, JSON.stringify(updatedQuests));
      }
      
      return updatedQuests;
    });
  };

  // Update quests whenever stats change
  useEffect(() => {
    if (isWalletConnected) {
      updateQuestProgress();
    }
  }, [stats, isWalletConnected]);

  const getProgressPercentage = (quest: Quest) => {
    return Math.min((quest.progress / quest.target) * 100, 100);
  };

  const completedQuests = quests.filter(q => q.completed).length;
  const totalQuests = quests.length;

  if (!isWalletConnected) {
    return (
      <Card className="w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-2 border-purple-200 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-6 w-6" />
            Quest Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <div className="py-8">
            <Target className="h-16 w-16 mx-auto text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Connect Your Wallet</h3>
            <p className="text-gray-600">Connect your wallet to start tracking quest progress and earning rewards!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-2 border-purple-200 shadow-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Target className="h-6 w-6" />
          Quest Progress
          <Badge variant="secondary" className="ml-auto bg-white/20 text-white border-white/30">
            {completedQuests}/{totalQuests} Complete
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 max-h-96 overflow-y-auto">
        <div className="space-y-4">
          {quests.map((quest) => (
            <div
              key={quest.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                quest.completed
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 shadow-md'
                  : 'bg-gradient-to-r from-white to-gray-50 border-gray-200 hover:border-purple-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  {quest.completed ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : (
                    <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                      <Star className="h-3 w-3 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-800">{quest.title}</h3>
                    <p className="text-sm text-gray-600">{quest.description}</p>
                  </div>
                </div>
                <Badge 
                  variant={quest.completed ? "default" : "secondary"}
                  className={`flex items-center gap-1 ${quest.completed ? 'bg-green-500' : 'bg-purple-500'} text-white`}
                >
                  <Gift className="h-3 w-3" />
                  {quest.reward}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress: {quest.progress}/{quest.target}</span>
                  <span className="font-semibold">{Math.round(getProgressPercentage(quest))}%</span>
                </div>
                <Progress 
                  value={getProgressPercentage(quest)} 
                  className={`h-3 ${quest.completed ? 'bg-green-100' : 'bg-gray-200'}`}
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 rounded-lg border border-purple-200">
          <p className="text-sm text-purple-700 text-center font-medium">
            🎯 Complete quests to earn bonus tokens and unlock achievements!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestSystem;

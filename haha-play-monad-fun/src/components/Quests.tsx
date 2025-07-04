import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Trophy, Target, Clock, CheckCircle, Star, Wallet } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { useNavigate } from 'react-router-dom';

interface Quest {
  id: string;
  title: string;
  description: string;
  requirement: string;
  reward: number;
  type: 'daily' | 'weekly' | 'achievement';
  progress: number;
  maxProgress: number;
  completed: boolean;
  game?: string;
}

const Quests = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [walletAddress, setWalletAddress] = useState(() => {
    return localStorage.getItem('walletAddress') || '';
  });

  useEffect(() => {
    if (!walletAddress) {
      return;
    }

    // Generate wallet-specific quests
    const generateQuests = (): Quest[] => {
      const today = new Date().toDateString();
      const questKey = `quests_${walletAddress}_${today}`;
      const storedQuests = localStorage.getItem(questKey);
      
      if (storedQuests) {
        return JSON.parse(storedQuests);
      }

      // Get current stats for progress tracking
      const currentTokens = parseInt(localStorage.getItem('totalTokens') || '0');
      const monTokens = parseInt(localStorage.getItem('monTokens') || '0');
      const dailyStreak = parseInt(localStorage.getItem('dailyStreak') || '0');
      const dinoScore = parseInt(localStorage.getItem('dinoHighScore') || '0');
      const flappyScore = parseInt(localStorage.getItem('flappyHighScore') || '0');
      const quizScore = parseInt(localStorage.getItem('quizHighScore') || '0');
      const blockStackScore = parseInt(localStorage.getItem('blockStackHighScore') || '0');

      const newQuests: Quest[] = [
        // Daily Quests
        {
          id: 'daily_dino_score',
          title: '🦕 Dino Daily Sprint',
          description: 'Score 500 points in Dino Run',
          requirement: 'Score 500+ in a single Dino Run game',
          reward: 50,
          type: 'daily',
          progress: Math.min(dinoScore, 500),
          maxProgress: 500,
          completed: dinoScore >= 500,
          game: 'dino'
        },
        {
          id: 'daily_block_stack',
          title: '🧱 Block Master',
          description: 'Score 1000 points in Block Stack',
          requirement: 'Score 1000+ in Block Stack',
          reward: 60,
          type: 'daily',
          progress: Math.min(blockStackScore, 1000),
          maxProgress: 1000,
          completed: blockStackScore >= 1000,
          game: 'block-stack'
        },
        {
          id: 'daily_play_3_games',
          title: '🎮 Gaming Enthusiast',
          description: 'Play 3 different games today',
          requirement: 'Play Dino, Flappy Bird, Quiz, and Block Stack',
          reward: 40,
          type: 'daily',
          progress: [dinoScore > 0, flappyScore > 0, quizScore > 0, blockStackScore > 0].filter(Boolean).length,
          maxProgress: 4,
          completed: [dinoScore > 0, flappyScore > 0, quizScore > 0, blockStackScore > 0].filter(Boolean).length >= 3
        },
        {
          id: 'daily_earn_tokens',
          title: '🪙 Token Hunter',
          description: 'Earn 200 tokens today',
          requirement: 'Accumulate 200 tokens from gameplay',
          reward: 30,
          type: 'daily',
          progress: Math.min(currentTokens, 200),
          maxProgress: 200,
          completed: currentTokens >= 200
        },
        
        // Weekly Quests
        {
          id: 'weekly_streak',
          title: '🔥 Week Warrior',
          description: 'Maintain a 7-day playing streak',
          requirement: 'Play games for 7 consecutive days',
          reward: 300,
          type: 'weekly',
          progress: dailyStreak,
          maxProgress: 7,
          completed: dailyStreak >= 7
        },
        {
          id: 'weekly_high_scores',
          title: '🏆 Score Master',
          description: 'Achieve high scores in all games',
          requirement: 'Set scores in all 4 games',
          reward: 200,
          type: 'weekly',
          progress: [dinoScore > 0, flappyScore > 0, quizScore > 0, blockStackScore > 0].filter(Boolean).length,
          maxProgress: 4,
          completed: [dinoScore > 0, flappyScore > 0, quizScore > 0, blockStackScore > 0].filter(Boolean).length >= 4
        },
        {
          id: 'weekly_block_master',
          title: '🧱 Block Stack Legend',
          description: 'Score 5000+ in Block Stack',
          requirement: 'Achieve 5000 points in Block Stack',
          reward: 250,
          type: 'weekly',
          progress: Math.min(blockStackScore, 5000),
          maxProgress: 5000,
          completed: blockStackScore >= 5000,
          game: 'block-stack'
        },
        
        // Achievement Quests
        {
          id: 'achievement_first_swap',
          title: '💎 First Exchange',
          description: 'Make your first MON token swap',
          requirement: 'Swap 100 points for 1 MON token',
          reward: 100,
          type: 'achievement',
          progress: monTokens > 0 ? 1 : 0,
          maxProgress: 1,
          completed: monTokens > 0
        },
        {
          id: 'achievement_1000_points',
          title: '🌟 Point Millionaire',
          description: 'Accumulate 1000 total points',
          requirement: 'Earn 1000 points across all games',
          reward: 400,
          type: 'achievement',
          progress: Math.min(currentTokens, 1000),
          maxProgress: 1000,
          completed: currentTokens >= 1000
        },
        {
          id: 'achievement_wallet_connected',
          title: '🔗 Wallet Pioneer',
          description: 'Connect wallet and start gaming',
          requirement: 'Successfully connect MetaMask wallet',
          reward: 50,
          type: 'achievement',
          progress: 1,
          maxProgress: 1,
          completed: true
        }
      ];

      localStorage.setItem(questKey, JSON.stringify(newQuests));
      return newQuests;
    };

    setQuests(generateQuests());
  }, [walletAddress]);

  const claimReward = (questId: string) => {
    const updatedQuests = quests.map(quest => {
      if (quest.id === questId && quest.completed && quest.progress >= quest.maxProgress) {
        const currentTokens = parseInt(localStorage.getItem('totalTokens') || '0');
        const newTokens = currentTokens + quest.reward;
        localStorage.setItem('totalTokens', newTokens.toString());
        
        // Track reward claim with wallet
        const rewardHistory = JSON.parse(localStorage.getItem(`rewardHistory_${walletAddress}`) || '[]');
        rewardHistory.push({
          timestamp: new Date().toISOString(),
          questId: quest.id,
          questTitle: quest.title,
          rewardAmount: quest.reward,
          walletAddress
        });
        localStorage.setItem(`rewardHistory_${walletAddress}`, JSON.stringify(rewardHistory));
        
        toast({
          title: "🎉 Quest Completed!",
          description: `Earned ${quest.reward} bonus points!`,
        });
        
        return { ...quest, reward: 0 }; // Mark as claimed
      }
      return quest;
    });
    
    setQuests(updatedQuests);
    
    // Update localStorage with wallet-specific key
    const today = new Date().toDateString();
    const questKey = `quests_${walletAddress}_${today}`;
    localStorage.setItem(questKey, JSON.stringify(updatedQuests));
  };

  const getQuestIcon = (type: string) => {
    switch (type) {
      case 'daily': return <Clock className="h-5 w-5" />;
      case 'weekly': return <Target className="h-5 w-5" />;
      case 'achievement': return <Trophy className="h-5 w-5" />;
      default: return <Star className="h-5 w-5" />;
    }
  };

  const getQuestColor = (type: string) => {
    switch (type) {
      case 'daily': return 'bg-blue-50 border-blue-200';
      case 'weekly': return 'bg-purple-50 border-purple-200';
      case 'achievement': return 'bg-yellow-50 border-yellow-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  if (!walletAddress) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <Card className="p-6 bg-gradient-to-r from-red-500 to-pink-500 text-white">
          <h2 className="text-2xl font-bold mb-4">🔐 Wallet Required</h2>
          <p className="mb-4">Please connect your wallet to view and track your quests.</p>
          <Button 
            onClick={() => navigate('/')}
            className="bg-white text-red-600 hover:bg-gray-100"
          >
            <Wallet className="h-4 w-4 mr-2" />
            Connect Wallet
          </Button>
        </Card>
      </div>
    );
  }

  const questsByType = {
    daily: quests.filter(q => q.type === 'daily'),
    weekly: quests.filter(q => q.type === 'weekly'),
    achievement: quests.filter(q => q.type === 'achievement')
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card className="p-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
        <h2 className="text-2xl font-bold mb-2">🎯 Quest Hub</h2>
        <p className="opacity-90">Complete quests to earn bonus points and rewards!</p>
        <div className="mt-2 flex items-center text-sm opacity-90">
          <Wallet className="h-4 w-4 mr-2" />
          <span>Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
        </div>
      </Card>

      {/* Daily Quests */}
      <div>
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-blue-600" />
          Daily Quests
        </h3>
        <div className="grid gap-4">
          {questsByType.daily.map(quest => (
            <Card key={quest.id} className={`p-4 border-2 ${getQuestColor(quest.type)}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    {getQuestIcon(quest.type)}
                    <h4 className="font-semibold ml-2">{quest.title}</h4>
                    <Badge variant="secondary" className="ml-2">+{quest.reward} pts</Badge>
                  </div>
                  <p className="text-gray-600 mb-2">{quest.description}</p>
                  <p className="text-sm text-gray-500">{quest.requirement}</p>
                  
                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{quest.progress}/{quest.maxProgress}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((quest.progress / quest.maxProgress) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="ml-4">
                  {quest.completed && quest.reward > 0 ? (
                    <Button onClick={() => claimReward(quest.id)} size="sm">
                      Claim Reward
                    </Button>
                  ) : quest.completed ? (
                    <Badge variant="outline">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Claimed
                    </Badge>
                  ) : (
                    <Badge variant="secondary">In Progress</Badge>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Weekly Quests */}
      <div>
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Target className="h-5 w-5 mr-2 text-purple-600" />
          Weekly Challenges
        </h3>
        <div className="grid gap-4">
          {questsByType.weekly.map(quest => (
            <Card key={quest.id} className={`p-4 border-2 ${getQuestColor(quest.type)}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    {getQuestIcon(quest.type)}
                    <h4 className="font-semibold ml-2">{quest.title}</h4>
                    <Badge variant="secondary" className="ml-2">+{quest.reward} pts</Badge>
                  </div>
                  <p className="text-gray-600 mb-2">{quest.description}</p>
                  <p className="text-sm text-gray-500">{quest.requirement}</p>
                  
                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{quest.progress}/{quest.maxProgress}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((quest.progress / quest.maxProgress) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="ml-4">
                  {quest.completed && quest.reward > 0 ? (
                    <Button onClick={() => claimReward(quest.id)} size="sm">
                      Claim Reward
                    </Button>
                  ) : quest.completed ? (
                    <Badge variant="outline">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Claimed
                    </Badge>
                  ) : (
                    <Badge variant="secondary">In Progress</Badge>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Achievement Quests */}
      <div>
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Trophy className="h-5 w-5 mr-2 text-yellow-600" />
          Achievements
        </h3>
        <div className="grid gap-4">
          {questsByType.achievement.map(quest => (
            <Card key={quest.id} className={`p-4 border-2 ${getQuestColor(quest.type)}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    {getQuestIcon(quest.type)}
                    <h4 className="font-semibold ml-2">{quest.title}</h4>
                    <Badge variant="secondary" className="ml-2">+{quest.reward} pts</Badge>
                  </div>
                  <p className="text-gray-600 mb-2">{quest.description}</p>
                  <p className="text-sm text-gray-500">{quest.requirement}</p>
                  
                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{quest.progress}/{quest.maxProgress}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((quest.progress / quest.maxProgress) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="ml-4">
                  {quest.completed && quest.reward > 0 ? (
                    <Button onClick={() => claimReward(quest.id)} size="sm">
                      Claim Reward
                    </Button>
                  ) : quest.completed ? (
                    <Badge variant="outline">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Claimed
                    </Badge>
                  ) : (
                    <Badge variant="secondary">In Progress</Badge>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quests;

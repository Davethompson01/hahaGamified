
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, Trophy, Calendar, Flame } from 'lucide-react';

interface TokenSystemProps {
  gameScore: number;
  gameType: string;
  onTokensEarned: (tokens: number) => void;
}

export const TokenSystem: React.FC<TokenSystemProps> = ({
  gameScore,
  gameType,
  onTokensEarned
}) => {
  const [totalTokens, setTotalTokens] = useState(() => {
    return parseInt(localStorage.getItem('totalTokens') || '0');
  });
  
  const [dailyStreak, setDailyStreak] = useState(() => {
    return parseInt(localStorage.getItem('dailyStreak') || '0');
  });
  
  const [lastPlayDate, setLastPlayDate] = useState(() => {
    return localStorage.getItem('lastPlayDate') || '';
  });
  
  const [todaysTokens, setTodaysTokens] = useState(() => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem(`tokensEarned_${today}`);
    return parseInt(stored || '0');
  });

  useEffect(() => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    // Check if this is a new day
    if (lastPlayDate !== today) {
      // Check streak continuation
      if (lastPlayDate === yesterday) {
        setDailyStreak(prev => prev + 1);
      } else if (lastPlayDate !== '') {
        // Streak broken
        setDailyStreak(1);
      } else {
        // First time playing
        setDailyStreak(1);
      }
      
      setLastPlayDate(today);
      setTodaysTokens(0);
      localStorage.setItem('lastPlayDate', today);
      localStorage.setItem(`tokensEarned_${today}`, '0');
    }
  }, [lastPlayDate]);

  const calculateTokensEarned = (score: number, gameType: string): number => {
    let baseTokens = Math.floor(score / 10);
    
    // Game-specific multipliers
    const multipliers = {
      'dino': 1.0,
      'flappy-bird': 1.2,
      'quiz': 1.5,
      'tic-tac-toe': 0.8
    };
    
    const multiplier = multipliers[gameType as keyof typeof multipliers] || 1.0;
    baseTokens = Math.floor(baseTokens * multiplier);
    
    // Daily streak bonus
    const streakBonus = Math.floor(baseTokens * (dailyStreak * 0.1));
    
    return baseTokens + streakBonus;
  };

  useEffect(() => {
    if (gameScore > 0) {
      const tokensEarned = calculateTokensEarned(gameScore, gameType);
      const newTotal = totalTokens + tokensEarned;
      const newTodaysTokens = todaysTokens + tokensEarned;
      
      setTotalTokens(newTotal);
      setTodaysTokens(newTodaysTokens);
      
      localStorage.setItem('totalTokens', newTotal.toString());
      localStorage.setItem(`tokensEarned_${new Date().toDateString()}`, newTodaysTokens.toString());
      localStorage.setItem('dailyStreak', dailyStreak.toString());
      
      onTokensEarned(tokensEarned);
    }
  }, [gameScore, gameType, totalTokens, todaysTokens, dailyStreak, onTokensEarned]);

  const getStreakReward = (): string => {
    if (dailyStreak >= 7) return '🔥 Week Warrior! +70% bonus';
    if (dailyStreak >= 3) return '🌟 Streak Master! +30% bonus';
    if (dailyStreak >= 2) return '⚡ Daily Player! +10% bonus';
    return '🎮 Keep playing daily for bonuses!';
  };

  return (
    <Card className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Coins className="h-6 w-6 mr-1" />
            <span className="font-bold text-lg">{totalTokens}</span>
          </div>
          <p className="text-sm opacity-90">Total Tokens</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Trophy className="h-6 w-6 mr-1" />
            <span className="font-bold text-lg">{todaysTokens}</span>
          </div>
          <p className="text-sm opacity-90">Today's Tokens</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Flame className="h-6 w-6 mr-1" />
            <span className="font-bold text-lg">{dailyStreak}</span>
          </div>
          <p className="text-sm opacity-90">Daily Streak</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Calendar className="h-6 w-6 mr-1" />
          </div>
          <Badge variant="secondary" className="text-xs">
            {getStreakReward().split('!')[0]}!
          </Badge>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm opacity-90">{getStreakReward()}</p>
      </div>
    </Card>
  );
};

export default TokenSystem;

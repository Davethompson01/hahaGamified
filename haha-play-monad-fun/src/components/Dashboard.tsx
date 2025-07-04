
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Wallet, Trophy, Coins, Target, Calendar, Zap, Star, TrendingUp, Volume2, VolumeX, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';

const Dashboard = () => {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const [gameStats, setGameStats] = useState({
    totalTokens: parseInt(localStorage.getItem('totalTokens') || '0'),
    gamesPlayed: parseInt(localStorage.getItem('gamesPlayed') || '0'),
    highScores: {
      flappyBird: parseInt(localStorage.getItem('flappyBirdHighScore') || '0'),
      dino: parseInt(localStorage.getItem('dinoHighScore') || '0'),
      blockStack: parseInt(localStorage.getItem('blockStackHighScore') || '0'),
      quiz: parseInt(localStorage.getItem('quizHighScore') || '0'),
    },
    dailyStreak: parseInt(localStorage.getItem('dailyStreak') || '0'),
  });

  useEffect(() => {
    const updateStats = () => {
      setGameStats({
        totalTokens: parseInt(localStorage.getItem('totalTokens') || '0'),
        gamesPlayed: parseInt(localStorage.getItem('gamesPlayed') || '0'),
        highScores: {
          flappyBird: parseInt(localStorage.getItem('flappyBirdHighScore') || '0'),
          dino: parseInt(localStorage.getItem('dinoHighScore') || '0'),
          blockStack: parseInt(localStorage.getItem('blockStackHighScore') || '0'),
          quiz: parseInt(localStorage.getItem('quizHighScore') || '0'),
        },
        dailyStreak: parseInt(localStorage.getItem('dailyStreak') || '0'),
      });
    };

    updateStats();
    const interval = setInterval(updateStats, 2000);
    return () => clearInterval(interval);
  }, []);

  const games = [
    {
      id: 'flappy-bird',
      name: 'Flappy Bird',
      icon: '🐦',
      gradient: 'from-sky-400 via-blue-500 to-cyan-600',
      highScore: gameStats.highScores.flappyBird
    },
    {
      id: 'dino',
      name: 'Hulk Run',
      icon: '💚',
      gradient: 'from-green-400 via-emerald-500 to-teal-600',
      highScore: gameStats.highScores.dino
    },
    {
      id: 'block-stack',
      name: '3D Tetris',
      icon: '🧱',
      gradient: 'from-purple-500 via-violet-500 to-indigo-600',
      highScore: gameStats.highScores.blockStack
    },
    {
      id: 'quiz',
      name: 'Quiz Game',
      icon: '🧠',
      gradient: 'from-pink-500 via-rose-500 to-red-600',
      highScore: gameStats.highScores.quiz
    }
  ];

  if (!isConnected || !address) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Wallet className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Connect Wallet to Play
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600 leading-relaxed">
              Connect your wallet to start playing games and earning tokens!
            </p>
            <Button 
              onClick={() => navigate('/')}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Wallet className="h-5 w-5 mr-2" />
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">
              Gaming Dashboard
            </h1>
            <p className="text-white/80 text-lg">Play games, earn tokens, have fun!</p>
          </div>
          
          {/* Settings Bar */}
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setSoundEnabled(!soundEnabled)}
              variant="outline"
              className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Wallet Info Card */}
        <Card className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white border-0 shadow-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Wallet className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Wallet Connected</h3>
                  <p className="text-white/90 font-mono text-sm">
                    {address.slice(0, 8)}...{address.slice(-6)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <Coins className="h-5 w-5 text-yellow-300" />
                  <span className="text-2xl font-bold">{gameStats.totalTokens}</span>
                </div>
                <p className="text-white/80 text-sm">Total Tokens</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white/20 backdrop-blur-sm border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 mx-auto mb-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <Target className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">{gameStats.gamesPlayed}</h3>
              <p className="text-white/80 text-sm">Games</p>
            </CardContent>
          </Card>

          <Card className="bg-white/20 backdrop-blur-sm border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 mx-auto mb-2 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">{gameStats.dailyStreak}</h3>
              <p className="text-white/80 text-sm">Streak</p>
            </CardContent>
          </Card>

          <Card className="bg-white/20 backdrop-blur-sm border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 mx-auto mb-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Coins className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">{gameStats.totalTokens}</h3>
              <p className="text-white/80 text-sm">Tokens</p>
            </CardContent>
          </Card>

          <Card className="bg-white/20 backdrop-blur-sm border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 mx-auto mb-2 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                <Star className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">
                {Math.floor(gameStats.totalTokens / 100) + 1}
              </h3>
              <p className="text-white/80 text-sm">Level</p>
            </CardContent>
          </Card>
        </div>

        {/* Games Grid */}
        <Card className="bg-white/20 backdrop-blur-sm border-white/30 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white flex items-center">
              <Trophy className="h-6 w-6 mr-2 text-yellow-300" />
              Play Games
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {games.map((game) => (
                <Card key={game.id} className={`bg-gradient-to-br ${game.gradient} border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer`}>
                  <CardContent 
                    className="p-6 text-center text-white"
                    onClick={() => navigate(`/games/${game.id}`)}
                  >
                    <div className="text-4xl mb-3">{game.icon}</div>
                    <h3 className="text-lg font-bold mb-2">{game.name}</h3>
                    <div className="flex items-center justify-center space-x-1 text-sm">
                      <TrendingUp className="h-4 w-4" />
                      <span>{game.highScore}</span>
                    </div>
                    <Button
                      className="mt-3 w-full bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 text-sm py-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/games/${game.id}`);
                      }}
                    >
                      Play Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

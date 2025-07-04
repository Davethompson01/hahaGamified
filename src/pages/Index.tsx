
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { 
  Gamepad2, 
  Trophy, 
  Star, 
  Coins, 
  Users, 
  Play,
  Volume2,
  VolumeX,
  Settings,
  Target
} from "lucide-react";

const Index = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  useEffect(() => {
    const checkWalletConnection = () => {
      const walletAddress = localStorage.getItem('userWalletAddress');
      setIsWalletConnected(!!walletAddress);
    };

    checkWalletConnection();
    window.addEventListener('walletChanged', checkWalletConnection);
    return () => window.removeEventListener('walletChanged', checkWalletConnection);
  }, []);

  const games = [
    {
      id: "flappy-bird",
      name: "🐦 3D Flappy Bird",
      description: "Navigate through pipes in stunning 3D",
      gradient: "from-brand-primary via-blue-500 to-cyan-500",
      difficulty: "Medium"
    },
    {
      id: "dino",
      name: "💚 3D Hulk Run",
      description: "Help the Hulk smash through obstacles",
      gradient: "from-green-500 via-emerald-500 to-brand-secondary",
      difficulty: "Easy"
    },
    {
      id: "quiz",
      name: "🧠 Enhanced Quiz",
      description: "Test your knowledge and earn rewards",
      gradient: "from-brand-secondary via-purple-500 to-brand-accent",
      difficulty: "Hard"
    },
    {
      id: "tic-tac-toe",
      name: "⭕ Tic Tac Toe",
      description: "Classic strategy game with AI",
      gradient: "from-orange-500 via-red-500 to-pink-500",
      difficulty: "Easy"
    },
    {
      id: "block-stack",
      name: "🧱 3D Tetris",
      description: "Classic block stacking in 3D space",
      gradient: "from-brand-accent via-purple-600 to-brand-primary",
      difficulty: "Medium"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-accent relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-gradient-to-br from-brand-accent/20 to-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-cyan-400/30 to-brand-primary/30 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-gradient-to-br from-yellow-400/30 to-brand-secondary/30 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-between items-center mb-8">
            <div className="flex-1"></div>
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent drop-shadow-2xl mb-4 animate-fade-in">
                🎮 Haha Play
              </h1>
              <p className="text-xl md:text-2xl text-white/90 font-medium drop-shadow-lg animate-fade-in delay-200">
                Play 3D Games • Earn Monad Tokens • Have Fun!
              </p>
            </div>
            
            {/* Settings Bar */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-200"
              >
                <Volume2 className="h-4 w-4" />
              </Button>
              <Settings className="h-6 w-6 text-white/70" />
            </div>
          </div>
          
          {/* Wallet Connection Placeholder */}
          <div className="mb-8 animate-fade-in delay-300">
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-3 rounded-full">
              Connect Wallet
            </Button>
          </div>

          {/* Stats Dashboard */}
          {isWalletConnected && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-in delay-400">
              <Card className="bg-gradient-to-br from-brand-primary/20 to-blue-500/20 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-4 text-center">
                  <Coins className="h-8 w-8 mx-auto mb-2 text-yellow-400" />
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm opacity-80">Total Tokens</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-4 text-center">
                  <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-400" />
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm opacity-80">Day Streak</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-brand-secondary/20 to-brand-accent/20 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-4 text-center">
                  <Gamepad2 className="h-8 w-8 mx-auto mb-2 text-cyan-400" />
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm opacity-80">Games Played</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-4 text-center">
                  <Star className="h-8 w-8 mx-auto mb-2 text-yellow-400" />
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm opacity-80">Best Score</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {games.map((game, index) => (
            <Card 
              key={game.id} 
              className={`group hover:scale-105 transition-all duration-300 bg-gradient-to-br ${game.gradient} text-white border-0 shadow-2xl hover:shadow-3xl animate-fade-in overflow-hidden`}
              style={{ animationDelay: `${500 + index * 100}ms` }}
            >
              <CardHeader className="relative">
                <div className="absolute top-0 right-0 p-4">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    {game.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-2xl font-bold mb-2 drop-shadow-lg">
                  {game.name}
                </CardTitle>
                <p className="text-white/90 text-sm drop-shadow">
                  {game.description}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link to={`/games/${game.id}`} className="block">
                  <Button 
                    className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-white/30 hover:border-white/50 transition-all duration-200 group-hover:scale-105"
                    size="lg"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Play Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center text-white/80 animate-fade-in delay-800">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Gamepad2 className="w-6 h-6" />
            <span className="font-medium text-lg">Powered by Monad Testnet</span>
          </div>
          <p className="text-sm opacity-75 mb-2">
            🚀 The fastest blockchain gaming experience
          </p>
          <div className="flex justify-center items-center gap-4 text-xs">
            <span>🎯 Play to Earn</span>
            <span>•</span>
            <span>🏆 Compete & Win</span>
            <span>•</span>
            <span>💎 Collect NFTs</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

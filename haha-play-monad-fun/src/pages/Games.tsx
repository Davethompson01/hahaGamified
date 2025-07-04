
import React, { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import RainbowWalletConnect from "../components/games/RainbowWalletConnect";

// Import game components
import FlappyBird from "../components/games/FlappyBird";
import QuizGame from "../components/games/QuizGame";
import TicTacToe from "../components/games/TicTacToe";
import BlockStack from "../components/games/BlockStack";

const Games = () => {
  const { gameId } = useParams();
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

  // If wallet is not connected, show connection screen
  if (!isWalletConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-accent flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl border-2 border-purple-300 animate-scale-in">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              🎮 Connect Your Wallet
            </CardTitle>
            <p className="text-gray-600 mb-6">
              You need to connect your wallet to play games and earn tokens!
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <RainbowWalletConnect />
            <div className="text-center">
              <Link to="/">
                <Button variant="outline" className="mt-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderGame = () => {
    switch (gameId) {
      case "flappy-bird":
        return <FlappyBird />;
      case "quiz":
        return <QuizGame />;
      case "tic-tac-toe":
        return <TicTacToe />;
      case "block-stack":
        return <BlockStack />;
      default:
        return <Navigate to="/404" replace />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-accent">
      {renderGame()}
    </div>
  );
};

export default Games;

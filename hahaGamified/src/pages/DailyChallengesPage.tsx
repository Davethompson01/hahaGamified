import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import DailyChallenges from '../components/games/DailyChallenges';

const DailyChallengesPage = () => {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100">
      {/* Header with back button */}
      <div className="p-4">
        <Button 
          onClick={handleBackToDashboard}
          variant="outline"
          className="border-blue-600 text-blue-600 hover:bg-blue-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      {/* Daily Challenges Content */}
      <div className="px-4 pb-4">
        <DailyChallenges
          currentGameScore={0}
          gameType="general"
          onChallengeComplete={() => {}}
        />
      </div>
    </div>
  );
};

export default DailyChallengesPage;

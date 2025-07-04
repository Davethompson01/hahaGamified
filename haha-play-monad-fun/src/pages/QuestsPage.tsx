import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';
// import Quests from '../components/Quests';

const QuestsPage = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-purple-100">
      {/* Header with back button */}
      <div className="p-4">
        <Button 
          onClick={handleBackToHome}
          variant="outline"
          className="border-indigo-600 text-indigo-600 hover:bg-indigo-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
      </div>

      {/* Quests Content */}
      <div className="px-4 pb-4">
        {/* <Quests /> */}
      </div>
    </div>
  );
};

export default QuestsPage;

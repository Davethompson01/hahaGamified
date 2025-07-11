import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Dashboard from '../components/Dashboard';

const DashboardPage = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100">
      {/* Header with back button */}
      <div className="p-4">
        <Button 
          onClick={handleBackToHome}
          variant="outline"
          className="border-purple-600 text-purple-600 hover:bg-purple-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
      </div>

      {/* Dashboard Content */}
      <div className="px-4 pb-4">
        <Dashboard />
      </div>
    </div>
  );
};

export default DashboardPage;

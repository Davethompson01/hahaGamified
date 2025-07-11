
import React from "react";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Play, Trophy, Zap } from "lucide-react";

interface DinoGameMenuProps {
  onStartGame: () => void;
}

const DinoGameMenu: React.FC<DinoGameMenuProps> = ({ onStartGame }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600">
      <Card className="w-full max-w-md bg-gradient-to-br from-white via-green-50 to-emerald-50 border-4 border-green-400 shadow-2xl animate-scale-in">
        <CardHeader className="text-center">
          <div className="text-8xl mb-4 animate-bounce"></div>
          <CardTitle className="text-3xl md:text-4xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            Hulk Run 3D
          </CardTitle>
          {/* <div className="flex justify-center gap-2 mb-4">
            <Badge className="bg-green-500 text-white">
              <Zap className="w-4 h-4 mr-1" />
              3D Graphics
            </Badge>
            <Badge className="bg-emerald-500 text-white">
              <Trophy className="w-4 h-4 mr-1" />
              High Score
            </Badge> */}
          {/* </div> */}
        </CardHeader>s  
        
        <CardContent className="text-center space-y-6">
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-6 rounded-xl">
            <h3 className="text-xl font-bold text-green-800 mb-3">🎮 Ready to Run?</h3>
            <p className="text-green-700 mb-4">
              The faster you go, the higher your score!
            </p>
          </div>
          
            {/* <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center justify-center p-3 bg-green-100 rounded-lg">
                <span className="font-semibold text-green-800">🏃‍♂️ Run Fast</span>
              </div>
              <div className="flex items-center justify-center p-3 bg-emerald-100 rounded-lg">
                <span className="font-semibold text-emerald-800">⚡ Gain Speed</span>
              </div>
            </div> */}
          
          <Button 
            onClick={onStartGame}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 text-xl font-bold transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            <Play className="w-6 h-6 mr-2" />
            💪 Start Hulk Run!
          </Button>
          
          <div className="text-center text-sm text-gray-600">
            <p>🎯 Use spacebar or tap to jump • 📱 Tilt device on mobile</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DinoGameMenu;

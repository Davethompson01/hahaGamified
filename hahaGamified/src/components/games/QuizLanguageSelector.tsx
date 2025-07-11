
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Brain, Sparkles } from "lucide-react";

export type Language = 'english' | 'hindi' | 'spanish';

interface QuizLanguageSelectorProps {
  onLanguageSelect: (language: Language) => void;
}

const QuizLanguageSelector: React.FC<QuizLanguageSelectorProps> = ({ onLanguageSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-bounce"></div>
      </div>

      <Card className="w-full max-w-4xl bg-white/95 backdrop-blur-sm shadow-2xl border-0 relative z-10 animate-scale-in">
        <CardHeader className="text-center pb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Brain className="w-16 h-16 text-purple-600 animate-pulse" />
              {/* <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-spin" /> */}
            </div>
          </div>
          <CardTitle className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent mb-4">
            🧠 Quiz Challenge
          </CardTitle>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Test your knowledge across different languages and topics. Choose your preferred language to begin!
          </p>
        </CardHeader>
        
        <CardContent className="space-y-8 px-8 pb-8">
          <div className="flex items-center justify-center space-x-2 text-gray-500 mb-6">
            <Globe className="w-5 h-5" />
            <span className="font-medium">Choose your language:</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Button
              onClick={() => onLanguageSelect('english')}
              className="group relative bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-8 px-8 text-lg font-bold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl transform border-0 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex flex-col items-center space-y-3">
                <div className="text-3xl">🇺🇸</div>
                <div>English</div>
                <div className="text-sm opacity-90">Global Language</div>
              </div>
            </Button>
            
            <Button
              onClick={() => onLanguageSelect('hindi')}
              className="group relative bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-8 px-8 text-lg font-bold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl transform border-0 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-orange-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex flex-col items-center space-y-3">
                <div className="text-3xl">🇮🇳</div>
                <div>हिंदी</div>
                <div className="text-sm opacity-90">भारतीय भाषा</div>
              </div>
            </Button>
            
            <Button
              onClick={() => onLanguageSelect('spanish')}
              className="group relative bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-8 px-8 text-lg font-bold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl transform border-0 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex flex-col items-center space-y-3">
                <div className="text-3xl">🇪🇸</div>
                <div>Español</div>
                <div className="text-sm opacity-90">Idioma Español</div>
              </div>
            </Button>
          </div>

          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 px-6 py-3 rounded-full">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-purple-800 font-medium">30 Random Questions • Timed Challenge</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizLanguageSelector;

import React, { useState } from 'react';
import QuizLanguageSelector from './QuizLanguageSelector';
import EnhancedQuizGameplay from './EnhancedQuizGameplay';

const LANGUAGE_MAP = {
  english: {
    id: 'english',
    name: 'English',
    flag: '🇺🇸',
    gradient: 'from-blue-400 to-blue-600'
  },
  hindi: {
    id: 'hindi',
    name: 'Hindi',
    flag: '🇮🇳',
    gradient: 'from-orange-400 to-orange-600'
  },
  spanish: {
    id: 'spanish',
    name: 'Spanish',
    flag: '🇪🇸',
    gradient: 'from-red-400 to-red-600'
  }
};

type LanguageKey = keyof typeof LANGUAGE_MAP;

type Language = typeof LANGUAGE_MAP[LanguageKey];

const QuizGame = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);

  const handleLanguageSelect = (languageKey: LanguageKey) => {
    setSelectedLanguage(LANGUAGE_MAP[languageKey]);
  };

  const handleBackToLanguageSelect = () => {
    setSelectedLanguage(null);
  };

  return (
    <div className="w-full h-full min-h-screen">
      {!selectedLanguage ? (
        <QuizLanguageSelector onLanguageSelect={handleLanguageSelect} />
      ) : (
        <EnhancedQuizGameplay 
          language={selectedLanguage} 
          onBackToLanguageSelect={handleBackToLanguageSelect}
        />
      )}
    </div>
  );
};

export default QuizGame;

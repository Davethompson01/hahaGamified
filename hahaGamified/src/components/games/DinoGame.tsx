
import React from 'react';
import { Navigate } from 'react-router-dom';

const DinoGame = () => {
  // Redirect to the new route structure
  return <Navigate to="/games/dino" replace />;
};

export default DinoGame;

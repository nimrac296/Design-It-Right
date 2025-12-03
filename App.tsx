import React, { useState, useEffect } from 'react';
import { DESIGN_CHALLENGES } from './constants';
import { ChallengeData, DesignChallengeData } from './types';
import DesignChallenge from './components/DesignChallenge';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const [currentChallenge, setCurrentChallenge] = useState<ChallengeData | null>(null);

  useEffect(() => {
    const designChallenges = DESIGN_CHALLENGES.filter(c => c.type === 'DESIGN');
    
    // Check if there is a saved challenge ID to restore the user's session
    const lastChallengeId = localStorage.getItem('last_challenge_id');
    
    if (lastChallengeId) {
      const savedChallenge = designChallenges.find(c => c.id === parseInt(lastChallengeId));
      if (savedChallenge) {
        setCurrentChallenge(savedChallenge);
        return;
      }
    }

    // Fallback: Select a random challenge
    if (designChallenges.length > 0) {
        const randomIndex = Math.floor(Math.random() * designChallenges.length);
        setCurrentChallenge(designChallenges[randomIndex]);
    }
  }, []);

  const handleSelectChallenge = (id: number) => {
    const selected = DESIGN_CHALLENGES.find(c => c.id === id);
    if (selected) {
      setCurrentChallenge(selected);
      // Optional: Update URL or local storage here if needed explicitly
    }
  };

  if (!currentChallenge) {
    return (
      <div className="min-h-screen bg-brand-bg flex justify-center items-center">
        <LoadingSpinner />
        <span className="ml-4 text-brand-text-muted">Loading...</span>
      </div>
    );
  }

  return (
    // The App wrapper is now minimal, letting the child component control the full layout
    <main className="bg-brand-bg min-h-screen text-brand-text font-sans">
       <DesignChallenge 
          challenge={currentChallenge as DesignChallengeData} 
          onSelectChallenge={handleSelectChallenge}
       />
    </main>
  );
};

export default App;
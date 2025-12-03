import React, { useState } from 'react';
import { ColorVibeChallengeData } from '../types';
import { getColorVibeFeedback } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

interface ColorVibeChallengeProps {
  challenge: ColorVibeChallengeData;
}

const ColorVibeChallenge: React.FC<ColorVibeChallengeProps> = ({ challenge }) => {
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [streak, setStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) {
      setError('Please describe the vibe before submitting.');
      return;
    }
    setError('');
    setIsLoading(true);
    setFeedback('');
    setIsCorrect(null);
    setSubmitted(true);
    
    try {
      const result = await getColorVibeFeedback(challenge.colors, challenge.keywords, userInput);
      setFeedback(result.feedback);
      setIsCorrect(result.isCorrect);

      if (result.isCorrect) {
        setStreak(prev => prev + 1);
      } else {
        setStreak(0);
      }
    } catch (err) {
      setError('Failed to get feedback. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderFeedback = () => {
    if (!submitted || isLoading) return null;

    const feedbackColor = isCorrect ? 'border-green-500' : 'border-red-500';
    const feedbackHeader = isCorrect ? 'Correct! 🔥' : 'Not Quite... 🤔';

    return (
      <div className={`mt-8 p-6 bg-slate-800/50 rounded-lg border ${feedbackColor}`}>
        <h3 className="text-xl font-bold text-slate-100">{feedbackHeader}</h3>
        <p className="mt-2 text-slate-300">{feedback}</p>
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-100">{challenge.title}</h2>
      <div className="flex justify-between items-center mt-4">
        <p className="text-lg text-slate-400">Current Streak:</p>
        <p className="text-3xl font-bold text-indigo-400">{streak}</p>
      </div>

      <div className="mt-6 flex space-x-2 p-4 bg-slate-900 border border-slate-700 rounded-lg">
        {challenge.colors.map((color, index) => (
          <div 
            key={index}
            className="w-1/5 h-24 rounded-md"
            style={{ backgroundColor: color }}
            title={color}
          ></div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-6">
        <label htmlFor="color-vibe-description" className="block text-lg font-medium text-slate-200">
          {challenge.prompt}
        </label>
        <textarea
          id="color-vibe-description"
          rows={5}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="mt-2 block w-full bg-slate-900 border border-slate-700 rounded-md shadow-sm p-3 text-slate-200 focus:ring-indigo-500 focus:border-indigo-500 placeholder-slate-500"
          placeholder="e.g., This feels very corporate and trustworthy, maybe for a bank or a tech company..."
        />
        {error && <p className="mt-2 text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="mt-4 inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
        >
          {isLoading ? <><LoadingSpinner /> Analyzing...</> : 'Check My Vibe'}
        </button>
      </form>

      {renderFeedback()}
    </div>
  );
};

export default ColorVibeChallenge;
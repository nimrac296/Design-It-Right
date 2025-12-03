
import React, { useState } from 'react';
import { VibeCheckChallengeData } from '../types';
import { getVibeCheckFeedback } from '../services/geminiService';
import { urlToBase64 } from '../utils/image';
import LoadingSpinner from './LoadingSpinner';

interface VibeCheckChallengeProps {
  challenge: VibeCheckChallengeData;
}

const VibeCheckChallenge: React.FC<VibeCheckChallengeProps> = ({ challenge }) => {
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) {
      setError('Please describe the vibe before submitting.');
      return;
    }
    setError('');
    setIsLoading(true);
    setFeedback('');
    try {
      const { base64, mimeType } = await urlToBase64(challenge.imageUrl);
      const result = await getVibeCheckFeedback(base64, mimeType, userInput);
      setFeedback(result);
    } catch (err) {
      setError('Failed to process the image and get feedback. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-100">{challenge.title}</h2>
      <div className="mt-4 aspect-video bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
        <img src={challenge.imageUrl} alt="UI to analyze" className="w-full h-full object-cover" />
      </div>

      <form onSubmit={handleSubmit} className="mt-6">
        <label htmlFor="vibe-description" className="block text-lg font-medium text-slate-200">
          {challenge.prompt}
        </label>
        <textarea
          id="vibe-description"
          rows={6}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="mt-2 block w-full bg-slate-900 border border-slate-700 rounded-md shadow-sm p-3 text-slate-200 focus:ring-indigo-500 focus:border-indigo-500 placeholder-slate-500"
          placeholder="e.g., This design feels very luxurious and exclusive. The dark color scheme and serif font suggest a high-end brand..."
        />
        {error && <p className="mt-2 text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="mt-4 inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
        >
          {isLoading ? <><LoadingSpinner /> Analyzing...</> : 'Get Feedback'}
        </button>
      </form>

      {/* FIX: Replaced FeedbackDisplay component which expects an object with a simple div to correctly render string feedback. */}
      {feedback && (
        <div className="mt-8 p-6 bg-slate-800/50 rounded-lg border border-slate-700">
          <h2 className="text-2xl font-bold text-slate-100 mb-4">
            AI Feedback
          </h2>
          <p className="text-slate-300">{feedback}</p>
        </div>
      )}
    </div>
  );
};

export default VibeCheckChallenge;
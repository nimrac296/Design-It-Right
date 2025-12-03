import React, { useState } from 'react';
import { TypographyChallengeData } from '../types';
import { getTypographyFeedback } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import OptionButton from './OptionButton';

interface TypographyChallengeProps {
  challenge: TypographyChallengeData;
}

const TypographyChallenge: React.FC<TypographyChallengeProps> = ({ challenge }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [streak, setStreak] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAnswer) {
      setError('Please select an answer.');
      return;
    }
    setError('');
    setIsLoading(true);
    setFeedback('');
    setSubmitted(true);
    
    try {
      const isCorrect = selectedAnswer === challenge.correctAnswer;
      if (isCorrect) {
        setStreak(prev => prev + 1);
      } else {
        setStreak(0);
      }
      
      const result = await getTypographyFeedback(challenge.correctAnswer, challenge.explanationPrompt);
      setFeedback(result);
    } catch (err) {
      setError('Failed to get feedback. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMarkdown = (text: string) => {
    const html = text
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-indigo-400 mt-6 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-indigo-300 mt-8 mb-3">$1</h2>')
      .replace(/^\* (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
      .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br />')
      .replace(/(<li.*<\/li>)(?!<li)/gs, '<ul>$1</ul>')
      .replace(/<\/ul><br \/><ul>/g, '');
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  };

  const renderFeedback = () => {
    if (!submitted || isLoading) return null;
    const isCorrect = selectedAnswer === challenge.correctAnswer;
    const feedbackColor = isCorrect ? 'border-green-500' : 'border-red-500';
    const feedbackHeader = isCorrect ? 'Correct! 🔥' : 'Not Quite... 🤔';

    return (
      <div className={`mt-8 p-6 bg-slate-800/50 rounded-lg border ${feedbackColor}`}>
        <h3 className="text-xl font-bold text-slate-100">{feedbackHeader}</h3>
        {!isCorrect && <p className="mt-2 text-slate-300">The correct answer was <strong>{challenge.correctAnswer}</strong>. Here's why it's important:</p>}
        <div className="prose prose-invert text-slate-300 max-w-none mt-4">
          {renderMarkdown(feedback)}
        </div>
      </div>
    );
  };
  
  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-100">{challenge.title}</h2>
        <div className="text-right">
            <p className="text-sm text-slate-400">Streak</p>
            <p className="text-2xl font-bold text-indigo-400">{streak}</p>
        </div>
      </div>
      <div className="mt-4 aspect-video bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
        <img src={challenge.imageUrl} alt="Typography challenge" className="w-full h-full object-cover" />
      </div>

      <form onSubmit={handleSubmit} className="mt-6">
        <label className="block text-lg font-medium text-slate-200">
          {challenge.prompt}
        </label>
        
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {challenge.options.map(option => (
            <OptionButton
              key={option}
              text={option}
              isSelected={selectedAnswer === option}
              onClick={() => setSelectedAnswer(option)}
              disabled={submitted}
              isSubmitted={submitted}
              isCorrect={option === challenge.correctAnswer}
            />
          ))}
        </div>

        {error && <p className="mt-2 text-red-400">{error}</p>}
        
        {!submitted && (
          <button
            type="submit"
            disabled={isLoading || !selectedAnswer}
            className="mt-6 inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
          >
            {isLoading ? <><LoadingSpinner /> Checking...</> : 'Check Answer'}
          </button>
        )}
      </form>

      {isLoading && (
        <div className="flex justify-center items-center mt-8">
            <LoadingSpinner />
            <span className="ml-2">Analyzing...</span>
        </div>
      )}
      {renderFeedback()}
    </div>
  );
};

export default TypographyChallenge;
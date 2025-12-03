import React from 'react';
import { AIFeedback } from '../types';

const ScoreGauge: React.FC<{ score: number }> = ({ score }) => {
  const radius = 50;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let scoreColor = 'text-brand-text-muted';
  if (score >= 80) scoreColor = 'text-green-500'; // Green for high score
  else if (score >= 50) scoreColor = 'text-yellow-400';
  else if (score >= 0) scoreColor = 'text-red-500'; // Red for low score

  return (
    <div className="relative w-32 h-32">
      <svg
        height="100%"
        width="100%"
        viewBox={`0 0 ${radius*2} ${radius*2}`}
        className="transform -rotate-90"
      >
        <circle
          stroke="currentColor"
          className="text-brand-border"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="currentColor"
          className={scoreColor}
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-out' }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
         <span className={`text-3xl font-bold ${scoreColor}`}>{score}</span>
         <span className="text-xs text-brand-text-muted">/ 100</span>
      </div>
    </div>
  );
};


const FeedbackDisplay: React.FC<{ feedback: AIFeedback }> = ({ feedback }) => {
  return (
    <div className="mt-8 p-6 bg-brand-surface rounded-lg border border-brand-border">
      <h2 className="text-2xl font-bold text-brand-text mb-4">
        AI Feedback
      </h2>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="flex-shrink-0">
            <ScoreGauge score={feedback.score} />
        </div>
        <div className="flex-1">
            <p className="text-brand-text font-semibold italic">"{feedback.overallAssessment}"</p>
            <ul className="mt-3 space-y-2 text-brand-text-muted list-disc list-inside">
                {feedback.feedbackPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                ))}
            </ul>
        </div>
      </div>
    </div>
  );
};

export default FeedbackDisplay;
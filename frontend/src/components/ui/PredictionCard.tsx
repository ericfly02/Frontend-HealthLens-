// PredictionCard.tsx
import React from 'react';

interface PredictionCardProps {
  prediction: string;
}

const PredictionCard: React.FC<PredictionCardProps> = ({ prediction }) => {
  return (
    <div className="mt-8 p-6 max-w-lg mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold text-indigo-600">Prediction Result</h2>
      <p className="mt-4 text-gray-700">
        {prediction}
      </p>
    </div>
  );
};

export default PredictionCard;

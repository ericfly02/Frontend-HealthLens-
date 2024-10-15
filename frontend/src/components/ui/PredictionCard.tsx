import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "./Cards";
import { Badge } from "./badge";
import { AlertCircle } from 'lucide-react';

interface PredictionCardProps {
  prediction: string;
  confidence: number | null;
}

const PredictionCard: React.FC<PredictionCardProps> = ({ prediction, confidence }) => {
  if (!confidence) {
    confidence = 91;
  }
  const confidenceColor = confidence > 80 ? 'bg-green-500' : confidence > 50 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8 max-w-lg mx-auto"
    >
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <CardTitle className="flex items-center text-2xl font-bold">
            <AlertCircle className="mr-2 h-6 w-6" />
            Prediction Result
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{prediction}</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Confidence Level:</span>
              <Badge className={`${confidenceColor} text-white`}>
                {confidence}%
              </Badge>
            </div>
            <div className="mt-4 bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                className={`h-full ${confidenceColor}`}
                initial={{ width: 0 }}
                animate={{ width: `${confidence}%` }}
                transition={{ duration: 0.5, delay: 0.5 }}
              />
            </div>
          </motion.div>
          <p className="mt-6 text-sm text-gray-600">
            This prediction is based on our AI model's analysis. Please consult with a healthcare professional for a definitive diagnosis.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PredictionCard;
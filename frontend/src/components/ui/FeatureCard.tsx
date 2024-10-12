import { ReactNode } from 'react';
import { Button } from './Button';
import { ChevronRight } from 'lucide-react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  buttonText: string;
  onClick?: () => void; 
}

export default function FeatureCard({ icon, title, description, buttonText, onClick }: FeatureCardProps) {
  return (
    <div className="bg-white bg-opacity-50 backdrop-blur-md rounded-xl p-6 shadow-md">
      <div className="h-8 w-8 text-indigo-600 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-indigo-800">{title}</h3>
      <p className="text-indigo-600 mb-4">{description}</p>
      <Button variant="outline" className="text-indigo-600 hover:bg-indigo-50" onClick={onClick}>
        {buttonText} <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
}
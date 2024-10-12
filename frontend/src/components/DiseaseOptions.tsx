import { motion } from 'framer-motion';
import { Button } from "./ui/Button";
import { Stethoscope, Eye } from 'lucide-react';

interface DiseaseOptionsProps {
  onImageTypeSelect: (type: 'skin' | 'eye' | 'nail') => void;
  fromDashboard?: boolean;
}

interface FingernailProps {
  className?: string;
}

const Fingernail: React.FC<FingernailProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M8 9C8 5.686 10.686 3 14 3C17.314 3 20 5.686 20 9V20C20 21.105 19.105 22 18 22H10C8.895 22 8 21.105 8 20V9Z" />
    <path d="M8 9C8 12 10 14 14 14C18 14 20 12 20 9" />
  </svg>
);

export default function DiseaseOptions(props: DiseaseOptionsProps) {
  const { fromDashboard } = props;
  const { onImageTypeSelect } = props;
  return (
    <motion.div 
      key="step0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      {!fromDashboard && (      
        <>
          <h2 className="text-4xl font-bold mb-6 text-indigo-800">Discover Your Health's Story</h2>
          <p className="text-xl mb-8 text-indigo-600">Select the type of image you'd like to analyze</p>
          </>
      )}
      <div className="flex justify-center space-x-8">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => onImageTypeSelect('skin')}
            className="p-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex flex-col items-center transition-all"
          >
            <Stethoscope className="h-16 w-16 mb-4" />
            <span className="text-lg font-semibold">Skin</span>
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => onImageTypeSelect('eye')}
            className="p-8 bg-blue-500 hover:bg-blue-600 text-white rounded-xl flex flex-col items-center transition-all"
          >
            <Eye className="h-16 w-16 mb-4" />
            <span className="text-lg font-semibold">Eye </span>
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => onImageTypeSelect('nail')}
            className="p-8 bg-indigo-400 hover:bg-indigo-500 text-white rounded-xl flex flex-col items-center transition-all"
          >
            <Fingernail className="h-16 w-16 mb-4" />
            <span className="text-lg font-semibold">Nail </span>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
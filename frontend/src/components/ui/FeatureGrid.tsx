import React from 'react';
import { Book, MessageSquare, Code } from 'lucide-react';
import FeatureCard from './FeatureCard';
import { motion } from 'framer-motion';

interface FeatureGridProps {
  onConsultationClick: () => void;
  onLearnMoreClick: () => void;
  onResourcesClick: () => void;
}

export default function FeatureGrid({ onConsultationClick, onLearnMoreClick, onResourcesClick }: FeatureGridProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="mt-16 grid md:grid-cols-3 gap-8"
    >
      <FeatureCard
        icon={<Book className="w-8 h-8 text-indigo-600" />}
        title="Skin Encyclopedia"
        description="Explore a comprehensive database of skin conditions and treatments."
        buttonText="Learn More"
        onClick={onLearnMoreClick}
      />
      <FeatureCard
        icon={<MessageSquare className="w-8 h-8 text-indigo-600" />}
        title="Expert Consultations"
        description="Connect with dermatologists for professional advice."
        buttonText="Book a Session"
        onClick={onConsultationClick}
      />
      <FeatureCard
        icon={<Code className="w-8 h-8 text-indigo-600" />}
        title="Project Resources"
        description="Explore our codebase and watch our project video."
        buttonText="View Resources"
        onClick={onResourcesClick}
      />
    </motion.div>
  );
}
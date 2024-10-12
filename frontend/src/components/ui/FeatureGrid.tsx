import React from 'react';
import { Book, BarChart, MessageSquare } from 'lucide-react';
import FeatureCard from './FeatureCard';
import { motion } from 'framer-motion';

interface FeatureGridProps {
  onConsultationClick: () => void;
  onDashboardClick: () => void;
  onLearnMoreClick: () => void;
}

export default function FeatureGrid({ onConsultationClick, onDashboardClick, onLearnMoreClick }: FeatureGridProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="mt-16 grid md:grid-cols-3 gap-8"
    >
      <FeatureCard
        icon={<Book />}
        title="Skin Encyclopedia"
        description="Explore a comprehensive database of skin conditions and treatments."
        buttonText="Learn More"
        onClick={onLearnMoreClick}
      />
      <FeatureCard
        icon={<BarChart />}
        title="Personalized Insights"
        description="Track your skin health over time with AI-powered analytics."
        buttonText="View Insights"
        onClick={onDashboardClick}
      />
      <FeatureCard
        icon={<MessageSquare />}
        title="Expert Consultations"
        description="Connect with dermatologists for professional advice."
        buttonText="Book a Session"
        onClick={onConsultationClick}
      />
    </motion.div>
  );
}
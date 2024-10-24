import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Youtube, ArrowLeft, Code, Video, ExternalLink } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export default function ResourcesPage() {
  const navigate = useNavigate();

  const repositories = [
    { name: 'Frontend Repository', url: 'https://github.com/ericfly02/Frontend-HealthLens', icon: Code, color: 'text-blue-600' },
    { name: 'Backend Repository', url: 'https://github.com/ericfly02/Backend-HealthLens', icon: Code, color: 'text-green-600' },
    { name: 'Flask Service Repository', url: 'https://github.com/ericfly02/Flask-Service-HealthLens', icon: Code, color: 'text-purple-600' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-teal-50 text-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-5xl mx-auto"
      >
        <motion.div variants={itemVariants} className="mb-16">
          <Button
            variant="ghost"
            className="mb-8 flex items-center text-indigo-600 hover:text-indigo-800 transition-colors duration-300"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>

          <h1 className="text-6xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Project Resources
          </h1>
          <p className="text-center text-gray-600 text-xl">Dive into our codebase and explore our project in action</p>
        </motion.div>

        <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8 transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-3xl font-semibold mb-6 text-indigo-700 flex items-center">
              <Github className="mr-3 h-8 w-8" />
              GitHub Repositories
            </h2>
            <div className="space-y-6">
              {repositories.map((repo, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left hover:bg-gray-50 transition-all duration-300 group"
                  >
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center py-4 px-4 rounded-lg"
                    >
                      <repo.icon className={`mr-4 h-6 w-6 ${repo.color}`} />
                      <span className="font-medium text-lg group-hover:text-indigo-600 transition-colors duration-300">{repo.name}</span>
                      <ExternalLink className="ml-auto h-5 w-5 text-gray-400 group-hover:text-indigo-600 transition-colors duration-300" />
                    </a>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8 transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-3xl font-semibold mb-6 text-indigo-700 flex items-center">
              <Video className="mr-3 h-8 w-8" />
              Project Video
            </h2>
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="aspect-video bg-gray-100 rounded-xl overflow-hidden"
            >
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Project Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </motion.div>
            <p className="text-gray-600 mt-6 text-lg">
              Get an in-depth look at our project, its features, and how it works in our comprehensive video walkthrough.
            </p>
            <Button
              variant="outline"
              className="w-full justify-center text-center hover:bg-red-50 transition-colors duration-300 mt-4"
            >
              <a
                href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center py-3"
              >
                <Youtube className="mr-3 h-6 w-6 text-red-600" />
                <span className="font-medium text-lg">Watch on YouTube</span>
              </a>
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
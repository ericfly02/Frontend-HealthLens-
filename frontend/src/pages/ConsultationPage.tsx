import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorFinder from '../components/doctor-finder';
import { Button } from "../components/ui/Button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/DropdownMenu";
import { User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ConsultationPage() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-teal-50 text-gray-800">
      <header className="p-4 flex justify-between items-center bg-white bg-opacity-80 backdrop-blur-md">
        <h1 className="text-xl md:text-2xl font-bold text-indigo-600">HealthLens</h1>
        <nav className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" onClick={() => handleNavigation('/')}>Home</Button>
          <Button variant="ghost" onClick={() => handleNavigation('/encyclopedia')}>Encyclopedia</Button>
          <Button variant="ghost" onClick={() => handleNavigation('/about')}>About</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" onClick={toggleDropdown}>
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            {isDropdownOpen && (
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => handleNavigation('/login')}>Login</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleNavigation('/signup')}>Sign Up</DropdownMenuItem>
              </DropdownMenuContent>
            )}
          </DropdownMenu>
        </nav>
        <Button variant="outline" size="icon" className="md:hidden" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white shadow-lg p-4 absolute top-16 left-0 right-0 z-50"
          >
            <Button variant="ghost" className="w-full justify-start mb-2" onClick={() => handleNavigation('/')}>Home</Button>
            <Button variant="ghost" className="w-full justify-start mb-2" onClick={() => handleNavigation('/encyclopedia')}>Encyclopedia</Button>
            <Button variant="ghost" className="w-full justify-start mb-2" onClick={() => handleNavigation('/about')}>About</Button>
            <Button variant="ghost" className="w-full justify-start mb-2" onClick={() => handleNavigation('/login')}>Login</Button>
            <Button variant="ghost" className="w-full justify-start mb-2" onClick={() => handleNavigation('/signup')}>Sign Up</Button>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="container mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-6 text-indigo-800">Expert Consultations</h2>
          <DoctorFinder />
        </motion.div>
      </main>
    </div>
  );
}
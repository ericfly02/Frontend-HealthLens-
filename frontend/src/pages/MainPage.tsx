import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "../components/ui/Button";
import DiseaseOptions from "../components/DiseaseOptions";
import UploadImage from "../components/UploadImage";
import Chat from "../components/Chat";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/DropdownMenu";
import { User, ChevronLeft, X } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import FeatureGrid from '../components/ui/FeatureGrid';
import Login from '../components/Auth/Login';
import Signup from '../components/Auth/Signup';
import { SpeedInsights } from "@vercel/speed-insights/react"
import axios from 'axios';
import Loader from "../components/ui/Loader";


export default function MainPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [imageType, setImageType] = useState<'skin' | 'eye' | 'nail' | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ text: string; isAI: boolean }>>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | null>(null);
  const [loading, setLoading] = useState(false); // Loading state for AI analysis

  const handleImageTypeSelect = (type: 'skin' | 'eye' | 'nail') => {
    setImageType(type);
    setStep(1);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, imageUrl: string) => {
    setUploadedImageUrl(imageUrl);
    setStep(2);
    setLoading(true);
    setChatMessages([{ text: `Analyzing your ${imageType} image...`, isAI: true }]);
  
    const file = event.target.files?.[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', imageType!);
  
    let apiUrl;
    switch (imageType) {
      case 'eye':
        apiUrl = 'https://46.172.240.200/predict/cataracts';
        break;
      case 'nail':
        apiUrl = 'https://46.172.240.200/predict/nails';
        break;
      case 'skin':
        apiUrl = 'https://46.172.240.200/predict/skin';
        break;
      default:
        return;
    }
  
    try {
      const response = await axios.post(apiUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      console.log('Prediction result:', response);
  
      const prediction = response.data.prediction;
      setChatMessages(prev => [
        ...prev,
        { text: `Prediction result: ${prediction}. Let's discuss your condition in more detail.`, isAI: true },
      ]);
  
      // Assuming you have a sessionId from somewhere, e.g., stored in localStorage/sessionStorage
      const sessionId = localStorage.getItem('sessionId') || null;
  
      // Send the prediction and sessionId to the conversation starter
      const assistantResponse = await axios.post('https://backend-health-lens.vercel.app/chat/start-conversation', {
        sessionId,  // Pass the sessionId here
        disease: prediction,  // Pass the prediction result as the disease
      });
  
      setChatMessages(prev => [
        ...prev,
        { text: assistantResponse.data.reply, isAI: true },
      ]);
  
    } catch (error) {
      console.error('Error uploading image:', error);
      setChatMessages(prev => [
        ...prev,
        { text: 'There was an error uploading the image. Please try again.', isAI: true },
      ]);
    } finally {
      setLoading(false);
    }
  };
  

  const handleSendMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const input = form.elements.namedItem('message') as HTMLInputElement;
    const userMessage = input.value;
    setChatMessages(prev => [...prev, { text: userMessage, isAI: false }]);
    form.reset();
    setTimeout(() => {
      setChatMessages(prev => [...prev, { text: `Based on the ${imageType} image and your description, it appears to be...`, isAI: true }]);
    }, 1000);
  }; 

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const handleBack = () => {
    setStep(prevStep => Math.max(0, prevStep - 1));
    if (step === 1) {
      setImageType(null);
    } else if (step === 2) {
      setUploadedImageUrl(null);
      setChatMessages([]);
    }
  };

  const openAuthModal = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    closeDropdown();
  };

  const closeAuthModal = () => {
    setAuthMode(null);
  };

  const switchAuthMode = () => {
    setAuthMode(prevMode => prevMode === 'login' ? 'signup' : 'login');
  };

  const handleLogin = () => {
    // Here you would typically handle the login logic
    // For now, we'll just redirect to the dashboard
    navigate('/dashboard');
  };

  const handleConsultationClick = () => {
    navigate('/consultation');
  };

  const handleDashboardClick = () => {
    navigate('/dashboard');
  };

  const handleAboutClick = () => {
    navigate('/about');
  };

  const handleEncyclopediaClick = () => {
    navigate('/encyclopedia');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-teal-50 text-gray-800">
      <header className="p-4 flex justify-between items-center bg-white bg-opacity-80 backdrop-blur-md">
        <h1 className="text-2xl font-bold text-indigo-600">HealthLens</h1>
        <nav className="flex items-center space-x-4">
          <Button variant="ghost" onClick={handleEncyclopediaClick}>Encyclopedia</Button>
          <Button variant="ghost" onClick={handleAboutClick}>About</Button>
          <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6 text-red-600 hover:opacity-75 transition-opacity"
            >
              <path d="M19.615 6.035c-.556-.557-1.24-.84-2.055-.84-1.876-.03-3.755-.035-5.625-.035-1.87 0-3.745.005-5.625.035-.815 0-1.5.283-2.055.84-.556.556-.835 1.244-.835 2.06-.03 1.873-.035 3.752-.035 5.625s.005 3.745.035 5.625c0 .815.279 1.5.835 2.055.556.556 1.244.835 2.055.835 1.876.03 3.755.035 5.625.035 1.87 0 3.745-.005 5.625-.035.815 0 1.5-.279 2.055-.835.556-.556.835-1.24.835-2.055.03-1.876.035-3.755.035-5.625s-.005-3.755-.035-5.625c0-.815-.279-1.5-.835-2.055zm-10.905 8.46v-4.995l5.195 2.505-5.195 2.49z" />
            </svg>
          </a>
          <a href="https://github.com/ericfly02/Frontend-HealthLens" target="_blank" rel="noopener noreferrer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6 text-gray-800 hover:text-gray-600 transition-colors"
            >
              <path d="M12 0.297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.111.82-.261.82-.577 0-.285-.011-1.04-.017-2.04-3.338.724-4.042-1.415-4.042-1.415-.546-1.387-1.333-1.757-1.333-1.757-1.09-.744.083-.729.083-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.809 1.305 3.495.998.107-.775.418-1.305.762-1.605-2.665-.304-5.466-1.332-5.466-5.93 0-1.31.469-2.381 1.236-3.22-.123-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.289-1.552 3.295-1.23 3.295-1.23.655 1.653.242 2.873.12 3.176.77.839 1.235 1.91 1.235 3.22 0 4.61-2.807 5.623-5.48 5.921.43.371.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .32.218.694.825.576 4.765-1.589 8.2-6.086 8.2-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" onClick={toggleDropdown}>
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            {isDropdownOpen && (
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => openAuthModal('login')}>Login</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => openAuthModal('signup')}>Sign Up</DropdownMenuItem>
                <DropdownMenuItem onClick={closeDropdown}>Dashboard</DropdownMenuItem>
              </DropdownMenuContent>
            )}
          </DropdownMenu>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-12 relative">
        <AnimatePresence mode="wait">
          {step > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute top-0 left-0 mt-4 ml-4"
            >
              <Button
                onClick={handleBack}
                variant="outline"
                className="flex items-center space-x-2 bg-white bg-opacity-50 backdrop-blur-md hover:bg-opacity-75 transition-all"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
            </motion.div>
          )}
          {step === 0 && <DiseaseOptions onImageTypeSelect={handleImageTypeSelect} />}
          {step === 1 && <UploadImage imageType={imageType} onImageUpload={handleImageUpload} />}
          {step === 2 && (
            <div>
              {loading ? (
                <Loader />  // Show loader if image is being processed
              ) : (
                <Chat
                  chatMessages={chatMessages}
                  onSendMessage={handleSendMessage}
                  imageType={imageType}
                  uploadedImageUrl={uploadedImageUrl}
                />
              )}
            </div>
          )}
        </AnimatePresence>
        <FeatureGrid onConsultationClick={handleConsultationClick} onDashboardClick={handleDashboardClick} onLearnMoreClick={handleEncyclopediaClick}/>
      </main>

      <AnimatePresence>
        {authMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 15 }}
              className="relative"
            >
              <button
                onClick={closeAuthModal}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition-colors z-10"
              >
                <X size={24} />
              </button>
              {authMode === 'login' ? (
                <Login onClose={closeAuthModal} onSwitchToSignup={switchAuthMode} onLogin={handleLogin} />
              ) : (
                <Signup onClose={closeAuthModal} onSwitchToLogin={switchAuthMode} />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <SpeedInsights />
    </div>
  );
}
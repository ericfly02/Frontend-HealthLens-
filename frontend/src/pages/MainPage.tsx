import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "../components/ui/Button";
import DiseaseOptions from "../components/DiseaseOptions";
import UploadImage from "../components/UploadImage";
import Chat from "../components/Chat";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/DropdownMenu";
import { User, ChevronLeft, X, Menu } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import FeatureGrid from '../components/ui/FeatureGrid';
import Login from '../components/Auth/Login';
import Signup from '../components/Auth/Signup';
import { SpeedInsights } from "@vercel/speed-insights/react"
import axios from 'axios';
import Loader from "../components/ui/Loader";
import ChatLoader from '../components/ui/ChatLoader';

export default function MainPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [imageType, setImageType] = useState<'skin' | 'eye' | 'nail' | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ text: string; isAI: boolean }>>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | null>(null);
  const [loading, setLoading] = useState(false); 
  const [prediction, setPrediction] = useState(''); 
  const [confidence, setConfidence] = useState<number>(0);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [isTranscriptionLoading, setIsTranscriptionLoading] = useState(false);
  const [isMessageLoading, setIsMessageLoading] = useState(false);


  const handleImageTypeSelect = (type: 'skin' | 'eye' | 'nail') => {
    setImageType(type);
    setStep(1);
  };

  const sendMessageToBackend = async (userMessage: string) => {
    // Show user message in the chat
    setChatMessages(prev => [...prev, { text: userMessage, isAI: false }]);
  
    // Show loader while waiting for the response
    setLoading(true);
  
    try {
      //const sessionId = localStorage.getItem('sessionId') || null;
      const response = await axios.post('https://backend-health-lens.vercel.app/chat/start-conversation', {
        message: userMessage,
        //sessionId,
      });
 
      const botReply = response.data.response;
      //localStorage.setItem('sessionId', response.data.sessionId);
  
      // Add the bot reply to chat and stop the loader
      setChatMessages(prev => [...prev, { text: botReply, isAI: true }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setChatMessages(prev => [
        ...prev,
        { text: 'There was an error connecting to the chatbot. Please try again later.', isAI: true }
      ]);
    } finally {
      setLoading(false); // Stop showing the loader
    }
  };
  
   
  const handleTranscription = async (transcribedText: string) => {
    setTranscription(transcribedText);
  
    // Show loader while waiting for the response
    setLoading(true);
  
    await sendMessageToBackend(transcribedText);
  };
  
  

  const handleSendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const input = form.elements.namedItem('message') as HTMLInputElement;
    const userMessage = input.value;
    form.reset();
    
    await sendMessageToBackend(userMessage);
  };
  
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, imageUrl: string) => {
    setUploadedImageUrl(imageUrl);
    setStep(2);
    setLoading(true);
    setChatMessages([{ text: `Hi there! I am your health assistant. My specialty is providing information about your diagnosis. What questions can I answer for you?`, isAI: true }]);
  
    const file = event.target.files?.[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', imageType!);
  
    let apiUrl;
    switch (imageType) {
      case 'eye':
        apiUrl = 'https://www.healthlens.beauty/predict/cataracts';
        break;
      case 'nail':
        apiUrl = 'https://www.healthlens.beauty/predict/nails';
        break;
      case 'skin':
        apiUrl = 'https://www.healthlens.beauty/predict/skin';
        break;
      default:
        return;
    }
  
    try {
      const response = await axios.post(apiUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    
      const prediction = response.data.prediction;
      const confidence = response.data.confidence;
      if(prediction === 'malignant' && confidence < 0.9) {
        setConfidence(0);
        setPrediction('Not Conclusive');
      }
      else{
        const confidenceAux = Number((confidence * 100).toFixed(2));
        setConfidence(confidenceAux);
        setPrediction(prediction);
      }

      // Add prediction result to chat messages
      /*
      setChatMessages(prev => [
        ...prev,
        { text: `Based on the image, I predict: ${prediction} with ${confidenceAux}% confidence. Do you have any questions about this diagnosis?`, isAI: true },
      ]);
      */
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

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
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
    setIsMobileMenuOpen(false);
  };

  const closeAuthModal = () => {
    setAuthMode(null);
  };

  const switchAuthMode = () => {
    setAuthMode(prevMode => prevMode === 'login' ? 'signup' : 'login');
  };

  const handleLogin = () => {
    navigate('/dashboard');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-teal-50 text-gray-800">
      <header className="p-4 flex justify-between items-center bg-white bg-opacity-80 backdrop-blur-md">
        <div className="flex items-center">
          {step > 0 && (
            <Button
              onClick={handleBack}
              variant="ghost"
              size="icon"
              className="mr-2 md:mr-4"
            >
              <ChevronLeft className="h-4 w-4 md:mr-1" />
              <span className="hidden md:inline">Back</span>
            </Button>
          )}
          <h1 className="text-xl md:text-2xl font-bold text-indigo-600">HealthLens</h1>
        </div>
        <nav className="hidden md:flex items-center space-x-4">
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
                <DropdownMenuItem onSelect={() => openAuthModal('login')}>Login</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => openAuthModal('signup')}>Sign Up</DropdownMenuItem>
              </DropdownMenuContent>
            )}
          </DropdownMenu>
        </nav>
        <Button variant="outline" size="icon" className="md:hidden" onClick={toggleMobileMenu}>
          <Menu className="h-4 w-4" />
        </Button>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white shadow-lg p-4 absolute top-16 left-0 right-0 z-50"
          >
            <Button variant="ghost" className="w-full justify-start mb-2" onClick={() => handleNavigation('/encyclopedia')}>Encyclopedia</Button>
            <Button variant="ghost" className="w-full justify-start mb-2" onClick={() => handleNavigation('/about')}>About</Button>
            <Button variant="ghost" className="w-full justify-start mb-2" onClick={() => openAuthModal('login')}>Login</Button>
            <Button variant="ghost" className="w-full justify-start mb-2" onClick={() => openAuthModal('signup')}>Sign Up</Button>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="container mx-auto px-4 py-8 md:py-12">
        <AnimatePresence mode="wait">
          {step === 0 && <DiseaseOptions onImageTypeSelect={handleImageTypeSelect} />}
          {step === 1 && <UploadImage imageType={imageType} onImageUpload={handleImageUpload} />}
          {step === 2 && (
            <div className="flex-grow overflow-auto">
            {(isTranscriptionLoading || isMessageLoading) ? (
              <ChatLoader />
            ) : (
              <Chat
                chatMessages={chatMessages}
                onSendMessage={handleSendMessage}
                imageType={imageType}
                uploadedImageUrl={uploadedImageUrl}
                prediction={prediction}
                confidence={confidence}
                loading={loading}  // Pass loading state here
                onTranscription={handleTranscription}
              />
            )}
            </div>
          )}
        </AnimatePresence>
        <FeatureGrid 
          onConsultationClick={() => handleNavigation('/consultation')} 
          onLearnMoreClick={() => handleNavigation('/encyclopedia')}
          onResourcesClick={() => handleNavigation('/resources')}
        />
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
              className="relative w-full max-w-md"
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
import React, { useState } from 'react';
import { Button } from "../ui/Button";
import { ChevronLeft } from 'lucide-react';
import DiseaseOptions from '../DiseaseOptions';
import UploadImage from '../UploadImage';
import Chat from '../Chat';
import axios from 'axios';

const UploadTab = () => {
  const [uploadStep, setUploadStep] = useState(0);
  const [imageType, setImageType] = useState<'skin' | 'eye' | 'nail' | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ text: string; isAI: boolean }>>([]);
  const [loading, setLoading] = useState(false); // Loading state for AI analysis
  const [prediction, setPrediction] = useState(''); 
  const [confidence, setConfidence] = useState<number>(0);

  const handleBack = () => {
    if (uploadStep > 0) setUploadStep((prev) => prev - 1);
  };

  const handleImageTypeSelect = async (type: 'skin' | 'eye' | 'nail') => {
    setImageType(type);
    setUploadStep(1);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'https://backend-health-lens.vercel.app/user/increment-scans', 
        {}, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error('Error incrementing scans:', error);
    }
  };

  const handlePrediction = async (disease: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'https://backend-health-lens.vercel.app/user/add-disease',
        { disease },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error('Error adding disease:', error);
    }
  };

  const handleSendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const form = event.target as HTMLFormElement;
    const input = form.elements.namedItem('message') as HTMLInputElement;
    const userMessage = input.value;

    setChatMessages(prev => [...prev, { text: userMessage, isAI: false }]);
    
    form.reset();

    try {
        const sessionId = localStorage.getItem('sessionId') || null;
        const response = await axios.post('https://backend-health-lens.vercel.app/chat/start-conversation', {
            message: userMessage,
            sessionId,
        });

        const botReply = response.data.watsonResponse;

        localStorage.setItem('sessionId', response.data.sessionId);

        setChatMessages(prev => [...prev, { text: botReply, isAI: true }]);
    } catch (error) {
        if ((error as any).response?.data?.error === 'Invalid Session') {
            localStorage.removeItem('sessionId');
            console.error("Session expired. Please try again.");
            setChatMessages(prev => [
                ...prev,
                { text: 'Session expired. Starting a new conversation...', isAI: true }
            ]);
        } else {
            console.error("Error sending message:", error);
            setChatMessages(prev => [
                ...prev,
                { text: 'There was an error connecting to the chatbot. Please try again later.', isAI: true }
            ]);
        }
    }
};

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, imageUrl: string) => {
    setUploadedImageUrl(imageUrl);
    setUploadStep(2);
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
      const response = await axios.post(apiUrl, formData,  {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    
      const prediction = response.data.prediction;
      const confidence = response.data.confidence;
      const confidenceAux = Number((confidence * 100).toFixed(2));
      setConfidence(confidenceAux);
      setPrediction(prediction);

      // Save disease to user's disease history in Supabase
      await handlePrediction(prediction);
  
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

  return (
    <div>
      {uploadStep === 0 && (
        <DiseaseOptions onImageTypeSelect={handleImageTypeSelect} fromDashboard={true} />
      )}
      {uploadStep === 1 && (
        <>
          <UploadImage imageType={imageType} onImageUpload={handleImageUpload} />
          <Button
            onClick={handleBack}
            variant="outline"
            className="flex items-center space-x-2 bg-white bg-opacity-50 backdrop-blur-md hover:bg-opacity-75 transition-all"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
        </>
      )}
      {uploadStep === 2 && (
        <>
          <Chat
            chatMessages={chatMessages}
            onSendMessage={handleSendMessage}
            imageType={imageType}
            uploadedImageUrl={uploadedImageUrl}
            prediction={prediction}
            confidence={confidence}
          />
          <Button
            onClick={handleBack}
            variant="outline"
            className="flex items-center space-x-2 bg-white bg-opacity-50 backdrop-blur-md hover:bg-opacity-75 transition-all"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
        </>
      )}
    </div>
  );
};

export default UploadTab;

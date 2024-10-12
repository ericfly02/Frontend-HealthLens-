import React, { useState } from 'react';
import { Button } from "../ui/Button";
import { ChevronLeft } from 'lucide-react';
import DiseaseOptions from '../DiseaseOptions';
import UploadImage from '../UploadImage';
import Chat from '../Chat';

const UploadTab = () => {
  const [uploadStep, setUploadStep] = useState(0);
  const [imageType, setImageType] = useState<'skin' | 'eye' | 'nail' | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ text: string; isAI: boolean }>>([]);

  const handleBack = () => {
    if (uploadStep > 0) setUploadStep((prev) => prev - 1);
  };

  const handleImageTypeSelect = (type: 'skin' | 'eye' | 'nail') => {
    setImageType(type);
    setUploadStep(1);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, imageUrl: string) => {
    console.log('Image uploaded:', event.target.files?.[0]);
    setUploadedImageUrl(imageUrl);
    setUploadStep(2);
    setChatMessages([{ text: `I've analyzed your ${imageType} image. Let's discuss your symptoms in more detail.`, isAI: true }]);
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
            onSendMessage={() => {}}
            imageType={imageType}
            uploadedImageUrl={uploadedImageUrl}
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

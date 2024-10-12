import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';

interface UploadImageProps {
  imageType: 'skin' | 'eye' | 'nail' | null;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>, imageUrl: string) => void;
}

export default function UploadImage({ imageType, onImageUpload }: UploadImageProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
      onImageUpload(event, imageUrl);
    }
  };

  return (
    <motion.div 
      key="step1"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <h2 className="text-4xl font-bold mb-6 text-indigo-800">Upload Your {imageType} Image</h2>
      <p className="text-xl mb-8 text-indigo-600">Let our AI analyze your {imageType} condition</p>
      <div className="max-w-md mx-auto">
        <label htmlFor="image-upload" className="cursor-pointer">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="border-3 border-dashed border-indigo-300 rounded-lg p-12 hover:border-indigo-500 transition-all"
          >
            {previewUrl ? (
              <img src={previewUrl} alt="Uploaded image" className="max-w-full h-auto rounded-lg" />
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="h-12 w-12 text-indigo-600 mb-4" />
                <span className="text-indigo-600">Click to Upload {imageType} Image</span>
              </div>
            )}
          </motion.div>
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>
    </motion.div>
  );
}

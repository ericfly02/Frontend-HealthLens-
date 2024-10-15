import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { MessageSquare, Maximize2, Minimize2, Mic, StopCircle } from 'lucide-react';
import axios from 'axios';
import PredictionCard from "./ui/PredictionCard";

interface ChatProps {
  chatMessages: Array<{ text: string; isAI: boolean }>;
  onSendMessage: (event: React.FormEvent<HTMLFormElement>) => void;
  imageType: 'skin' | 'eye' | 'nail' | null;
  uploadedImageUrl: string | null;
  prediction: string | null;
  confidence: number | null;
}

export default function Chat({ chatMessages, onSendMessage, imageType, uploadedImageUrl, prediction, confidence }: ChatProps) {
  const [isFullSize, setIsFullSize] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const toggleSize = () => setIsFullSize(!isFullSize);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        const formData = new FormData();
        formData.append('audio', audioBlob);

        try {
          const response = await axios.post('https://backend-health-lens.vercel.app/speech/speech-to-text', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          // Handle response from IBM Speech to Text
          console.log(response.data);
          // You can use response.data to display the transcribed text in the chat
        } catch (error) {
          console.error('Error transcribing voice:', error);
        }

        audioChunks.current = []; // Clear audio chunks for next recording
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  return (
    <motion.div 
      key="chat-component"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-6xl mx-auto"
    >
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-4 md:mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <h3 className="text-xl md:text-2xl font-semibold text-indigo-700 mb-2 md:mb-0">AI Analysis in Progress</h3>
          <Button
            onClick={toggleSize}
            variant="outline"
            size="icon"
            className="flex items-center space-x-2 text-sm"
          >
            {isFullSize ? <Minimize2 className="h-3 w-3 md:h-4 md:w-4" /> : <Maximize2 className="h-3 w-3 md:h-4 md:w-4" />}
            <span className="hidden md:inline">{isFullSize ? 'Split View' : 'Full Chat'}</span>
          </Button>
        </div>
        <div className={`flex flex-col ${isFullSize ? 'md:flex-col' : 'md:flex-row'}`}>
          <div className={`${isFullSize ? 'w-full' : 'w-full md:w-1/2 md:pr-3'} mb-4 md:mb-0`}>
            <div ref={chatContainerRef} className="bg-indigo-50 rounded-lg p-3 h-64 md:h-96 overflow-y-auto mb-4">
              <AnimatePresence>
                {chatMessages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.1 }}
                    className={`mb-3 ${message.isAI ? 'text-left' : 'text-right'}`}
                  >
                    <div className={`inline-block p-2 md:p-3 rounded-lg text-sm md:text-base ${message.isAI ? 'bg-indigo-100 text-indigo-800' : 'bg-teal-100 text-teal-800'}`}>
                      {message.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <form onSubmit={onSendMessage} className="flex flex-col md:flex-row gap-2">
              <Input
                type="text"
                name="message"
                placeholder="Chat here..."
                className="flex-grow bg-white border border-gray-300 rounded-lg p-2 text-sm md:text-base"
              />
              <div className="flex gap-2">
                <Button type="submit" className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg flex items-center justify-center text-sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send
                </Button>
                {isRecording ? (
                  <Button onClick={handleStopRecording} className="flex-1 md:flex-none bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg flex items-center justify-center text-sm">
                    <StopCircle className="h-4 w-4 mr-2" />
                    Stop
                  </Button>
                ) : (
                  <Button onClick={handleStartRecording} className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg flex items-center justify-center text-sm">
                    <Mic className="h-4 w-4 mr-2" />
                    Record
                  </Button>
                )}
              </div>
            </form>
          </div>
          <AnimatePresence>
            {(!isFullSize && uploadedImageUrl) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className={`${isFullSize ? 'w-full mt-4' : 'w-full md:w-1/2 md:pl-3 md:border-l md:border-indigo-100'}`}
              >
                <h3 className="text-xl md:text-2xl font-semibold mb-3 text-indigo-700">Uploaded {imageType === 'skin' ? 'Skin' : imageType === 'eye' ? 'Eye' : 'Nail'} Image</h3>
                <img src={uploadedImageUrl} alt={`Uploaded ${imageType} image`} className="w-full h-auto rounded-lg shadow-md mb-3" />

                <div className="mt-3">
                  {prediction && confidence !== null && <PredictionCard prediction={prediction} confidence={confidence} />}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
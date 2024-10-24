import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { MessageSquare, Maximize2, Minimize2, Mic, StopCircle, Bot, User } from 'lucide-react';
import axios from 'axios';
import PredictionCard from "./ui/PredictionCard";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import Loader from './ui/Loader';
import ChatLoader from './ui/ChatLoader';
import { on } from 'events';

interface ChatProps {
  chatMessages: Array<{ text: string; isAI: boolean }>;
  onSendMessage: (event: React.FormEvent<HTMLFormElement>) => void;
  imageType: 'skin' | 'eye' | 'nail' | null;
  uploadedImageUrl: string | null;
  prediction: string | null;
  confidence: number | null;
  loading: boolean;
  onTranscription: (transcription: string) => void;
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, [matches, query]);

  return matches;
}

export default function Chat({ chatMessages, onSendMessage, imageType, uploadedImageUrl, prediction, confidence, loading, onTranscription }: ChatProps) {
  const [isFullSize, setIsFullSize] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, isTranscribing]);

  const toggleSize = () => setIsFullSize(!isFullSize);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing the microphone', error);
    }
  };

  const handleStopRecording = async () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.wav');
  
        setIsTranscribing(true); // Set to true when transcription starts
        try {
          const response = await axios.post('https://www.healthlens.beauty/speech/transcribe', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          onTranscription(response.data.transcription);
        } catch (error) {
          console.error('Error uploading audio file:', error);
        } finally {
          setIsTranscribing(false); // Set to false once transcription is done
        }
      };
      setIsRecording(false);
      audioChunksRef.current = [];
    }
  };
  

  return (
    <motion.div 
      key="chat-component"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full max-w-7xl mx-auto"
    >
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 h-full flex flex-col">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <h3 className="text-xl md:text-2xl font-semibold text-indigo-700 mb-2 md:mb-0">AI Analysis in Progress</h3>
          {!isMobile && (
            <Button
              onClick={toggleSize}
              variant="outline"
              size="icon"
              className="flex items-center space-x-2 text-sm"
            >
              {isFullSize ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              <span className="hidden md:inline">{isFullSize ? 'Split View' : 'Full Chat'}</span>
            </Button>
          )}
        </div>
        <div className={`flex flex-col ${isMobile ? '' : (isFullSize ? 'md:flex-col' : 'md:flex-row')} flex-grow overflow-hidden`}>
          <div className={`${isFullSize ? 'w-full' : 'w-full md:w-1/2 md:pr-3'} mb-4 md:mb-0 flex flex-col flex-grow`}>
            <div ref={chatContainerRef} className="bg-indigo-50 rounded-lg p-3 flex-grow overflow-y-auto mb-4">
              <AnimatePresence>
                {chatMessages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-start mb-4 ${message.isAI ? 'justify-start' : 'justify-end'}`}
                  >
                    {message.isAI && (
                      <Avatar className="w-8 h-8 mr-2">
                        <AvatarFallback><Bot className="text-indigo-600" /></AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`p-4 rounded-lg ${
                        message.isAI
                          ? 'bg-indigo-100 text-indigo-800 self-start'
                          : 'bg-gray-100 text-gray-800 self-end'
                      }`}
                    >
                      {message.text}
                    </div>
                    {!message.isAI && (
                      <Avatar className="w-8 h-8 ml-2">
                        <AvatarFallback><User className="text-teal-600" /></AvatarFallback>
                      </Avatar>
                    )}
                  </motion.div>
                ))}
                {isTranscribing && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-start mb-4 justify-end"
                  >
                    <Avatar className="w-8 h-8 mr-2">
                      <AvatarFallback><User className="text-indigo-600" /></AvatarFallback>
                    </Avatar>
                    <ChatLoader />
                  </motion.div>
                )}

                {loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-start mb-4 justify-start"
                  >
                    <Avatar className="w-8 h-8 mr-2">
                      <AvatarFallback><Avatar className="text-indigo-600" /></AvatarFallback>
                    </Avatar>
                    <ChatLoader />
                  </motion.div>
                )}
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
                className={`${isFullSize ? 'w-full mt-4' : 'w-full md:w-1/2 md:pl-3 md:border-l md:border-indigo-100'} flex flex-col`}
              >
                <h3 className="text-xl md:text-2xl font-semibold mb-3 text-indigo-700">
                  Uploaded {imageType === 'skin' ? 'Skin' : imageType === 'eye' ? 'Eye' : 'Nail'} Image
                </h3>
                <div className="flex-grow overflow-y-auto">
                  <img
                    src={uploadedImageUrl}
                    alt={`Uploaded ${imageType} image`}
                    className="w-full max-h-[300px] object-contain rounded-lg shadow-md mb-3"
                  />
                  <div className="mt-3">
                    {prediction && confidence !== null && <PredictionCard prediction={prediction} confidence={confidence} />}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
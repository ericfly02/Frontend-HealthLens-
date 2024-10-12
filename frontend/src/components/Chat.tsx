import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { MessageSquare, Maximize2, Minimize2, Mic, StopCircle } from 'lucide-react';
import axios from 'axios';

interface ChatProps {
  chatMessages: Array<{ text: string; isAI: boolean }>;
  onSendMessage: (event: React.FormEvent<HTMLFormElement>) => void;
  imageType: 'skin' | 'eye' | 'nail' | null;
  uploadedImageUrl: string | null;
}

export default function Chat({ chatMessages, onSendMessage, imageType, uploadedImageUrl }: ChatProps) {
  const [isFullSize, setIsFullSize] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

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

        // Send the audio to the backend for IBM Speech to Text processing
        await axios.post('http://localhost:3001/speech/speech-to-text', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }).then((response) => {
          // Handle response from IBM Speech to Text
          console.log(response.data);
          // You can use response.data to display the transcribed text in the chat
        }).catch((error) => {
          console.error('Error transcribing voice:', error);
        });

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
      className="max-w-6xl mx-auto"
    >
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-semibold text-indigo-700">AI Analysis in Progress</h3>
          <Button
            onClick={toggleSize}
            variant="outline"
            size="default"
            className="flex items-center space-x-2"
          >
            {isFullSize ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            <span>{isFullSize ? 'Split View' : 'Full Chat'}</span>
          </Button>
        </div>
        <div className={`flex ${isFullSize ? 'flex-col' : 'flex-row'}`}>
          <div className={`${isFullSize ? 'w-full' : 'flex-1 pr-6'}`}>
            <div className="bg-indigo-50 rounded-lg p-4 h-96 overflow-y-auto mb-4">
              <AnimatePresence>
                {chatMessages.map((message, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.1 }}
                    className={`mb-4 ${message.isAI ? 'text-left' : 'text-right'}`}
                  >
                    <div className={`inline-block p-3 rounded-lg ${message.isAI ? 'bg-indigo-100 text-indigo-800' : 'bg-teal-100 text-teal-800'}`}>
                      {message.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <form onSubmit={onSendMessage} className="flex gap-2">
              <Input type="text" name="message" placeholder="Describe your symptoms..." className="flex-grow" />
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
                <MessageSquare className="h-4 w-4 mr-2" />
                Send
              </Button>
              {isRecording ? (
                <Button onClick={handleStopRecording} className="bg-red-600 hover:bg-red-700">
                  <StopCircle className="h-4 w-4 mr-2" />
                  Stop
                </Button>
              ) : (
                <Button onClick={handleStartRecording} className="bg-indigo-600 hover:bg-indigo-700">
                  <Mic className="h-4 w-4 mr-2" />
                  Record
                </Button>
              )}
            </form>
          </div>
          <AnimatePresence>
            {(!isFullSize && uploadedImageUrl) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className={`${isFullSize ? 'w-full mt-6' : 'flex-1 pl-6 border-l border-indigo-100'}`}
              >
                <h3 className="text-2xl font-semibold mb-4 text-indigo-700">Uploaded {imageType === 'skin' ? 'Skin' : 'Eye'} Image</h3>
                <img src={uploadedImageUrl} alt={`Uploaded ${imageType} image`} className="w-full h-auto rounded-lg shadow-md" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

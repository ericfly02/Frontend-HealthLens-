import React, { useEffect, useState } from 'react';
import { ScrollArea } from '../ui/Scroll_Area';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../ui/Cards';

// Mock chat data for fallback
const mockChatHistory = [
  { id: 1, title: "Rash Analysis", lastMessage: "AI: Here's your rash analysis", timestamp: "2 hours ago", messages: [{ id: 1, content: "Here's your rash analysis", isAI: true, timestamp: "2 hours ago" }] },
  { id: 2, title: "Eye Infection", lastMessage: "AI: Your eye infection symptoms", timestamp: "1 day ago", messages: [{ id: 2, content: "Your eye infection symptoms", isAI: true, timestamp: "1 day ago" }] }
];

const ChatHistoryComponent = () => {
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // API Call to fetch chat history
  /*
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        // Simulate API call
        const response = await fetch('/api/chat-history'); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch chat history");
        }
        const data = await response.json();
        setChatHistory(data);
      } catch (err) {
        console.error(err);
        setError(error.message);
        // Fallback to mock data
        setChatHistory(mockChatHistory);
      } finally {
        setLoading(false);
      }
    };

    fetchChatHistory();
  }, []);
  */

  if (loading) {
    return <p>Loading chat history...</p>;
  }

  if (error) {
    return <p>Error loading chat history: {error}</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chat History</CardTitle>
        <CardDescription>Review and continue your previous conversations.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex h-[600px]">
          <div className="w-1/3 border-r border-gray-200 pr-4">
            <ScrollArea className="h-[570px]">
              {chatHistory.map((chat) => (
                <div
                  key={chat.id}
                  className={`p-3 mb-2 rounded-lg cursor-pointer transition-colors ${
                    activeChat?.id === chat.id ? 'bg-indigo-100' : 'hover:bg-indigo-50'
                  }`}
                  onClick={() => setActiveChat(chat)}
                >
                  <h3 className="font-semibold text-indigo-600">{chat.title}</h3>
                  <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                  <p className="text-xs text-gray-400 mt-1">{chat.timestamp}</p>
                </div>
              ))}
            </ScrollArea>
          </div>
          <div className="w-2/3 pl-4">
            {activeChat ? (
              <>
                <ScrollArea className="h-[500px] mb-4 p-4 border border-gray-200 rounded-lg">
                  {activeChat.messages.map((message: any) => (
                    <div
                      key={message.id}
                      className={`mb-4 ${message.isAI ? 'text-left' : 'text-right'}`}
                    >
                      <div
                        className={`inline-block p-3 rounded-lg ${
                          message.isAI ? 'bg-indigo-100 text-indigo-800' : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {message.content}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{message.timestamp}</p>
                    </div>
                  ))}
                </ScrollArea>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                Select a chat to view the conversation
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatHistoryComponent;

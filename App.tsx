
import React, { useState, useCallback } from 'react';
import MapDisplay from './components/MapDisplay';
import ChatHistory from './components/ChatHistory';
import ChatInput from './components/ChatInput';
import { useGeolocation } from './hooks/useGeolocation';
import { getGroundedResponse } from './services/geminiService';
import type { ChatMessage } from './types';

const App: React.FC = () => {
  const { location, error: geoError, loading: geoLoading } = useGeolocation();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'model',
      text: 'Hello! Ask me about nearby places or any other question. I can use Google Search and Maps to find up-to-date information.',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleSendMessage = useCallback(async (text: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setApiError(null);

    try {
      const { text: responseText, groundingChunks } = await getGroundedResponse(text, location);
      const modelMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        groundingChunks,
      };
      setMessages((prev) => [...prev, modelMessage]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setApiError(errorMessage);
      const errorBotMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: `Sorry, I encountered an error: ${errorMessage}`,
      };
      setMessages((prev) => [...prev, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [location]);

  return (
    <div className="flex flex-col md:flex-row h-screen font-sans bg-gray-900 text-gray-100">
      <div className="md:w-1/3 lg:w-2/5 xl:w-1/3 h-64 md:h-full p-4">
        <MapDisplay location={location} loading={geoLoading} error={geoError} />
      </div>
      <div className="flex-1 flex flex-col bg-gray-800 md:rounded-l-2xl shadow-2xl overflow-hidden">
        <ChatHistory messages={messages} isLoading={isLoading} />
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default App;


import React, { useRef, useEffect } from 'react';
import type { ChatMessage, GroundingChunk } from '../types';
import { BotIcon, UserIcon, LinkIcon } from './Icons';

interface ChatHistoryProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

const GroundingInfo: React.FC<{ chunks: GroundingChunk[] }> = ({ chunks }) => {
  const sources = chunks.flatMap(chunk => {
    const sources = [];
    if (chunk.web) sources.push({ type: 'Web', ...chunk.web });
    if (chunk.maps) sources.push({ type: 'Map', ...chunk.maps });
    return sources;
  });

  if (sources.length === 0) return null;

  return (
    <div className="mt-3 border-t border-gray-700 pt-3">
      <h4 className="text-xs font-semibold text-gray-400 mb-2">Sources:</h4>
      <ul className="space-y-1">
        {sources.map((source, index) => (
          <li key={index}>
            <a
              href={source.uri}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 text-sm hover:underline flex items-start transition-colors duration-200"
            >
              <LinkIcon />
              <span className="truncate">{source.title || 'Untitled Source'}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};


const ChatHistory: React.FC<ChatHistoryProps> = ({ messages, isLoading }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {messages.map((message) => (
        <div key={message.id} className={`flex items-start gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}>
          {message.role === 'model' && (
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                <BotIcon />
            </div>
          )}
          <div className={`max-w-md lg:max-w-lg p-4 rounded-xl shadow ${
            message.role === 'user' 
            ? 'bg-indigo-600 text-white rounded-br-none' 
            : 'bg-gray-700 text-gray-200 rounded-bl-none'
          }`}>
            <p className="whitespace-pre-wrap">{message.text}</p>
            {message.groundingChunks && <GroundingInfo chunks={message.groundingChunks} />}
          </div>
          {message.role === 'user' && (
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                <UserIcon />
            </div>
          )}
        </div>
      ))}
      {isLoading && (
         <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                <BotIcon />
            </div>
            <div className="max-w-md lg:max-w-lg p-4 rounded-xl shadow bg-gray-700 text-gray-200 rounded-bl-none">
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
            </div>
        </div>
      )}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default ChatHistory;

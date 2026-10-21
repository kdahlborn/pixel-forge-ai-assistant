import { useState } from 'react';
import { HumanMessage, AImessage } from '@langchain/core/messages';

export const useChat = () => {
    const [messages, setMessages] = useState(() => {
        const chatHistory = JSON.parse(localStorage.getItem('messages')) || [
            {
                role: 'assistant',
                content: 'Hi! How can I help you?',
            },
        ];

        return chatHistory.map((message) => {});
    });
};

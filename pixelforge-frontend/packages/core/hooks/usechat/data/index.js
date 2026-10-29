import { useState, useEffect } from 'react';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import { askQuestion } from '@pixelforge/api';
import { useCartStore } from '@pixelforge/useCartStore';

export const useChat = () => {
    // messages innehåller det vi hämtar från localStorage
    const [messages, setMessages] = useState(() => {
        const chatHistory = JSON.parse(localStorage.getItem('messages')) || [
            {
                role: 'assistant',
                content: 'Hej! Hur kan jag hjälpa dig?',
                documents: [],
            },
        ];

        return chatHistory.map((message) => {
            if (message.role === 'user') {
                return new HumanMessage(message.content);
            }

            const aiMessage = new AIMessage(message.content);
            aiMessage.documents = message.documents || [];
            return aiMessage;
        });
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const addToCart = useCartStore((state) => state.addToCart);
    const removeFromCart = useCartStore((state) => state.removeFromCart);

    // useEffect uppdaterar localStorage när nya meddelanden läggs till
    useEffect(() => {
        const chatHistory = messages.map((message) => ({
            role: message?.getType() === 'human' ? 'user' : 'assistant',
            content: message.content,
            documents: message.documents || [],
        }));

        localStorage.setItem('messages', JSON.stringify(chatHistory));
    }, [messages]);

    // Funktion: getAnswer
    const getAnswer = async (question) => {
        const userMessage = new HumanMessage(question);

        const history = [...messages, userMessage];
        setMessages(history);
        setIsLoading(true);
        setError(false);

        try {
            const chatHistory = messages.map((message) => ({
                role: message.getType() === 'human' ? 'user' : 'assistant',
                content: message.content,
            }));

            const response = await askQuestion({
                question,
                history: chatHistory,
            });

            const aiMessage = new AIMessage(response.answer);

            // Spara dokumentlänkarna på meddelandet
            aiMessage.documents = response.documents ?? [];

            setMessages([...history, aiMessage]);

            if (response.cart?.length) {
                response.cart.forEach((cartAction) => {
                    if (cartAction.action === 'add') {
                        cartAction.items.forEach((item) => {
                            for (let i = 0; i < item.qty; i++) {
                                addToCart(item);
                            }
                        });
                    } else if (cartAction.action === 'remove') {
                        cartAction.items.forEach((item) => {
                            for (let i = 0; i < item.qty; i++) {
                                removeFromCart(item.id);
                            }
                        });
                    }
                });
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const clearHistory = () => {
        const initialMessage = new AIMessage('Hej! Hur kan jag hjälpa dig?');
        initialMessage.documents = [];
        setMessages([initialMessage]);
    };

    return {
        messages,
        getAnswer,
        isLoading,
        error,
        clearHistory,
    };
};

import './index.css';
import { ChatHeader } from '@pixelforge/chatheader';
import { ChatForm } from '@pixelforge/chatform';
import { useChat } from '@pixelforge/usechat';
import { ChatMessage } from '@pixelforge/chatmessage';
import { Loading } from '@pixelforge/loading';
import { useEffect, useRef } from 'react';
import { Button } from '@pixelforge/button';

export const ChatWindow = ({ onClose }) => {
    const { messages, getAnswer, isLoading, error, clearHistory } = useChat();

    // Hanterar scrollningen på sidan vid nya meddelanden
    const messagesRef = useRef(null);
    useEffect(() => {
        if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const messageComponents = messages.map((message, index) => {
        const role = message.getType() === 'human' ? 'user' : 'assistant';

        return (
            <ChatMessage
                key={index}
                content={message.content}
                role={role}
                documents={message.documents || []}
            />
        );
    });

    return (
        <aside className="chat-window">
            <ChatHeader onClose={onClose} />
            <section className="chat">
                <section className="chat__messages" ref={messagesRef}>
                    {messageComponents}
                    {isLoading && <Loading />}
                    {error && <p className="chat__error">{error}</p>}
                </section>

                <ChatForm getAnswer={getAnswer} />

                <Button onClick={clearHistory} text="clear" type="clear" />
            </section>
        </aside>
    );
};

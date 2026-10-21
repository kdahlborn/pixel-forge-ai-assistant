import './index.css';
import { ChatHeader } from '@pixelforge/chatheader';
import { ChatForm } from '@pixelforge/chatform';

export const ChatWindow = ({ onClose }) => {
    return (
        <aside className="chat-window">
            <ChatHeader onClose={onClose} />
            <section className="chat">
                <ChatForm />
            </section>
        </aside>
    );
};

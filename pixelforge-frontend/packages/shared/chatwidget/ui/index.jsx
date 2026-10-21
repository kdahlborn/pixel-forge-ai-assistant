import './index.css';
import { ChatWindow } from '@pixelforge/chatwindow';
import { Button } from '@pixelforge/button';
import { Icon } from '@pixelforge/icon';
import { Bot, BotOff } from 'lucide-react';
import { useState } from 'react';

export const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="chat-widget">
            {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}

            <Button
                type="chat"
                onClick={() => {
                    isOpen ? setIsOpen(false) : setIsOpen(true);
                }}
                text={<Icon icon={isOpen ? BotOff : Bot} size={40} />}
            ></Button>
        </div>
    );
};

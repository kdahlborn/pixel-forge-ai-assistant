import './index.css';
import { ChatWindow } from '@pixelforge/chatwindow';
import { Button } from '@pixelforge/button';
import { Icon } from '@pixelforge/icon';
import { Bot, BotOff } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="chat-widget">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="chat-window-wrapper"
                        className="chat-widget__window-wrapper"
                        initial={{ opacity: 0, y: 100, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 80, scale: 0.9 }}
                        transition={{
                            type: 'spring',
                            stiffness: 260,
                            damping: 20,
                            mass: 0.8,
                        }}
                    >
                        <ChatWindow onClose={() => setIsOpen(false)} />
                    </motion.div>
                )}
            </AnimatePresence>

            <Button
                type={`chat ${isOpen ? 'button--chat-open' : ''}`}
                onClick={() => {
                    setIsOpen((prev) => !prev);
                }}
                text={
                    <Icon
                        icon={isOpen ? BotOff : Bot}
                        size={isOpen ? 25 : 40}
                    />
                }
            ></Button>
        </div>
    );
};

import './index.css';
import { Button } from '@pixelforge/button';
import { Icon } from '@pixelforge/icon';
import { X } from 'lucide-react';

export const ChatHeader = ({ onClose }) => {
    return (
        <header className="chat__header">
            <h3 className="chat__title">AI-assistant</h3>
            <Button
                type="close"
                onClick={onClose}
                text={<Icon icon={X} size={15} />}
            />
        </header>
    );
};

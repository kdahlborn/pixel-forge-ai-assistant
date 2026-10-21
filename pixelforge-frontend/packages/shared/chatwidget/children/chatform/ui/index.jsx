import { useRef } from 'react';
import './index.css';

export const ChatForm = () => {
    const inputRef = useRef();

    const handleSubmit = (e) => {
        e.preventDefault();
        const userInput = inputRef.current.value;
        inputRef.current.value = '';

        console.log('USER INPUT', userInput);
    };

    return (
        <form className="chat__form" onSubmit={handleSubmit}>
            <input
                type="text"
                className="chat__input"
                ref={inputRef}
                placeholder="Ask me anything..."
            />
        </form>
    );
};

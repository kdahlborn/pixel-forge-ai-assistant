import { useRef } from 'react';
import './index.css';
import { useEffect } from 'react';

export const ChatForm = ({ getAnswer }) => {
    const inputRef = useRef();

    // Sätter focus på input-fältet när chatten öppnas
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const userInput = inputRef.current.value;
        inputRef.current.value = '';

        getAnswer(userInput);
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

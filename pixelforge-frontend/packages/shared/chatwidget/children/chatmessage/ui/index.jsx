import './index.css';

export const ChatMessage = ({ content, role }) => {
    return (
        <article className={`message message--${role}`}>
            <p className="message__text">{content}</p>
        </article>
    );
};

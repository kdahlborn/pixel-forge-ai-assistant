import { Link } from 'react-router-dom';
import { Icon } from '@pixelforge/icon';
import { ExternalLink } from 'lucide-react';
import './index.css';

export const ChatMessage = ({ content, role, documents = [] }) => {
    return (
        <article className={`message message--${role}`}>
            <p className="message__text">{content}</p>

            {documents.length > 0 && (
                <div className="message__documents">
                    <span className="message__documents-title">Läs mer:</span>
                    <ul className="message__documents-list">
                        {documents.map(({ id, title, url }) => (
                            <li key={id} className="message__documents-item">
                                <Link
                                    to={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="message__documents-link"
                                >
                                    {title}
                                    {<Icon icon={ExternalLink} size={15} />}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </article>
    );
};

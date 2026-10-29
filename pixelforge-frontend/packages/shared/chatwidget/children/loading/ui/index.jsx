import './index.css';

export const Loading = () => {
    return (
        <div className="loading">
            <p className="loading__text">Tänker</p>
            <span className="loading__dot"></span>
            <span className="loading__dot"></span>
            <span className="loading__dot"></span>
        </div>
    );
};

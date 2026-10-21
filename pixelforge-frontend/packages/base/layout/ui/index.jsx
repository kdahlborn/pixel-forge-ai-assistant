import { Outlet } from 'react-router-dom';
import { Header } from '@pixelforge/header';
import { Footer } from '@pixelforge/footer';
import { ChatWidget } from '@pixelforge/chatwidget';
import './index.css';

export const Layout = () => {
    return (
        <>
            <Header />
            <main className="page">
                <Outlet />
                <ChatWidget />
            </main>
            <Footer />
        </>
    );
};

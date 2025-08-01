import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-blue-500 text-white p-4">
            <h1 className="text-2xl font-bold">Unfogged PWA</h1>
            <nav className="mt-2">
                <ul className="flex space-x-4">
                    <li><a href="#" className="hover:underline">Home</a></li>
                    <li><a href="#" className="hover:underline">Explore</a></li>
                    <li><a href="#" className="hover:underline">Settings</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
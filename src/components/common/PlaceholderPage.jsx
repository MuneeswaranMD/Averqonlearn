import React from 'react';
import { Construction } from 'lucide-react';

const PlaceholderPage = ({ title }) => {
    return (
        <div className="min-h-screen pt-20 flex flex-col items-center justify-center bg-background text-white">
            <Construction size={64} className="text-primary mb-6" />
            <h1 className="text-4xl font-bold mb-4">{title}</h1>
            <p className="text-text-secondary text-lg">This page is under construction. Check back soon!</p>
        </div>
    );
};

export default PlaceholderPage;

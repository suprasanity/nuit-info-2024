import React from 'react';
import { Link } from 'react-router-dom';
import { InteractiveModel } from '../components/InteractiveModel';
import { PodcastSection } from '../components/PodcastSection';
import { QRCode } from '../components/QRCode';
import '../style/Homepage.css';

export const HomePage = () => {
    return (
        <div className="homepage">
            {/* Hero Section */}
            <div className="relative h-screen">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1464925257126-6450e871c667"
                        alt="Ocean"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-blue-900 bg-opacity-60"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
                    <div className="text-white">
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">
                            Race for Water
                        </h1>
                        <p className="text-xl md:text-2xl mb-8">
                            Préserver nos océans, c'est préserver notre santé
                        </p>
                        <Link
                            to="https://www.raceforwater.org/fr/nouvelle-odyssee-2024/"
                            target="_blank"
                            className="inline-block bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                        >
                            Découvrer notre fondation
                        </Link>
                    </div>
                </div>
            </div>

            {/* Interactive Model Section */}
            <section id="interactive">
                <InteractiveModel />
            </section>

            {/* Podcast Section */}
            <section id="podcast">
                <PodcastSection />
            </section>

            {/* QR Code Component */}
            <QRCode />
        </div>
    );
};

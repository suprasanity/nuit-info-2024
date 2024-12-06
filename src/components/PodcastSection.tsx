import React from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import { PodcastCard } from './PodcastCard';
import {Link} from "react-router-dom";

const podcasts = [
  {
    title: "Épisode 1: L'Impact du Plastique",
    progress: "w-1/3"
  },
  {
    title: "Épisode 2: Les Solutions Innovantes",
    progress: "w-1/4"
  }
];

export const PodcastSection = () => {
  const [playingIndex, setPlayingIndex] = React.useState<number | null>(null);

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">
          Nos Podcasts
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {podcasts.map((podcast, index) => (
            <PodcastCard
              key={index}
              title={podcast.title}
              progress={podcast.progress}
              isPlaying={playingIndex === index}
              onPlayPause={() => setPlayingIndex(playingIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
      <div className="text-center mt-8 mb-12">
        <Link
            to="/media"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          En savoir plus
        </Link>
      </div>
    </div>
  );
};
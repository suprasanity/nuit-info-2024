import React from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

interface PodcastCardProps {
  title: string;
  progress: string;
  isPlaying: boolean;
  onPlayPause: () => void;
}

export const PodcastCard: React.FC<PodcastCardProps> = ({
  title,
  progress,
  isPlaying,
  onPlayPause,
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <div className="flex items-center space-x-4">
        <button
          onClick={onPlayPause}
          className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700"
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </button>
        <div className="flex-1">
          <div className="h-2 bg-blue-300 rounded-full">
            <div className={`h-2 bg-blue-600 rounded-full ${progress}`}></div>
          </div>
        </div>
        <Volume2 className="w-6 h-6 text-blue-600" />
      </div>
    </div>
  );
};
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ComparisonItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface ComparisonCardProps {
  comparison: {
    human: ComparisonItem;
    ocean: ComparisonItem;
  };
  isActive: boolean;
  onClick: () => void;
}

export const ComparisonCard: React.FC<ComparisonCardProps> = ({
  comparison,
  isActive,
  onClick,
}) => {
  const { human, ocean } = comparison;

  return (
    <div
      className={`p-6 rounded-lg cursor-pointer transition-all duration-300 ${
        isActive
          ? 'bg-blue-600 text-white transform scale-105'
          : 'bg-white hover:bg-blue-50'
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between mb-4">
        <div className="text-center flex-1">
          <human.icon className="w-12 h-12 mx-auto mb-2" />
          <h3 className="font-bold">{human.title}</h3>
        </div>
        <div className="text-center flex-1">
          <ocean.icon className="w-12 h-12 mx-auto mb-2" />
          <h3 className="font-bold">{ocean.title}</h3>
        </div>
      </div>
      <div className="text-center mt-4">
        <p className="text-sm">{human.description}</p>
        <p className="text-sm mt-2">{ocean.description}</p>
      </div>
    </div>
  );
};
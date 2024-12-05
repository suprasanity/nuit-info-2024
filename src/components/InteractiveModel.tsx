import React from 'react';
import { Brain, Heart, Stethoscope, Waves, Fish, Leaf } from 'lucide-react';
import { ComparisonCard } from './ComparisonCard';

const comparisons = [
  {
    human: { icon: Brain, title: "Cerveau", description: "Centre de contrôle du corps" },
    ocean: { icon: Waves, title: "Courants Océaniques", description: "Régulent le climat mondial" }
  },
  {
    human: { icon: Heart, title: "Cœur", description: "Pompe le sang dans tout le corps" },
    ocean: { icon: Fish, title: "Vie Marine", description: "Maintient l'équilibre des écosystèmes" }
  },
  {
    human: { icon: Stethoscope, title: "Poumons", description: "Fournissent l'oxygène essentiel" },
    ocean: { icon: Leaf, title: "Phytoplancton", description: "Produit 50% de l'oxygène terrestre" }
  }
];

export const InteractiveModel = () => {
  const [activeComparison, setActiveComparison] = React.useState(0);

  return (
    <div className="py-12 bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">
          Le Corps Humain et l'Océan : Une Connexion Vitale
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {comparisons.map((comparison, index) => (
            <ComparisonCard
              key={index}
              comparison={comparison}
              isActive={activeComparison === index}
              onClick={() => setActiveComparison(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
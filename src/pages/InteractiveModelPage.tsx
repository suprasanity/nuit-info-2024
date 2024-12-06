import React, { useState } from 'react';
import HumanBody from '../resources/human_body.svg';
import '../style/InteractiveModel.css';

interface OrganInfo {
  id: string;
  title: string;
  description: string;
  oceanEquivalent: string;
  x: number;
  y: number;
}

const organInfos: OrganInfo[] = [
  {
    id: "brain",
    title: "Cerveau",
    description: "Centre de contrôle du corps humain",
    oceanEquivalent: "Les courants océaniques agissent comme le système nerveux des océans, régulant la température et distribuant les nutriments.",
    x: 51,
    y: 5
  },
  {
    id: "heart",
    title: "Cœur",
    description: "Pompe le sang dans tout le corps",
    oceanEquivalent: "La circulation thermohaline agit comme le cœur des océans, faisant circuler l'eau à travers les différentes profondeurs.",
    x: 50,
    y: 35
  },
  {
    id: "lungs",
    title: "Poumons",
    description: "Permettent les échanges gazeux",
    oceanEquivalent: "Le phytoplancton produit 50% de l'oxygène que nous respirons, agissant comme les poumons de la planète.",
    x: 50,
    y: 45
  }
];

export const InteractiveModelPage = () => {
  const [activeOrgan, setActiveOrgan] = useState<OrganInfo | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 interactive-model">
      <h1 className="text-3xl font-bold text-center mb-12 text-blue-900">
        Le Corps Humain et l'Océan
      </h1>

      <div className="relative w-full max-w-2xl mx-auto aspect-[3/4]">
        <img src={HumanBody} alt="Human Body" className="absolute inset-0 w-full h-full object-contain"/>
        <div className="absolute inset-0 bg-gray-100 rounded-lg">
          {organInfos.map((organ) => (
            <button
              key={organ.id}
              className="absolute w-4 h-4 bg-red-500 rounded-full hover:bg-green-600 transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${organ.x}%`, top: `${organ.y}%` }}
              onMouseEnter={() => setActiveOrgan(organ)}
              onMouseLeave={() => setActiveOrgan(null)}
            />
          ))}
        </div>

        {activeOrgan && (
          <div
            className="absolute bg-white p-4 rounded-lg shadow-lg max-w-xs"
            style={{
              left: `${activeOrgan.x}vw`,
              top: `${activeOrgan.y + 5}vh`,
              transform: 'translateX(-50%)'
            }}
          >
            <h3 className="font-bold text-lg mb-2">{activeOrgan.title}</h3>
            <p className="text-gray-600 mb-2">{activeOrgan.description}</p>
            <p className="text-blue-600">{activeOrgan.oceanEquivalent}</p>
          </div>
        )}
      </div>
    </div>
  );
};
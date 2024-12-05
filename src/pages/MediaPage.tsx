import React from 'react';

interface MediaCard {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

const mediaCards: MediaCard[] = [
  {
    id: 1,
    title: "L'impact du plastique sur les océans",
    description: "Découvrez comment la pollution plastique affecte nos écosystèmes marins et notre santé.",
    imageUrl: "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef"
  },
  {
    id: 2,
    title: "Les solutions innovantes",
    description: "Explorez les nouvelles technologies et initiatives pour nettoyer nos océans.",
    imageUrl: "https://images.unsplash.com/photo-1621451537084-482c73073a0f"
  },
  {
    id: 3,
    title: "La vie marine en danger",
    description: "Comprendre les menaces qui pèsent sur la biodiversité marine.",
    imageUrl: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7"
  }
];

export const MediaPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-center mb-12 text-blue-900">
        Médiathèque
      </h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mediaCards.map((card) => (
          <div
            key={card.id}
            className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
          >
            <img
              src={card.imageUrl}
              alt={card.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
              <p className="text-gray-600">{card.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
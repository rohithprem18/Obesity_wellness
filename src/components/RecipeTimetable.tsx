import React, { useState } from 'react';

const timetable = [
  { day: 'Monday', meals: { breakfast: 'Idli + Sambar', lunch: 'Brown Rice + Sambar + Grilled Chicken', dinner: 'Ragi Dosa + Coconut Chutney' } },
  { day: 'Tuesday', meals: { breakfast: 'Oats Upma', lunch: 'Quinoa Pongal + Curd', dinner: 'Vegetable Stew + Appam' } },
  { day: 'Wednesday', meals: { breakfast: 'Moong Dal Chilla', lunch: 'Millet Lemon Rice + Sprouts', dinner: 'Grilled Fish + Veg Poriyal' } },
  { day: 'Thursday', meals: { breakfast: 'Ragi Porridge', lunch: 'Brown Rice + Rasam + Boiled Eggs', dinner: 'Vegetable Uttapam' } },
  { day: 'Friday', meals: { breakfast: 'Vegetable Dalia', lunch: 'Samai (Little Millet) Bisi Bele Bath', dinner: 'Paneer Chettinad + Chapati' } },
  { day: 'Saturday', meals: { breakfast: 'Kambu (Bajra) Idli', lunch: 'Red Rice + Avial', dinner: 'Chicken Stew + Idiyappam' } },
  { day: 'Sunday', meals: { breakfast: 'Vegetable Semiya Upma', lunch: 'Brown Rice + Fish Curry', dinner: 'Mixed Dal Adai + Chutney' } },
];

const getTodayIndex = () => {
  const jsDay = new Date().getDay(); // 0 (Sun) - 6 (Sat)
  return jsDay === 0 ? 6 : jsDay - 1; // Make Monday=0, Sunday=6
};

const getRandomMeal = (type: 'breakfast' | 'lunch' | 'dinner', exclude: string) => {
  const options = timetable.map(day => day.meals[type]).filter(m => m !== exclude);
  return options[Math.floor(Math.random() * options.length)];
};

// Extract the first food keyword for Unsplash
const getMainFood = (meal: string) => meal.split(/[,+]/)[0].trim();

const fallbackImg = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80'; // South Indian food

const getUnsplashUrl = (query: string) =>
  `https://source.unsplash.com/400x300/?${encodeURIComponent(query + ',south indian food')}`;

export const RecipeTimetable: React.FC = () => {
  const today = getTodayIndex();
  const todayMeals = timetable[today].meals;
  const [meals, setMeals] = useState({ ...todayMeals });
  const [imgError, setImgError] = useState<{ [key: string]: boolean }>({});

  const handleShuffle = (type: 'breakfast' | 'lunch' | 'dinner') => {
    setMeals(prev => ({
      ...prev,
      [type]: getRandomMeal(type, prev[type]),
    }));
    setImgError(prev => ({ ...prev, [type]: false }));
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 text-center">
        <span className="text-lg font-bold text-black">
          {timetable[today].day} (Today)
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {(['breakfast', 'lunch', 'dinner'] as const).map(type => {
          const mainFood = getMainFood(meals[type]);
          const imgUrl = getUnsplashUrl(mainFood);
          return (
            <div key={type} className="glass-3d rounded-2xl shadow-lg p-4 flex flex-col items-center">
              <img
                src={imgError[type] ? fallbackImg : imgUrl}
                alt={meals[type]}
                className="w-full h-48 object-cover rounded-xl mb-4 border"
                loading="lazy"
                onError={() => setImgError(prev => ({ ...prev, [type]: true }))}
              />
              <div className="font-semibold text-gray-800 text-lg mb-2 capitalize">{type}</div>
              <div className="text-black text-center mb-4">{meals[type]}</div>
              <button
                onClick={() => handleShuffle(type)}
                className="px-4 py-2 rounded-lg bg-purple-500 text-white font-semibold hover:bg-purple-600 transition-all"
              >
                Shuffle
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}; 
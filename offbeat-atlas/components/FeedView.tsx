
import React from 'react';

const categories = [
  { name: 'Cultural Immersions', img: 'https://picsum.photos/id/10/80/80' },
  { name: 'Hidden Gems', img: 'https://picsum.photos/id/11/80/80' },
  { name: 'Local Flavors', img: 'https://picsum.photos/id/12/80/80' },
  { name: 'Sustainable Treks', img: 'https://picsum.photos/id/13/80/80' },
  { name: 'Art & Craft', img: 'https://picsum.photos/id/14/80/80' },
];

const FeedView: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Category Circles */}
      <div className="flex justify-center gap-10 mb-12">
        {categories.map((cat, i) => (
          <div key={i} className="flex flex-col items-center gap-2 group cursor-pointer">
            <div className="w-20 h-20 rounded-full border-2 border-white shadow-md overflow-hidden transition-transform group-hover:scale-105">
              <img src={cat.img} alt={cat.name} className="w-full h-full object-cover" />
            </div>
            <span className="text-xs font-medium text-gray-600 text-center">{cat.name}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-4 mb-8 border-b border-gray-200 text-sm">
        <button className="pb-2 border-b-2 border-green-800 font-semibold text-green-900">All</button>
        <button className="pb-2 text-gray-400 hover:text-gray-600">Following</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Post (Large) */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img src="https://picsum.photos/id/65/40/40" className="w-10 h-10 rounded-full" alt="" />
                <div>
                  <h4 className="font-semibold text-sm">Elena Rossi • Florence, Italy</h4>
                  <p className="text-[10px] text-gray-400">July 5, 2023</p>
                </div>
              </div>
              <button className="text-gray-400">•••</button>
            </div>
            <img src="https://picsum.photos/id/16/800/500" className="w-full object-cover" alt="" />
            <div className="p-4 space-y-3">
              <p className="text-sm text-gray-700 leading-relaxed">
                Lost in the Oltrarno district. Found the most incredible artisan workshops tucked away.
                <span className="block mt-1 text-green-700 font-medium cursor-pointer">#OffbeatItaly #CulturalDiscovery</span>
              </p>
              <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                <div className="flex gap-4">
                  <button className="flex items-center gap-1 text-xs text-gray-500"><span className="text-lg">♡</span> 245</button>
                  <button className="flex items-center gap-1 text-xs text-gray-500"><span className="text-lg">💬</span> 32</button>
                </div>
                <div className="flex gap-3">
                  <button className="text-gray-400">🔖</button>
                  <button className="text-gray-400">➦</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Posts (Small) */}
        <div className="space-y-8">
           <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <img src="https://picsum.photos/id/66/30/30" className="w-8 h-8 rounded-full" alt="" />
                <h4 className="font-semibold text-xs">Kenji Tanaka • Kyoto</h4>
              </div>
              <button className="text-gray-400 text-xs">•••</button>
            </div>
            <img src="https://picsum.photos/id/17/400/300" className="w-full object-cover" alt="" />
            <div className="p-3 space-y-2">
              <p className="text-xs text-gray-700 line-clamp-2">Morning prayers and mist at an ancient temple, away from the crowds.</p>
              <div className="flex justify-between text-[10px] text-gray-400">
                <div className="flex gap-2">
                  <span>♡ 245</span>
                  <span>💬 32</span>
                </div>
                <div className="flex gap-2"><span>🔖</span> <span>➦</span></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <img src="https://picsum.photos/id/67/30/30" className="w-8 h-8 rounded-full" alt="" />
                <h4 className="font-semibold text-xs">Marrakech • Morocco</h4>
              </div>
              <button className="text-gray-400 text-xs">•••</button>
            </div>
            <img src="https://picsum.photos/id/18/400/300" className="w-full object-cover" alt="" />
            <div className="p-3 space-y-2 text-xs">
              <div className="flex justify-between text-gray-400">
                <div className="flex gap-2"><span>♡ 120</span> <span>💬 15</span></div>
                <div className="flex gap-2"><span>🔖</span> <span>➦</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-10 right-10 w-16 h-16 bg-green-600 text-white rounded-full shadow-2xl flex flex-col items-center justify-center transition-transform hover:scale-110 active:scale-95">
        <span className="text-2xl font-light">+</span>
        <span className="text-[10px] uppercase tracking-tighter">Create</span>
      </button>
    </div>
  );
};

export default FeedView;

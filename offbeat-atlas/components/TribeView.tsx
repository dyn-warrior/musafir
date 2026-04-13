
import React from 'react';

const events = [
  { id: 1, host: 'Rupalee', hostAvatar: 'https://picsum.photos/id/301/40/40', title: 'Join Rupalee on a trek to Chandratal Lake', desc: 'Looking for 2-3 companions for a moderate trek. Focus on photography and local culture.', date: 'Oct 12-18', loc: 'Spiti Valley, India', type: 'trek' },
  { id: 2, host: 'Kenji', hostAvatar: 'https://picsum.photos/id/302/40/40', title: 'Documentary Photography in Kyoto', desc: 'A small group trip focusing on capturing the autumn colors and traditional artisans.', date: 'Nov 20-27', loc: 'Kyoto, Japan', type: 'photo' },
  { id: 3, host: 'Sarah', hostAvatar: 'https://picsum.photos/id/303/40/40', title: 'Cycling the Silk Road - Segment 1', desc: 'An epic journey. Seeking experienced cyclists for the first leg from Xi\'an to Lanzhou.', date: 'Sep 15 - Oct 5', loc: 'China', type: 'cycling' },
  { id: 4, host: 'Mateo', hostAvatar: 'https://picsum.photos/id/304/40/40', title: 'Seeking Crew for Coastal Cleanup & Surf', desc: 'Environmentally conscious trip. Help clean a remote beach, then enjoy surfing.', date: 'Nov 5 - 10', loc: 'Algarve, Portugal', type: 'surf' },
];

const TribeView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Hero Banner */}
      <div className="relative h-96 rounded-3xl overflow-hidden mb-12 shadow-2xl">
        <img src="https://picsum.photos/id/1025/1200/600" className="w-full h-full object-cover brightness-75" alt="" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-4">
          <h1 className="serif text-6xl font-bold mb-4">Find Your Tribe.<br/>Share the Adventure.</h1>
          <p className="text-lg font-light mb-10">Connect with like-minded explorers for offbeat<br/>journeys and cultural discoveries.</p>
          
          <div className="bg-white/10 backdrop-blur-md p-2 rounded-2xl flex gap-2 border border-white/20 w-full max-w-2xl">
             <div className="flex-grow relative">
                <input type="text" placeholder="Location" className="w-full bg-white/10 border-none rounded-xl py-3 pl-10 text-sm focus:ring-0 placeholder-white/70" />
                <span className="absolute left-3 top-1/2 -translate-y-1/2">🔍</span>
             </div>
             <div className="w-px bg-white/20"></div>
             <div className="flex-grow px-2 flex items-center text-sm font-medium">Activity ▾</div>
             <div className="w-px bg-white/20"></div>
             <div className="flex-grow px-2 flex items-center text-sm font-medium">Date ▾</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {events.map(event => (
          <div key={event.id} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-6 hover:shadow-md transition">
            <div className="flex justify-between items-start">
               <div className="flex items-center gap-3">
                  <img src={event.hostAvatar} className="w-12 h-12 rounded-full" alt="" />
                  <span className="font-bold text-sm text-gray-800">{event.host}</span>
               </div>
               <div className="w-10 h-10 bg-[#eef1ed] rounded-xl flex items-center justify-center text-xl grayscale opacity-60">
                 {event.type === 'trek' ? '🎒' : event.type === 'photo' ? '📷' : event.type === 'cycling' ? '🚲' : '🏄'}
               </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="serif text-2xl font-bold leading-tight">{event.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{event.desc}</p>
            </div>

            <div className="flex flex-col gap-2 pt-2 border-t border-gray-50">
               <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                  <span>🗓</span> {event.date}
               </div>
               <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                  <span>📍</span> {event.loc}
               </div>
            </div>

            <button className="w-full bg-[#789a8e] text-white py-3 rounded-xl font-bold hover:bg-[#65857a] transition shadow-inner">
               Join
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-12">
        <button className="px-10 py-3 border border-gray-200 rounded-full text-sm font-bold text-gray-500 hover:bg-white transition shadow-sm">
          Load More
        </button>
      </div>
    </div>
  );
};

export default TribeView;

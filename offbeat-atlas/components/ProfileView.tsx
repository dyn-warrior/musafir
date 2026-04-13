
import React from 'react';

const ProfileView: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      {/* Header Profile Section */}
      <div className="flex flex-col items-center text-center space-y-6 mb-16">
        <div className="relative">
          <img src="https://picsum.photos/id/64/160/160" className="w-40 h-40 rounded-full border-8 border-white shadow-xl" alt="Elena" />
          <div className="absolute inset-0 rounded-full border border-gray-100"></div>
        </div>
        <div className="space-y-2">
          <h1 className="serif text-5xl font-bold">Elena Dubois</h1>
          <p className="text-gray-500 max-w-md text-sm leading-relaxed">
            Passionate traveler, storyteller, and seeker of hidden cultural gems. Based in Paris. Sharing stories from offbeat paths.
          </p>
        </div>
        <button className="bg-[#c58f7a] text-white px-8 py-2 rounded-full font-bold text-sm shadow-sm hover:bg-[#b07b68] transition">
          Edit Profile
        </button>
      </div>

      {/* Tabs */}
      <div className="flex justify-center border-b border-gray-100 mb-10 gap-16">
        {['My Trips', 'Saved Places', 'Posts', 'Settings'].map((tab, i) => (
          <button key={i} className={`pb-4 text-sm font-medium transition ${i === 0 ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Grid of Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex gap-4 hover:shadow-md transition cursor-pointer">
           <img src="https://picsum.photos/id/101/200/200" className="w-32 h-32 rounded-2xl object-cover" alt="" />
           <div className="flex flex-col justify-center space-y-1">
             <h3 className="serif text-xl font-bold">Hidden Kyoto & Rural Japan</h3>
             <p className="text-xs text-gray-400">Date: Oct 2023</p>
             <p className="text-xs text-gray-500">Status: <span className="text-green-600 font-bold uppercase tracking-widest text-[8px]">Completed</span></p>
           </div>
         </div>
         <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex gap-4 hover:shadow-md transition cursor-pointer">
           <img src="https://picsum.photos/id/102/200/200" className="w-32 h-32 rounded-2xl object-cover" alt="" />
           <div className="flex flex-col justify-center space-y-1">
             <h3 className="serif text-xl font-bold">Moroccan Atlas Trek</h3>
             <p className="text-xs text-gray-400">Date: Upcoming: May 2024</p>
             <p className="text-xs text-gray-500">Status: <span className="text-orange-500 font-bold uppercase tracking-widest text-[8px]">Planning</span></p>
           </div>
         </div>
      </div>

      {/* Decorative Illustrations Placeholder */}
      <div className="mt-20 opacity-10 flex justify-between pointer-events-none">
         <div className="w-32 h-32 bg-contain bg-no-repeat grayscale" style={{backgroundImage: 'url(https://www.svgrepo.com/show/447781/compass.svg)'}}></div>
         <div className="w-32 h-32 bg-contain bg-no-repeat grayscale" style={{backgroundImage: 'url(https://www.svgrepo.com/show/433306/mountain.svg)'}}></div>
      </div>
    </div>
  );
};

export default ProfileView;

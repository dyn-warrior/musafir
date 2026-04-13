
import React, { useState } from 'react';

const groups = [
  { id: '1', name: 'r/Manali: Himalayan Hideaways', count: 'Active members', img: 'https://picsum.photos/id/103/60/60' },
  { id: '2', name: 'r/Pune: Cultural Canvas', count: '1.9K members', img: 'https://picsum.photos/id/104/60/60' },
  { id: '3', name: 'r/Jibhi: Offbeat Escapes', count: '1.3K members', img: 'https://picsum.photos/id/105/60/60' },
  { id: '4', name: 'r/backpacker: Global Trekkers', count: '1.3K members', img: 'https://picsum.photos/id/106/60/60' },
  { id: '5', name: 'r/Ladakh: High Desert', count: '1.3K members', img: 'https://picsum.photos/id/107/60/60' },
];

const messages = [
  { author: 'Arjun K.', time: '10:30 AM', text: 'Just arrived in Old Manali. The vibe is incredible! Any recommendations for a quiet cafe with a view?', avatar: 'https://picsum.photos/id/201/40/40' },
  { author: 'Maya S.', time: '10:35 AM', text: 'Welcome! You have to check out \'Cafe 1947\' by the river. It\'s peaceful and has great local food.', avatar: 'https://picsum.photos/id/202/40/40' },
  { author: 'Rohan D.', time: '10:42 AM', text: 'Also, don\'t miss the Jogini Waterfall trek early in the morning. The path is serene and less crowded.', avatar: 'https://picsum.photos/id/203/40/40' },
  { author: 'Priya L.', time: '11:15 AM', text: 'Thanks for the tips! I\'m heading there tomorrow. Is the Hadimba Temple area walkable from Old Manali?', avatar: 'https://picsum.photos/id/204/40/40' },
];

const CommunityView: React.FC = () => {
  const [activeGroup, setActiveGroup] = useState('1');

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-200 bg-[#f8f8f5] p-6 space-y-6 flex-shrink-0">
        <h3 className="uppercase tracking-widest text-xs font-bold text-gray-500">Community Groups</h3>
        <div className="space-y-4">
          {groups.map(group => (
            <div 
              key={group.id}
              onClick={() => setActiveGroup(group.id)}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition ${
                activeGroup === group.id ? 'bg-[#e5e7e0] shadow-sm' : 'hover:bg-white hover:shadow-sm'
              }`}
            >
              <img src={group.img} className="w-10 h-10 rounded-lg object-cover" alt="" />
              <div>
                <h4 className="text-xs font-bold leading-tight">{group.name}</h4>
                <p className="text-[10px] text-gray-400">{group.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-grow flex flex-col bg-white">
        <div className="p-6 border-b border-gray-100 flex items-center gap-4">
           <img src={groups.find(g => g.id === activeGroup)?.img} className="w-12 h-12 rounded-xl object-cover" alt="" />
           <div>
             <h3 className="serif text-xl font-bold">{groups.find(g => g.id === activeGroup)?.name}</h3>
             <p className="text-xs text-gray-500">Discussing offbeat paths, local culture, and hidden gems in {groups.find(g => g.id === activeGroup)?.name.split(':')[1] || 'Manali'}.</p>
           </div>
        </div>

        <div className="flex-grow overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className="flex gap-4">
              <img src={msg.avatar} className="w-10 h-10 rounded-full flex-shrink-0" alt="" />
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-800">{msg.author}</span>
                  <span className="text-[10px] text-gray-400">{msg.time}</span>
                </div>
                <div className="bg-[#f0f1ea] p-4 rounded-2xl rounded-tl-none text-sm text-gray-700 leading-relaxed">
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-white border-t border-gray-100">
          <div className="relative flex items-center gap-3">
            <input 
              type="text" 
              placeholder="Share your thoughts or ask a question..." 
              className="flex-grow bg-white border border-gray-200 rounded-lg py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-green-800"
            />
            <button className="bg-[#789a8e] text-white p-3 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-[#65857a] transition">
              Send <span className="text-lg">✈</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityView;

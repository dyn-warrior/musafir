
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';

const tags = ['Jibhi', 'Manali', 'Phuktal', 'Ladakh', 'Wayanad', 'Spiti Valley', 'Gokarna', 'Varkala', 'Dharamshala', 'Coorg'];

const DiscoverView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAiPlan = async () => {
    if (!query) return;
    setLoading(true);
    setAiResponse(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `I want to plan a trip to ${query}. Give me a short, inspiring 3-day itinerary focusing on offbeat spots and local culture. Use markdown formatting.`,
      });
      setAiResponse(response.text || "Sorry, I couldn't plan that trip.");
    } catch (e) {
      setAiResponse("Something went wrong. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">
      {/* Search Section */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-grow">
          <input 
            type="text" 
            placeholder="Where will your next adventure be?" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-[#ecede6] border-none rounded-full py-4 px-12 text-sm focus:ring-2 focus:ring-green-500"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        </div>
        <button 
          onClick={handleAiPlan}
          disabled={loading}
          className="bg-[#789a8e] text-white px-8 py-4 rounded-full text-sm font-medium hover:bg-[#65857a] transition shadow-md disabled:opacity-50"
        >
          {loading ? 'Thinking...' : 'Ask AI to plan a trip'}
        </button>
      </div>

      {/* AI Response Display */}
      {aiResponse && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-green-100 animate-in fade-in slide-in-from-top-4">
          <h3 className="serif text-2xl mb-4 text-green-900">AI Planned Itinerary for {query}</h3>
          <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">{aiResponse}</div>
        </div>
      )}

      {/* Tag Chips */}
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <button key={tag} className="px-5 py-2 rounded-full bg-[#789a8e] text-white text-xs hover:opacity-90 transition">
            {tag}
          </button>
        ))}
      </div>

      {/* Hero Destinations */}
      <div className="flex gap-6 overflow-x-auto pb-6 custom-scrollbar">
        <div className="min-w-[400px] bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col">
          <img src="https://picsum.photos/id/1018/600/400" className="h-72 w-full object-cover" alt="" />
          <div className="p-6 space-y-3">
            <h2 className="serif text-2xl font-bold">Jibhi: The Hidden Jewel of Himachal</h2>
            <p className="text-sm text-gray-600">Whispering pines and crystal rivers, a tranquil escape into nature's untouched embrace.</p>
            <div className="flex gap-4 text-[10px] text-gray-500 font-medium">
               <span className="bg-gray-100 px-3 py-1 rounded-full">⏱ Best Time: Mar-Jun</span>
               <span className="bg-gray-100 px-3 py-1 rounded-full">💰 Budget: ₹</span>
            </div>
          </div>
        </div>

        {[
          { title: "Manali: Gateway to Adventure & Solace", text: "From thrilling treks to peaceful monasteries.", img: "https://picsum.photos/id/1015/400/300" },
          { title: "Phuktal: A Spiritual Cliffside Sanctuary", text: "Journey to a remote, ancient monastery carved into rock.", img: "https://picsum.photos/id/1016/400/300" },
          { title: "Ladakh: Land of High Passes", text: "Experience the unique blend of barren landscapes and rich culture.", img: "https://picsum.photos/id/1019/400/300" }
        ].map((item, i) => (
          <div key={i} className="min-w-[300px] bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col">
            <img src={item.img} className="h-48 w-full object-cover" alt="" />
            <div className="p-5 space-y-2">
              <h3 className="serif text-lg font-bold leading-tight">{item.title}</h3>
              <p className="text-xs text-gray-600 line-clamp-2">{item.text}</p>
              <div className="flex gap-2 text-[9px] text-gray-500 pt-2">
                <span className="bg-gray-50 px-2 py-1 rounded">⏱ Best Time: Oct-Mar</span>
                <span className="bg-gray-50 px-2 py-1 rounded">💰 Budget: ₹₹</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Community Stories */}
      <div className="space-y-6">
        <h2 className="serif text-3xl">Community Stories & Offbeat Guides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
            <img src="https://picsum.photos/id/1020/150/150" className="w-24 h-24 rounded-lg object-cover" alt="" />
            <div className="flex-grow flex flex-col justify-between py-1">
              <div>
                <h4 className="font-bold text-sm">Trekking the Unseen Paths of Uttarakhand</h4>
                <p className="text-xs text-gray-500 mt-1">Discovering hidden villages and breathtaking vistas...</p>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-gray-400">
                <img src="https://picsum.photos/id/1021/20/20" className="w-4 h-4 rounded-full" alt="" />
                <span>Author Name • Jun 19, 2021</span>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
            <img src="https://picsum.photos/id/1022/150/150" className="w-24 h-24 rounded-lg object-cover" alt="" />
            <div className="flex-grow flex flex-col justify-between py-1">
              <div>
                <h4 className="font-bold text-sm">The Artisans of Kutch: Weaving Traditions</h4>
                <p className="text-xs text-gray-500 mt-1">Exploring the vibrant handicrafts and cultural heritage...</p>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-gray-400">
                <img src="https://picsum.photos/id/1023/20/20" className="w-4 h-4 rounded-full" alt="" />
                <span>Local Artisan • Jun 17, 2021</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoverView;

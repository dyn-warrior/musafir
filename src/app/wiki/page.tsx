"use client";

import { useState } from "react";
import { MapPin, MessageCircle, DollarSign, Users } from "lucide-react";

export default function WikiPage() {
    const [activeTab, setActiveTab] = useState("Overview");

    const tabs = ['Overview', 'How to Reach', 'Best Time to Visit', 'Budget Breakdown', 'Local Festivals & Culture', 'Stays Nearby', 'Community & Contributions', 'Map'];

    return (
        <div className="min-h-screen bg-[#FDFBF7] text-gray-900 font-sans">
            {/* Banner */}
            <div className="relative h-[60vh]">
                <img src="https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover" alt="Chefchaouen" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-16 left-4 md:left-16 text-white max-w-2xl">
                    <h1 className="font-heading text-5xl md:text-7xl font-bold mb-4">Chefchaouen, Morocco</h1>
                    <p className="text-xl font-light opacity-90">The Blue Pearl of the Rif Mountains.</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-12 py-12 grid grid-cols-1 md:grid-cols-12 gap-12">
                {/* Sidebar Nav */}
                <aside className="col-span-1 md:col-span-3 space-y-8">
                    <div className="space-y-1 hidden md:block">
                        <h4 className="uppercase tracking-widest text-xs font-bold text-gray-400 mb-4">Contents</h4>
                        {tabs.map((item, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveTab(item)}
                                className={`w-full text-left px-4 py-2 rounded-lg text-sm transition ${activeTab === item ? 'bg-green-100 text-green-900 font-bold' : 'text-gray-500 hover:bg-gray-100'}`}
                            >
                                {item}
                            </button>
                        ))}
                    </div>

                    <div className="bg-[#f8f8f5] p-6 rounded-2xl border border-gray-100 space-y-4">
                        <h4 className="font-heading text-2xl font-bold">Quick Facts</h4>
                        <div className="space-y-4 text-xs">
                            <div className="flex gap-3 items-start">
                                <MapPin className="w-5 h-5 opacity-50" />
                                <div>
                                    <p className="font-bold">Location</p>
                                    <p className="text-gray-500">Rif Mountains, Northern Morocco</p>
                                </div>
                            </div>
                            <div className="flex gap-3 items-start">
                                <MessageCircle className="w-5 h-5 opacity-50" />
                                <div>
                                    <p className="font-bold">Language</p>
                                    <p className="text-gray-500">Arabic, Berber, Spanish</p>
                                </div>
                            </div>
                            <div className="flex gap-3 items-start">
                                <DollarSign className="w-5 h-5 opacity-50" />
                                <div>
                                    <p className="font-bold">Currency</p>
                                    <p className="text-gray-500">Moroccan Dirham (MAD)</p>
                                </div>
                            </div>
                            <div className="flex gap-3 items-start">
                                <Users className="w-5 h-5 opacity-50" />
                                <div>
                                    <p className="font-bold">Population</p>
                                    <p className="text-gray-500">~43,000</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="col-span-1 md:col-span-9 space-y-16">
                    <section className="space-y-4">
                        <h2 className="font-heading text-3xl font-bold">Overview</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Nestled in the dramatic Rif Mountains, Chefchaouen is a city of striking beauty, celebrated for its blue-rinsed buildings that cascade down the hillside. Beyond its aesthetics, it offers a relaxed pace, rich history, and unique cultural experiences, far removed from the bustling cities of Fez and Marrakech. It's a haven for photographers, hikers, and those seeking a tranquil escape.
                        </p>
                        <button className="text-green-800 font-bold text-sm bg-green-50 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors">Read More</button>
                    </section>

                    <section className="space-y-4">
                        <h2 className="font-heading text-3xl font-bold">How to Reach 🚌</h2>
                        <p className="text-gray-600 leading-relaxed text-sm">
                            The closest major airports are Tangier Ibn Battuta (TNG) and Fes Sais (FEZ). From Tangier, it's a 2-3 hour bus or taxi ride. From Fes, expect a 4-5 hour journey.
                            Private transfers are highly recommended for comfort and scenic views. Public buses (CTM, Supratours) are reliable and affordable options.
                        </p>
                    </section>

                    <section className="space-y-8">
                        <div className="flex justify-between items-end">
                            <h2 className="font-heading text-3xl font-bold">Budget Breakdown</h2>
                            <span className="text-xs text-gray-400">Estimated daily cost</span>
                        </div>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-4 font-bold">Item</th>
                                    <th className="text-right py-4 font-bold">Estimated daily cost</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <tr>
                                    <td className="py-3 text-gray-600">Accommodation (Mid-range Riad)</td>
                                    <td className="py-3 text-right font-medium">400 - 800 MAD</td>
                                </tr>
                                <tr>
                                    <td className="py-3 text-gray-600">Food (Local Restaurants)</td>
                                    <td className="py-3 text-right font-medium">150 - 300 MAD</td>
                                </tr>
                                <tr>
                                    <td className="py-3 text-gray-600">Transport (Local Taxis)</td>
                                    <td className="py-3 text-right font-medium">20 - 50 MAD</td>
                                </tr>
                                <tr>
                                    <td className="py-3 text-gray-600">Activities & Entry Fees</td>
                                    <td className="py-3 text-right font-medium">50 - 150 MAD</td>
                                </tr>
                                <tr className="border-t-2 border-gray-200">
                                    <td className="py-4 font-bold text-gray-900">Total Estimated Daily</td>
                                    <td className="py-4 text-right font-bold text-gray-900">620 - 1300 MAD ($60 - $130 USD)</td>
                                </tr>
                            </tbody>
                        </table>
                    </section>

                    <section className="space-y-6">
                        <h2 className="font-heading text-3xl font-bold">Stays Nearby</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { name: 'Dar Echchaouen', price: 'from $95/night', rating: '4.8', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=300&h=200&auto=format&fit=crop' },
                                { name: 'Lina Riad & Spa', price: 'from $120/night', rating: '4.6', img: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=300&h=200&auto=format&fit=crop' },
                                { name: 'Casa Perla', price: 'from $50/night', rating: '4.5', img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=300&h=200&auto=format&fit=crop' }
                            ].map((stay, i) => (
                                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                                    <img src={stay.img} className="h-32 w-full object-cover" alt="" />
                                    <div className="p-4 space-y-1">
                                        <div className="flex justify-between items-center">
                                            <h5 className="font-bold text-sm">{stay.name}</h5>
                                            <span className="text-[10px] text-orange-400">★ {stay.rating}</span>
                                        </div>
                                        <p className="text-[10px] text-gray-400">{stay.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full py-3 bg-[#789a8e] text-white rounded-xl text-sm font-bold hover:bg-[#65857a] transition-colors">See All Accommodations</button>
                    </section>
                </div>
            </div>
        </div>
    );
}

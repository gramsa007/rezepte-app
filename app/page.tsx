'use client';

import React, { useState } from 'react';

export default function Home() {
  // Zustand: Welche Kategorie ist gerade offen? (null = Startseite)
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center sm:py-10">
      
      {/* Handysimulation Container */}
      <main className="w-full max-w-md bg-white min-h-screen sm:min-h-[800px] shadow-2xl sm:rounded-3xl overflow-hidden font-sans relative flex flex-col">
        
        {/* --- HEADER --- */}
        <div className="p-6 pb-2 flex items-center justify-between bg-white z-10">
          {activeCategory ? (
            // Zurück-Button (erscheint nur, wenn wir in einer Kategorie sind)
            <button 
              onClick={() => setActiveCategory(null)} 
              className="text-gray-500 hover:text-orange-500 flex items-center gap-1 font-medium transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Zurück
            </button>
          ) : (
            // Logo / Titel auf der Startseite
            <h1 className="text-xl font-bold text-gray-900">Meine Rezepte 🍳</h1>
          )}
          
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-xs font-bold">
            AG
          </div>
        </div>

        {/* --- INHALT --- */}
        <div className="p-6 pt-2 flex-1 overflow-y-auto">
          
          {/* ANSICHT 1: STARTSEITE (Wenn KEINE Kategorie gewählt ist) */}
          {activeCategory === null && (
            <div className="animate-in fade-in duration-300">
              
              {/* Suche */}
              <div className="relative mb-8 mt-2">
                <input
                  type="text"
                  placeholder="Was kochen wir heute?"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl text-gray-700 focus:ring-2 focus:ring-orange-500 outline-none"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>

              <h2 className="text-lg font-bold mb-4 text-gray-800">Kategorien</h2>
              
              <div className="grid grid-cols-2 gap-4">
                
                {/* Salate */}
                <div className="bg-green-50 p-4 rounded-2xl flex flex-col items-center justify-center aspect-square cursor-pointer hover:scale-105 transition hover:bg-green-100">
                  <span className="text-4xl mb-2">🥗</span>
                  <span className="font-semibold text-green-800">Salate</span>
                </div>

                {/* Hauptgang (MIT KLICK-FUNKTION) */}
                <div 
                  onClick={() => setActiveCategory('Hauptgang')} 
                  className="bg-orange-50 p-4 rounded-2xl flex flex-col items-center justify-center aspect-square cursor-pointer hover:scale-105 transition shadow-sm border border-orange-100 hover:bg-orange-100"
                >
                  <span className="text-4xl mb-2">🍗</span>
                  <span className="font-semibold text-orange-800">Hauptgang</span>
                </div>

                {/* Nachtisch */}
                <div className="bg-pink-50 p-4 rounded-2xl flex flex-col items-center justify-center aspect-square cursor-pointer hover:scale-105 transition hover:bg-pink-100">
                  <span className="text-4xl mb-2">🍰</span>
                  <span className="font-semibold text-pink-800">Nachtisch</span>
                </div>

                {/* Alle */}
                <div className="bg-gray-50 p-4 rounded-2xl flex flex-col items-center justify-center aspect-square cursor-pointer hover:scale-105 transition border-2 border-dashed border-gray-200 hover:bg-gray-100">
                  <span className="text-3xl mb-2 text-gray-400">👀</span>
                  <span className="font-semibold text-gray-600">Alle</span>
                </div>
              </div>

              {/* Zuletzt gekocht */}
              <div className="mt-8">
                <h2 className="text-lg font-bold mb-4 text-gray-800">Zuletzt gekocht</h2>
                <div className="bg-white border border-gray-100 shadow-sm p-4 rounded-2xl flex items-center gap-4">
                  <div className="text-3xl">🍝</div>
                  <div>
                    <h3 className="font-bold text-gray-800">Carbonara</h3>
                    <p className="text-xs text-gray-500">20 Min • Einfach</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ANSICHT 2: UNTERMENÜ HAUPTGANG */}
          {activeCategory === 'Hauptgang' && (
            <div className="animate-in slide-in-from-right duration-300">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Hauptgang wählen</h2>
              
              <div className="space-y-3">
                
                {/* Vegetarisch */}
                <div className="flex items-center p-4 bg-green-50 rounded-xl cursor-pointer hover:bg-green-100 transition group">
                  <span className="text-3xl mr-4 group-hover:scale-110 transition">🥦</span>
                  <div>
                    <h3 className="font-bold text-green-900">Vegetarisch</h3>
                    <p className="text-xs text-green-700">Gemüsepfannen, Aufläufe</p>
                  </div>
                  <div className="ml-auto text-green-400">›</div>
                </div>

                {/* Geflügel */}
                <div className="flex items-center p-4 bg-yellow-50 rounded-xl cursor-pointer hover:bg-yellow-100 transition group">
                  <span className="text-3xl mr-4 group-hover:scale-110 transition">🍗</span>
                  <div>
                    <h3 className="font-bold text-yellow-900">Geflügel</h3>
                    <p className="text-xs text-yellow-700">Hähnchen, Pute, Ente</p>
                  </div>
                  <div className="ml-auto text-yellow-400">›</div>
                </div>

                {/* Fisch */}
                <div className="flex items-center p-4 bg-blue-50 rounded-xl cursor-pointer hover:bg-blue-100 transition group">
                  <span className="text-3xl mr-4 group-hover:scale-110 transition">🐟</span>
                  <div>
                    <h3 className="font-bold text-blue-900">Fisch</h3>
                    <p className="text-xs text-blue-700">Lachs, Forelle, Meeresfrüchte</p>
                  </div>
                  <div className="ml-auto text-blue-400">›</div>
                </div>

                {/* Fleisch */}
                <div className="flex items-center p-4 bg-red-50 rounded-xl cursor-pointer hover:bg-red-100 transition group">
                  <span className="text-3xl mr-4 group-hover:scale-110 transition">🥩</span>
                  <div>
                    <h3 className="font-bold text-red-900">Fleisch</h3>
                    <p className="text-xs text-red-700">Rind, Schwein, Lamm</p>
                  </div>
                  <div className="ml-auto text-red-400">›</div>
                </div>

              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
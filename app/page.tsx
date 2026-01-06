'use client';

import React, { useState, useEffect } from 'react';
import rezepteVorgabe from './rezepte.json';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedRezept, setSelectedRezept] = useState<any | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showBackup, setShowBackup] = useState(false);
  const [copyStatus, setCopyStatus] = useState('Kopieren');
  
  const [alleRezepte, setAlleRezepte] = useState<any[]>([]);

  useEffect(() => {
    const gespeicherteRezepte = localStorage.getItem('meineRezepte');
    const eigeneRezepte = gespeicherteRezepte ? JSON.parse(gespeicherteRezepte) : [];
    setAlleRezepte([...rezepteVorgabe, ...eigeneRezepte]);
  }, []);

  const [form, setForm] = useState({
    name: '', kategorie: 'Hauptgang', dauer: '', zutaten: '', zubereitung: '', emoji: '🍳'
  });

  const starteBearbeiten = (rezept: any) => {
    setForm({
      name: rezept.name,
      kategorie: rezept.kategorie,
      dauer: rezept.dauer,
      zutaten: rezept.zutaten.join('\n'),
      zubereitung: rezept.zubereitung.join('\n'),
      emoji: rezept.emoji || '🍳'
    });
    setEditingId(rezept.id);
    setIsAdding(true);
    setSelectedRezept(null);
  };

  const rezeptSpeichern = () => {
    if (!form.name) return alert("Bitte einen Namen eingeben");

    const formatierte = {
      id: editingId || Date.now(),
      ...form,
      zutaten: form.zutaten.split('\n').filter(z => z.trim()),
      zubereitung: form.zubereitung.split('\n').filter(s => s.trim())
    };

    let eigeneRezepte = JSON.parse(localStorage.getItem('meineRezepte') || '[]');
    if (editingId) {
      eigeneRezepte = eigeneRezepte.map((r: any) => r.id === editingId ? formatierte : r);
    } else {
      eigeneRezepte.push(formatierte);
    }
    
    localStorage.setItem('meineRezepte', JSON.stringify(eigeneRezepte));
    setAlleRezepte([...rezepteVorgabe, ...eigeneRezepte]);
    setIsAdding(false);
    setEditingId(null);
    setSearchTerm('');
    setForm({ name: '', kategorie: 'Hauptgang', dauer: '', zutaten: '', zubereitung: '', emoji: '🍳' });
  };

  // Funktion für den neuen Kopier-Button
  const kopiereInZwischenablage = () => {
    const text = JSON.stringify(JSON.parse(localStorage.getItem('meineRezepte') || '[]'), null, 2);
    navigator.clipboard.writeText(text).then(() => {
      setCopyStatus('Kopiert! ✓');
      setTimeout(() => setCopyStatus('Kopieren'), 2000);
    });
  };

  const gefilterteRezepte = alleRezepte.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center sm:py-10 font-sans text-gray-800">
      <main className="w-full max-w-md bg-white min-h-screen sm:min-h-[800px] shadow-2xl sm:rounded-3xl overflow-hidden relative flex flex-col">
        
        {/* HEADER */}
        <div className="bg-pink-200 w-full h-24 flex items-center justify-center shrink-0 relative">
          <h1 className="text-pink-900 text-3xl font-bold font-serif tracking-wide">Chef Maya</h1>
          {!activeCategory && !selectedRezept && !isAdding && (
            <button 
              onClick={() => setShowBackup(true)}
              className="absolute right-4 bg-pink-300 text-pink-900 px-3 py-1.5 rounded-xl text-[10px] font-bold shadow-sm active:scale-90 transition"
            >
              BACKUP
            </button>
          )}
        </div>

        {/* BACKUP MODAL MIT KOPIERBUTTON */}
        {showBackup && (
          <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
            <div className="bg-white w-full rounded-3xl p-6 space-y-4 shadow-2xl animate-in zoom-in duration-200">
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-lg">Datensicherung</h2>
                <button 
                  onClick={kopiereInZwischenablage}
                  className="bg-blue-500 text-white px-3 py-1 rounded-lg text-xs font-bold active:scale-95 transition"
                >
                  {copyStatus}
                </button>
              </div>
              <p className="text-[10px] text-gray-500 leading-tight">
                Klicke auf Kopieren und füge den Text am Ende deiner <strong>rezepte.json</strong> ein.
              </p>
              <textarea 
                readOnly 
                value={JSON.stringify(JSON.parse(localStorage.getItem('meineRezepte') || '[]'), null, 2)} 
                className="w-full h-48 p-3 bg-gray-50 rounded-xl font-mono text-[10px] outline-none border border-gray-100"
              />
              <button onClick={() => setShowBackup(false)} className="w-full bg-orange-500 text-white p-3 rounded-xl font-bold">Schließen</button>
            </div>
          </div>
        )}

        {/* NAVIGATION & SUCHE */}
        <div className="p-5 flex flex-col items-center border-b bg-white relative shrink-0 gap-4">
          {(activeCategory || selectedRezept || isAdding) ? (
            <div className="w-full flex items-center justify-between">
              <button 
                onClick={() => { setSelectedRezept(null); if(!selectedRezept) { setActiveCategory(null); setIsAdding(false); setEditingId(null); }}} 
                className="text-gray-600 flex items-center gap-2 font-bold text-xl transition active:scale-90"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/></svg>
                Zurück
              </button>
              {selectedRezept && !rezepteVorgabe.find(r => r.id === selectedRezept.id) && (
                <button onClick={() => starteBearbeiten(selectedRezept)} className="bg-gray-100 p-2 rounded-xl text-gray-400 active:scale-90"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
              )}
            </div>
          ) : (
            <>
              <div className="relative w-full max-w-[320px]">
                <input type="text" placeholder="Rezept suchen..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-gray-700 focus:ring-2 focus:ring-orange-500 outline-none shadow-inner text-sm" />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <button onClick={() => setIsAdding(true)} className="bg-orange-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl w-full max-w-[280px] justify-center flex items-center gap-3 transition active:scale-95"><span className="text-2xl">+</span> Rezept hinzufügen</button>
            </>
          )}
        </div>

        <div className="p-6 pt-4 flex-1 overflow-y-auto">
          {/* HIER DIE LOGIK FÜR LISTE / KACHELN / DETAILS AUS DEM VORHERIGEN SCHRITT EINFÜGEN */}
          {isAdding ? (
            <div className="space-y-4 animate-in fade-in">
              <h2 className="font-bold border-b pb-2 text-lg">{editingId ? "Rezept bearbeiten" : "Neues Rezept"}</h2>
              <input value={form.name} placeholder="Name" className="w-full p-3 bg-gray-50 rounded-xl ring-1 ring-gray-200 outline-none" onChange={e => setForm({...form, name: e.target.value})} />
              <div className="flex gap-2">
                <select value={form.kategorie} className="flex-1 p-3 bg-gray-50 rounded-xl ring-1 ring-gray-200 outline-none" onChange={e => setForm({...form, kategorie: e.target.value})}>
                  <option>Hauptgang</option><option>Salate</option><option>Nachtisch</option>
                </select>
                <input value={form.dauer} placeholder="Dauer" className="flex-1 p-3 bg-gray-50 rounded-xl ring-1 ring-gray-200 outline-none" onChange={e => setForm({...form, dauer: e.target.value})} />
              </div>
              <textarea value={form.zutaten} placeholder="Zutaten..." rows={3} className="w-full p-3 bg-gray-50 rounded-xl ring-1 ring-gray-200" onChange={e => setForm({...form, zutaten: e.target.value})} />
              <textarea value={form.zubereitung} placeholder="Zubereitung..." rows={3} className="w-full p-3 bg-gray-50 rounded-xl ring-1 ring-gray-200" onChange={e => setForm({...form, zubereitung: e.target.value})} />
              <button onClick={rezeptSpeichern} className="w-full bg-green-500 text-white p-4 rounded-xl font-bold shadow-lg">{editingId ? "Änderungen speichern" : "Direkt Speichern"}</button>
            </div>
          ) : selectedRezept ? (
            <div className="animate-in fade-in duration-300 space-y-6 pb-10">
              <div className="text-center">
                <span className="text-6xl block mb-2">{selectedRezept.emoji || '🍳'}</span>
                <h2 className="text-2xl font-bold leading-tight">{selectedRezept.name}</h2>
                <p className="text-gray-400 text-xs mt-1 font-medium">🕒 {selectedRezept.dauer}</p>
              </div>
              <div className="bg-orange-50 rounded-3xl p-5 border border-orange-100">
                <h3 className="font-bold text-orange-800 mb-3 uppercase text-[10px] tracking-widest">Zutaten</h3>
                <ul className="space-y-2.5">
                  {selectedRezept.zutaten.map((z:string, i:number) => (
                    <li key={i} className="flex items-start gap-3 text-gray-700 text-sm">
                      <div className="w-5 h-5 border-2 border-orange-200 rounded-lg shrink-0 mt-0.5"/>
                      {z}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-blue-50 rounded-3xl p-5 border border-blue-100">
                <h3 className="font-bold text-blue-800 mb-4 uppercase text-[10px] tracking-widest">Zubereitung</h3>
                {selectedRezept.zubereitung.map((s:string, i:number) => (
                  <div key={i} className="flex gap-4 mb-5 last:mb-0">
                    <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 shadow-sm">{i+1}</span>
                    <p className="text-gray-700 text-sm leading-relaxed">{s}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {searchTerm ? (
                <div className="space-y-2">
                  <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Suchergebnisse</h2>
                  {gefilterteRezepte.map(r => (
                    <div key={r.id} onClick={() => {setSelectedRezept(r); setSearchTerm('');}} className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-4 cursor-pointer hover:bg-orange-50 transition">
                      <span className="text-3xl">{r.emoji || '🍳'}</span>
                      <div className="font-bold text-sm text-gray-800">{r.name}</div>
                      <div className="ml-auto text-gray-300">›</div>
                    </div>
                  ))}
                </div>
              ) : !activeCategory ? (
                <div className="flex flex-wrap justify-center gap-4 py-4">
                  {['Salate', 'Hauptgang', 'Nachtisch', 'Alle'].map((kat) => (
                    <div key={kat} onClick={() => setActiveCategory(kat)} className="bg-gray-50 w-40 h-40 p-4 rounded-3xl flex flex-col items-center justify-center border border-gray-100 shadow-sm cursor-pointer hover:bg-orange-50 transition active:scale-95">
                      <span className="text-5xl mb-2">{kat === 'Salate' ? '🥗' : kat === 'Hauptgang' ? '🍗' : kat === 'Nachtisch' ? '🍰' : '👀'}</span>
                      <span className="font-bold text-gray-600 text-[11px] uppercase tracking-widest">{kat}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3 animate-in slide-in-from-right duration-300">
                  <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">{activeCategory}</h2>
                  {alleRezepte
                    .filter(r => activeCategory === 'Alle' || r.kategorie === activeCategory)
                    .map(r => (
                      <div key={r.id} onClick={() => setSelectedRezept(r)} className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-4 cursor-pointer hover:bg-orange-50 transition active:scale-[0.98]">
                        <span className="text-3xl">{r.emoji || '🍳'}</span>
                        <div className="font-bold text-sm text-gray-800">{r.name}</div>
                        <div className="ml-auto text-gray-300">›</div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, query, orderBy } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBu8cgTpB5ltHvWX7eDv4pOfCpYY5s23Ds",
  authDomain: "chef-maya.firebaseapp.com",
  projectId: "chef-maya",
  storageBucket: "chef-maya.firebasestorage.app",
  messagingSenderId: "996277631686",
  appId: "1:996277631686:web:6b7aea75c3eae02e8ab5c7",
  measurementId: "G-PSYNRE463E"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedRezept, setSelectedRezept] = useState<any | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [alleRezepte, setAlleRezepte] = useState<any[]>([]);
  const [checkedZutaten, setCheckedZutaten] = useState<string[]>([]);
  const [portionen, setPortionen] = useState(1);

  const [form, setForm] = useState({
    name: '', kategorie: 'Hauptgang', dauer: '', zutaten: '', zubereitung: '', emoji: '🍳', sterne: 0
  });

  const loadRezepte = async () => {
    try {
      const q = query(collection(db, "rezepte"), orderBy("name", "asc"));
      const querySnapshot = await getDocs(q);
      const daten = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAlleRezepte(daten);
    } catch (e) { console.error("Fehler beim Laden:", e); }
  };

  useEffect(() => { loadRezepte(); }, []);

  const rezeptSpeichern = async () => {
    if (!form.name) return alert("Bitte Namen eingeben!");
    try {
      const data = {
        ...form,
        zutaten: form.zutaten.split('\n').filter(z => z.trim()),
        zubereitung: form.zubereitung.split('\n').filter(s => s.trim())
      };
      if (editingId) {
        await updateDoc(doc(db, "rezepte", editingId), data);
      } else {
        await addDoc(collection(db, "rezepte"), data);
      }
      setIsAdding(false); setEditingId(null);
      setForm({ name: '', kategorie: 'Hauptgang', dauer: '', zutaten: '', zubereitung: '', emoji: '🍳', sterne: 0 });
      await loadRezepte();
    } catch (e) { alert("Fehler beim Speichern"); }
  };

  const bewertungSetzen = async (rezept: any, anzahl: number) => {
    try {
      const rezeptRef = doc(db, "rezepte", rezept.id);
      await updateDoc(rezeptRef, { sterne: anzahl });
      setSelectedRezept({ ...rezept, sterne: anzahl });
      await loadRezepte();
    } catch (e) { console.error("Bewertung fehlgeschlagen", e); }
  };

  const zeigeZufallsRezept = () => {
    const aktiveRezepte = alleRezepte.filter(r => r.kategorie !== 'Sonstiges');
    if (aktiveRezepte.length > 0) {
      const zufall = aktiveRezepte[Math.floor(Math.random() * aktiveRezepte.length)];
      setSelectedRezept(zufall);
      setCheckedZutaten([]);
      setPortionen(1);
    }
  };

  const toggleZutat = (zutat: string) => {
    setCheckedZutaten(prev => 
      prev.includes(zutat) ? prev.filter(z => z !== zutat) : [...prev, zutat]
    );
  };

  const berechneMenge = (text: string) => {
    if (portionen === 1) return text;
    return text.replace(/([0-9]+[.,]?[0-9]*)/g, (match) => {
      const zahl = parseFloat(match.replace(',', '.'));
      if (isNaN(zahl)) return match;
      const neueZahl = (zahl * portionen).toLocaleString('de-DE', { maximumFractionDigits: 2 });
      return neueZahl;
    });
  };

  const starteBearbeiten = (rezept: any) => {
    setForm({
      name: rezept.name, kategorie: rezept.kategorie, dauer: rezept.dauer,
      zutaten: rezept.zutaten.join('\n'), zubereitung: rezept.zubereitung.join('\n'), 
      emoji: rezept.emoji || '🍳', sterne: rezept.sterne || 0
    });
    setEditingId(rezept.id); setIsAdding(true); setSelectedRezept(null);
  };

  const SterneAnzeige = ({ anzahl, interaktiv = false, rezept = null }: { anzahl: number, interaktiv?: boolean, rezept?: any }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} onClick={() => interaktiv && rezept && bewertungSetzen(rezept, s)} className={`text-xl ${interaktiv ? 'cursor-pointer' : ''} ${s <= anzahl ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center sm:py-10 text-gray-800 font-sans">
      <main className="w-full max-w-md bg-white min-h-screen shadow-2xl sm:rounded-3xl overflow-hidden flex flex-col relative">
        <div className="bg-pink-200 h-20 flex items-center justify-center shrink-0 font-bold text-pink-900 text-3xl shadow-sm tracking-tight">Chef Maya</div>

        <div className="p-4 border-b flex flex-col items-center gap-3 bg-white sticky top-0 z-10">
          {(activeCategory || selectedRezept || isAdding) ? (
            <div className="w-full flex justify-between h-10 items-center">
              <button onClick={() => { setSelectedRezept(null); setIsAdding(false); setEditingId(null); if(!selectedRezept) setActiveCategory(null); setCheckedZutaten([]); setPortionen(1); }} className="font-bold text-gray-400">← Zurück</button>
              {selectedRezept && (
                <div className="flex gap-2">
                  <button onClick={() => starteBearbeiten(selectedRezept)} className="bg-gray-100 px-3 py-1 rounded-lg text-xs font-bold">STIFT</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <input type="text" placeholder="Rezepte suchen..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl outline-none text-sm border border-gray-100" />
              <div className="flex gap-2 w-full">
                <button onClick={() => setIsAdding(true)} className="bg-orange-500 text-white p-3 rounded-xl font-bold flex-1 shadow-lg transition active:scale-95 text-sm">+ Rezept</button>
                <button onClick={zeigeZufallsRezept} className="bg-pink-500 text-white p-3 rounded-xl font-bold flex-1 shadow-lg transition active:scale-95 text-sm">🎲 Zufall</button>
              </div>
            </>
          )}
        </div>

        <div className="p-5 flex-1 overflow-y-auto pb-10">
          {isAdding ? (
            <div className="space-y-3 animate-in fade-in">
              <input value={form.name} placeholder="Name" className="w-full p-3 border rounded-xl" onChange={e => setForm({...form, name: e.target.value})} />
              <div className="flex gap-2">
                <select value={form.kategorie} className="flex-1 p-3 border rounded-xl bg-white text-sm" onChange={e => setForm({...form, kategorie: e.target.value})}><option>Hauptgang</option><option>Salate</option><option>Nachtisch</option><option>Sonstiges</option></select>
                <input value={form.dauer} placeholder="Dauer" className="flex-1 p-3 border rounded-xl text-sm" onChange={e => setForm({...form, dauer: e.target.value})} />
              </div>
              <textarea value={form.zutaten} placeholder="Zutaten (eine pro Zeile)..." rows={6} className="w-full p-3 border rounded-xl text-sm" onChange={e => setForm({...form, zutaten: e.target.value})} />
              <textarea value={form.zubereitung} placeholder="Zubereitung..." rows={6} className="w-full p-3 border rounded-xl text-sm" onChange={e => setForm({...form, zubereitung: e.target.value})} />
              <button onClick={rezeptSpeichern} className="w-full bg-green-500 text-white p-4 rounded-xl font-bold shadow-md">Speichern</button>
            </div>
          ) : selectedRezept ? (
            <div className="space-y-5 animate-in slide-in-from-bottom">
              <div className="text-center space-y-2">
                <span className="text-5xl">{selectedRezept.emoji || '🍳'}</span>
                <h2 className="text-2xl font-bold leading-tight">{selectedRezept.name}</h2>
                <div className="flex justify-center"><SterneAnzeige anzahl={selectedRezept.sterne || 0} interaktiv={true} rezept={selectedRezept} /></div>
                <div className="flex items-center justify-center gap-3 mt-4 bg-gray-50 w-fit mx-auto px-4 py-2 rounded-2xl border border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Portionen:</span>
                  <button onClick={() => setPortionen(Math.max(1, portionen - 1))} className="text-orange-500 font-bold text-xl px-2">-</button>
                  <span className="font-bold text-sm w-4">{portionen}</span>
                  <button onClick={() => setPortionen(portionen + 1)} className="text-orange-500 font-bold text-xl px-2">+</button>
                </div>
                <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-2">🕒 {selectedRezept.dauer}</p>
              </div>
              <div className="bg-orange-50 p-5 rounded-3xl border border-orange-100 shadow-sm">
                <h3 className="font-bold text-orange-800 text-[10px] mb-3 uppercase tracking-widest">Checkliste: Zutaten</h3>
                <div className="space-y-3">
                  {selectedRezept.zutaten.map((z:string, i:number) => (
                    <div key={i} onClick={() => toggleZutat(z)} className={`flex items-center gap-3 cursor-pointer transition ${checkedZutaten.includes(z) ? 'opacity-30' : ''}`}>
                      <div className={`w-5 h-5 rounded border flex items-center justify-center ${checkedZutaten.includes(z) ? 'bg-orange-500 border-orange-500' : 'bg-white border-orange-200'}`}>{checkedZutaten.includes(z) && <span className="text-white text-xs">✓</span>}</div>
                      <span className={`text-sm ${checkedZutaten.includes(z) ? 'line-through' : ''}`}>{berechneMenge(z)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-blue-50 p-5 rounded-3xl border border-blue-100 shadow-sm text-sm">
                <h3 className="font-bold text-blue-800 mb-3 uppercase text-[10px] tracking-widest">Zubereitung</h3>
                {selectedRezept.zubereitung.map((s:string, i:number) => (
                  <div key={i} className="mb-4 flex gap-3 leading-relaxed"><span className="font-bold text-blue-500 shrink-0">{i+1}.</span><p>{s}</p></div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {!activeCategory ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    {['Salate', 'Hauptgang', 'Nachtisch', 'Alle'].map(kat => (
                      <div key={kat} onClick={() => setActiveCategory(kat)} className="bg-gray-50 p-6 rounded-3xl flex flex-col items-center justify-center border border-gray-100 shadow-sm cursor-pointer hover:bg-orange-50 transition active:scale-95">
                        {/* ICONS UM 25% VERGRÖSSERT auf text-5xl */}
                        <span className="text-5xl mb-2">{kat === 'Salate' ? '🥗' : kat === 'Hauptgang' ? '🍗' : kat === 'Nachtisch' ? '🍰' : '👀'}</span>
                        <span className="font-bold text-gray-500 text-[10px] uppercase tracking-wider">{kat}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end pr-1"><div onClick={() => setActiveCategory('Sonstiges')} className="bg-gray-100 px-4 py-2 rounded-xl flex items-center gap-2 border border-gray-200 cursor-pointer opacity-60 hover:opacity-100 transition active:scale-95"><span className="text-sm">📦</span><span className="font-bold text-gray-500 text-[9px] uppercase tracking-widest">Sonstiges</span></div></div>
                </>
              ) : (
                <div className="space-y-2 animate-in fade-in">
                  <div className="flex justify-between items-end mb-2 px-1"><h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{activeCategory}</h3><span className="text-[10px] text-gray-300">{alleRezepte.filter(r => (activeCategory === 'Alle' ? r.kategorie !== 'Sonstiges' : r.kategorie === activeCategory)).length} Rezepte</span></div>
                  {alleRezepte
                    .filter(r => (activeCategory === 'Alle' ? r.kategorie !== 'Sonstiges' : r.kategorie === activeCategory))
                    .filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map(r => (
                      <div key={r.id} onClick={() => { setSelectedRezept(r); setCheckedZutaten([]); setPortionen(1); }} className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center justify-between cursor-pointer active:bg-orange-50 transition">
                        <div className="flex flex-col"><span className="font-bold text-sm">{r.name}</span><div className="flex items-center gap-2"><span className="text-[10px] text-gray-400">{r.dauer}</span><div className="scale-75 origin-left"><SterneAnzeige anzahl={r.sterne || 0} /></div></div></div>
                        <span className="text-gray-200">›</span>
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


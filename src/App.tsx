import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CharacterList from './components/CharacterList';
import CharacterDetailPage from './pages/CharacterDetailPage';
import { CharacterExtraData } from './types';
import { ToastContainer } from 'react-toastify';
import { HiMenu } from 'react-icons/hi';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  const [extras, setExtras] = useState<Record<string, CharacterExtraData>>({});
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterType, setFilterType] = useState<'all' | 'starred' | 'others' | 'deleted'>('all');
  const [filterSpecies, setFilterSpecies] = useState<'all' | 'Human' | 'Alien'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarVisible, setSidebarVisible] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const stored = localStorage.getItem('characterExtras');
    if (stored) setExtras(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarVisible(true);
      } else {
        setSidebarVisible(false);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const updateExtra = (id: string, data: Partial<CharacterExtraData>) => {
    const updated = {
      ...extras,
      [id]: {
        ...extras[id],
        ...data,
      },
    };
    setExtras(updated);
    localStorage.setItem('characterExtras', JSON.stringify(updated));
  };

  const handleDeleteCharacter = (id: string) => {
    const deleted = extras[id]?.deleted ?? false;
    updateExtra(id, { deleted: !deleted });
  };

  const handleToggleFavorite = (id: string) => {
    const current = extras[id]?.favorite ?? false;
    updateExtra(id, { favorite: !current });
  };

  return (
    <BrowserRouter>
      <button
        className="fixed top-4 left-4 z-50 bg-purple-600 text-white p-2 rounded-full shadow-lg md:hidden"
        onClick={() => setSidebarVisible(!sidebarVisible)}
      >
        <HiMenu className="text-xl" />
      </button>

      <div className="flex h-screen w-full bg-gray-100">
        {sidebarVisible && (
          <aside className="w-80 bg-white p-6 border-r top-8 overflow-y-auto absolute md:relative z-40 h-full shadow-lg md:shadow-none">
            <div className="mb-4">
              <label htmlFor="sort" className="block text-sm  font-medium text-gray-600 mb-1">Order:</label>
              <select
                id="sort"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                className="w-full border border-gray-300 rounded-full p-2 text-sm"
              >
                <option value="asc">Name (A-Z)</option>
                <option value="desc">Name (Z-A)</option>
              </select>
            </div>
            <CharacterList
              extras={extras}
              onDeleteCharacter={handleDeleteCharacter}
              onToggleFavorite={handleToggleFavorite}
              sortOrder={sortOrder}
              filterType={filterType}
              filterSpecies={filterSpecies}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              setFilterType={setFilterType}
              setFilterSpecies={setFilterSpecies}
              setSortOrder={setSortOrder}
              onSelectMobile={() => setSidebarVisible(false)}
              showFavoritesFirst={true}
            />
          </aside>
        )}

        <main className="flex-1 h-full overflow-y-auto p-4 md:p-8">
          <Routes>
            <Route
              path="/character/:id"
              element={
                <>
                  
                  <div className="bg-white p-4 rounded-xl shadow-md">
                    <CharacterDetailPage
                      extras={extras}
                      onUpdateExtra={updateExtra}
                    />
                  </div>
                </>
              }
            />
            <Route
              path="/"
              element={<div className="text-gray-500 text-center mt-20">Selecciona un personaje para ver detalles</div>}
            />
          </Routes>
        </main>
      </div>
      <ToastContainer />
    </BrowserRouter>
  );
}

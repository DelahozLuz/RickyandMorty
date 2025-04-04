import { useCharacters } from '../hooks/useCharacters';
import CharacterCard from './CharacterCard';
import { CharacterExtraData } from '../types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiAdjustments } from 'react-icons/hi';

type Props = {
  extras: Record<string, CharacterExtraData>;
  onToggleFavorite: (id: string) => void;
  onDeleteCharacter: (id: string) => void;
  sortOrder: 'asc' | 'desc';
  filterType: 'all' | 'starred' | 'others' | 'deleted';
  filterSpecies: 'all' | 'Human' | 'Alien';
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setFilterType: (type: 'all' | 'starred' | 'others' | 'deleted') => void;
  setFilterSpecies: (type: 'all' | 'Human' | 'Alien') => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  onSelectMobile?: () => void;
  showFavoritesFirst?: boolean;
};

export default function CharacterList({
  extras,
  onToggleFavorite,
  onDeleteCharacter,
  sortOrder,
  filterType,
  filterSpecies,
  searchTerm,
  setSearchTerm,
  setFilterType,
  setFilterSpecies,
  onSelectMobile,
}: Props) {
  const { characters, loading, error } = useCharacters();
  const [showFilters, setShowFilters] = useState(false);
  const [localFilterType, setLocalFilterType] = useState(filterType);
  const [localFilterSpecies, setLocalFilterSpecies] = useState(filterSpecies);
  const navigate = useNavigate();

  if (loading) return <p className="text-sm text-gray-400">Cargando personajes...</p>;
  if (error) return <p className="text-sm text-red-400">Error al cargar personajes</p>;

  const handleApplyFilters = () => {
    setFilterType(localFilterType);
    setFilterSpecies(localFilterSpecies);
    setShowFilters(false);
  };

  const filtered = characters.filter((char) => {
    const extra = extras[char.id];

    if (filterType !== 'deleted' && extra?.deleted) return false;
    if (filterType === 'deleted' && !extra?.deleted) return false;

    const isStarred = extra?.favorite;
    const matchesType =
      filterType === 'deleted' ||
      filterType === 'all' ||
      (filterType === 'starred' && isStarred) ||
      (filterType === 'others' && !isStarred);

    const matchesSpecies =
      filterSpecies === 'all' ||
      (typeof char.species === 'string' && char.species.toLowerCase() === filterSpecies.toLowerCase());

    const matchesSearch = char.name.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesType && matchesSpecies && matchesSearch;
  });

  const favorites = filtered.filter((char) => extras[char.id]?.favorite);
  const others = filtered.filter((char) => !extras[char.id]?.favorite);

  const sortFn = (a: typeof filtered[0], b: typeof filtered[0]) =>
    sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);

  favorites.sort(sortFn);
  others.sort(sortFn);

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder=" search character..."
          className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 pr-10"
        />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="absolute right-2 top-2.5 text-purple-600 hover:text-purple-800"
          title="Mostrar filtros"
        >
          <HiAdjustments className="text-xl" />
        </button>

        {showFilters && (
          <div className="absolute top-12 left-0 w-full z-10 bg-white p-4 rounded-xl shadow-xl space-y-4">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Character</p>
              <div className="flex gap-2 flex-wrap">
                {(['all', 'starred', 'others', 'deleted'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setLocalFilterType(type)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      localFilterType === type ? 'bg-purple-200' : 'bg-gray-100'
                    }`}
                  >
                    {type[0].toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Species</p>
              <div className="flex gap-2 flex-wrap">
                {(['all', 'Human', 'Alien'] as const).map((specie) => (
                  <button
                    key={specie}
                    onClick={() => setLocalFilterSpecies(specie)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      localFilterSpecies === specie ? 'bg-purple-200' : 'bg-gray-100'
                    }`}
                  >
                    {specie}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleApplyFilters}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-full text-sm font-semibold"
            >
              Filter
            </button>
          </div>
        )}
      </div>

      <ul className="space-y-2">
        {filterType === 'all' ? (
          <>
            {favorites.length > 0 && <h3 className="text-sm font-bold text-gray-600 mt-4">Favorite Characters</h3>}
            {favorites.map((char) => (
              <CharacterCard
                key={char.id}
                character={char}
                favorite={true}
                onClick={() => navigate(`/character/${char.id}`)}
                onToggleFavorite={() => onToggleFavorite(char.id)}
                onDelete={() => onDeleteCharacter(char.id)}
                restoreMode={false}
                onSelectMobile={onSelectMobile}
              />
            ))}

            {others.length > 0 && <h3 className="text-sm font-bold text-gray-600 mt-6">All Characters</h3>}
            {others.map((char) => (
              <CharacterCard
                key={char.id}
                character={char}
                favorite={false}
                onClick={() => navigate(`/character/${char.id}`)}
                onToggleFavorite={() => onToggleFavorite(char.id)}
                onDelete={() => onDeleteCharacter(char.id)}
                restoreMode={false}
                onSelectMobile={onSelectMobile}
              />
            ))}
          </>
        ) : (
          filtered.map((char) => (
            <CharacterCard
              key={char.id}
              character={char}
              favorite={extras[char.id]?.favorite}
              onClick={() => navigate(`/character/${char.id}`)}
              onToggleFavorite={() => onToggleFavorite(char.id)}
              onDelete={() => onDeleteCharacter(char.id)}
              restoreMode={filterType === 'deleted'}
              onSelectMobile={onSelectMobile}
            />
          ))
        )}
      </ul>
    </div>
  );
}

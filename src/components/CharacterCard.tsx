import { Character } from '../types';
import { HiHeart, HiTrash, HiRefresh } from 'react-icons/hi';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Props = {
  character: Character;
  favorite?: boolean;
  onClick: () => void;
  onToggleFavorite: () => void;
  onDelete: () => void;
  restoreMode?: boolean;
  onSelectMobile?: () => void;
};

export default function CharacterCard({
  character,
  onClick,
  favorite,
  onToggleFavorite,
  onDelete,
  restoreMode = false,
  onSelectMobile,
}: Props) {
  const handleDelete = () => {
    onDelete();
    if (!restoreMode) {
      toast.error(`Eliminaste a ${character.name}`, {
        position: 'bottom-right',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });
    } else {
      toast.success(`Restauraste a ${character.name}`, {
        position: 'bottom-right',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });
    }
  };

  const handleSelect = () => {
    onClick();
    if (window.innerWidth < 768 && onSelectMobile) {
      onSelectMobile();
    }
  };

  return (
    <li
      className={`flex flex-col gap-1 p-2 rounded-lg transition-colors group ${
        restoreMode ? 'border border-red-300 bg-red-50' : 'hover:bg-indigo-200'
      }`}
    >
      <div className="flex items-center gap-3">
        <img
          src={character.image}
          alt={character.name}
          className="w-10 h-10 rounded-full cursor-pointer"
          onClick={handleSelect}
        />
        <div className="flex-1 cursor-pointer" onClick={handleSelect}>
          <p className="font-semibold text-sm">
            {character.name} {restoreMode && <span className="text-xs text-blue-500">(removed)</span>}
          </p>
          <p className="text-xs text-gray-500">{character.species}</p>
        </div>
        <div className="flex items-center gap-2">
          {!restoreMode && (
            <button onClick={onToggleFavorite} aria-label="toggle-favorite">
              <HiHeart
                className={`text-lg ${
                  favorite ? 'text-green-500' : 'text-gray-300 group-hover:text-gray-500'
                }`}
              />
            </button>
          )}

          <button
            onClick={handleDelete}
            data-testid={restoreMode ? 'restore-button' : 'delete-button'}
            className={`text-xs ${restoreMode ? 'text-blue-500' : 'text-red-500'} hover:underline flex items-center gap-1`}
          >
            {restoreMode ? (
              <>
                <HiRefresh className="text-sm" />
                <span className="sr-only">Restaurar</span>
              </>
            ) : (
              <>
                <HiTrash className="text-sm" />
                <span className="sr-only">Eliminar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </li>
  );
}

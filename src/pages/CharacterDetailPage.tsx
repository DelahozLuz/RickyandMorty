import { useParams, useNavigate } from 'react-router-dom';
import { useCharacters } from '../hooks/useCharacters';
import CharacterDetail from '../components/CharacterDetail';
import { CharacterExtraData } from '../types';

type Props = {
  extras: Record<string, CharacterExtraData>;
  onUpdateExtra: (id: string, data: Partial<CharacterExtraData>) => void;
};

export default function CharacterDetailPage({ extras, onUpdateExtra }: Props) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { characters } = useCharacters();

  const character = characters.find((c) => c.id === id);

  if (!character) return (
    <div className="p-6 text-center text-red-500">
      Personaje no encontrado
      <br />
      <button
        onClick={() => navigate('/')}
        className="text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-full text-sm flex items-center gap-2"
      >
        ← 
      </button>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
     

      <CharacterDetail
        character={character}
        extra={extras[character.id]}
        onUpdateExtra={(data) => onUpdateExtra(character.id, data)}
      />
    </div>
  );
}

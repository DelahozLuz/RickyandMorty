import { useEffect, useState } from 'react';
import { Character, CharacterExtraData } from '../types';

type Props = {
  character: Character;
  extra?: CharacterExtraData;
  onUpdateExtra: (data: Partial<CharacterExtraData>) => void;
};

export default function CharacterDetail({ character, extra, onUpdateExtra }: Props) {
  const [comment, setComment] = useState(extra?.comment || '');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setComment(extra?.comment || '');
  }, [extra?.comment]);

  const handleSendComment = () => {
    onUpdateExtra({ comment });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="w-full h-full bg-white rounded-xl shadow-lg p-6 md:p-10 space-y-8 overflow-y-auto">
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
        <img src={character.image} alt={character.name} className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-purple-200" />
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold text-gray-800">{character.name}</h1>
          <p className="text-xl text-gray-600">{character.species}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-base text-gray-800">
        <div><strong>Status:</strong> {character.status}</div>
        <div><strong>Gender:</strong> {character.gender}</div>
        <div><strong>Origin:</strong> {character.origin?.name}</div>
      </div>

      <div>
        <button
          onClick={() => onUpdateExtra({ favorite: !extra?.favorite })}
          className={`px-6 py-2 rounded-lg text-white font-semibold text-base ${
            extra?.favorite ? 'bg-red-400' : 'bg-gray-500'
          }`}
        >
          {extra?.favorite ? 'Remove favorites ' : 'Add to favorites '}
        </button>
      </div>

      <div className="space-y-4 max-w-full">
        <label className="block text-lg font-semibold text-gray-700">comments</label>

        {extra?.comment && (
          <div className="bg-gray-100 p-4 rounded-lg border text-gray-800 max-w-full overflow-auto">
            <p className="text-sm font-medium text-gray-600 mb-1">Saved comment:</p>
            <p className="whitespace-pre-wrap text-base">{extra.comment}</p>
          </div>
        )}

        <textarea
          rows={5}
          className="w-full max-h-40 border border-gray-300 rounded-lg p-4 text-base resize-none overflow-y-auto"
          placeholder="Write or update your comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div className="flex items-center gap-4">
          <button
            onClick={handleSendComment}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg"
          >
            Submit comment
          </button>
          {saved && <span className="text-green-500 text-sm">Saved comment✅</span>}
        </div>
      </div>
    </div>
  );
}

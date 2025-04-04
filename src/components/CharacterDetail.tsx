import { useEffect, useState } from 'react';
import { Character, CharacterExtraData } from '../types';
import { HiHeart } from 'react-icons/hi';

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
    <div className="w-full h-full p-6 md:p-10 space-y-10 font-sans">
     
      <div className="flex flex-col items-start gap-2 relative">
        <div className="relative w-fit">
          <img
            src={character.image}
            alt={character.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          {extra?.favorite && (
            <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-white flex items-center justify-center">
              <HiHeart className="text-green-500 text-base" />
            </span>
          )}
        </div>
        <h1 className="text-lg font-semibold text-gray-900 pt-1">{character.name}</h1>
      </div>

     
      <div className="space-y-6 text-left divide-y divide-gray-300">
        <div className="pt-2">
          <p className="text-sm font-medium text-gray-500">Specie</p>
          <p className="text-base text-gray-900">{character.species}</p>
        </div>
        <div className="pt-2">
          <p className="text-sm font-medium text-gray-500">Status</p>
          <p className="text-base text-gray-900">{character.status}</p>
        </div>
        <div className="pt-2">
          <p className="text-sm font-medium text-gray-500">Origin</p>
          <p className="text-base text-gray-900">{character.origin?.name}</p>
        </div>
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
        <label className="block text-lg font-semibold text-gray-700">Comments</label>

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
          {saved && <span className="text-green-500 text-sm">Saved comment ✅</span>}
        </div>
      </div>
    </div>
  );
}

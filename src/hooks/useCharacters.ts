import { useQuery } from '@apollo/client';
import { GET_CHARACTERS } from '../graphql/queries';
import { Character } from '../types';

export function useCharacters() {
  const { data, loading, error } = useQuery(GET_CHARACTERS);

  return {
    characters: data?.characters?.results as Character[] || [],
    loading,
    error,
  };
}

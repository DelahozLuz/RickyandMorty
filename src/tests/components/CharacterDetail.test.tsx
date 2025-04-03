/// <reference types="@testing-library/jest-dom" />

import { render, screen } from '@testing-library/react';
import CharacterList from '@/components/CharacterList';
import { useCharacters } from '@/hooks/useCharacters';
import { BrowserRouter } from 'react-router-dom';
import { Character, CharacterExtraData } from '@/types';
import { ApolloError } from '@apollo/client';

// Mock del hook
jest.mock('@/hooks/useCharacters');
const mockUseCharacters = useCharacters as jest.MockedFunction<typeof useCharacters>;

const mockCharacter: Character = {
  id: '1',
  name: 'Rick Sanchez',
  species: 'Human',
  image: 'https://example.com/rick.png',
  status: 'Alive',
  gender: 'Male',
  origin: { name: 'Earth' },
};

const mockExtras: Record<string, CharacterExtraData> = {
  '1': {
    favorite: true,
    comment: 'Es un genio loco',
    deleted: false,
  },
};

const defaultProps = {
  extras: mockExtras,
  onToggleFavorite: jest.fn(),
  onDeleteCharacter: jest.fn(),
  sortOrder: 'asc' as const,
  filterType: 'all' as const,
  filterSpecies: 'all' as const,
  searchTerm: '',
  setSearchTerm: jest.fn(),
  setFilterType: jest.fn(),
  setFilterSpecies: jest.fn(),
  setSortOrder: jest.fn(),
  onSelectMobile: jest.fn(),
};

const renderComponent = () =>
  render(
    <BrowserRouter>
      <CharacterList {...defaultProps} />
    </BrowserRouter>
  );

describe('CharacterList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('muestra mensaje de carga', () => {
    mockUseCharacters.mockReturnValue({
      characters: [],
      loading: true,
      error: undefined,
    });

    renderComponent();
    expect(screen.getByText('Cargando personajes...')).toBeInTheDocument();
  });

  test('muestra mensaje de error si ocurre un error', () => {
    mockUseCharacters.mockReturnValue({
      characters: [],
      loading: false,
      error: new ApolloError({ errorMessage: 'Error simulado' }),
    });

    renderComponent();
    expect(screen.getByText('Error al cargar personajes')).toBeInTheDocument();
  });

  test('renderiza personaje cuando hay datos', () => {
    mockUseCharacters.mockReturnValue({
      characters: [mockCharacter],
      loading: false,
      error: undefined,
    });

    renderComponent();
    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Human')).toBeInTheDocument();
  });
});

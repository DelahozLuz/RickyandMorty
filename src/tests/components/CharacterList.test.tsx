/// <reference types="@testing-library/jest-dom" />

import { render, screen } from '@testing-library/react';
import CharacterList from '@/components/CharacterList';
import { useCharacters } from '@/hooks/useCharacters';
import { BrowserRouter } from 'react-router-dom';
import { CharacterExtraData } from '@/types';
import { ApolloError } from '@apollo/client';


jest.mock('@/hooks/useCharacters');
const mockUseCharacters = useCharacters as jest.MockedFunction<typeof useCharacters>;


const mockCharacter = {
  id: '1',
  name: 'Rick Sanchez',
  species: 'Human',
  image: 'https://example.com/rick.png',
};


const mockExtras: Record<string, CharacterExtraData> = {
  '1': {
    favorite: true,
    deleted: false,
    comment: 'Genio loco',
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
      error: new ApolloError({ errorMessage: 'Simulado' }),
    });

    renderComponent();

    expect(screen.getByText('Error al cargar personajes')).toBeInTheDocument();
  });

  test('muestra un personaje cuando se carga correctamente', () => {
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

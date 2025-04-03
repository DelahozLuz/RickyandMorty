/// <reference types="@testing-library/jest-dom" />

import { render, fireEvent, screen } from '@testing-library/react';
import CharacterCard from '@/components/CharacterCard';
import { Character } from '@/types';

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockOnClick = jest.fn();
const mockOnToggleFavorite = jest.fn();
const mockOnDelete = jest.fn();
const mockOnSelectMobile = jest.fn();

const character: Character = {
  id: '1',
  name: 'Rick Sanchez',
  species: 'Human',
  image: 'https://example.com/rick.png',
};

describe('CharacterCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debe renderizar correctamente', () => {
    render(
      <CharacterCard
        character={character}
        onClick={mockOnClick}
        onToggleFavorite={mockOnToggleFavorite}
        onDelete={mockOnDelete}
        restoreMode={false}
        onSelectMobile={mockOnSelectMobile}
      />
    );

    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Human')).toBeInTheDocument();
  });

  test('debe llamar onClick cuando se hace click en el nombre o imagen', () => {
    render(
      <CharacterCard
        character={character}
        onClick={mockOnClick}
        onToggleFavorite={mockOnToggleFavorite}
        onDelete={mockOnDelete}
        restoreMode={false}
        onSelectMobile={mockOnSelectMobile}
      />
    );

    fireEvent.click(screen.getByText('Rick Sanchez'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByAltText('Rick Sanchez'));
    expect(mockOnClick).toHaveBeenCalledTimes(2);
  });

  test('debe llamar onToggleFavorite cuando se hace click en el ícono de corazón', () => {
    render(
      <CharacterCard
        character={character}
        onClick={mockOnClick}
        onToggleFavorite={mockOnToggleFavorite}
        onDelete={mockOnDelete}
        restoreMode={false}
        onSelectMobile={mockOnSelectMobile}
        favorite={false}
      />
    );

    fireEvent.click(screen.getByLabelText('toggle-favorite')); // ✅ Preciso
    expect(mockOnToggleFavorite).toHaveBeenCalledTimes(1);
  });

  test('debe llamar onDelete y mostrar mensaje de error cuando se hace click en "Eliminar"', () => {
    render(
      <CharacterCard
        character={character}
        onClick={mockOnClick}
        onToggleFavorite={mockOnToggleFavorite}
        onDelete={mockOnDelete}
        restoreMode={false}
        onSelectMobile={mockOnSelectMobile}
      />
    );

    fireEvent.click(screen.getByTestId('delete-button')); // ✅ Preciso
    expect(mockOnDelete).toHaveBeenCalledTimes(1);

    expect(require('react-toastify').toast.error).toHaveBeenCalledWith(
      'Eliminaste a Rick Sanchez',
      expect.any(Object)
    );
  });

  test('debe llamar onDelete y mostrar mensaje de éxito cuando se hace click en "Restaurar"', () => {
    render(
      <CharacterCard
        character={character}
        onClick={mockOnClick}
        onToggleFavorite={mockOnToggleFavorite}
        onDelete={mockOnDelete}
        restoreMode={true}
        onSelectMobile={mockOnSelectMobile}
      />
    );

    fireEvent.click(screen.getByTestId('restore-button')); 
    expect(mockOnDelete).toHaveBeenCalledTimes(1);

    expect(require('react-toastify').toast.success).toHaveBeenCalledWith(
      'Restauraste a Rick Sanchez',
      expect.any(Object)
    );
  });
});

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import RecipeCard from '../RecipeCard';

const mockRecipe = {
  id: '123',
  name: 'Delicious Test Pasta',
  imageUrl: 'https://www.example.com/pasta.jpg',
  // category: 'Italian', // Optional: for testing display of category if added
};

describe('RecipeCard', () => {
  it('renders the recipe name correctly', () => {
    const { getByText } = render(<RecipeCard recipe={mockRecipe} onPress={() => {}} />);
    expect(getByText(mockRecipe.name)).toBeTruthy();
  });

  it('renders the recipe image with correct source URI', () => {
    const { getByTestId } = render(<RecipeCard recipe={mockRecipe} onPress={() => {}} />);
    const image = getByTestId(`recipe-card-image-${mockRecipe.id}`);
    expect(image.props.source.uri).toBe(mockRecipe.imageUrl);
  });

  it('calls onPress with recipe id and name when the card is pressed', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(
      <RecipeCard recipe={mockRecipe} onPress={mockOnPress} />
    );
    fireEvent.press(getByTestId(`recipe-card-touchable-${mockRecipe.id}`));
    expect(mockOnPress).toHaveBeenCalledWith(mockRecipe.id, mockRecipe.name);
  });

  // Example for testing category display if RecipeCard is updated to show it
  // it('displays the category if provided', () => {
  //   const recipeWithCategory = { ...mockRecipe, category: 'Italian' };
  //   const { getByText } = render(<RecipeCard recipe={recipeWithCategory} onPress={() => {}} />);
  //   expect(getByText('Italian')).toBeTruthy();
  // });

  // it('does not display category if not provided', () => {
  //   const { queryByText } = render(<RecipeCard recipe={mockRecipe} onPress={() => {}} />);
  //   // Assuming category would be identified by its text. Adjust if using testIDs or other identifiers.
  //   expect(queryByText(mockRecipe.category)).toBeNull(); // If category is undefined
  //   expect(queryByText('Italian')).toBeNull(); // Or specific text if category field might exist but be empty
  // });
});

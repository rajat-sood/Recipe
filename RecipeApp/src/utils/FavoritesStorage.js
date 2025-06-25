import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@RecipeApp:Favorites';

// Helper function to get the favorites list
export const getFavorites = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(FAVORITES_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error fetching favorites from AsyncStorage', e);
    return [];
  }
};

// Add a recipe to favorites
export const addRecipeToFavorites = async (recipe) => {
  if (!recipe || !recipe.id) {
    console.error('Invalid recipe object provided to addRecipeToFavorites');
    return false;
  }
  try {
    const currentFavorites = await getFavorites();
    // Check if recipe already exists
    if (currentFavorites.find(r => r.id === recipe.id)) {
      console.log('Recipe already in favorites:', recipe.id);
      return true;
    }
    const newFavorites = [...currentFavorites, recipe];
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    console.log('Recipe added to favorites:', recipe.id);
    return true;
  } catch (e) {
    console.error('Error adding recipe to favorites in AsyncStorage', e);
    return false;
  }
};

// Remove a recipe from favorites
export const removeRecipeFromFavorites = async (recipeId) => {
  if (!recipeId) {
    console.error('Invalid recipeId provided to removeRecipeFromFavorites');
    return false;
  }
  try {
    const currentFavorites = await getFavorites();
    const newFavorites = currentFavorites.filter(recipe => recipe.id !== recipeId);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    console.log('Recipe removed from favorites:', recipeId);
    return true;
  } catch (e) {
    console.error('Error removing recipe from favorites in AsyncStorage', e);
    return false;
  }
};

// Check if a recipe is in favorites
export const isRecipeInFavorites = async (recipeId) => {
  if (!recipeId) return false;
  try {
    const currentFavorites = await getFavorites();
    return currentFavorites.some(recipe => recipe.id === recipeId);
  } catch (e) {
    console.error('Error checking if recipe is in favorites', e);
    return false;
  }
};

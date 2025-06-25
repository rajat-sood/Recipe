import AsyncStorage from '@react-native-async-storage/async-storage';

const LIBRARY_KEY = '@RecipeApp:Library';

// Helper function to get the library
export const getLibrary = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(LIBRARY_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error fetching library from AsyncStorage', e);
    return [];
  }
};

// Add a recipe to the library
export const addRecipeToLibrary = async (recipe) => {
  if (!recipe || !recipe.id) {
    console.error('Invalid recipe object provided to addRecipeToLibrary');
    return false;
  }
  try {
    const currentLibrary = await getLibrary();
    // Check if recipe already exists to prevent duplicates
    if (currentLibrary.find(r => r.id === recipe.id)) {
      console.log('Recipe already in library:', recipe.id);
      return true; // Indicate success as it's already there
    }
    const newLibrary = [...currentLibrary, recipe];
    await AsyncStorage.setItem(LIBRARY_KEY, JSON.stringify(newLibrary));
    console.log('Recipe added to library:', recipe.id);
    return true;
  } catch (e) {
    console.error('Error adding recipe to library in AsyncStorage', e);
    return false;
  }
};

// Remove a recipe from the library
export const removeRecipeFromLibrary = async (recipeId) => {
  if (!recipeId) {
    console.error('Invalid recipeId provided to removeRecipeFromLibrary');
    return false;
  }
  try {
    const currentLibrary = await getLibrary();
    const newLibrary = currentLibrary.filter(recipe => recipe.id !== recipeId);
    await AsyncStorage.setItem(LIBRARY_KEY, JSON.stringify(newLibrary));
    console.log('Recipe removed from library:', recipeId);
    return true;
  } catch (e) {
    console.error('Error removing recipe from library in AsyncStorage', e);
    return false;
  }
};

// Check if a recipe is in the library
export const isRecipeInLibrary = async (recipeId) => {
  if (!recipeId) return false;
  try {
    const currentLibrary = await getLibrary();
    return currentLibrary.some(recipe => recipe.id === recipeId);
  } catch (e) {
    console.error('Error checking if recipe is in library', e);
    return false;
  }
};

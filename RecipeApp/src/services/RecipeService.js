const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1/';

/**
 * Fetches recipes from TheMealDB API based on an ingredient.
 * @param {string} ingredient - The ingredient to search for.
 * @returns {Promise<Array>} A promise that resolves to an array of meals, or an empty array if an error occurs or no meals are found.
 */
export const searchRecipesByIngredient = async (ingredient) => {
  if (!ingredient || ingredient.trim() === '') {
    console.log('Search ingredient is empty, returning no results.');
    return [];
  }
  try {
    const response = await fetch(`${API_BASE_URL}filter.php?i=${ingredient.trim()}`);
    if (!response.ok) {
      console.error('Network response was not ok:', response.status);
      return [];
    }
    const data = await response.json();
    // The API returns { meals: null } if no meals are found for the ingredient
    if (data.meals) {
      return data.meals.map(meal => ({
        id: meal.idMeal,
        name: meal.strMeal,
        imageUrl: meal.strMealThumb,
      }));
    } else {
      console.log(`No meals found for ingredient: ${ingredient}`);
      return [];
    }
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return []; // Return empty array on error
  }
};

/**
 * Fetches the full details of a specific recipe by its ID.
 * @param {string} id - The ID of the meal to fetch.
 * @returns {Promise<Object|null>} A promise that resolves to the meal details, or null if an error occurs or no meal is found.
 */
export const getRecipeDetailsById = async (id) => {
  if (!id) {
    console.log('Recipe ID is empty, returning null.');
    return null;
  }
  try {
    const response = await fetch(`${API_BASE_URL}lookup.php?i=${id}`);
    if (!response.ok) {
      console.error('Network response was not ok:', response.status);
      return null;
    }
    const data = await response.json();
    if (data.meals && data.meals.length > 0) {
      const meal = data.meals[0];
      // Extract ingredients and measures
      const ingredients = [];
      for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
          ingredients.push({
            ingredient: meal[`strIngredient${i}`],
            measure: meal[`strMeasure${i}`],
          });
        } else {
          break; // No more ingredients
        }
      }
      return {
        id: meal.idMeal,
        name: meal.strMeal,
        category: meal.strCategory,
        area: meal.strArea,
        instructions: meal.strInstructions,
        imageUrl: meal.strMealThumb,
        tags: meal.strTags ? meal.strTags.split(',') : [],
        youtubeUrl: meal.strYoutube,
        ingredients: ingredients,
        source: meal.strSource,
      };
    } else {
      console.log(`No meal found for ID: ${id}`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    return null;
  }
};

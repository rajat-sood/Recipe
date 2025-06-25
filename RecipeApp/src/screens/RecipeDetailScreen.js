import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, TouchableOpacity, Alert, Share } from 'react-native';
import { getRecipeDetailsById } from '../services/RecipeService';
import {
  addRecipeToLibrary, removeRecipeFromLibrary, isRecipeInLibrary,
  addRecipeToFavorites, removeRecipeFromFavorites, isRecipeInFavorites
} from '../utils';

const RecipeDetailScreen = ({ route }) => {
  const recipeId = route.params?.recipeId;

  const [recipeDetails, setRecipeDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchDetailsAndStatus = async () => {
      if (!recipeId) {
        setError('No recipe ID provided. Please navigate correctly.');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const details = await getRecipeDetailsById(recipeId);
        if (details) {
          setRecipeDetails(details);
          const [libraryStatus, favoriteStatus] = await Promise.all([
            isRecipeInLibrary(details.id),
            isRecipeInFavorites(details.id)
          ]);
          setIsInLibrary(libraryStatus);
          setIsFavorite(favoriteStatus);
        } else {
          setError('Recipe not found or error fetching details.');
        }
      } catch (e) {
        console.error('Failed to fetch recipe details or status:', e);
        setError('Failed to fetch recipe details.');
      }
      setLoading(false);
    };

    fetchDetailsAndStatus();
  }, [recipeId]);

  const handleToggleLibrary = async () => {
    if (!recipeDetails) return;
    const currentRecipeSummary = {
      id: recipeDetails.id, name: recipeDetails.name, imageUrl: recipeDetails.imageUrl,
      category: recipeDetails.category, area: recipeDetails.area,
    };

    if (isInLibrary) {
      const success = await removeRecipeFromLibrary(recipeDetails.id);
      if (success) {
        setIsInLibrary(false);
        Alert.alert('Removed', `${recipeDetails.name} has been removed from your library.`);
      } else {
        Alert.alert('Error', 'Could not remove recipe from library.');
      }
    } else {
      const success = await addRecipeToLibrary(currentRecipeSummary);
      if (success) {
        setIsInLibrary(true);
        Alert.alert('Saved!', `${recipeDetails.name} has been added to your library.`);
      } else {
        Alert.alert('Error', 'Could not save recipe to library.');
      }
    }
  };

  const handleToggleFavorite = async () => {
    if (!recipeDetails) return;
    const currentRecipeSummary = {
        id: recipeDetails.id, name: recipeDetails.name, imageUrl: recipeDetails.imageUrl,
        category: recipeDetails.category, area: recipeDetails.area,
      };

    if (isFavorite) {
      const success = await removeRecipeFromFavorites(recipeDetails.id);
      if (success) {
        setIsFavorite(false);
        Alert.alert('Unfavorited', `${recipeDetails.name} has been removed from your favorites.`);
      } else {
        Alert.alert('Error', 'Could not remove recipe from favorites.');
      }
    } else {
      const success = await addRecipeToFavorites(currentRecipeSummary);
      if (success) {
        setIsFavorite(true);
        Alert.alert('Favorited!', `${recipeDetails.name} has been added to your favorites.`);
      } else {
        Alert.alert('Error', 'Could not add recipe to favorites.');
      }
    }
  };

  const handleExportToText = async () => {
    if (!recipeDetails) {
      Alert.alert('Error', 'Recipe details not available to export.');
      return;
    }
    try {
      let textToShare = `Recipe: ${recipeDetails.name}\n\n`;
      textToShare += `Category: ${recipeDetails.category}\n`;
      textToShare += `Area: ${recipeDetails.area}\n\n`;

      textToShare += 'Ingredients:\n';
      recipeDetails.ingredients.forEach(item => {
        textToShare += `- ${item.measure ? `${item.measure} ` : ''}${item.ingredient}\n`;
      });

      textToShare += '\nInstructions:\n';
      textToShare += recipeDetails.instructions;

      await Share.share({
        message: textToShare,
        title: `Recipe: ${recipeDetails.name}`,
      });
    } catch (error) {
      Alert.alert('Export Error', 'Failed to share recipe.');
      console.error('Error sharing recipe:', error.message);
    }
  };

  const handleGenerateShoppingList = async () => {
    if (!recipeDetails || !recipeDetails.ingredients || recipeDetails.ingredients.length === 0) {
      Alert.alert('Error', 'No ingredients available to generate a shopping list.');
      return;
    }
    try {
      let shoppingListText = `Shopping List for ${recipeDetails.name}:\n\n`;
      recipeDetails.ingredients.forEach(item => {
        shoppingListText += `- ${item.measure ? `${item.measure} ` : ''}${item.ingredient}\n`;
      });

      await Share.share({
        message: shoppingListText,
        title: `Shopping List: ${recipeDetails.name}`,
      });
    } catch (error) {
      Alert.alert('Shopping List Error', 'Failed to generate shopping list.');
      console.error('Error generating shopping list:', error.message);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#007bff" style={styles.loader} />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  if (!recipeDetails) {
    return <Text style={styles.infoText}>No recipe details available.</Text>;
  }

  const { name, imageUrl, ingredients, instructions, category, area } = recipeDetails;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.headerContent}>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.subtitle}>{category} | {area}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ingredients</Text>
        {ingredients.map((item, index) => (
          <Text key={index} style={styles.ingredient}>
            • {item.measure ? `${item.measure} ` : ''}{item.ingredient}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Instructions</Text>
        <Text style={styles.instructions}>{instructions}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
            style={[styles.button, isInLibrary ? styles.buttonRemove : styles.buttonSave]}
            onPress={handleToggleLibrary}
        >
            <Text style={styles.buttonText}>
                {isInLibrary ? 'Remove from Library' : 'Save to Library'}
            </Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[styles.button, isFavorite ? styles.buttonUnfavorite : styles.buttonFavorite]}
            onPress={handleToggleFavorite}
        >
            <Text style={styles.buttonText}>
                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonExport]} onPress={handleExportToText}>
            <Text style={styles.buttonText}>Export to Text</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonShoppingList]} onPress={handleGenerateShoppingList}>
            <Text style={styles.buttonText}>Generate Shopping List</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    paddingBottom: 30,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  errorText: {
    color: '#dc3545',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  infoText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#6c757d',
    paddingHorizontal: 15,
  },
  image: {
    width: '100%',
    height: 280,
    backgroundColor: '#e9ecef',
  },
  headerContent: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#212529',
  },
  subtitle: {
    fontSize: 16,
    color: '#495057',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#343a40',
  },
  ingredient: {
    fontSize: 16,
    lineHeight: 26,
    color: '#495057',
    marginBottom: 4,
  },
  instructions: {
    fontSize: 16,
    lineHeight: 26,
    color: '#495057',
    textAlign: 'left',
  },
  buttonContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  buttonSave: {
    backgroundColor: '#28a745',
  },
  buttonRemove: {
    backgroundColor: '#dc3545',
  },
  buttonFavorite: {
    backgroundColor: '#ffc107',
  },
  buttonUnfavorite: {
    backgroundColor: '#6c757d',
  },
  buttonExport: {
    backgroundColor: '#17a2b8',
  },
  buttonShoppingList: { // For Shopping List
    backgroundColor: '#fd7e14', // Bootstrap orange
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default RecipeDetailScreen;

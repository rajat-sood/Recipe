import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getLibrary } from '../utils/LibraryStorage';
import { RecipeCard } from '../components';

const LibraryScreen = () => {
  const navigation = useNavigation();
  const [libraryRecipes, setLibraryRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLibrary = useCallback(async () => {
    setLoading(true);
    try {
      const recipes = await getLibrary();
      setLibraryRecipes(recipes);
    } catch (error) {
      console.error("Failed to fetch library recipes:", error);
      // Optionally set an error state here to display to the user
    }
    setLoading(false);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchLibrary();
    setRefreshing(false);
  }, [fetchLibrary]);

  // useFocusEffect to reload data when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchLibrary();
      return () => {
        // Optional: cleanup if needed when screen loses focus
      };
    }, [fetchLibrary])
  );

  const handleRecipePress = (recipeId, recipeName) => {
    navigation.navigate('RecipeDetail', { recipeId, recipeName });
  };

  if (loading && !refreshing) {
    return <ActivityIndicator size="large" color="#007bff" style={styles.loader} />;
  }

  if (!libraryRecipes || libraryRecipes.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Your Library is empty.</Text>
        <Text style={styles.emptySubText}>Save recipes to see them here!</Text>
        <TouchableOpacity style={styles.browseButton} onPress={() => navigation.navigate('Search')}>
            <Text style={styles.browseButtonText}>Find Recipes</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={libraryRecipes}
      renderItem={({ item }) => (
        <RecipeCard
          recipe={item}
          onPress={() => handleRecipePress(item.id, item.name)}
        />
      )}
      keyExtractor={item => item.id.toString()}
      style={styles.container}
      contentContainerStyle={styles.listContentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#007bff"]} />
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 20,
  },
  browseButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  browseButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContentContainer: {
    padding: 10,
  },
});

export default LibraryScreen;

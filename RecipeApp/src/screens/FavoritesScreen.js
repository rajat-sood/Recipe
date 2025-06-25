import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getFavorites } from '../utils/FavoritesStorage'; // Use FavoritesStorage
import { RecipeCard } from '../components';

const FavoritesScreen = () => {
  const navigation = useNavigation();
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFavorites = useCallback(async () => {
    setLoading(true);
    try {
      const recipes = await getFavorites(); // Fetch from favorites
      setFavoriteRecipes(recipes);
    } catch (error) {
      console.error("Failed to fetch favorite recipes:", error);
    }
    setLoading(false);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchFavorites();
    setRefreshing(false);
  }, [fetchFavorites]);

  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
      return () => {};
    }, [fetchFavorites])
  );

  const handleRecipePress = (recipeId, recipeName) => {
    navigation.navigate('RecipeDetail', { recipeId, recipeName });
  };

  if (loading && !refreshing) {
    return <ActivityIndicator size="large" color="#007bff" style={styles.loader} />;
  }

  if (!favoriteRecipes || favoriteRecipes.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>You have no favorite recipes yet.</Text>
        <Text style={styles.emptySubText}>Mark recipes as favorite to see them here!</Text>
        <TouchableOpacity style={styles.browseButton} onPress={() => navigation.navigate('Search')}>
            <Text style={styles.browseButtonText}>Find Recipes</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={favoriteRecipes}
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

export default FavoritesScreen;

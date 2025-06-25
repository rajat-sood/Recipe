import React, { useState, useCallback } from 'react';
import { View, TextInput, StyleSheet, SafeAreaView, Platform, Text, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { searchRecipesByIngredient } from '../services/RecipeService';
import { RecipeCard } from '../components';
import _debounce from 'lodash/debounce';

const SearchScreen = () => {
  const navigation = useNavigation(); // Get navigation object
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRecipePress = (recipeId, recipeName) => {
    navigation.navigate('RecipeDetail', { recipeId, recipeName });
  };

  const debouncedSearch = useCallback(
    _debounce(async (term) => {
      if (term.length > 2) {
        setLoading(true);
        setError(null);
        setRecipes([]);
        try {
          const results = await searchRecipesByIngredient(term);
          setRecipes(results);
        } catch (e) {
          setError('Failed to fetch recipes.');
        }
        setLoading(false);
      } else {
        setRecipes([]);
      }
    }, 500),
    [navigation] // Add navigation to dependency array if used inside, though not directly here
  );

  const handleSearchChange = (text) => {
    setSearchTerm(text);
    debouncedSearch(text);
  };

  const renderRecipe = ({ item }) => (
    <RecipeCard
      recipe={item}
      onPress={() => handleRecipePress(item.id, item.name)} // Pass id and name
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TextInput
          style={styles.searchBar}
          placeholder="Enter ingredient (e.g., chicken)"
          value={searchTerm}
          onChangeText={handleSearchChange}
          clearButtonMode="while-editing"
        />
        {loading && <ActivityIndicator size="large" color="#007bff" style={styles.loader} />}
        {error && <Text style={styles.errorText}>{error}</Text>}
        {!loading && !error && searchTerm.length > 2 && recipes.length === 0 && (
          <Text style={styles.infoText}>No recipes found for "{searchTerm}". Try another ingredient.</Text>
        )}
        <FlatList
          data={recipes}
          renderItem={renderRecipe}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContentContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 25 : 10,
    paddingHorizontal: 10,
  },
  searchBar: {
    height: 50,
    borderColor: '#dee2e6',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    backgroundColor: '#ffffff',
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  loader: {
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  infoText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#6c757d',
  },
  listContentContainer: {
    paddingVertical: 10, // Changed from paddingBottom to paddingVertical
  },
});

export default SearchScreen;

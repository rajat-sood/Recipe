import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const RecipeCard = ({ recipe, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(recipe.id, recipe.name)} // Ensure name is passed if needed by handler
      testID={`recipe-card-touchable-${recipe.id}`} // Added testID for touchable
    >
      <Image
        source={{ uri: recipe.imageUrl }}
        style={styles.image}
        testID={`recipe-card-image-${recipe.id}`} // Added testID for image
      />
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">
          {recipe.name}
        </Text>
        {/* Basic info like category could be added here if available in 'recipe' object from search */}
        {/* e.g., {recipe.category && <Text style={styles.category}>{recipe.category}</Text>} */}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    overflow: 'hidden', // Ensures image corners are rounded if image is not
    marginVertical: 8, // Replaced marginBottom with marginVertical for consistent spacing
    marginHorizontal: 10, // Added horizontal margin
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, // Softer shadow
    shadowOpacity: 0.20, // Slightly more visible shadow
    shadowRadius: 1.41,
    flexDirection: 'row',
    alignItems: 'center', // Vertically align items in the center
  },
  image: {
    width: 80, // Slightly smaller image
    height: 80,
    borderRadius: 8, // Rounded corners for the image itself
    margin: 10, // Margin around the image
  },
  infoContainer: {
    paddingVertical: 10,
    paddingLeft: 0, // Image has its own margin now
    paddingRight: 10, // Padding on the right of text
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333', // Darker text for better readability
    marginBottom: 4, // Space if category/other info is added below
  },
  // Example style for category if you add it:
  // category: {
  //   fontSize: 12,
  //   color: '#666666',
  // },
});

export default RecipeCard;

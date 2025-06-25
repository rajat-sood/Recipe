import React from 'react';
// View and Text for placeholder are no longer needed
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SearchScreen, LibraryScreen, FavoritesScreen } from '../screens'; // Added FavoritesScreen
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

// FavoritesScreenPlaceholder is no longer needed

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Library') {
            iconName = focused ? 'library' : 'library-outline';
          } else if (route.name === 'Favorites') {
            iconName = focused ? 'heart' : 'heart-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{ title: 'Search' }}
      />
      <Tab.Screen
        name="Library"
        component={LibraryScreen}
        options={{ title: 'My Library' }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen} // Use actual FavoritesScreen
        options={{ title: 'Favorites' }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;

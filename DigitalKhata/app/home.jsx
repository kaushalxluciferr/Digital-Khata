import { Image, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import React from 'react';

const Home = () => {

  
  return (
    <View style={styles.container}>
      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.text}>This is scrollable content</Text>
        {/* Add more content here */}
      </ScrollView>

      {/* Floating Plus Button */}
      <TouchableOpacity style={styles.floatingButton}>
        <Image 
          source={require('../pictures/plus.png')} 
          style={styles.plusIcon} 
        />
      </TouchableOpacity>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100, // Extra space so scroll doesn’t hide button
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
  floatingButton: {
    position: 'absolute',
    right: 20,   // distance from left
    bottom: 20, // distance from bottom
    backgroundColor: '#fff',
    borderRadius: 60,
    elevation: 5, // shadow for Android
    shadowColor: '#000', // shadow for iOS
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    padding: 10,
  },
  plusIcon: {
    height: 60,
    width: 60,
  },
});

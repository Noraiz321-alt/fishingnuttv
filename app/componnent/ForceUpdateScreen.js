import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ImageBackground } from 'react-native';
import image from '../Utilis/image';

const ForceUpdateScreen = ({ storeLink, message }) => {
  const handleUpdate = () => {
    Linking.openURL(storeLink);
  };

  return (
    <ImageBackground 
      source={image.sh} 
      style={styles.background} 
      resizeMode="cover"
      blurRadius={5} // 👈 This adds the blur
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Update Required</Text>
        <Text style={styles.message}>
          {message || 'A new version is available. Please update to continue.'}
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Update Now</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default ForceUpdateScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
    width: '85%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  button: {
    backgroundColor: '#1b6001',
    padding: 15,
    borderRadius: 8,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

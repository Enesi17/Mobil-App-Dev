import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { db } from '../firebase'; // Import the Realtime Database instance
import { ref, get, set } from 'firebase/database';
import * as DocumentPicker from 'expo-document-picker';

const AddResultGuide = ({ goToScreen }) => {
  const [uploadedFileData, setUploadedFileData] = useState(null);

  const selectFile = async () => {
    try {
      const file = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: false,
      });

      if (file.type === 'success') {
        const response = await fetch(file.uri);
        const json = await response.json();
        setUploadedFileData(json);
        Alert.alert('File Selected', `File name: ${file.name}`);
      } else {
        Alert.alert('File Selection Cancelled');
      }
    } catch (error) {
      console.error('Error selecting file:', error);
      Alert.alert('Error', 'Failed to select a file.');
    }
  };

  const saveGuide = async () => {
    try {
      if (!uploadedFileData) {
        Alert.alert('Error', 'No file uploaded.');
        return;
      }
  
      // Specify the path dynamically
      const guidePath = '/';
      const dataRef = ref(db, guidePath);
  
      // Fetch existing keys
      const snapshot = await get(dataRef);
      const data = snapshot.val();
      const keys = Object.keys(data || {});
      const newKey = `kl${keys.length + 1}`; // Determine the next key (e.g., kl4)
  
      // Save the new guide under the new key
      const newGuideRef = ref(db, `${guidePath}/${newKey}`);
      await set(newGuideRef, {
        ...uploadedFileData, // This should already have the nested structure like IgA -> geoMean, etc.
      });
  
      Alert.alert('Success', `Result Guide added successfully as ${newKey}!`);
      goToScreen('AdminDashboard'); 
    } catch (error) {
      console.error('Error saving guide:', error);
      Alert.alert('Error', 'Failed to add the result guide.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Result Guide</Text>
      <TouchableOpacity style={styles.fileButton} onPress={selectFile}>
        <Text style={styles.buttonText}>Select File</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={saveGuide}>
        <Text style={styles.buttonText}>Save Guide</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => goToScreen('AdminDashboard')}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  fileButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddResultGuide;

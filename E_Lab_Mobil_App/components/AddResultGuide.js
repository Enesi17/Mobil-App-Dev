import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { db } from '../firebase'; // Import the Realtime Database instance
import { ref, get, set } from 'firebase/database';

const AddResultGuide = ({ goToScreen }) => {
  const [uploadedFileData, setUploadedFileData] = useState(null);

  const handleFileUpload = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) {
        Alert.alert('Error', 'No file selected.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result);
          setUploadedFileData(json);
          Alert.alert('Success', 'File uploaded and parsed successfully!');
        } catch (error) {
          console.error('Error parsing JSON:', error);
          Alert.alert('Error', 'Invalid JSON file.');
        }
      };
      reader.readAsText(file);
    } catch (error) {
      console.error('Error uploading file:', error);
      Alert.alert('Error', 'Failed to upload file.');
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
      <input
        type="file"
        accept="application/json"
        style={styles.fileInput}
        onChange={handleFileUpload}
      />
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
    flex: 1,
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  fileInput: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default AddResultGuide;

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
//import * as DocumentPicker from 'expo-document-picker';
import { firestore } from '../firebase';

const AddResultGuide = ({ goToScreen }) => {
  const [parameter, setParameter] = useState('');
  const [priority, setPriority] = useState('');
  const [ageGroups, setAgeGroups] = useState('');
  const navigation = useNavigation();

  const uploadFile = async () => {
    //const file = await DocumentPicker.getDocumentAsync();
    if (file.type === 'success') {
      console.log(`File uploaded: ${file.uri}`);
      // Process the uploaded file here
    }
  };

  const saveGuide = async () => {
    try {
      await firestore.collection('resultGuides').add({
        parameter,
        priority: parseInt(priority, 10),
        ageGroups: JSON.parse(ageGroups), // Example format for age groups
        createdAt: new Date(),
      });
      alert('Result Guide added successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error saving guide:', error);
      alert('Error adding guide');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Result Guide</Text>
      <TextInput
        style={styles.input}
        placeholder="Parameter (e.g., IgA)"
        value={parameter}
        onChangeText={setParameter}
      />
      <TextInput
        style={styles.input}
        placeholder="Priority (1-5)"
        value={priority}
        keyboardType="numeric"
        onChangeText={setPriority}
      />
      <TextInput
        style={[styles.input, styles.multiline]}
        placeholder='Age Groups (e.g., [{"minAge": 0, "maxAge": 12, "ranges": {...}}])'
        value={ageGroups}
        multiline
        onChangeText={setAgeGroups}
      />
      <TouchableOpacity style={styles.button} onPress={uploadFile}>
        <Text style={styles.buttonText}>Upload File</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={saveGuide}>
        <Text style={styles.buttonText}>Save Guide</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => goToScreen('Dashboard')}>
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
  input: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  multiline: {
    height: 100,
    textAlignVertical: 'top',
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

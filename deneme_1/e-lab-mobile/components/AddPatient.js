import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { auth, firestore } from '../firebase';

const AddPatient = ({ goToScreen }) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const DEFAULT_PASSWORD = "patient"; // Set the default password

  const savePatient = async () => {
    if (!email || !name || !surname || !dob) {
      alert('All fields are required!');
      return;
    }

    setLoading(true);

    try {
      // Check if the email already exists in Firebase Authentication
      const existingUser = await auth.fetchSignInMethodsForEmail(email);
      if (existingUser.length > 0) {
        alert('A user with this email already exists.');
        setLoading(false);
        return;
      }

      // Create a new user in Firebase Authentication with the default password
      const userCredential = await auth.createUserWithEmailAndPassword(email, DEFAULT_PASSWORD);
      const userId = userCredential.user.uid;

      // Add the patient details to the Firestore `users` collection
      await firestore.collection('users').doc(userId).set({
        name,
        surname,
        dob,
        email,
        role: 'patient', // Explicitly set the role
        createdAt: new Date(),
      });

      alert('Patient added successfully!');
      setName('');
      setSurname('');
      setDob('');
      setEmail('');
    } catch (error) {
      console.error('Error adding patient:', error);
      alert('Error adding patient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Patient</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Surname"
        value={surname}
        onChangeText={setSurname}
      />
      <TextInput
        style={styles.input}
        placeholder="Date of Birth (YYYY-MM-DD)"
        value={dob}
        onChangeText={setDob}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TouchableOpacity
        style={[styles.button, loading && styles.disabledButton]}
        onPress={savePatient}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Saving...' : 'Save Patient'}
        </Text>
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
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#b0c4de',
  },
});

export default AddPatient;

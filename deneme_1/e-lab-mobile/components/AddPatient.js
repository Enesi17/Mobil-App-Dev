import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firestore = getFirestore();

const AddPatient = ({ goToScreen }) => {
  const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
  
    const isValidDate = (date) => /^\d{4}-\d{2}-\d{2}$/.test(date);
  
    const handleSignup = async () => {
      if (!username || !dateOfBirth || !email || !password) {
        Alert.alert('Registration Failed', 'All fields are required.');
        return;
      }
    
      if (!isValidDate(dateOfBirth)) {
        Alert.alert('Signup Failed', 'Date of Birth must be in YYYY-MM-DD format.');
        return;
      }
    
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
    
        // Use Firebase Auth UID as the document ID
        await setDoc(doc(firestore, `users/${user.uid}`), {
          email: user.email,
          username: username,
          password: password,
          date_of_birth: dateOfBirth,
        });
    
        Alert.alert('Registration Successful');
        goToScreen('AdminDashboard');
      } catch (error) {
        console.error('Registration Error:', error.message);
        Alert.alert('Registration Failed', error.message);
      }
    };
    
    
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Register Patient Manually</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={(text) => setUsername(text)}
          autoCapitalize="none"
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Date of Birth (YYYY-MM-DD)"
          value={dateOfBirth}
          onChangeText={(text) => setDateOfBirth(text)}
          keyboardType="default"
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => goToScreen('Login')}>
          <Text style={styles.linkText}>Already have an account? Log in</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: '#f2f2f2',
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 20,
    },
    input: {
      width: '100%',
      height: 50,
      backgroundColor: '#fff',
      paddingHorizontal: 15,
      borderRadius: 8,
      marginBottom: 20,
      borderColor: '#ccc',
      borderWidth: 1,
      fontSize: 16,
      color: '#333',
    },
    button: {
      width: '80%',
      height: 50,
      backgroundColor: '#4CAF50',
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 5,
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    linkText: {
      color: '#007AFF',
      fontSize: 16,
      marginTop: 20,
      textDecorationLine: 'underline',
    },
  });

export default AddPatient;

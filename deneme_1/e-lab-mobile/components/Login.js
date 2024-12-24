import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import { auth } from '../firebase.js';
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login = ({ goToScreen }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Login Failed', 'Please enter both email and password.');
      return;
    }
  
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        Alert.alert('Login Successful', `Welcome ${user.email}!`);
        if (user.email.includes("admin")) {
          goToScreen("AdminDashboard");
        } else {
          goToScreen("UserDashboard");
        }
        
        
      })
      .catch((error) => {
        let errorMessage = 'An error occurred. Please try again.';
        if (error.code === 'auth/invalid-email') {
          errorMessage = 'Invalid email format.';
          setError(true);
        } else if (error.code === 'auth/user-not-found') {
          errorMessage = 'No account found with this email.';
          setError(true);
        } else if (error.code === 'auth/wrong-password') {
          errorMessage = 'Incorrect password. Please try again.';
          setError(true);
        }
        Alert.alert('Login Failed', errorMessage);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>
      {error && <Text style={styles.error}>A problem appeared</Text>}
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
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => goToScreen("Signup")}>
        <Text style={styles.linkText}>Don’t have an account? Register</Text>
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
  error:{
    color: '#f00'
  }
});

export default Login;

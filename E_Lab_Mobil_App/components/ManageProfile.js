import React, { useState, useEffect } from 'react';
import { auth, firestore } from '../firebase';
import { doc, collection, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

const ManageProfile = ({goToScreen}) => {
  const [userData, setUserData] = useState(null);
  const [username, setUsername] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert('No logged-in user found.');
        return;
      }
  
      // Parse the username from the email if displayName is not available
      const username = user.displayName || user.email.split('@')[0];
      console.log('Fetching results for username:', username);
  
      // Query Firestore for the user document with a matching username
      const userQuery = query(collection(firestore, 'users'), where('username', '==', username));
      const userSnapshot = await getDocs(userQuery);
  
      if (userSnapshot.empty) {
        alert('User profile not found for username.');
        console.log('No user profile found for username:', username);
        return;
      }
  
      // Assuming the username is unique, fetch the first document in the query result
      const userData = userSnapshot.docs[0].data();
      console.log('Fetched user data:', userData);
  
      setUserData(userData);
      setUsername(userData.username || '');
      setDateOfBirth(userData.date_of_birth || '');
    } catch (error) {
      console.error('Error fetching user data:', error.message);
      alert('Error fetching user data.');
    }
  };
  

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      const user = auth.currentUser;
  
      if (!user) {
        alert('No logged-in user found.');
        return;
      }
  
      // Derive the username from the email if necessary
      const oldUsername = userData.username || user.email.split('@')[0];
  
      if (username !== oldUsername) {
        setWarningMessage(
          'Changing your username will cause previous results to not appear in your result list.'
        );
      } else {
        setWarningMessage('');
      }
  
      // Query Firestore to find the user document by username
      const userQuery = query(collection(firestore, 'users'), where('username', '==', oldUsername));
      const userSnapshot = await getDocs(userQuery);
  
      if (userSnapshot.empty) {
        alert('User profile not found for the current username.');
        console.log('No user profile found for the current username:', oldUsername);
        return;
      }
  
      const userDocRef = userSnapshot.docs[0].ref; // Reference to the document
  
      // Update Firestore with the new username and date of birth
      await updateDoc(userDocRef, {
        username,
        date_of_birth: dateOfBirth,
      });
  
      alert('Profile updated successfully.');
  
      // Update the userData state to reflect changes
      setUserData((prevState) => ({
        ...prevState,
        username,
        date_of_birth: dateOfBirth,
      }));
    } catch (error) {
      console.error('Error saving changes:', error.message);
      alert('Error saving changes.');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleResetPassword = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert('No logged-in user found.');
        return;
      }

      await sendPasswordResetEmail(auth, user.email);
      alert('Password reset email sent.');
    } catch (error) {
      console.error('Error resetting password:', error.message);
      alert('Error resetting password.');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.frame}>
        <Text style={styles.title}>Manage Profile</Text>
        {userData ? (
          <>
            <View style={styles.field}>
              <Text style={styles.label}>Date of Birth:</Text>
              <TextInput
                value={dateOfBirth}
                onChangeText={setDateOfBirth}
                style={styles.input}
                placeholder="YYYY-MM-DD"
              />
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveChanges}
                disabled={isSaving}
              >
                <Text style={styles.buttonText}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.resetButton}
                onPress={() => goToScreen('UserDashboard')}
              >
                <Text style={styles.buttonText}>Back</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <ActivityIndicator style={styles.loading} size="large" color="#4CAF50" />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    marginTop: 50,
  },
  frame: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 50,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10,
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loading: {
    marginTop: 20,
  },
});


export default ManageProfile;

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { auth, firestore, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from '../firebase';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';

const ResetPasswordForm = ({ onClose }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert('New password and confirmation do not match!');
      return;
    }
  
    try {
      const user = auth.currentUser;
  
      if (user) {
        // Reauthenticate the user
        const credential = EmailAuthProvider.credential(user.email, oldPassword);
        await reauthenticateWithCredential(user, credential);
  
        // Update password in Firebase Authentication
        await updatePassword(user, newPassword);
  
        // Query Firestore to find the user's document by email
        const q = query(collection(firestore, 'users'), where('email', '==', user.email));
        const querySnapshot = await getDocs(q);
  
        if (!querySnapshot.empty) {
          // Loop through the results (though there should be only one in most cases)
          const docSnapshots = querySnapshot.docs;
          if (docSnapshots.length === 1) {
            const userDocRef = docSnapshots[0].ref; // Reference to the matched document
            await updateDoc(userDocRef, {
              password: newPassword, // Ideally, this should be a hashed password
            });
            alert('Password updated successfully in both Authentication and Firestore!');
          } else {
            console.error('Multiple documents found for the same email. Ensure email uniqueness.');
            alert('Failed to update password due to multiple matching records.');
          }
        } else {
          alert('User document not found in Firestore!');
        }
      } else {
        alert('No logged-in user found!');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Failed to update password. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Old Password"
        secureTextEntry
        value={oldPassword}
        onChangeText={setOldPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Update Password</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 50,
    backgroundColor: '#f9f9f9',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: '#FF0000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ResetPasswordForm;

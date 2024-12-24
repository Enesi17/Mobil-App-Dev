import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { auth, firestore, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from '../firebase';
import Logout from './Logout';
import ResetPasswordForm from './ResetPasswordForm';

const DashboardUser = ({ goToScreen }) => {
  const [search, setSearch] = useState('');
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const user = auth.currentUser;

        if (user) {
          const username = user.displayName || user.email.split('@')[0];
          console.log('Fetching results for username:', username);

          const q = query(collection(firestore, 'results'), where('username', '==', username));

          const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
              const fetchedResults = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
              setTestResults(fetchedResults);
              setLoading(false);
            },
            (error) => {
              console.error('Error fetching results:', error);
              setLoading(false);
            }
          );

          return () => unsubscribe();
        } else {
          console.error('No user is logged in!');
          setLoading(false);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const filteredResults = testResults.filter(
    (item) =>
      item.value_checked.toLowerCase().includes(search.toLowerCase()) ||
      item.result.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }) => {
    const arrow =
      item.result === 'High' ? '↑' :
      item.result === 'Low' ? '↓' : '↔';
    const arrowColor =
      item.result === 'High' ? '#FF0000' :
      item.result === 'Low' ? '#ADD8E6' : 
      '#0000FF';
  
    return (
      <View style={[styles.resultItem, styles[item.result.toLowerCase()]]}>
        <View style={styles.resultContent}>
          <Text style={styles.resultText}>
            {item.value_checked} - {item.result}
          </Text>
          <Text style={{ fontSize: 50, color: arrowColor }}>{arrow}</Text>
        </View>
        <Text style={styles.resultDate}>{item.date || 'No Date'}</Text>
      </View>
    );
  };

  // Reset password via email
  const resetPassword = async () => {
    const user = auth.currentUser;
    if (user && user.email) {
      try {
        await auth.sendPasswordResetEmail(user.email);
        alert('Password reset email sent successfully!');
      } catch (error) {
        console.error('Error sending password reset email:', error);
        alert('Failed to send password reset email. You can manually change your password.');
        setShowChangePasswordForm(true);
      }
    } else {
      alert('No logged-in user found!');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!auth.currentUser) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Please log in to access your dashboard.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Dashboard</Text>
      <TextInput
        style={styles.input}
        placeholder="Search Test or Result"
        value={search}
        onChangeText={(text) => setSearch(text)}
      />
      {filteredResults.length === 0 ? (
        <Text>No results found.</Text>
      ) : (
        <FlatList
          data={filteredResults}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.resultList}
        />
      )}
      {!showChangePasswordForm ? (
        <>
          <TouchableOpacity style={styles.button} onPress={() => goToScreen('Home')}>
            <Text style={styles.buttonText}>Manage Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={resetPassword}>
            <Text style={styles.buttonText}>Reset Password</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View>
          <ResetPasswordForm />
          <TouchableOpacity style={styles.cancelButton} onPress={() => setShowChangePasswordForm(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
      <Logout goToScreen={goToScreen} />
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  resultList: {
    marginBottom: 20,
  },
  resultItem: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  resultContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  resultDate: {
    fontSize: 14,
    color: '#666',
  },
  low: {
    backgroundColor: '#ffcccc',
  },
  normal: {
    backgroundColor: '#ccffcc',
  },
  high: {
    backgroundColor: '#ffb3b3',
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
    marginRight: 50,
    marginLeft: 50,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  form: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default DashboardUser;

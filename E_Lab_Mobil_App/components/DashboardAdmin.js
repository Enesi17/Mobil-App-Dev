import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { firestore } from '../firebase';
import Logout from './Logout';

const DashboardAdmin = ({ goToScreen }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // Fetch all results from the 'results' collection, ordered by date (latest first)
        const resultsQuery = query(collection(firestore, 'results'), orderBy('date', 'desc'));
        const resultsSnapshot = await getDocs(resultsQuery);

        const fetchedResults = resultsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setResults(fetchedResults);
      } catch (error) {
        console.error('Error fetching results from Firestore:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const renderItem = ({ item }) => {
    const arrow =
      item.result === 'High' ? '↑' :
      item.result === 'Low' ? '↓' : '↔';
    const arrowColor =
      item.result === 'High' ? '#FF0000' :
      item.result === 'Low' ? '#00FF00' : '#0000FF';

    return (
      <View style={[styles.resultItem, styles[item.result?.toLowerCase()]]}>
        <View style={styles.resultContent}>
          <Text style={styles.resultText}>
            {item.username || 'Unknown User'} - {item.value_checked || 'N/A'} - {item.result}
          </Text>
          <Text style={{ fontSize: 50, color: arrowColor }}>{arrow}</Text>
        </View>
        <Text style={styles.resultDate}>{item.date || 'No Date'}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <FlatList
        data={results}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.resultList}
      />
      <TouchableOpacity style={styles.button} onPress={() => goToScreen('AddResultGuide')}>
        <Text style={styles.buttonText}>Add Result Guide</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => goToScreen('AddPatient')}>
        <Text style={styles.buttonText}>Add Patient</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => goToScreen('AddResult')}>
        <Text style={styles.buttonText}>Add Result</Text>
      </TouchableOpacity>
      <Logout goToScreen={goToScreen} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f2f2f2',
    marginTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
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
    backgroundColor: '#007AFF',
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

export default DashboardAdmin;

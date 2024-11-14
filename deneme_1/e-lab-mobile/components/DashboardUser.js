import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Logout from './Logout';

const DashboardUser = ({ goToScreen }) => {
  const testResults = [
    { id: '1', test: 'IgA', result: 'Normal', date: '2024-10-01' },
    { id: '2', test: 'IgM', result: 'High', date: '2024-10-15' },
    { id: '3', test: 'IgG', result: 'Low', date: '2024-11-01' },
  ];

  const renderItem = ({ item }) => (
    <View style={[styles.resultItem, styles[item.result.toLowerCase()]]}>
      <Text style={styles.resultText}>{item.test} - {item.result}</Text>
      <Text style={styles.resultDate}>{item.date}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Dashboard</Text>
      <FlatList
        data={testResults}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.resultList}
      />
      <TouchableOpacity style={styles.button} onPress={() => goToScreen('Home')}>
        <Text style={styles.buttonText}>Manage Profile</Text>
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
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
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
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DashboardUser;

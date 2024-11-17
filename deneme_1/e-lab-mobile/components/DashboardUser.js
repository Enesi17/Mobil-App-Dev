import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Logout from './Logout';

const DashboardUser = ({ goToScreen }) => {
  const [search, setSearch] = useState('');
  const testResults = [
    { id: '1', test: 'IgA', result: 'Normal', date: '2024-10-01' },
    { id: '2', test: 'IgM', result: 'High', date: '2024-10-15' },
    { id: '3', test: 'IgG', result: 'Low', date: '2024-11-01' },
    { id: '4', test: 'IgA', result: 'Normal', date: '2024-02-01' },
    { id: '5', test: 'IgM', result: 'Low', date: '2024-10-15' },
    { id: '6', test: 'IgG', result: 'Low', date: '2023-12-01' },
    { id: '7', test: 'IgA', result: 'High', date: '2023-10-01' },
    { id: '8', test: 'IgM', result: 'High', date: '2023-10-15' },
    { id: '9', test: 'IgG', result: 'High', date: '2023-11-01' },
  ];

  const filteredResults = testResults.filter(
    (item) =>
      item.test.toLowerCase().includes(search.toLowerCase()) ||
      item.date.includes(search)
  );

  const renderItem = ({ item }) => {
    const arrow =
      item.result === 'High' ? '↑' :
      item.result === 'Low' ? '↓' : '↔';
    const arrowColor =
      item.result === 'High' ? '#FF0000' :
      item.result === 'Low' ? '#00FF00' : '#0000FF';

    return (
      <View style={[styles.resultItem, styles[item.result.toLowerCase()]]}>
        <View style={styles.resultContent}>
          <Text style={styles.resultText}>{item.test} - {item.result}</Text>
          <Text style={{ fontSize: 50, color: arrowColor }}>{arrow}</Text>
        </View>
        <Text style={styles.resultDate}>{item.date}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Dashboard</Text>
      <TextInput
        style={styles.input}
        placeholder="Search Test or Date"
        value={search}
        onChangeText={(text) => setSearch(text)}
      />
      <FlatList
        data={filteredResults}
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
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DashboardUser;

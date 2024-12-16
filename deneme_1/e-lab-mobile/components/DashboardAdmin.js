import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Logout from './Logout';

const DashboardAdmin = ({ goToScreen }) => {
  const [search, setSearch] = useState('');

  const patients = [
    { id: '1', name: 'John Doe', age: 35, recentTest: 'Normal' },
    { id: '2', name: 'Jane Smith', age: 28, recentTest: 'High' },
    { id: '3', name: 'Emily Davis', age: 42, recentTest: 'Low' },
  ];

  const filteredPatients = patients.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.age.toString().includes(search)
  );

  const renderItem = ({ item }) => {
    const arrow =
      item.recentTest === 'High' ? '↑' :
      item.recentTest === 'Low' ? '↓' : '↔';
    const arrowColor =
      item.recentTest === 'High' ? '#FF0000' :
      item.recentTest === 'Low' ? '#00FF00' : '#0000FF';

    return (
      <View style={[styles.patientItem, styles[item.recentTest.toLowerCase()]]}>
        <View style={styles.patientContent}>
          <Text style={styles.patientText}>
            {item.name} (Age: {item.age}) - {item.recentTest}
          </Text>
          <Text style={{ fontSize: 50, color: arrowColor }}>{arrow}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <TextInput
        style={styles.input}
        placeholder="Search by Patient Name or Age"
        value={search}
        onChangeText={(text) => setSearch(text)}
      />
      <FlatList
        data={filteredPatients}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.patientList}
      />
      {/* Add buttons for the new functionalities */}
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
  patientList: {
    marginBottom: 20,
  },
  patientItem: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  patientContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  patientText: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
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
    marginBottom: 10, // Space between buttons
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DashboardAdmin;

import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Logout from './Logout';

const DashboardAdmin = ({ goToScreen }) => {
  const [search, setSearch] = useState('');

  const patients = [
    
    { id: '1', name: 'John Doe', recentTest: 'Normal' },
    { id: '2', name: 'Jane Smith', recentTest: 'High' },
  ];

  const renderItem = ({ item }) => (
    <View style={[styles.patientItem, styles[item.recentTest.toLowerCase()]]}>
      <Text style={styles.patientText}>{item.name} - {item.recentTest}</Text>
    </View>
  );

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
        data={patients}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.patientList}
      />
      <TouchableOpacity style={styles.button} onPress={() => goToScreen('GuideCreation')}>
        <Text style={styles.buttonText}>Create New Guide</Text>
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
  patientText: {
    fontSize: 18,
    fontWeight: 'bold',
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
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DashboardAdmin;

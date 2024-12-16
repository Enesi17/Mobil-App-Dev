import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { firestore } from '../firebase';

const AddResult = ({ goToScreen }) => {
  const [patientName, setPatientName] = useState('');
  const [dob, setDob] = useState('');
  const [parameter, setParameter] = useState('');
  const [value, setValue] = useState('');

  // Function to fetch and evaluate the result based on result guides
  const evaluateResult = async (parameter, value) => {
    try {
      // Fetch all result guides for the given parameter
      const guidesSnapshot = await firestore
        .collection('resultGuides')
        .where('parameter', '==', parameter)
        .get();

      if (guidesSnapshot.empty) {
        console.error('No result guides found for parameter:', parameter);
        return 'No guides available';
      }

      const guides = [];
      guidesSnapshot.forEach((doc) => guides.push(doc.data()));

      // Initialize counters for the decision
      const resultCounts = { low: 0, normal: 0, high: 0 };

      // Iterate through guides and compare the value
      guides.forEach((guide) => {
        const { ageGroups, priority } = guide;

        // Find the matching age group based on dob (age in months calculation)
        const dobDate = new Date(dob);
        const ageInMonths = Math.floor((Date.now() - dobDate) / (1000 * 60 * 60 * 24 * 30.44)); // Approx. months
        const matchingAgeGroup = ageGroups.find(
          (group) => ageInMonths >= group.minAge && ageInMonths <= group.maxAge
        );

        if (matchingAgeGroup) {
          const { ranges } = matchingAgeGroup;
          if (value <= ranges.low) {
            resultCounts.low += priority || 1; // Use priority for weighted decisions
          } else if (value >= ranges.high) {
            resultCounts.high += priority || 1;
          } else if (value >= ranges.normal[0] && value <= ranges.normal[1]) {
            resultCounts.normal += priority || 1;
          }
        }
      });

      // Determine the majority decision
      const result = Object.entries(resultCounts).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
      return result;
    } catch (error) {
      console.error('Error evaluating result:', error);
      return 'Error in evaluation';
    }
  };

  // Save result to Firestore with evaluation
  const saveResult = async () => {
    const evaluatedResult = await evaluateResult(parameter, parseFloat(value));
    if (evaluatedResult === 'Error in evaluation' || evaluatedResult === 'No guides available') {
      alert(evaluatedResult);
      return;
    }

    try {
      await firestore.collection('tests').add({
        patientName,
        dob,
        parameter,
        value: parseFloat(value),
        result: evaluatedResult, // Save the evaluated result
        status: 'pending',
        createdAt: new Date(),
      });
      alert('Result added successfully!');
    } catch (error) {
      console.error('Error saving result:', error);
      alert('Error adding result');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Result</Text>
      <TextInput
        style={styles.input}
        placeholder="Patient Name"
        value={patientName}
        onChangeText={setPatientName}
      />
      <TextInput
        style={styles.input}
        placeholder="Date of Birth (YYYY-MM-DD)"
        value={dob}
        onChangeText={setDob}
      />
      <TextInput
        style={styles.input}
        placeholder="Parameter (e.g., IgA)"
        value={parameter}
        onChangeText={setParameter}
      />
      <TextInput
        style={styles.input}
        placeholder="Value"
        value={value}
        keyboardType="numeric"
        onChangeText={setValue}
      />
      <TouchableOpacity style={styles.button} onPress={saveResult}>
        <Text style={styles.buttonText}>Save Result</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => goToScreen('Dashboard')}>
              <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default AddResult;

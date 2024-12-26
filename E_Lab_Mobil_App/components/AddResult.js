import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { firestore, db } from '../firebase';
import { getDocs, query, collection, where, addDoc } from 'firebase/firestore';
import { ref, get } from "firebase/database";

const AddResult = ({goToScreen}) => {
  const [email, setEmail] = useState('');
  const [selectedParameter, setSelectedParameter] = useState('');
  const [value, setValue] = useState('');
  const [result, setResult] = useState('');
  const [doctorDecision, setDoctorDecision] = useState('');


  const checkPatientResult = async () => {
    try {
      console.log("Starting patient result check...");
  
      // Fetch all guides dynamically from the root of the Realtime Database
      const rootRef = ref(db, '/');
      const snapshot = await get(rootRef);
      const allData = snapshot.val();
  
      if (!allData) {
        alert("No result guides found in the database.");
        console.log("No guides found at root.");
        return;
      }
  
      const guides = Object.keys(allData); // Dynamically fetch the guides (e.g., ["kl1", "kl2", "kl3", ...])
      console.log("Fetched guides:", guides);
  
      // Static logic remains the same
      const userQuery = query(collection(firestore, "users"), where("email", "==", email));
      const userSnapshot = await getDocs(userQuery);
  
      if (userSnapshot.empty) {
        alert("No patient found with this email");
        console.log("No patient found for email:", email);
        return;
      }
  
      const userData = userSnapshot.docs[0].data();
      console.log("User Data:", userData);
  
      const dob = new Date(`${userData.date_of_birth}T00:00:00`);
      if (isNaN(dob.getTime())) {
        throw new Error("Invalid Date of Birth value.");
      }
  
      console.log("Parsed Date of Birth:", dob);
  
      const ageInDays = Math.floor((Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24));
      console.log("Age in Days:", ageInDays);
  
      const valueToCheck = parseFloat(value);
      const results = { Low: 0, Normal: 0, High: 0 };
  
      for (const guide of guides) {
        console.log("Checking guide:", guide);
  
        const dataRef = ref(db, `${guide}/${selectedParameter}`);
        const snapshot = await get(dataRef);
        const data = snapshot.val();
  
        if (!data) {
          console.log("No data found for path:", `${guide}/${selectedParameter}`);
          continue;
        }
  
        console.log("Fetched Data:", data);
  
        let matchedRange = null;
        let matchedMin = null;
        let matchedMax = null;
  
        for (const ageRange in data) {
          const [minAgeStr, maxAgeStr] = ageRange.split("_").map((range) => {
            const [value, unit] = range.split("-");
            return unit === "days" ? parseInt(value) : parseInt(value) * 30;
          });
  
          const minAge = minAgeStr;
          const maxAge = maxAgeStr;
  
          if (ageInDays >= minAge && ageInDays <= maxAge) {
            matchedRange = ageRange;
            matchedMin = data[ageRange].min;
            matchedMax = data[ageRange].max;
            break;
          }
        }
  
        if (!matchedRange) {
          const lastRangeKey = Object.keys(data).pop();
          const lastRange = data[lastRangeKey];
          matchedMin = lastRange.min;
          matchedMax = lastRange.max;
          matchedRange = lastRangeKey;
        }
  
        console.log(`Matched Range: ${matchedRange}, Min: ${matchedMin}, Max: ${matchedMax}`);
  
        if (valueToCheck < matchedMin) {
          results.Low += 1;
        } else if (valueToCheck > matchedMax) {
          results.High += 1;
        } else {
          results.Normal += 1;
        }
      }
  
      const totalVotes = Object.entries(results).map(([key, count]) => `${key}: ${count}`);
      setResult(`Checking results: ${totalVotes.join(", ")}. Please decide.`);
      alert(`Voting results: ${totalVotes.join(", ")}. Please decide if adjustments are needed.`);
    } catch (error) {
      console.error("Error fetching data:", error.message, error.stack);
      alert(`Error: ${error.message}`);
    }
  };
  
  const saveDoctorDecision = async () => {
    try {
      if (!doctorDecision) {
        alert('Please select a decision before saving.');
        return;
      }
  
      // Use modular SDK syntax for Firestore
      await addDoc(collection(firestore, 'results'), {
        username: email.split('@')[0],
        value_checked: selectedParameter,
        result: doctorDecision,
        date: new Date().toISOString().split('T')[0],
      });
  
      alert('Decision saved successfully!');
      setDoctorDecision('');
      goToScreen('AdminDashboard');
    } catch (error) {
      console.error('Error saving decision:', error);
      alert('Error saving the decision. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Evaluate Patient Result</Text>

      <TextInput
        style={styles.input}
        placeholder="Patient Email"
        value={email}
        onChangeText={setEmail}
      />

      <Picker
        selectedValue={selectedParameter}
        onValueChange={(itemValue) => setSelectedParameter(itemValue)}
        style={styles.input}
      >
        <Picker.Item label="Select Parameter" value="" />
        <Picker.Item label="IgA" value="IgA" />
        <Picker.Item label="IgM" value="IgM" />
        <Picker.Item label="IgG" value="IgG" />
        <Picker.Item label="IgG1" value="IgG1" />
        <Picker.Item label="IgG2" value="IgG2" />
        <Picker.Item label="IgG3" value="IgG3" />
        <Picker.Item label="IgG4" value="IgG4" />
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Value to Check"
        value={value}
        keyboardType="numeric"
        onChangeText={setValue}
      />

      <TouchableOpacity style={styles.button} onPress={checkPatientResult}>
        <Text style={styles.buttonText}>Evaluate</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => goToScreen('AdminDashboard')}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>

      {result !== '' && (
        <View style={styles.decisionContainer}>
          <Text style={styles.resultText}>{result}</Text>

          <Picker
            selectedValue={doctorDecision}
            onValueChange={(itemValue) => setDoctorDecision(itemValue)}
            style={styles.input}
          >
            <Picker.Item label="Select Final Decision" value="" />
            <Picker.Item label="Low" value="Low" />
            <Picker.Item label="Normal" value="Normal" />
            <Picker.Item label="High" value="High" />
          </Picker>

          <TouchableOpacity style={styles.button} onPress={saveDoctorDecision}>
            <Text style={styles.buttonText}>Save Decision</Text>
          </TouchableOpacity>
        </View>
      )}
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
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#007AFF',
  },
  decisionContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
});

export default AddResult;

import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { auth } from './firebase';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

// import all the components/screens 
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import DashboardUser from './components/DashboardUser';
import DashboardAdmin from './components/DashboardAdmin';
import AddResult from './components/AddResult';
import AddPatient from './components/AddPatient';
import AddResultGuide from './components/AddResultGuide';
import ManageProfile from './components/ManageProfile';

// Getting firestore from Firebase.js
const firestore = getFirestore();

const App = () => {

  // Initializing screen, default screen is "Home"
  const [currentScreen, setCurrentScreen] = useState("Home");
  const [loading, setLoading] = useState(true);

  // Funtion to navigate through screens
  const goToScreen = (screenName) => {
    setCurrentScreen(screenName);
  };

  // This useEffect will redirect to Login if authentication ends
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        const userEmail = user.email;
      } else {
        setCurrentScreen("Login");
      }
      setLoading(false);
    });
  
    return () => unsubscribe();
  }, []);
  
  // Loading icon while data or screens are loading... 
  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  // Switch to be able to navigate through screens
  let displayedScreen;
  switch (currentScreen) {
    case "Home":
      displayedScreen = <Home goToScreen={goToScreen} />;
      break;
    case "Login":
      displayedScreen = <Login goToScreen={goToScreen} />;
      break;
    case "Signup":
      displayedScreen = <Signup goToScreen={goToScreen} />;
      break;
    case "AdminDashboard":
      displayedScreen = <DashboardAdmin goToScreen={goToScreen} />;
      break;
    case "UserDashboard":
      displayedScreen = <DashboardUser goToScreen={goToScreen} />;
      break;
    case "AddPatient":
      displayedScreen = <AddPatient goToScreen={goToScreen} />;
      break;
    case "AddResultGuide":
      displayedScreen = <AddResultGuide goToScreen={goToScreen} />;
      break;
    case "AddResult":
      displayedScreen = <AddResult goToScreen={goToScreen} />;
      break;
    case "ManageProfile":
      displayedScreen = <ManageProfile goToScreen={goToScreen} />;
      break;
      //Deafult screen is set to Home
    default:
      displayedScreen = <Home goToScreen={goToScreen} />;
      break;
  }

  // Return will render the screen set
  return (
    <View style={styles.container}>
      {displayedScreen}
    </View>
  );
};

// Style of App.js
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;

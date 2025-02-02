import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import DashboardUser from './components/DashboardUser';
import DashboardAdmin from './components/DashboardAdmin';
import AddResult from './components/AddResult';
import AddPatient from './components/AddPatient';
import AddResultGuide from './components/AddResultGuide';
import ManageProfile from './components/ManageProfile';

import { auth } from './firebase';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const firestore = getFirestore();

const App = () => {
  const [currentScreen, setCurrentScreen] = useState("Home");
  const [loading, setLoading] = useState(true);

  const goToScreen = (screenName) => {
    setCurrentScreen(screenName);
  };
  // checking the user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        const userEmail = user.email;
        console.log("Logged in user email:", userEmail);
      } else {
        console.log("No user is logged in, redirecting to Login");
        setCurrentScreen("Login");
      }
  
      setLoading(false);
    });
  
    return () => unsubscribe();
  }, []);
  
  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

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
    default:
      displayedScreen = <Home goToScreen={goToScreen} />;
      break;
  }

  return (
    <View style={styles.container}>
      {displayedScreen}
    </View>
  );
};

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

import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import DashboardUser from './components/DashboardUser';
import DashboardAdmin from './components/DashboardAdmin';
import { auth } from './firebase';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const firestore = getFirestore();

const App = () => {
  const [currentScreen, setCurrentScreen] = useState("Home");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const goToScreen = (screenName) => {
    setCurrentScreen(screenName);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userEmail = user.email;
        console.log("Logged in user email:", userEmail);

        if (userEmail) {
          try {
            
            const adminQuery = query(
              collection(firestore, 'admins'),
              where('email', '==', userEmail)
            );
            const adminSnapshot = await getDocs(adminQuery);

            if (!adminSnapshot.empty) {
              setIsAdmin(true);
              console.log("User is an admin");
            } else {
              const userQuery = query(
                collection(firestore, 'users'),
                where('email', '==', userEmail)
              );
              const userSnapshot = await getDocs(userQuery);

              if (!userSnapshot.empty) {
                setIsAdmin(false);
                console.log("User is a regular user");
              }
            }
            setCurrentScreen("Dashboard");
          } catch (error) {
            console.error("Error checking user role:", error);
          }
        } else {
          console.error("Email not found in user profile");
        }
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
    case "Dashboard":
      displayedScreen = isAdmin ? <DashboardAdmin goToScreen={goToScreen} /> : <DashboardUser goToScreen={goToScreen} />;
      break;
    default:
      displayedScreen = <Home goToScreen={goToScreen} />;
      break;
  }

  return (
    <View style={styles.container}>
      {displayedScreen}
      <StatusBar style="auto" />
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

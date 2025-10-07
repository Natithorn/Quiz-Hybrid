import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import SignIn from './signin';
import { Home, ClassMembers, Feed } from './src/screens';
import * as api from './src/api';

type Screen = 'signin' | 'home' | 'class' | 'feed';

export default function App() {
  const [screen, setScreen] = useState<Screen>('signin');
  const [token, setToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // initialize storage (supports web localStorage and native AsyncStorage)
    api.initStorage().then(({ token: t, email }) => {
      if (t) {
        setToken(t);
        setUserEmail(email || null);
        setScreen('home');
      }
    });
  }, []);

  const handleSignIn = (tok: string, email?: string) => {
    setToken(tok);
    setUserEmail(email || null);
    api.storageSet('token', tok);
    if (email) api.storageSet('email', email);
    setScreen('feed'); // เปลี่ยนจาก 'home' เป็น 'feed'
  };

  const handleSignOut = () => {
    setToken(null);
    setUserEmail(null);
    api.storageRemove('token');
    api.storageRemove('email');
    setScreen('signin');
  };

  return (
    <View style={styles.container}>
      {screen === 'signin' && <SignIn onSignIn={handleSignIn} />}
      {screen === 'home' && (
        <Home
          onNavigate={(s: Screen) => setScreen(s)}
          onSignOut={handleSignOut}
          token={token}
          userEmail={userEmail}
        />
      )}
      {screen === 'class' && (
        <ClassMembers
          token={token}
          onBack={() => setScreen('home')}
        />
      )}
      {screen === 'feed' && (
        <Feed
          token={token}
          onBack={() => setScreen('home')}
        />
      )}
      <Text style={styles.footer}>CIS KKU Demo — minimal client (responsive)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
    paddingTop: 40,
    paddingHorizontal: 12,
    minHeight: '100%',
  },
  footer: {
    textAlign: 'center',
    color: '#666',
    marginTop: 18,
  },
});

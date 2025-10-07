import React from 'react';
import { View, Text, StyleSheet, Button, useWindowDimensions } from 'react-native';

export default function Home({ onNavigate, onSignOut, token, userEmail }: any) {
  const { width } = useWindowDimensions();
  const isSmall = width < 600;

  return (
    <View style={[styles.container, { paddingHorizontal: isSmall ? 12 : 24 }]}> 
      <View style={[styles.box, { maxWidth: isSmall ? '100%' : 900 }] }>
        <Text style={[styles.title, { fontSize: isSmall ? 18 : 22 }]}>Welcome{userEmail ? `, ${userEmail}` : ''}</Text>

        <View style={isSmall ? styles.col : styles.row}>
          <View style={styles.buttonWrap}>
            <Button title="Class Members" onPress={() => onNavigate('class')} />
          </View>
          <View style={{ height: isSmall ? 8 : 0, width: isSmall ? '100%' : 12 }} />
          <View style={styles.buttonWrap}>
            <Button title="Feed" onPress={() => onNavigate('feed')} />
          </View>
        </View>

        <View style={{ height: 12 }} />
        <Button title="Sign out" onPress={onSignOut} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', width: '100%', paddingVertical: 24 },
  box: { backgroundColor: '#fff', padding: 18, borderRadius: 8, width: '100%', alignSelf: 'center' },
  title: { fontWeight: '600', marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' },
  col: { flexDirection: 'column', alignItems: 'stretch' },
  buttonWrap: { flex: 1 },
});

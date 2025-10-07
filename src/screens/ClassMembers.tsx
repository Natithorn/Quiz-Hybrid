import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import * as api from '../api';

export default function ClassMembers({ token, onBack }: any) {
  const { width } = useWindowDimensions();
  const isSmall = width < 700;
  const [year, setYear] = useState('2565');
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const doFetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getClassMembers(year);
      // data format unknown — try to extract members array
      const list = Array.isArray(data) ? data : data.members || data.data || [];
      setMembers(list);
    } catch (err: any) {
      setError(JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingHorizontal: isSmall ? 12 : 24 }]}>
      <View style={styles.headerRow}>
        <Button title="Back" onPress={onBack} />
        <Text style={styles.title}>Class Members</Text>
      </View>
      <View style={isSmall ? styles.col : styles.row}>
        <View style={styles.controls}>
          <TextInput value={year} onChangeText={setYear} style={styles.input} />
          <View style={{ height: 8 }} />
          <Button title={loading ? 'Loading...' : 'Fetch'} onPress={doFetch} disabled={loading} />
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
        <ScrollView style={styles.list}>
          {members.length === 0 && <Text>No members yet (fetch to see results)</Text>}
          {members.map((m: any, idx: number) => (
            <View key={idx} style={styles.item}>
              <Text style={styles.name}>{m.name || m.fullname || m.email || JSON.stringify(m)}</Text>
              <Text style={styles.sub}>{m.studentId || m.id || ''}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { maxWidth: 1200, alignSelf: 'center' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  title: { fontSize: 18, fontWeight: '600', marginVertical: 10 },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  col: { flexDirection: 'column' },
  controls: { width: 320, marginRight: 12 },
  list: { flex: 1 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 6, minWidth: 120 },
  item: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  name: { fontSize: 16 },
  sub: { color: '#666', fontSize: 12 },
  error: { color: 'red' },
});

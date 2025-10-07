import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import * as api from '../api';

export default function Feed({ token, onBack }: any) {
  const { width } = useWindowDimensions();
  const isSmall = width < 700;
  const [content, setContent] = useState('');
  const [statusId, setStatusId] = useState('');
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');

  const doPost = async () => {
    setMessage('');
    try {
      const res = await api.postStatus(token, content);
      setMessage('Posted');
      setContent('');
      // try to extract id
      setStatusId(res && (res.id || res._id || res.statusId) ? (res.id || res._id || res.statusId) : '');
    } catch (err: any) {
      setMessage('Error: ' + JSON.stringify(err));
    }
  };

  const doComment = async () => {
    setMessage('');
    try {
      await api.postComment(token, statusId, comment);
      setMessage('Commented');
      setComment('');
    } catch (err: any) {
      setMessage('Error: ' + JSON.stringify(err));
    }
  };

  const doLike = async () => {
    setMessage('');
    try {
      await api.toggleLike(token, statusId);
      setMessage('Toggled like');
    } catch (err: any) {
      setMessage('Error: ' + JSON.stringify(err));
    }
  };

  return (
    <View style={[styles.container, { paddingHorizontal: isSmall ? 12 : 24 }]}>
      <Button title="Back" onPress={onBack} />
      <Text style={styles.title}>Feed / Status</Text>

      <View style={isSmall ? styles.col : {}}>
        <TextInput placeholder="Write a status..." value={content} onChangeText={setContent} style={styles.input} />
        <Button title="Post" onPress={doPost} />

        <View style={{ height: 12 }} />
        <Text style={{ marginBottom: 6 }}>Last posted status id (auto):</Text>
        <Text selectable style={styles.smallBox}>{statusId || '(none yet)'}</Text>

        <View style={{ height: 12 }} />
        <TextInput placeholder="Status ID to comment/like" value={statusId} onChangeText={setStatusId} style={styles.input} />
        <TextInput placeholder="Comment content" value={comment} onChangeText={setComment} style={styles.input} />
        <View style={{ flexDirection: isSmall ? 'column' : 'row', gap: 8 }}>
          <Button title="Comment" onPress={doComment} />
          <View style={{ width: isSmall ? 0 : 8, height: isSmall ? 8 : 0 }} />
          <Button title="Like/Unlike" onPress={doLike} />
        </View>

        <View style={{ height: 12 }} />
        {message ? <Text style={styles.message}>{message}</Text> : null}

        <ScrollView style={{ marginTop: 12 }}>
          <Text style={{ color: '#666' }}>This demo does not fetch a full feed — it's focused on POST actions required by the assignment.</Text>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { maxWidth: 900, alignSelf: 'center' },
  title: { fontSize: 18, fontWeight: '600', marginVertical: 10 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 6, marginBottom: 8 },
  smallBox: { padding: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: '#eee', borderRadius: 6 },
  message: { marginTop: 8, color: '#007700' },
  col: { flexDirection: 'column' },
});

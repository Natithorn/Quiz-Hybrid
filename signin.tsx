import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, useWindowDimensions } from 'react-native';
import * as api from './src/api';

export default function SignIn({ onSignIn }: any) {
	const { width } = useWindowDimensions();
	const isSmall = width < 600;
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState('');
	const [lastRequest, setLastRequest] = useState<string | null>(null);
	const [lastResponse, setLastResponse] = useState<string | null>(null);

	const doSignIn = async () => {
		setLoading(true);
		setMessage('');
		try {
			// เซ็ต API Key โดยตรง
			api.setApiKey('8d9722bdf8ed27716e6e2e0213b8ff737cc16d17a85b2abda054ff59d99ba591');
			const res = await api.signIn(email, password);
			// try extract token
			// res is expected to be the inner data object per API example
			// save request/response for debugging
			setLastRequest(JSON.stringify({ email, password }, null, 2));
			// API key is loaded automatically from storage in initStorage(); no need to set it here
			if (res && typeof res === 'object') {
				const token = (res as any).token || (res as any).accessToken || null;
				if (token) api.setAuthToken(token);
				// pass token and email to parent; also include user object for UI
				onSignIn(token || JSON.stringify(res), (res as any).email || email);
				setMessage(`Welcome ${((res as any).firstname || '')}`);
				setLastResponse(JSON.stringify(res, null, 2));
			} else {
				onSignIn(JSON.stringify(res), email);
				setLastResponse(JSON.stringify(res, null, 2));
			}
		} catch (err: any) {
			setMessage('Sign in failed: ' + JSON.stringify(err));
			try {
				// try to extract response body from web exception
				if (err && err.response) setLastResponse(JSON.stringify(err.response, null, 2));
			} catch (_) {}
		} finally {
			setLoading(false);
		}
	};

		return (
			<View style={styles.container}>
				<View style={[styles.box, { maxWidth: isSmall ? '100%' : 420 }] }>
					<Text style={[styles.title, { fontSize: isSmall ? 18 : 20 }]}>CIS KKU Demo</Text>
					<TextInput value={email} onChangeText={setEmail} style={styles.input} placeholder="email" autoCapitalize="none" keyboardType="email-address" />
					<TextInput value={password} onChangeText={setPassword} style={styles.input} placeholder="password" secureTextEntry />

					<Button title={loading ? 'Signing...' : 'Sign In'} onPress={doSignIn} disabled={loading} />
					{message ? <Text style={styles.error}>{message}</Text> : null}
					{lastRequest ? (
						<View style={{ marginTop: 12 }}>
							<Text style={{ fontWeight: '600' }}>Last request (JSON):</Text>
							<Text selectable style={{ fontFamily: 'monospace' }}>{lastRequest}</Text>
						</View>
					) : null}
					{lastResponse ? (
						<View style={{ marginTop: 8 }}>
							<Text style={{ fontWeight: '600' }}>Last response (raw):</Text>
							<Text selectable style={{ fontFamily: 'monospace' }}>{lastResponse}</Text>
						</View>
					) : null}
					<Text style={{ marginTop: 12, color: '#666' }}>Sign in with your university email</Text>
				</View>
			</View>
		);
}

const styles = StyleSheet.create({
	container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
	box: { width: '100%', maxWidth: 420, backgroundColor: '#fff', padding: 20, borderRadius: 8, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6 },
	title: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
	input: { borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 6, marginBottom: 8, width: '100%' },
	error: { color: 'red', marginTop: 8 },
});

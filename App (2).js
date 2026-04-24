import { useState } from 'react';
import {
  StyleSheet, View, Text, TextInput,
  TouchableOpacity, SafeAreaView, StatusBar,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert
} from 'react-native';
import HubspotMobileChatSDK from '@hubspot/mobile-chat-sdk-react-native';

// ─────────────────────────────────────────
// LOGIN SCREEN
// ─────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [restaurant, setRestaurant] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!name || !email || !restaurant) {
      setError('Please fill in all fields');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Set custom contact properties so agent sees them instantly
      await HubspotMobileChatSDK.setCustomContactProperty(
        'restaurant_name', restaurant
      );
      await HubspotMobileChatSDK.setCustomContactProperty(
        'firstname', name.split(' ')[0]
      );
      await HubspotMobileChatSDK.setCustomContactProperty(
        'lastname', name.split(' ').slice(1).join(' ') || ''
      );
      await HubspotMobileChatSDK.setCustomContactProperty(
        'email', email
      );

      onLogin({ name, email, restaurant });
    } catch (e) {
      setError('Something went wrong. Please try again.');
      console.error('HubSpot SDK error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#ff7a59" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}>

        {/* Header */}
        <View style={styles.loginHeader}>
          <Text style={styles.loginLogo}>🍽️</Text>
          <Text style={styles.loginTitle}>Restaurant Portal</Text>
          <Text style={styles.loginSub}>Sign in to access support</Text>
        </View>

        {/* Form */}
        <View style={styles.loginForm}>

          <Text style={styles.formLabel}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. John Smith"
            placeholderTextColor="#aaa"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <Text style={styles.formLabel}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. john@restaurant.com"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.formLabel}>Restaurant Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. The Burger Spot"
            placeholderTextColor="#aaa"
            value={restaurant}
            onChangeText={setRestaurant}
            autoCapitalize="words"
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
            onPress={handleLogin}
            disabled={loading}>
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.loginBtnText}>Open Support Chat →</Text>
            }
          </TouchableOpacity>

          <Text style={styles.testNote}>
            🧪 Test Mode · Your restaurant name will auto-appear for the agent
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────
// CHAT SCREEN
// ─────────────────────────────────────────
function ChatScreen({ user, onLogout }) {
  const [loading, setLoading] = useState(true);

  const openHubSpotChat = async () => {
    try {
      await HubspotMobileChatSDK.openChat();
      setLoading(false);
    } catch (e) {
      setLoading(false);
      Alert.alert(
        'Chat Error',
        'Could not open chat. Please check your connection and try again.',
        [{ text: 'OK' }]
      );
      console.error('HubSpot chat open error:', e);
    }
  };

  // Open chat as soon as screen loads
  useState(() => {
    openHubSpotChat();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#ff7a59" />

      {/* Header */}
      <View style={styles.chatHeader}>
        <View>
          <Text style={styles.chatHeaderTitle}>💬 Support Chat</Text>
          <Text style={styles.chatHeaderSub}>
            {user.restaurant} · {user.name}
          </Text>
        </View>
        <TouchableOpacity onPress={onLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>← Back</Text>
        </TouchableOpacity>
      </View>

      {/* Loading / Open Chat */}
      <View style={styles.chatBody}>
        {loading ? (
          <>
            <ActivityIndicator size="large" color="#ff7a59" />
            <Text style={styles.loaderText}>Connecting to support...</Text>
            <Text style={styles.loaderSub}>Signing in as {user.name}</Text>
          </>
        ) : (
          <>
            <Text style={styles.chatOpenText}>💬</Text>
            <Text style={styles.chatOpenTitle}>Chat is open!</Text>
            <Text style={styles.chatOpenSub}>
              The HubSpot chat window is now active.{'\n'}
              Your agent can see:
            </Text>
            <View style={styles.infoCard}>
              <Text style={styles.infoRow}>👤  {user.name}</Text>
              <Text style={styles.infoRow}>📧  {user.email}</Text>
              <Text style={styles.infoRow}>🍔  {user.restaurant}</Text>
            </View>
            <TouchableOpacity
              style={styles.reopenBtn}
              onPress={openHubSpotChat}>
              <Text style={styles.reopenBtnText}>Reopen Chat</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);

  return user
    ? <ChatScreen user={user} onLogout={() => setUser(null)} />
    : <LoginScreen onLogin={setUser} />;
}

// ─────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ff7a59' },
  flex: { flex: 1 },

  // Login
  loginHeader: {
    backgroundColor: '#ff7a59',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  loginLogo: { fontSize: 48, marginBottom: 12 },
  loginTitle: { fontSize: 24, fontWeight: '700', color: '#fff', marginBottom: 6 },
  loginSub: { fontSize: 14, color: '#ffe5de' },
  loginForm: {
    flex: 1,
    backgroundColor: '#f4f6f9',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 28,
  },
  formLabel: {
    fontSize: 13, fontWeight: '600', color: '#33475b',
    marginBottom: 6, marginTop: 14,
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#fff', borderRadius: 10,
    borderWidth: 1, borderColor: '#e0e7ef',
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, color: '#33475b',
  },
  errorText: { color: '#e53e3e', fontSize: 13, marginTop: 10, textAlign: 'center' },
  loginBtn: {
    backgroundColor: '#ff7a59', borderRadius: 12,
    paddingVertical: 16, alignItems: 'center', marginTop: 24,
    shadowColor: '#ff7a59', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  loginBtnDisabled: { opacity: 0.6 },
  loginBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  testNote: { textAlign: 'center', color: '#99acc2', fontSize: 12, marginTop: 16 },

  // Chat
  chatHeader: {
    backgroundColor: '#ff7a59',
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12,
  },
  chatHeaderTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
  chatHeaderSub: { color: '#ffe5de', fontSize: 12, marginTop: 2 },
  logoutBtn: {
    paddingHorizontal: 12, paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8,
  },
  logoutText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  chatBody: {
    flex: 1, backgroundColor: '#f4f6f9',
    alignItems: 'center', justifyContent: 'center', padding: 32,
  },
  loaderText: { marginTop: 14, fontSize: 16, fontWeight: '600', color: '#33475b' },
  loaderSub: { marginTop: 6, fontSize: 13, color: '#99acc2' },
  chatOpenText: { fontSize: 56, marginBottom: 12 },
  chatOpenTitle: { fontSize: 20, fontWeight: '700', color: '#33475b', marginBottom: 8 },
  chatOpenSub: { fontSize: 14, color: '#6b7c93', textAlign: 'center', marginBottom: 20, lineHeight: 22 },
  infoCard: {
    backgroundColor: '#fff', borderRadius: 12,
    padding: 20, width: '100%', marginBottom: 24,
    borderWidth: 1, borderColor: '#e0e7ef',
  },
  infoRow: { fontSize: 15, color: '#33475b', marginBottom: 10, fontWeight: '500' },
  reopenBtn: {
    backgroundColor: '#ff7a59', borderRadius: 12,
    paddingVertical: 14, paddingHorizontal: 32,
  },
  reopenBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});

import { useState } from 'react';
import {
  StyleSheet, View, Text, TextInput,
  TouchableOpacity, SafeAreaView, StatusBar,
  KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native';
import { WebView } from 'react-native-webview';

// ─────────────────────────────────────────
// HUBSPOT CONFIG
// ─────────────────────────────────────────
const HUBSPOT_PORTAL_ID = '244508708';
const HUBSPOT_HUBLET    = 'na2';

function buildChatHTML(user) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0"/>
  <title>Support Chat</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #f4f6f9;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      min-height: 100vh; padding: 24px;
    }
    .card {
      background: white; border-radius: 16px;
      padding: 32px 24px; width: 100%; max-width: 400px;
      text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }
    .emoji { font-size: 44px; margin-bottom: 12px; }
    h2 { color: #33475b; font-size: 20px; margin-bottom: 6px; }
    p  { color: #6b7c93; font-size: 14px; margin-bottom: 20px; }
    .info { background: #f8f9fa; border-radius: 10px; padding: 16px; text-align: left; margin-bottom: 8px; }
    .info-row { font-size: 14px; color: #33475b; margin-bottom: 8px; font-weight: 500; }
    .loading { color: #99acc2; font-size: 13px; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="emoji">💬</div>
    <h2>Hi, ${user.name}!</h2>
    <p>Connecting you to our support team...</p>
    <div class="info">
      <div class="info-row">👤 ${user.name}</div>
      <div class="info-row">📧 ${user.email}</div>
      <div class="info-row">🍔 ${user.restaurant}</div>
    </div>
    <p class="loading">Chat widget will appear in the bottom right corner</p>
  </div>

  <script>
    var _hsq = window._hsq = window._hsq || [];
    _hsq.push(['identify', {
      email:     '${user.email}',
      firstname: '${user.firstName}',
      lastname:  '${user.lastName}',
      company:   '${user.restaurant}'
    }]);
  </script>

  <script type="text/javascript" id="hs-script-loader" async defer
    src="//js-${HUBSPOT_HUBLET}.hs-scripts.com/${HUBSPOT_PORTAL_ID}.js">
  </script>

  <script>
    function openChat() {
      if (window.HubSpotConversations && window.HubSpotConversations.widget) {
        window.HubSpotConversations.widget.open();
      } else {
        setTimeout(openChat, 600);
      }
    }
    setTimeout(openChat, 1500);
  </script>
</body>
</html>`;
}

function LoginScreen({ onLogin }) {
  const [name, setName]             = useState('');
  const [email, setEmail]           = useState('');
  const [restaurant, setRestaurant] = useState('');
  const [error, setError]           = useState('');

  const handleLogin = () => {
    if (!name || !email || !restaurant) { setError('Please fill in all fields'); return; }
    if (!email.includes('@'))            { setError('Please enter a valid email'); return; }
    const parts = name.trim().split(' ');
    onLogin({ name, email, restaurant, firstName: parts[0], lastName: parts.slice(1).join(' ') });
  };

  return (
    <SafeAreaView style={s.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#ff7a59" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.flex}>
        <View style={s.header}>
          <Text style={s.logo}>🍽️</Text>
          <Text style={s.title}>Restaurant Portal</Text>
          <Text style={s.sub}>Sign in to access support</Text>
        </View>
        <View style={s.form}>
          <Text style={s.label}>Full Name</Text>
          <TextInput style={s.input} placeholder="e.g. John Smith" placeholderTextColor="#aaa"
            value={name} onChangeText={setName} autoCapitalize="words" />

          <Text style={s.label}>Email Address</Text>
          <TextInput style={s.input} placeholder="e.g. john@restaurant.com" placeholderTextColor="#aaa"
            value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

          <Text style={s.label}>Restaurant Name</Text>
          <TextInput style={s.input} placeholder="e.g. The Burger Spot" placeholderTextColor="#aaa"
            value={restaurant} onChangeText={setRestaurant} autoCapitalize="words" />

          {error ? <Text style={s.error}>{error}</Text> : null}

          <TouchableOpacity style={s.btn} onPress={handleLogin}>
            <Text style={s.btnText}>Open Support Chat →</Text>
          </TouchableOpacity>

          <Text style={s.note}>🧪 Your details will auto-appear for the support agent</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function ChatScreen({ user, onLogout }) {
  const [loading, setLoading] = useState(true);
  return (
    <SafeAreaView style={s.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#ff7a59" />
      <View style={s.chatHeader}>
        <View>
          <Text style={s.chatTitle}>💬 Support Chat</Text>
          <Text style={s.chatSub}>{user.restaurant} · {user.name}</Text>
        </View>
        <TouchableOpacity onPress={onLogout} style={s.backBtn}>
          <Text style={s.backText}>← Back</Text>
        </TouchableOpacity>
      </View>
      {loading && (
        <View style={s.loader}>
          <ActivityIndicator size="large" color="#ff7a59" />
          <Text style={s.loaderText}>Connecting to support...</Text>
          <Text style={s.loaderSub}>Signing in as {user.name}</Text>
        </View>
      )}
      <WebView
        source={{ html: buildChatHTML(user) }}
        style={s.webview}
        onLoadEnd={() => setLoading(false)}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        thirdPartyCookiesEnabled={true}
        sharedCookiesEnabled={true}
        allowsInlineMediaPlayback={true}
        originWhitelist={['*']}
      />
    </SafeAreaView>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  return user
    ? <ChatScreen user={user} onLogout={() => setUser(null)} />
    : <LoginScreen onLogin={setUser} />;
}

const s = StyleSheet.create({
  safeArea:   { flex: 1, backgroundColor: '#ff7a59' },
  flex:       { flex: 1 },
  header:     { backgroundColor: '#ff7a59', alignItems: 'center', paddingVertical: 40, paddingHorizontal: 24 },
  logo:       { fontSize: 48, marginBottom: 12 },
  title:      { fontSize: 24, fontWeight: '700', color: '#fff', marginBottom: 6 },
  sub:        { fontSize: 14, color: '#ffe5de' },
  form:       { flex: 1, backgroundColor: '#f4f6f9', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 28 },
  label:      { fontSize: 13, fontWeight: '600', color: '#33475b', marginBottom: 6, marginTop: 14, textTransform: 'uppercase', letterSpacing: 0.5 },
  input:      { backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#e0e7ef', paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: '#33475b' },
  error:      { color: '#e53e3e', fontSize: 13, marginTop: 10, textAlign: 'center' },
  btn:        { backgroundColor: '#ff7a59', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 24, elevation: 4 },
  btnText:    { color: '#fff', fontSize: 15, fontWeight: '700' },
  note:       { textAlign: 'center', color: '#99acc2', fontSize: 12, marginTop: 16 },
  chatHeader: { backgroundColor: '#ff7a59', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  chatTitle:  { color: '#fff', fontSize: 16, fontWeight: '700' },
  chatSub:    { color: '#ffe5de', fontSize: 12, marginTop: 2 },
  backBtn:    { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8 },
  backText:   { color: '#fff', fontSize: 13, fontWeight: '600' },
  webview:    { flex: 1, backgroundColor: '#fff' },
  loader:     { position: 'absolute', top: 80, left: 0, right: 0, bottom: 0, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  loaderText: { marginTop: 14, fontSize: 16, fontWeight: '600', color: '#33475b' },
  loaderSub:  { marginTop: 6, fontSize: 13, color: '#99acc2' },
});

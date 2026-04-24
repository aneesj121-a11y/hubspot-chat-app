import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator, Text, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import { useState } from 'react';

// 👇 Replace this with your Tiiny.host URL
const CHAT_URL = 'https://YOUR-TIINYHOST-URL.tiiny.site';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>💬 Support Chat</Text>
        <Text style={styles.subText}>We're here to help</Text>
      </View>

      {/* Loading Indicator */}
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#ff7a59" />
          <Text style={styles.loaderText}>Loading chat...</Text>
        </View>
      )}

      {/* Error State */}
      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>⚠️ Could not load chat.</Text>
          <Text style={styles.errorSub}>Check your internet connection and try again.</Text>
        </View>
      )}

      {/* WebView — loads your HubSpot chat page */}
      <WebView
        source={{ uri: CHAT_URL }}
        style={styles.webview}
        onLoadEnd={() => setLoading(false)}
        onError={() => { setLoading(false); setError(true); }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={false}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#ff7a59',
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  subText: {
    color: '#ffe5de',
    fontSize: 12,
    marginTop: 2,
  },
  webview: {
    flex: 1,
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  loaderText: {
    marginTop: 10,
    color: '#99acc2',
    fontSize: 14,
  },
  errorBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#33475b',
    marginBottom: 8,
  },
  errorSub: {
    fontSize: 13,
    color: '#99acc2',
    textAlign: 'center',
  },
});

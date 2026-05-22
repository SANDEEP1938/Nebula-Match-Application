import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { CosmicBackground } from '../src/components/ui/CosmicBackground';
import { PrimaryButton } from '../src/components/ui/PrimaryButton';
import { useAuth } from '../src/context/AuthContext';
import { colors } from '../src/theme/colors';

export default function LoginScreen() {
  const { login, error, setError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const handleLogin = async () => {
    setBusy(true);
    setError(null);
    try {
      await login({ email: email.trim(), password });
      router.replace('/(tabs)');
    } catch {
      setError('Invalid email or password');
    } finally {
      setBusy(false);
    }
  };

  return (
    <CosmicBackground>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <Animated.View entering={FadeInDown.duration(450)}>
            <Text style={styles.title}>Welcome back</Text>
            {error && <Text style={styles.error}>{error}</Text>}
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor={colors.textMuted}
              placeholder="you@example.com"
            />
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor={colors.textMuted}
              placeholder="••••••••"
            />
            <PrimaryButton
              label={busy ? 'Signing in...' : 'Sign in'}
              onPress={() => void handleLogin()}
              disabled={busy}
            />
            <PrimaryButton
              label="Forgot password?"
              variant="ghost"
              onPress={() => router.push('/forgot-password')}
              style={styles.gap}
            />
            <PrimaryButton
              label="Create account"
              variant="ghost"
              onPress={() => router.replace('/register')}
              style={styles.gap}
            />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </CosmicBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { padding: 24, paddingTop: 16 },
  title: { color: colors.text, fontSize: 28, fontWeight: '800', marginBottom: 20 },
  label: { color: colors.textMuted, marginBottom: 6, marginTop: 12 },
  input: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    color: colors.text,
    fontSize: 16,
  },
  error: { color: colors.danger, marginBottom: 12 },
  gap: { marginTop: 10 },
});

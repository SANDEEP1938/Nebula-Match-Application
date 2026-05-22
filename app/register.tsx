import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { CosmicBackground } from '../src/components/ui/CosmicBackground';
import { PrimaryButton } from '../src/components/ui/PrimaryButton';
import { useAuth } from '../src/context/AuthContext';
import { colors } from '../src/theme/colors';

export default function RegisterScreen() {
  const { register, error, setError } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const handleRegister = async () => {
    setBusy(true);
    setError(null);
    try {
      await register({
        username: username.trim(),
        email: email.trim(),
        password,
      });
      router.replace('/(tabs)');
    } catch {
      setError('Registration failed. Try a different email or username.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <CosmicBackground>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <Animated.View entering={FadeInDown.duration(450)}>
            <Text style={styles.title}>Join the crew</Text>
            {error && <Text style={styles.error}>{error}</Text>}
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="PilotName"
              placeholderTextColor={colors.textMuted}
            />
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="you@example.com"
              placeholderTextColor={colors.textMuted}
            />
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Min 6 characters"
              placeholderTextColor={colors.textMuted}
            />
            <PrimaryButton
              label={busy ? 'Creating...' : 'Create account'}
              onPress={() => void handleRegister()}
              disabled={busy}
            />
            <PrimaryButton
              label="Already have an account?"
              variant="ghost"
              onPress={() => router.replace('/login')}
              style={styles.gap}
            />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </CosmicBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 24 },
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

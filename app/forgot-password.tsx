import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import api from '../src/api/client';
import { CosmicBackground } from '../src/components/ui/CosmicBackground';
import { PrimaryButton } from '../src/components/ui/PrimaryButton';
import { colors } from '../src/theme/colors';
import type { ApiSuccess } from '../src/types';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const { data } = await api.post<ApiSuccess<{ message: string }>>('/auth/forgot-password', {
        email: email.trim(),
      });
      setMessage(data.data.message);
    } catch {
      setError('Could not send reset email. Check the address and API URL.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <CosmicBackground>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Animated.View entering={FadeInDown.duration(450)}>
          <Text style={styles.title}>Reset password</Text>
          <Text style={styles.subtitle}>
            Enter your email. If an account exists, you will receive reset instructions.
          </Text>
          {error && <Text style={styles.error}>{error}</Text>}
          {message && <Text style={styles.success}>{message}</Text>}
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
          <PrimaryButton
            label={busy ? 'Sending...' : 'Send reset link'}
            onPress={() => void submit()}
            disabled={busy}
          />
          <PrimaryButton
            label="Back to sign in"
            variant="ghost"
            onPress={() => router.back()}
            style={styles.gap}
          />
        </Animated.View>
      </ScrollView>
    </CosmicBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 24 },
  title: { color: colors.text, fontSize: 28, fontWeight: '800' },
  subtitle: { color: colors.textMuted, marginTop: 10, marginBottom: 20, lineHeight: 22 },
  label: { color: colors.textMuted, marginBottom: 6 },
  input: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    color: colors.text,
    fontSize: 16,
    marginBottom: 16,
  },
  error: { color: colors.danger, marginBottom: 12 },
  success: { color: colors.success, marginBottom: 12 },
  gap: { marginTop: 10 },
});

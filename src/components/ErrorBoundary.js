import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, spacing } from '../constants/theme';

export default class ErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    console.error('App crash:', error);
  }

  render() {
    if (this.state.error) {
      return (
        <View style={styles.wrap}>
          <ScrollView contentContainerStyle={styles.box}>
            <Text style={styles.title}>Uygulama hatası</Text>
            <Text style={styles.msg}>{String(this.state.error?.message || this.state.error)}</Text>
            <TouchableOpacity style={styles.btn} onPress={() => this.setState({ error: null })}>
              <Text style={styles.btnText}>Tekrar dene</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.background },
  box: { padding: spacing.lg, flexGrow: 1, justifyContent: 'center' },
  title: { color: colors.accent, fontSize: 20, fontWeight: '700', marginBottom: spacing.md },
  msg: { color: colors.text, fontSize: 14, lineHeight: 22, marginBottom: spacing.lg },
  btn: {
    backgroundColor: colors.accent,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnText: { color: colors.background, fontWeight: '700' },
});

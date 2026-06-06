import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../constants/theme';

export default function ChatBubble({ message }) {
  const isUser = message.role === 'user';
  const isError = message.isError;

  return (
    <View style={[styles.row, isUser && styles.rowUser]}>
      {!isUser && (
        <View style={[styles.avatar, isError && styles.avatarError]}>
          {isError ? (
            <Ionicons
              name="alert-circle"
              size={16}
              color={colors.error}
            />
          ) : (
            <Image
              source={require('../../assets/bilge-ai-portrait.png')}
              style={styles.avatarImage}
              contentFit="cover"
              cachePolicy="memory-disk"
            />
          )}
        </View>
      )}
      <View
        style={[
          styles.bubble,
          isUser ? styles.bubbleUser : styles.bubbleAi,
          isError && styles.bubbleError,
        ]}
      >
        {!isUser && !isError && (
          <Text style={styles.label}>BilgeAI</Text>
        )}
        <Text style={[styles.text, isUser && styles.textUser]}>{message.text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  rowUser: {
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accentSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
    overflow: 'hidden',
  },
  avatarError: {
    backgroundColor: 'rgba(231, 76, 60, 0.15)',
  },
  avatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  bubble: {
    maxWidth: '82%',
    borderRadius: 18,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  bubbleUser: {
    backgroundColor: colors.userBubble,
    borderBottomRightRadius: 4,
  },
  bubbleAi: {
    backgroundColor: colors.aiBubble,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderBottomLeftRadius: 4,
  },
  bubbleError: {
    borderColor: colors.error,
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.accent,
    marginBottom: 4,
  },
  text: {
    ...typography.body,
    fontSize: 15,
    lineHeight: 22,
  },
  textUser: {
    color: colors.white,
  },
});


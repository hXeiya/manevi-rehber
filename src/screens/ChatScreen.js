import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ChatBubble from '../components/ChatBubble';
import ScreenHeader from '../components/ScreenHeader';
import { useApp } from '../context/AppContext';
import { colors, spacing, typography } from '../constants/theme';

const SUGGESTIONS = [
  'Gelecek kaygısıyla nasıl başa çıkarım?',
  'Sınav stresi ve yapamama korkusu',
  'Yalnızlık hissini nasıl yatıştırabilirim?',
];

export default function ChatScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { messages, isLoading, hasApiKey, sendMessage, resetChat } = useApp();
  const [input, setInput] = useState('');
  const listRef = useRef(null);
  const messagesCountRef = useRef(0);

  useEffect(() => {
    if (route?.params?.initialText) {
      if (route.params.autoSend) {
        sendMessage(route.params.initialText);
      } else {
        setInput(route.params.initialText);
      }
      // Clear parameters to avoid re-triggering
      navigation.setParams({ initialText: undefined, autoSend: undefined });
    }
  }, [route?.params?.initialText]);

  const prevMessagesRef = useRef(messages);
  const prevIsLoadingRef = useRef(isLoading);
  const shouldScrollToEndRef = useRef(false);

  // Detect new messages or loading transitions during the render phase
  if (messages !== prevMessagesRef.current) {
    const prevLastMsg = prevMessagesRef.current[prevMessagesRef.current.length - 1];
    const currLastMsg = messages[messages.length - 1];
    if (currLastMsg && (!prevLastMsg || currLastMsg.id !== prevLastMsg.id)) {
      shouldScrollToEndRef.current = true;
    }
    prevMessagesRef.current = messages;
  }

  if (isLoading !== prevIsLoadingRef.current) {
    if (isLoading) {
      shouldScrollToEndRef.current = true;
    }
    prevIsLoadingRef.current = isLoading;
  }

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading || !hasApiKey) return;

    setInput('');
    await sendMessage(text);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <ScreenHeader
        title="BilgeAI"
        subtitle="Kultur ve medeniyet rehberiniz"
        rightElement={
          <TouchableOpacity onPress={resetChat} style={styles.clearBtn}>
            <Ionicons name="trash-outline" size={22} color={colors.textSecondary} />
          </TouchableOpacity>
        }
      />

      {!hasApiKey && (
        <View style={styles.banner}>
          <Ionicons name="alert-circle-outline" size={20} color={colors.accent} />
          <Text style={styles.bannerText}>
            BilgeAI cevrimdisi demo modunda calisiyor.
          </Text>
        </View>
      )}

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatBubble message={item} />}
        contentContainerStyle={styles.messageList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => {
          if (shouldScrollToEndRef.current) {
            shouldScrollToEndRef.current = false;
            // Scroll to bottom immediately
            listRef.current?.scrollToEnd({ animated: true });
            // Secondary small fallback to guarantee it catches any rendering shifts
            setTimeout(() => {
              listRef.current?.scrollToEnd({ animated: true });
            }, 100);
          }
        }}
        ListFooterComponent={
          isLoading ? (
            <View style={styles.typing}>
              <ActivityIndicator size="small" color={colors.accent} />
              <Text style={styles.typingText}>BilgeAI dusunuyor...</Text>
            </View>
          ) : null
        }
      />

      {messages.length <= 1 && !isLoading && (
        <View style={styles.suggestions}>
          {SUGGESTIONS.map((suggestion) => (
            <TouchableOpacity
              key={suggestion}
              style={styles.chip}
              onPress={() => setInput(suggestion)}
              disabled={!hasApiKey}
            >
              <Text style={styles.chipText}>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
        <TextInput
          style={styles.input}
          placeholder={hasApiKey ? "BilgeAI'a sorun..." : 'BilgeAI hazirlaniyor'}
          placeholderTextColor={colors.textMuted}
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={2000}
          editable={!isLoading && hasApiKey}
        />
        <TouchableOpacity
          style={[styles.sendBtn, (!input.trim() || isLoading || !hasApiKey) && styles.sendBtnDisabled]}
          onPress={handleSend}
          disabled={!input.trim() || isLoading || !hasApiKey}
        >
          <Ionicons name="send" size={20} color={colors.background} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  clearBtn: {
    padding: spacing.xs,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentSoft,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    padding: spacing.md,
    borderRadius: 12,
    gap: spacing.sm,
  },
  bannerText: {
    flex: 1,
    fontSize: 13,
    color: colors.accent,
    fontWeight: '600',
  },
  messageList: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    flexGrow: 1,
  },
  typing: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  typingText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  suggestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },
  chip: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  chipText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    maxHeight: 120,
    minHeight: 44,
    backgroundColor: colors.surfaceLight,
    borderRadius: 22,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    color: colors.text,
    fontSize: 15,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },
});

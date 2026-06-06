import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  CHAT_HISTORY: '@manevi_rehber/chat_history',
};

export async function getChatHistory() {
  try {
    const raw = await AsyncStorage.getItem(KEYS.CHAT_HISTORY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveChatHistory(messages) {
  await AsyncStorage.setItem(KEYS.CHAT_HISTORY, JSON.stringify(messages));
}

export async function clearChatHistory() {
  await AsyncStorage.removeItem(KEYS.CHAT_HISTORY);
}

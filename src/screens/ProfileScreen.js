import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';
import { useApp } from '../context/AppContext';
import { colors, spacing, typography } from '../constants/theme';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const {
    user,
    ip,
    chatsCount,
    readGuides,
    login,
    register,
    logout,
    isLoading: authLoading,
  } = useApp();

  const [isLoginTab, setIsLoginTab] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // Gamification formulas
  const getRankInfo = (points) => {
    if (points >= 600) {
      return { title: 'Mutasavvıf', nextLimit: 1000, desc: 'Gönül sırlarına ermiş yüce rehber.', icon: 'trophy', color: '#FFD700' };
    }
    if (points >= 300) {
      return { title: 'Arif', nextLimit: 600, desc: 'Hikmet ve sükûnet kapısını aralamış bilge.', icon: 'eye-outline', color: '#D4AF37' };
    }
    if (points >= 100) {
      return { title: 'Salik', nextLimit: 300, desc: 'Manevi olgunlaşma yolunda kararlı yolcu.', icon: 'footsteps-outline', color: '#F5C469' };
    }
    return { title: 'Müptedi', nextLimit: 100, desc: 'Yolun başında, irfan arayışındaki talebe.', icon: 'book-outline', color: colors.textSecondary };
  };

  const rank = getRankInfo(ip);
  const prevLimit = ip >= 600 ? 600 : ip >= 300 ? 300 : ip >= 100 ? 100 : 0;
  const progressPercent = Math.min(
    100,
    ((ip - prevLimit) / (rank.nextLimit - prevLimit)) * 100
  );

  // Badge unlock checks
  const badges = [
    {
      id: 'gonul_dostu',
      title: 'Gönül Dostu',
      desc: 'BilgeAI ile 5 sohbet gerçekleştir.',
      icon: 'chatbubbles-outline',
      unlocked: chatsCount >= 5,
    },
    {
      id: 'hikmet_kasifi',
      title: 'Hikmet Kâşifi',
      desc: '3 bilge rehber makalesi oku.',
      icon: 'library-outline',
      unlocked: readGuides.length >= 3,
    },
    {
      id: 'sekine_sahibi',
      title: 'Sekine Sahibi',
      desc: 'Tasavvufi çalışmalardan 100 IP biriktir.',
      icon: 'heart-outline',
      unlocked: ip >= 100,
    },
    {
      id: 'irfan_eri',
      title: 'İrfan Eri',
      desc: 'Manevi dereceyi Arif rütbesine yükselt.',
      icon: 'ribbon-outline',
      unlocked: ip >= 300,
    },
  ];

  const handleAuthAction = async () => {
    const trimmedEmail = email.trim();
    const trimmedPass = password.trim();

    if (!trimmedEmail || !trimmedPass) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    try {
      if (isLoginTab) {
        await login(trimmedEmail, trimmedPass);
      } else {
        await register(trimmedEmail, trimmedPass, name.trim());
      }
      setEmail('');
      setPassword('');
      setName('');
    } catch (error) {
      Alert.alert('Giriş Hatası', error.message || 'Bir sorun oluştu.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenHeader title="Gönül Profili" subtitle="İrfan yolculuğunuzun kayıtları" />

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.md }]}>
        
        {/* Irfan Yolculugu Level Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>İrfan Yolculuğu</Text>
          
          <View style={styles.rankRow}>
            <View style={[styles.rankBadge, { borderColor: rank.color }]}>
              <Ionicons name={rank.icon} size={28} color={rank.color} />
            </View>
            <View style={styles.rankInfo}>
              <Text style={[styles.rankTitle, { color: rank.color }]}>{rank.title}</Text>
              <Text style={styles.rankDesc}>{rank.desc}</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>{ip} IP</Text>
              <Text style={styles.progressLabel}>{rank.nextLimit} IP</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progressPercent}%`, backgroundColor: rank.color }]} />
            </View>
            <Text style={styles.progressSub}>Sonraki rütbe için {rank.nextLimit - ip} IP gerekli.</Text>
          </View>

          {/* Core Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statVal}>{chatsCount}</Text>
              <Text style={styles.statLabel}>Sohbet</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statVal}>{readGuides.length}</Text>
              <Text style={styles.statLabel}>Okunan Rehber</Text>
            </View>
          </View>
        </View>

        {/* Badges Grid */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Kazanılan Nişanlar</Text>
          <View style={styles.badgesGrid}>
            {badges.map((b) => (
              <View key={b.id} style={[styles.badgeCard, !b.unlocked && styles.badgeLocked]}>
                <Ionicons
                  name={b.icon}
                  size={32}
                  color={b.unlocked ? colors.accent : colors.textMuted}
                />
                <Text style={[styles.badgeTitle, b.unlocked && styles.badgeTitleUnlocked]}>
                  {b.title}
                </Text>
                <Text style={styles.badgeDesc}>{b.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Firebase Authentication / User Profile Card */}
        {user ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Hesap Bilgileri</Text>
            <View style={styles.userRow}>
              <Ionicons name="person-circle-outline" size={40} color={colors.accent} />
              <View style={styles.userInfo}>
                <Text style={styles.userEmail}>{user.email}</Text>
                <Text style={styles.userStatus}>Manevi Rehber Bulut Senkronizasyonu Aktif</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
              <Text style={styles.logoutBtnText}>Oturumu Kapat</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.card}>
            {/* Tabs for Login / Register */}
            <View style={styles.authTabs}>
              <TouchableOpacity
                style={[styles.authTab, isLoginTab && styles.authTabActive]}
                onPress={() => setIsLoginTab(true)}
              >
                <Text style={[styles.authTabText, isLoginTab && styles.authTabTextActive]}>Giriş Yap</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.authTab, !isLoginTab && styles.authTabActive]}
                onPress={() => setIsLoginTab(false)}
              >
                <Text style={[styles.authTabText, !isLoginTab && styles.authTabTextActive]}>Kayıt Ol</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              {!isLoginTab && (
                <TextInput
                  style={styles.input}
                  placeholder="İsminiz"
                  placeholderTextColor={colors.textMuted}
                  value={name}
                  onChangeText={setName}
                />
              )}
              <TextInput
                style={styles.input}
                placeholder="E-posta Adresi"
                placeholderTextColor={colors.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Şifre"
                placeholderTextColor={colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />

              <TouchableOpacity style={styles.authBtn} onPress={handleAuthAction} disabled={authLoading}>
                {authLoading ? (
                  <ActivityIndicator size="small" color={colors.background} />
                ) : (
                  <Text style={styles.authBtnText}>
                    {isLoginTab ? 'Bulut Senkronizasyonunu Başlat' : 'Yeni Yolculuk Başlat'}
                  </Text>
                )}
              </TouchableOpacity>
              
              <Text style={styles.authHelpText}>
                Bulut hesabınızı bağlayarak İrfan Puanı ve sohbet geçmişinizi yedekleyebilirsiniz.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: spacing.md,
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 16,
    padding: spacing.md,
  },
  cardTitle: {
    ...typography.subtitle,
    fontSize: 16,
    color: colors.accent,
    marginBottom: spacing.md,
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  rankBadge: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    marginRight: spacing.md,
  },
  rankInfo: {
    flex: 1,
  },
  rankTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  rankDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  progressContainer: {
    marginBottom: spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surfaceLight,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 8,
    borderRadius: 4,
  },
  progressSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 6,
    fontStyle: 'italic',
  },
  statsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    borderRadius: 10,
    padding: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  statVal: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  badgeCard: {
    width: '48%',
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    flexGrow: 1,
  },
  badgeLocked: {
    opacity: 0.4,
  },
  badgeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  badgeTitleUnlocked: {
    color: colors.accent,
  },
  badgeDesc: {
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  userInfo: {
    flex: 1,
  },
  userEmail: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  userStatus: {
    fontSize: 11,
    color: colors.accent,
    marginTop: 2,
  },
  logoutBtn: {
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: 10,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
  },
  logoutBtnText: {
    color: colors.error,
    fontSize: 14,
    fontWeight: '600',
  },
  authTabs: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceLight,
    borderRadius: 10,
    padding: 3,
    marginBottom: spacing.md,
  },
  authTab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: 8,
  },
  authTabActive: {
    backgroundColor: colors.accent,
  },
  authTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  authTabTextActive: {
    color: colors.background,
  },
  form: {
    gap: spacing.sm,
  },
  input: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    color: colors.text,
    fontSize: 14,
  },
  authBtn: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  authBtnText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '700',
  },
  authHelpText: {
    fontSize: 10,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
    lineHeight: 14,
  },
});

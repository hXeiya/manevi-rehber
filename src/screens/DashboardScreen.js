import React, { useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../components/ScreenHeader';
import ContentCard from '../components/ContentCard';
import { CULTURE_CONTENT } from '../constants/content';
import { getQuoteOfTheDay } from '../data/culture/quotes';
import { useApp } from '../context/AppContext';
import { colors, spacing, typography, shadows } from '../constants/theme';

function matchesSearch(item, query) {
  const q = query.toLowerCase();
  const parts = [
    item.title,
    item.subtitle,
    item.category,
    item.excerpt,
    item.period,
    ...(item.highlights || []),
    ...(item.timeline || []).flatMap((entry) => [
      entry.date,
      entry.era,
      entry.title,
      entry.description,
    ]),
    ...(item.sections || []).flatMap((section) => [
      section.heading,
      ...section.paragraphs,
    ]),
  ];

  return parts.some((part) => part && String(part).toLowerCase().includes(q));
}

export default function DashboardScreen({ navigation }) {
  const { ip } = useApp();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('rehber'); // 'rehber' | 'kavram' | 'dua'
  const quoteOfTheDay = useMemo(() => getQuoteOfTheDay(), []);

  const getRankName = (points) => {
    if (points >= 600) return 'Mutasavvıf';
    if (points >= 300) return 'Arif';
    if (points >= 100) return 'Salik';
    return 'Müptedi';
  };

  const filtered = useMemo(() => {
    const items = CULTURE_CONTENT.filter((item) => item.type === activeTab);
    if (!search.trim()) return items;
    return items.filter((item) => matchesSearch(item, search));
  }, [activeTab, search]);

  const handleCardPress = (item) => {
    navigation.navigate('DiscoverDetail', { item });
  };

  const renderHeader = () => (
    <View style={styles.listHeader}>
      <View style={styles.hero}>
        <View style={styles.heroBadge}>
          <Ionicons name="sparkles" size={14} color={colors.accent} />
          <Text style={styles.heroBadgeText}>Söz ve Hikmet Mirası</Text>
        </View>
        <Text style={styles.heroTitle}>Eskilerin Sözü, Bugünün Derdi</Text>
        <Text style={styles.heroText}>
          Âşıkların, bilgelerin ve gönül insanlarının hayat hikayelerine ve şifa rehberlerine dokunun.
          Eski sözler bugünün yalnızlığına, telaşına ve arayışına köprü olsun.
        </Text>
      </View>

      {/* Günün Hikmeti Kartı */}
      <View style={styles.quoteCard}>
        <View style={styles.quoteHeader}>
          <Ionicons name="chatbubble-ellipses-outline" size={16} color={colors.accent} />
          <Text style={styles.quoteHeaderTitle}>GÜNÜN HİKMETİ</Text>
        </View>
        <Text style={styles.quoteText}>“{quoteOfTheDay.text}”</Text>
        <Text style={styles.quoteAuthor}>— {quoteOfTheDay.author}</Text>
        <Text style={styles.quoteContext}>{quoteOfTheDay.context}</Text>
        <TouchableOpacity
          style={styles.quoteActionBtn}
          onPress={() => navigation.navigate('BilgeAI', { initialText: quoteOfTheDay.prompt })}
          activeOpacity={0.8}
        >
          <Ionicons name="chatbubbles" size={14} color={colors.accent} />
          <Text style={styles.quoteActionText}>BilgeAI ile bu sözü tefekkür et</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchWrap}>
        <Ionicons name="search" size={20} color={colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={
            activeTab === 'rehber'
              ? "Mevlana, Yunus, sabır veya bilgelik ara..."
              : activeTab === 'kavram'
              ? "Tevekkül, rıza, hüzün veya edep ara..."
              : "Şifa, ferahlık, bereket veya uyku duası ara..."
          }
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'rehber' && styles.activeTabButton]}
          onPress={() => {
            setActiveTab('rehber');
            setSearch('');
          }}
          activeOpacity={0.8}
        >
          <Ionicons
            name="people"
            size={15}
            color={activeTab === 'rehber' ? colors.background : colors.textSecondary}
          />
          <Text style={[styles.tabText, activeTab === 'rehber' && styles.activeTabText]}>
            Gönül Dostları
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'kavram' && styles.activeTabButton]}
          onPress={() => {
            setActiveTab('kavram');
            setSearch('');
          }}
          activeOpacity={0.8}
        >
          <Ionicons
            name="sparkles"
            size={15}
            color={activeTab === 'kavram' ? colors.background : colors.textSecondary}
          />
          <Text style={[styles.tabText, activeTab === 'kavram' && styles.activeTabText]}>
            Hikmetler
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'dua' && styles.activeTabButton]}
          onPress={() => {
            setActiveTab('dua');
            setSearch('');
          }}
          activeOpacity={0.8}
        >
          <Ionicons
            name="water"
            size={15}
            color={activeTab === 'dua' ? colors.background : colors.textSecondary}
          />
          <Text style={[styles.tabText, activeTab === 'dua' && styles.activeTabText]}>
            Manevi Dualar
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>
        {filtered.length} {activeTab === 'rehber' ? 'gönül rehberi' : activeTab === 'kavram' ? 'hikmet kavramı' : 'manevi dua'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Manevi Rehber"
        subtitle="Keşfet - aşk, sabır, hikmet ve dualar"
        rightElement={
          <View style={styles.headerBadge}>
            <Ionicons name="sparkles" size={12} color={colors.accent} />
            <Text style={styles.headerBadgeText}>{getRankName(ip)} ({ip} IP)</Text>
          </View>
        }
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ContentCard item={item} onPress={handleCardPress} />}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.empty}>Aramanızla eşleşen içerik bulunamadı.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  listHeader: {
    marginBottom: spacing.sm,
  },
  hero: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.accentSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    marginBottom: spacing.sm,
    gap: 6,
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.accent,
  },
  heroTitle: {
    ...typography.subtitle,
    fontSize: 20,
    marginBottom: spacing.sm,
  },
  heroText: {
    ...typography.caption,
    lineHeight: 20,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 48,
    color: colors.text,
    fontSize: 15,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 4,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    gap: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  activeTabButton: {
    backgroundColor: colors.accent,
  },
  tabText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.background,
    fontWeight: '700',
  },
  sectionTitle: {
    ...typography.small,
    fontWeight: '600',
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  empty: {
    ...typography.caption,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  quoteCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
    ...shadows.card,
  },
  quoteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacing.sm,
  },
  quoteHeaderTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.accent,
    letterSpacing: 1,
  },
  quoteText: {
    fontSize: 15,
    fontStyle: 'italic',
    lineHeight: 22,
    color: colors.text,
    marginBottom: spacing.xs,
    fontWeight: '500',
  },
  quoteAuthor: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.accent,
    textAlign: 'right',
    marginBottom: spacing.xs,
  },
  quoteContext: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  quoteActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.accentSoft,
    paddingVertical: 10,
    borderRadius: 10,
  },
  quoteActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.accent,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    marginBottom: 4,
  },
  headerBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.accent,
  },
});


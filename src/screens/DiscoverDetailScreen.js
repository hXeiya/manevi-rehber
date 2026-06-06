import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import TimelineItem from '../components/TimelineItem';
import CultureImageBlock, { CultureImageGallery } from '../components/CultureImageBlock';
import { colors, spacing, typography } from '../constants/theme';
import { useApp } from '../context/AppContext';

export default function DiscoverDetailScreen({ route, navigation }) {
  const { item } = route.params;
  const insets = useSafeAreaInsets();
  const { markGuideAsRead } = useApp();

  React.useEffect(() => {
    if (item && item.id) {
      markGuideAsRead(item.id);
    }
  }, [item]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle} numberOfLines={1}>
          {item.category}
        </Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          {item.coverImage ? (
            <CultureImageBlock
              image={{
                url: item.coverImage,
                caption: item.images?.[0]?.caption,
                credit: item.images?.[0]?.credit,
              }}
              variant="hero"
            />
          ) : (
            <View style={styles.iconWrap}>
              <Ionicons name={item.icon || 'book'} size={32} color={colors.accent} />
            </View>
          )}
          <Text style={styles.category}>{item.category}</Text>
          <Text style={styles.title}>{item.title}</Text>
          {item.subtitle ? (
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          ) : null}
          <View style={styles.metaRow}>
            {item.period ? (
              <View style={styles.badge}>
                <Ionicons name="calendar-outline" size={14} color={colors.accent} />
                <Text style={styles.badgeText}>{item.period}</Text>
              </View>
            ) : null}
            <Text style={styles.readTime}>{item.readTime}</Text>
          </View>
        </View>

        {item.images?.length > 1 ? (
          <CultureImageGallery
            images={item.images.slice(1)}
            title="Konuyla ilgili görseller"
          />
        ) : null}

        {item.timeline?.length > 0 ? (
          <View style={styles.block}>
            <Text style={styles.sectionHeading}>Kronoloji ve Tarihler</Text>
            <Text style={styles.sectionIntro}>
              Önemli tarihler, dönemler ve olaylar kronolojik sırayla:
            </Text>
            {item.timeline.map((entry, index) => (
              <TimelineItem
                key={`${entry.date}-${index}`}
                item={entry}
                isLast={index === item.timeline.length - 1}
              />
            ))}
          </View>
        ) : null}

        {item.sections?.map((section, index) => (
          <View key={section.heading} style={styles.block}>
            <Text style={styles.sectionHeading}>{section.heading}</Text>
            {section.paragraphs.map((paragraph, pIndex) => (
              <Text key={pIndex} style={styles.paragraph}>
                {paragraph}
              </Text>
            ))}
          </View>
        ))}

        {item.highlights?.length > 0 ? (
          <View style={styles.block}>
            <Text style={styles.sectionHeading}>Öne Çıkanlar</Text>
            {item.highlights.map((point) => (
              <View key={point} style={styles.highlightRow}>
                <Ionicons name="star" size={14} color={colors.accent} />
                <Text style={styles.highlightText}>{point}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <TouchableOpacity
          style={styles.aiButton}
          onPress={() => {
            const prompt =
              item.type === 'rehber'
                ? `${item.title} (${item.period}) hakkında konuşmak istiyorum. Onun hayata, derde ve sabra dair manevi öğretilerini ve bugünün dünyasında yalnızlaşan ruhumuza getireceği şifaları bana anlatır mısın bilge dostum?`
                : item.type === 'kavram'
                ? `Tasavvuftaki '${item.title}' kavramı hakkında konuşmak istiyorum. '${item.subtitle}' düsturunun manevi psikolojimiz üzerindeki derinliğini, stres ve kaygılarımızı yönetmedeki yerini bana anlatır mısın bilge dostum?`
                : `'${item.title}' (${item.subtitle}) münacatı hakkında konuşmak istiyorum. Bu manevi duanın/niyazın ruhsal sıkıntılarımıza, panik ve gelecek kaygılarımıza getireceği sekine ve şifa boyutunu bana açıklar mısın bilge dostum?`;
            navigation.navigate('BilgeAI', { initialText: prompt, autoSend: true });
          }}
        >
          <Ionicons name="chatbubbles" size={20} color={colors.background} />
          <Text style={styles.aiButtonText}>BilgeAI ile bu konuyu sor</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBarTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  scroll: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl * 2,
  },
  hero: {
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    marginBottom: spacing.lg,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: colors.accentSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  category: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.title,
    fontSize: 24,
    lineHeight: 32,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.caption,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: spacing.md,
    color: colors.textSecondary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  readTime: {
    ...typography.small,
  },
  block: {
    marginBottom: spacing.lg,
  },
  sectionHeading: {
    ...typography.subtitle,
    fontSize: 18,
    marginBottom: spacing.sm,
    color: colors.accent,
  },
  sectionIntro: {
    ...typography.caption,
    marginBottom: spacing.md,
  },
  paragraph: {
    ...typography.body,
    fontSize: 15,
    lineHeight: 24,
    marginBottom: spacing.md,
    color: colors.textSecondary,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.sm,
    paddingRight: spacing.sm,
  },
  highlightText: {
    flex: 1,
    ...typography.caption,
    lineHeight: 20,
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    borderRadius: 12,
    marginTop: spacing.md,
  },
  aiButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.background,
  },
});

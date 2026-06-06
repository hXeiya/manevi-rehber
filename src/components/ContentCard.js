import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, shadows } from '../constants/theme';
import { remoteImageSource } from '../utils/imageSource';

export default function ContentCard({ item, onPress }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(item)}
      activeOpacity={0.85}
    >
      {item.coverImage ? (
        <Image
          source={remoteImageSource(item.coverImage)}
          style={styles.thumb}
          contentFit="cover"
          transition={200}
          cachePolicy="memory-disk"
        />
      ) : (
        <View style={styles.iconWrap}>
          <Ionicons name={item.icon || 'book'} size={24} color={colors.accent} />
        </View>
      )}
      <View style={styles.content}>
        <View style={styles.metaRow}>
          <Text style={styles.category}>{item.category}</Text>
          <Text style={styles.readTime}>{item.readTime}</Text>
        </View>
        {item.period ? (
          <Text style={styles.period} numberOfLines={1}>
            {item.period}
          </Text>
        ) : null}
        <Text style={styles.title} numberOfLines={3}>
          {item.title}
        </Text>
        {item.subtitle ? (
          <Text style={styles.subtitle} numberOfLines={2}>
            {item.subtitle}
          </Text>
        ) : null}
        <Text style={styles.excerpt} numberOfLines={2}>
          {item.excerpt}
        </Text>
        <View style={styles.footerRow}>
          {item.images?.length ? (
            <Text style={styles.imageHint}>
              {item.images.length} görsel
            </Text>
          ) : null}
          {item.timeline?.length ? (
            <Text style={styles.timelineHint}>
              {item.timeline.length} durak
            </Text>
          ) : null}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadows.card,
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: 12,
    marginRight: spacing.md,
    backgroundColor: colors.surfaceLight,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: colors.accentSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
    marginRight: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  category: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    flex: 1,
  },
  readTime: {
    ...typography.small,
  },
  period: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 2,
  },
  title: {
    ...typography.subtitle,
    fontSize: 15,
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
    marginBottom: spacing.xs,
  },
  excerpt: {
    ...typography.caption,
    fontSize: 12,
    lineHeight: 17,
  },
  footerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  imageHint: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
  timelineHint: {
    fontSize: 11,
    color: colors.accent,
    fontWeight: '600',
  },
});

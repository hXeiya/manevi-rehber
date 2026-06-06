import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../constants/theme';

export default function TimelineItem({ item, isLast }) {
  return (
    <View style={styles.row}>
      <View style={styles.rail}>
        <View style={styles.dot} />
        {!isLast && <View style={styles.line} />}
      </View>
      <View style={[styles.body, !isLast && styles.bodySpaced]}>
        <View style={styles.dateRow}>
          <Text style={styles.date}>{item.date}</Text>
          {item.era ? <Text style={styles.era}>{item.era}</Text> : null}
        </View>
        {item.title ? <Text style={styles.eventTitle}>{item.title}</Text> : null}
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  rail: {
    width: 20,
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent,
    marginTop: 4,
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: colors.cardBorder,
    marginTop: 4,
  },
  body: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  bodySpaced: {
    paddingBottom: spacing.lg,
  },
  dateRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  date: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.accent,
  },
  era: {
    fontSize: 11,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  eventTitle: {
    ...typography.subtitle,
    fontSize: 15,
    marginBottom: spacing.xs,
  },
  description: {
    ...typography.caption,
    lineHeight: 20,
  },
});

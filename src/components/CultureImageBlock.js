import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../constants/theme';
import { remoteImageSource } from '../utils/imageSource';

export default function CultureImageBlock({ image, variant = 'card' }) {
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);
  const isHero = variant === 'hero';
  const source = remoteImageSource(image?.url);

  if (!source) {
    return null;
  }

  if (failed) {
    return (
      <View style={[styles.placeholder, isHero && styles.placeholderHero]}>
        <Ionicons name="image-outline" size={32} color={colors.textMuted} />
        <Text style={styles.placeholderText}>Görsel yüklenemedi</Text>
        <Text style={styles.placeholderHint}>İnternet bağlantınızı kontrol edin</Text>
      </View>
    );
  }

  return (
    <View style={[styles.wrap, isHero && styles.wrapHero]}>
      <View style={[styles.imageFrame, isHero && styles.imageFrameHero]}>
        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator color={colors.accent} />
          </View>
        ) : null}
        <Image
          source={source}
          style={[styles.image, isHero && styles.imageHero]}
          contentFit="cover"
          transition={300}
          cachePolicy="memory-disk"
          onLoadStart={() => setLoading(true)}
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setFailed(true);
          }}
          accessibilityLabel={image.caption}
        />
      </View>
      {image.caption ? <Text style={styles.caption}>{image.caption}</Text> : null}
      {image.credit ? <Text style={styles.credit}>{image.credit}</Text> : null}
    </View>
  );
}

export function CultureImageGallery({ images, title = 'Görseller' }) {
  if (!images?.length) return null;

  return (
    <View style={styles.gallery}>
      <Text style={styles.galleryTitle}>{title}</Text>
      {images.map((img, index) => (
        <CultureImageBlock key={`${img.url}-${index}`} image={img} variant="card" />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.md,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.surface,
  },
  wrapHero: {
    marginBottom: spacing.lg,
    borderRadius: 14,
  },
  imageFrame: {
    width: '100%',
    height: 200,
    backgroundColor: colors.surfaceLight,
  },
  imageFrameHero: {
    height: 220,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageHero: {
    height: '100%',
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    backgroundColor: colors.surfaceLight,
  },
  caption: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 19,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    fontWeight: '600',
  },
  credit: {
    fontSize: 11,
    color: colors.textMuted,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    paddingTop: 2,
    fontStyle: 'italic',
  },
  placeholder: {
    height: 160,
    borderRadius: 12,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.md,
  },
  placeholderHero: {
    height: 200,
  },
  placeholderText: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: spacing.xs,
    fontWeight: '600',
  },
  placeholderHint: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 4,
    textAlign: 'center',
  },
  gallery: {
    marginBottom: spacing.lg,
  },
  galleryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.accent,
    marginBottom: spacing.md,
  },
});

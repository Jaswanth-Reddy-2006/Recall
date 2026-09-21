import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Sparkles, Globe, ArrowUpRight } from 'lucide-react-native';
import { Memory } from '../../types';
import { colors, typography, radii, spacing } from '../../constants/theme';
import { CategoryChip } from '../ui/CategoryChip';

interface Props {
  memory: Memory;
  searchReason?: string;
  onPress?: () => void;
}

export const MemoryCard: React.FC<Props> = ({ memory, searchReason, onPress }) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/memory/${memory.id}`);
    }
  };

  const formattedDate = React.useMemo(() => {
    try {
      const date = new Date(memory.createdAt);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours < 1) return 'Just now';
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return 'Recently';
    }
  }, [memory.createdAt]);

  const previewSnippet = memory.summary || memory.content || '';
  const detectedAction = memory.ai?.detectedActions?.[0];

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Memory: ${memory.title}`}
    >
      <View style={styles.contentRow}>
        <View style={styles.mainCol}>
          {/* Topline: Category badge, Source, Relative Time */}
          <View style={styles.topline}>
            <CategoryChip category={memory.category} size="sm" />
            {memory.source && (
              <Text style={styles.sourceText} numberOfLines={1}>
                {memory.source}
              </Text>
            )}
            <Text style={styles.timeText}>• {formattedDate}</Text>
          </View>

          {/* WHAT: Title */}
          <Text style={styles.title} numberOfLines={2}>
            {memory.title}
          </Text>

          {/* WHY: AI summary snippet */}
          {previewSnippet ? (
            <Text style={styles.snippet} numberOfLines={2}>
              {previewSnippet}
            </Text>
          ) : null}

          {/* Contextual Search Match Rationale with Blue/Pink */}
          {searchReason ? (
            <View style={styles.reasonBadge}>
              <Sparkles size={11} color={colors.brandPink} />
              <Text style={styles.reasonText} numberOfLines={1}>
                {searchReason}
              </Text>
            </View>
          ) : null}

          {/* Connected Action Pill */}
          {detectedAction ? (
            <View style={styles.actionPill}>
              <View style={styles.actionIndicator} />
              <Text style={styles.actionText} numberOfLines={1}>
                Action: {detectedAction.title}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Thumbnail / Domain Cue */}
        {memory.metadata?.imageUri ? (
          <Image
            source={{ uri: memory.metadata.imageUri }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
        ) : memory.type === 'link' ? (
          <View style={styles.linkIconBox}>
            <Globe size={18} color={colors.primaryBlue} />
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginHorizontal: spacing.base,
    marginBottom: spacing.sm,
    shadowColor: '#172033',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  mainCol: {
    flex: 1,
  },
  topline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  sourceText: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    maxWidth: 120,
  },
  timeText: {
    fontSize: typography.sizes.caption,
    color: colors.textMuted,
  },
  title: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    lineHeight: 20,
    marginBottom: 2,
  },
  snippet: {
    fontSize: typography.sizes.secondary,
    color: colors.textSecondary,
    lineHeight: 18,
    marginTop: 2,
  },
  thumbnail: {
    width: 52,
    height: 52,
    borderRadius: radii.sm,
    backgroundColor: colors.cardSubtle,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginTop: 2,
  },
  linkIconBox: {
    width: 38,
    height: 38,
    borderRadius: radii.sm,
    backgroundColor: colors.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.blueBorder,
    marginTop: 2,
  },
  reasonBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.pinkVerySoft,
    borderWidth: 1,
    borderColor: colors.pinkBorder,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radii.xs,
    marginTop: spacing.xs + 2,
    alignSelf: 'flex-start',
  },
  reasonText: {
    fontSize: typography.sizes.caption,
    color: colors.pinkDark,
    fontWeight: typography.weights.medium,
  },
  actionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.blueSoft,
    borderWidth: 1,
    borderColor: colors.blueBorder,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radii.xs,
    marginTop: spacing.xs + 2,
    alignSelf: 'flex-start',
  },
  actionIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primaryBlue,
  },
  actionText: {
    fontSize: typography.sizes.caption,
    color: colors.blueDeep,
    fontWeight: typography.weights.medium,
  },
});

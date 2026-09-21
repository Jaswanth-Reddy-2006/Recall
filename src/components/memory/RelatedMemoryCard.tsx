import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Sparkles, ArrowRight } from 'lucide-react-native';
import { Memory } from '../../types';
import { colors, typography, radii, spacing } from '../../constants/theme';
import { MemoryTypeIcon } from '../ui/MemoryTypeIcon';
import { CategoryChip } from '../ui/CategoryChip';

interface Props {
  memory: Memory;
  relationReason?: string;
}

export const RelatedMemoryCard: React.FC<Props> = ({ memory, relationReason }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/memory/${memory.id}`)}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Related memory: ${memory.title}`}
    >
      <View style={styles.topRow}>
        <View style={styles.iconWrap}>
          <MemoryTypeIcon type={memory.type} size={12} color={colors.primary} />
        </View>
        <CategoryChip category={memory.category} size="sm" />
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {memory.title}
      </Text>

      {relationReason ? (
        <View style={styles.reasonWrap}>
          <Sparkles size={10} color={colors.primary} />
          <Text style={styles.reasonText} numberOfLines={1}>
            {relationReason}
          </Text>
        </View>
      ) : memory.summary ? (
        <Text style={styles.summary} numberOfLines={2}>
          {memory.summary}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 210,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginRight: spacing.sm,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  iconWrap: {
    backgroundColor: colors.primaryLight,
    padding: 3,
    borderRadius: radii.xs,
  },
  title: {
    fontSize: typography.sizes.secondary,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    lineHeight: 18,
    marginBottom: 4,
  },
  reasonWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radii.xs,
    marginTop: 2,
  },
  reasonText: {
    fontSize: 10,
    color: colors.primaryDark,
    fontWeight: typography.weights.medium,
  },
  summary: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    lineHeight: 15,
  },
});

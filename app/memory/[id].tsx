import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ExternalLink,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowLeft,
  Share2,
} from 'lucide-react-native';
import { colors, typography, radii, spacing } from '../../src/constants/theme';
import { useMemoryStore } from '../../src/store/useMemoryStore';
import { searchService } from '../../src/services/search/SearchService';
import { CategoryChip } from '../../src/components/ui/CategoryChip';
import { TagChip } from '../../src/components/ui/TagChip';
import { MemoryTypeIcon } from '../../src/components/ui/MemoryTypeIcon';
import { RelatedMemoryCard } from '../../src/components/memory/RelatedMemoryCard';

export default function MemoryDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { memories, actions, deleteMemory, toggleActionComplete } = useMemoryStore();

  const memory = useMemo(() => {
    return memories.find((m) => m.id === id);
  }, [memories, id]);

  const relatedMemories = useMemo(() => {
    if (!memory) return [];
    return searchService.getRelatedMemories(memory, memories);
  }, [memory, memories]);

  const associatedAction = useMemo(() => {
    return actions.find((a) => a.sourceMemoryId === id);
  }, [actions, id]);

  if (!memory) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.notFoundText}>Memory not found</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Delete Memory',
      'Are you sure you want to remove this memory and its attached commitments from Recall?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteMemory(memory.id);
            router.back();
          },
        },
      ]
    );
  };

  const handleOpenUrl = () => {
    if (memory.metadata?.url) {
      Linking.openURL(memory.metadata.url).catch(() => {
        Alert.alert('Could not open link');
      });
    }
  };

  const formattedDate = new Date(memory.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Context Inspector Header */}
      <View style={styles.topInfo}>
        <View style={styles.metaRow}>
          <CategoryChip category={memory.category} />
          <View style={styles.typeBadge}>
            <MemoryTypeIcon type={memory.type} size={12} />
            <Text style={styles.typeText}>{memory.type.toUpperCase()}</Text>
          </View>
          <Text style={styles.dateText}>{formattedDate}</Text>
        </View>

        <Text style={styles.title}>{memory.title}</Text>
      </View>

      {/* Action Commitment Detected */}
      {associatedAction && (
        <View
          style={[
            styles.actionCard,
            associatedAction.status === 'completed' && styles.actionCardCompleted,
          ]}
        >
          <View style={styles.actionCardHeader}>
            <View style={styles.actionCardLeft}>
              <Sparkles size={13} color={colors.primary} />
              <Text style={styles.actionCardLabel}>ACTION DETECTED FROM THIS MEMORY</Text>
            </View>
            {associatedAction.dueDate && (
              <View style={styles.dueBadge}>
                <Clock size={11} color={colors.textSecondary} />
                <Text style={styles.dueBadgeText}>{associatedAction.dueDate}</Text>
              </View>
            )}
          </View>

          <Text
            style={[
              styles.actionTitle,
              associatedAction.status === 'completed' && styles.actionTitleCompleted,
            ]}
          >
            {associatedAction.title}
          </Text>

          <TouchableOpacity
            style={[
              styles.actionToggleBtn,
              associatedAction.status === 'completed' && styles.actionToggleBtnDone,
            ]}
            onPress={() => toggleActionComplete(associatedAction.id)}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={
              associatedAction.status === 'completed'
                ? 'Mark action as pending'
                : 'Mark action as completed'
            }
          >
            <CheckCircle2
              size={15}
              color={associatedAction.status === 'completed' ? colors.success : colors.white}
            />
            <Text
              style={[
                styles.actionToggleText,
                associatedAction.status === 'completed' && styles.actionToggleTextDone,
              ]}
            >
              {associatedAction.status === 'completed' ? 'Completed' : 'Mark Complete'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* AI Summary Block */}
      {memory.summary ? (
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionLabel}>AI SUMMARY</Text>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryText}>{memory.summary}</Text>
          </View>
        </View>
      ) : null}

      {/* Original Source Content */}
      <View style={styles.sectionBlock}>
        <Text style={styles.sectionLabel}>CAPTURED SOURCE</Text>

        {memory.metadata?.imageUri ? (
          <View style={styles.imageCard}>
            <Image
              source={{ uri: memory.metadata.imageUri }}
              style={styles.sourceImage}
              resizeMode="contain"
            />
            <View style={styles.imageCaption}>
              <Text style={styles.imageCaptionText}>Original screenshot preserved</Text>
            </View>
          </View>
        ) : null}

        {memory.metadata?.url ? (
          <TouchableOpacity
            style={styles.urlCard}
            onPress={handleOpenUrl}
            activeOpacity={0.8}
            accessibilityRole="link"
            accessibilityLabel="Open original URL"
          >
            <View style={styles.urlCardContent}>
              <Text style={styles.urlTitle} numberOfLines={1}>
                {memory.title}
              </Text>
              <Text style={styles.urlSubtitle} numberOfLines={1}>
                {memory.metadata.url}
              </Text>
            </View>
            <ExternalLink size={16} color={colors.primary} />
          </TouchableOpacity>
        ) : null}

        {memory.content && memory.type !== 'screenshot' ? (
          <View style={styles.contentCard}>
            <Text style={styles.contentText}>{memory.content}</Text>
          </View>
        ) : null}
      </View>

      {/* Tags */}
      {memory.tags.length > 0 && (
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionLabel}>TAGS & TOPICS</Text>
          <View style={styles.tagsRow}>
            {memory.tags.map((tag, idx) => (
              <TagChip key={idx} tag={tag} />
            ))}
          </View>
        </View>
      )}

      {/* Related Memories (Context Graph) */}
      {relatedMemories.length > 0 && (
        <View style={styles.sectionBlock}>
          <View style={styles.relatedHeader}>
            <Text style={styles.sectionLabel}>RELATED MEMORIES IN CONTEXT</Text>
            <Text style={styles.relatedSub}>Connected through shared topics and category</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.relatedScroll}
          >
            {relatedMemories.map((rel) => {
              const sharedTag = rel.tags.find((t) => memory.tags.includes(t));
              const relationReason = sharedTag
                ? `Related because: ${sharedTag} · ${memory.category}`
                : `Related by ${memory.category}`;

              return (
                <RelatedMemoryCard
                  key={rel.id}
                  memory={rel}
                  relationReason={relationReason}
                />
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Actions Footer */}
      <View style={styles.footerActions}>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={handleDelete}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel="Delete memory"
        >
          <Trash2 size={15} color={colors.danger} />
          <Text style={styles.deleteBtnText}>Delete from Recall</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: spacing.base,
    paddingBottom: spacing.xxl,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  notFoundText: {
    fontSize: typography.sizes.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  backBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
  },
  backBtnText: {
    color: colors.white,
    fontWeight: typography.weights.semibold,
  },
  topInfo: {
    marginBottom: spacing.base,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.cardSubtle,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typeText: {
    fontSize: 9,
    fontWeight: typography.weights.bold,
    color: colors.textSecondary,
  },
  dateText: {
    fontSize: typography.sizes.caption,
    color: colors.textMuted,
    marginLeft: 'auto',
  },
  title: {
    fontSize: typography.sizes.screenTitle,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    lineHeight: 32,
  },
  actionCard: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    padding: spacing.md,
    marginBottom: spacing.base,
  },
  actionCardCompleted: {
    borderColor: colors.border,
    backgroundColor: colors.cardSubtle,
  },
  actionCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  actionCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionCardLabel: {
    fontSize: 9,
    fontWeight: typography.weights.bold,
    color: colors.primaryDark,
    letterSpacing: 0.6,
  },
  dueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  dueBadgeText: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  actionTitle: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  actionTitleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  actionToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 8,
    borderRadius: radii.sm,
    gap: spacing.xs,
  },
  actionToggleBtnDone: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.success,
  },
  actionToggleText: {
    color: colors.white,
    fontSize: typography.sizes.secondary,
    fontWeight: typography.weights.semibold,
  },
  actionToggleTextDone: {
    color: colors.success,
  },
  sectionBlock: {
    marginBottom: spacing.base,
  },
  sectionLabel: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.semibold,
    color: colors.textMuted,
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  summaryText: {
    fontSize: typography.sizes.body,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  imageCard: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  sourceImage: {
    width: '100%',
    height: 200,
    backgroundColor: colors.cardSubtle,
  },
  imageCaption: {
    padding: spacing.sm,
    backgroundColor: colors.cardSubtle,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  imageCaptionText: {
    fontSize: typography.sizes.caption,
    color: colors.textMuted,
    textAlign: 'center',
  },
  urlCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.md,
  },
  urlCardContent: {
    flex: 1,
  },
  urlTitle: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  urlSubtitle: {
    fontSize: typography.sizes.caption,
    color: colors.primary,
    marginTop: 2,
  },
  contentCard: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  contentText: {
    fontSize: typography.sizes.body,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  relatedHeader: {
    marginBottom: 4,
  },
  relatedSub: {
    fontSize: typography.sizes.caption,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  relatedScroll: {
    paddingVertical: 2,
  },
  footerActions: {
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.base,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
  deleteBtnText: {
    fontSize: typography.sizes.secondary,
    color: colors.danger,
    fontWeight: typography.weights.medium,
  },
});

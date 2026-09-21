import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Check, Calendar, ArrowUpRight, Clock, BellOff } from 'lucide-react-native';
import { Action } from '../../types';
import { colors, typography, radii, spacing } from '../../constants/theme';
import { MemoryTypeIcon } from '../ui/MemoryTypeIcon';

interface Props {
  action: Action;
  onToggleComplete: () => void;
  onPress?: () => void;
  onSnooze?: () => void;
}

export const TaskCard: React.FC<Props> = ({ action, onToggleComplete, onPress, onSnooze }) => {
  const router = useRouter();
  const isCompleted = action.status === 'completed';
  const isSnoozed = action.status === 'snoozed';

  const navigateToSource = () => {
    if (action.sourceMemoryId) {
      if (action.sourceType === 'call') {
        router.push(`/calls/${action.sourceMemoryId}` as any);
      } else {
        router.push(`/memory/${action.sourceMemoryId}` as any);
      }
    }
  };

  const getActionTypeDetails = () => {
    switch (action.type) {
      case 'deadline':
        return { label: 'Deadline', bg: colors.dangerLight, text: colors.danger };
      case 'waiting':
        return { label: 'Waiting For', bg: colors.warningLight, text: colors.warning };
      case 'follow_up':
        return { label: 'Follow Up', bg: colors.infoLight, text: colors.info };
      default:
        return { label: 'Task', bg: colors.primaryLight, text: colors.primaryDark };
    }
  };

  const typeDetails = getActionTypeDetails();

  return (
    <View style={[styles.card, isCompleted && styles.cardCompleted]}>
      <View style={styles.topRow}>
        {/* Completion Checkbox with 44px minimum touch target */}
        <TouchableOpacity
          style={styles.checkboxTouchArea}
          onPress={onToggleComplete}
          activeOpacity={0.7}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: isCompleted }}
          accessibilityLabel={`Mark ${action.title} as ${isCompleted ? 'incomplete' : 'complete'}`}
        >
          <View style={[styles.checkbox, isCompleted && styles.checkboxChecked]}>
            {isCompleted && <Check size={13} color={colors.white} strokeWidth={2.8} />}
          </View>
        </TouchableOpacity>

        {/* Content Body: Tapping opens detail modal */}
        <TouchableOpacity
          style={styles.content}
          onPress={onPress}
          activeOpacity={onPress ? 0.75 : 1}
          accessibilityRole={onPress ? 'button' : undefined}
          accessibilityLabel={`Action: ${action.title}. Tap to view details.`}
        >
          <View style={styles.badgeRow}>
            <View style={[styles.typeBadge, { backgroundColor: typeDetails.bg }]}>
              <Text style={[styles.typeBadgeText, { color: typeDetails.text }]}>
                {typeDetails.label}
              </Text>
            </View>

            {action.dueDate ? (
              <View style={styles.dueBadge}>
                <Clock size={11} color={colors.textSecondary} />
                <Text style={styles.dueText}>{action.dueDate}</Text>
              </View>
            ) : null}

            {isSnoozed ? (
              <View style={styles.snoozedBadge}>
                <BellOff size={11} color={colors.textMuted} />
                <Text style={styles.snoozedText}>Snoozed</Text>
              </View>
            ) : null}
          </View>

          {/* Action Title */}
          <Text style={[styles.title, isCompleted && styles.titleCompleted]}>
            {action.title}
          </Text>
        </TouchableOpacity>

        {/* Snooze action trigger if pending */}
        {!isCompleted && onSnooze && (
          <TouchableOpacity
            style={styles.snoozeBtn}
            onPress={onSnooze}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Snooze action"
          >
            <BellOff size={14} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Source Memory Attenuation Row */}
      {action.sourceMemoryId ? (
        <TouchableOpacity
          style={styles.sourceRow}
          onPress={navigateToSource}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={`View source memory: ${action.sourceTitle || 'original note'}`}
        >
          <MemoryTypeIcon
            type={action.sourceType || 'screenshot'}
            size={12}
            color={colors.primary}
          />
          <Text style={styles.sourcePrefix}>Captured from:</Text>
          <Text style={styles.sourceTitle} numberOfLines={1}>
            {action.sourceTitle || 'Source Memory'}
          </Text>
          <ArrowUpRight size={11} color={colors.primary} />
        </TouchableOpacity>
      ) : null}
    </View>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  cardCompleted: {
    opacity: 0.55,
    backgroundColor: colors.background,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkboxTouchArea: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -spacing.xs,
    marginTop: -4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.6,
    borderColor: colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  checkboxChecked: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  content: {
    flex: 1,
    paddingLeft: spacing.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: 4,
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: radii.xs,
  },
  typeBadgeText: {
    fontSize: 9,
    fontWeight: typography.weights.semibold,
    textTransform: 'uppercase',
  },
  dueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  dueText: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  snoozedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.cardSubtle,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: radii.xs,
  },
  snoozedText: {
    fontSize: typography.sizes.caption,
    color: colors.textMuted,
  },
  title: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2.5,
    borderRadius: radii.xs,
    alignSelf: 'flex-start',
    marginLeft: 32,
    marginTop: 4,
  },
  sourcePrefix: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
  },
  sourceTitle: {
    fontSize: typography.sizes.caption,
    color: colors.primary,
    fontWeight: typography.weights.medium,
    maxWidth: 180,
  },
  snoozeBtn: {
    padding: spacing.xs,
    alignSelf: 'flex-start',
  },
});

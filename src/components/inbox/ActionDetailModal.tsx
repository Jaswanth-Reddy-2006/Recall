import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  X,
  Check,
  Calendar,
  Clock,
  Hourglass,
  CheckCircle2,
  Trash2,
  ArrowUpRight,
  Sparkles,
  Tag,
} from 'lucide-react-native';
import { Action, ActionType, ActionStatus } from '../../types';
import { colors, typography, radii, spacing } from '../../constants/theme';
import { MemoryTypeIcon } from '../ui/MemoryTypeIcon';

interface Props {
  visible: boolean;
  action: Action | null;
  onClose: () => void;
  onUpdate: (updated: Action) => void;
  onDelete: (actionId: string) => void;
  onToggleComplete: (actionId: string) => void;
}

const ACTION_TYPES: { type: ActionType; label: string; icon: any; color: string }[] = [
  { type: 'task', label: 'Task', icon: CheckCircle2, color: colors.primaryBlue },
  { type: 'deadline', label: 'Deadline', icon: Calendar, color: colors.brandPink },
  { type: 'waiting', label: 'Waiting For', icon: Hourglass, color: colors.warning },
  { type: 'follow_up', label: 'Follow Up', icon: Clock, color: '#7C3AED' },
];

export const ActionDetailModal: React.FC<Props> = ({
  visible,
  action,
  onClose,
  onUpdate,
  onDelete,
  onToggleComplete,
}) => {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [selectedType, setSelectedType] = useState<ActionType>('task');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (action) {
      setTitle(action.title);
      setDueDate(action.dueDate || '');
      setSelectedType(action.type);
      setIsEditing(false);
    }
  }, [action]);

  if (!action) return null;

  const isCompleted = action.status === 'completed';

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Title Required', 'Action title cannot be empty.');
      return;
    }
    const updated: Action = {
      ...action,
      title: title.trim(),
      dueDate: dueDate.trim() || undefined,
      type: selectedType,
    };
    onUpdate(updated);
    setIsEditing(false);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Action',
      'Are you sure you want to remove this action from your inbox?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            onDelete(action.id);
            onClose();
          },
        },
      ]
    );
  };

  const handleNavigateToSource = () => {
    if (!action.sourceMemoryId) return;
    onClose();
    if (action.sourceType === 'call') {
      router.push(`/calls/${action.sourceMemoryId}` as any);
    } else {
      router.push(`/memory/${action.sourceMemoryId}` as any);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.handle} />

          {/* Top Bar */}
          <View style={styles.topBar}>
            <View style={styles.badgeRow}>
              <View
                style={[
                  styles.statusBadge,
                  isCompleted ? styles.statusBadgeDone : styles.statusBadgePending,
                ]}
              >
                <Text
                  style={[
                    styles.statusBadgeText,
                    isCompleted ? styles.statusBadgeTextDone : styles.statusBadgeTextPending,
                  ]}
                >
                  {isCompleted ? 'Completed' : 'Pending Action'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              accessibilityRole="button"
              accessibilityLabel="Close action details"
            >
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Title */}
            <Text style={styles.fieldLabel}>ACTION ITEM</Text>
            <TextInput
              style={styles.titleInput}
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                setIsEditing(true);
              }}
              placeholder="Action title"
              placeholderTextColor={colors.textMuted}
              multiline
            />

            {/* Type Selector */}
            <Text style={styles.fieldLabel}>CLASSIFICATION</Text>
            <View style={styles.typeSelectorRow}>
              {ACTION_TYPES.map((t) => {
                const IconComponent = t.icon;
                const isSelected = selectedType === t.type;
                return (
                  <TouchableOpacity
                    key={t.type}
                    style={[
                      styles.typeChip,
                      isSelected && { borderColor: t.color, backgroundColor: `${t.color}15` },
                    ]}
                    onPress={() => {
                      setSelectedType(t.type);
                      setIsEditing(true);
                    }}
                    activeOpacity={0.7}
                  >
                    <IconComponent
                      size={13}
                      color={isSelected ? t.color : colors.textMuted}
                    />
                    <Text
                      style={[
                        styles.typeChipText,
                        isSelected && { color: t.color, fontWeight: typography.weights.bold },
                      ]}
                    >
                      {t.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Due Date Input */}
            <Text style={styles.fieldLabel}>DUE DATE OR COMMITMENT TIME</Text>
            <View style={styles.dateInputRow}>
              <Clock size={15} color={colors.textMuted} />
              <TextInput
                style={styles.dateInput}
                value={dueDate}
                onChangeText={(text) => {
                  setDueDate(text);
                  setIsEditing(true);
                }}
                placeholder="e.g. Friday, Tomorrow at 3 PM, Next week"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            {/* Source Memory Attribution Card */}
            {action.sourceMemoryId ? (
              <View style={styles.sourceContainer}>
                <Text style={styles.fieldLabel}>ORIGINATING CONTEXT</Text>
                <TouchableOpacity
                  style={styles.sourceCard}
                  onPress={handleNavigateToSource}
                  activeOpacity={0.8}
                >
                  <View style={styles.sourceLeft}>
                    <View style={styles.sourceIconBox}>
                      <MemoryTypeIcon
                        type={action.sourceType || 'screenshot'}
                        size={16}
                        color={colors.primaryBlue}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.sourceTitle} numberOfLines={1}>
                        {action.sourceTitle || 'Source Memory'}
                      </Text>
                      <Text style={styles.sourceSubtitle}>
                        Tapped to open the original capture
                      </Text>
                    </View>
                  </View>
                  <ArrowUpRight size={16} color={colors.primaryBlue} />
                </TouchableOpacity>
              </View>
            ) : null}

            {/* Save Changes button if edited */}
            {isEditing && (
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSave}
                activeOpacity={0.8}
              >
                <Check size={16} color={colors.white} strokeWidth={2.5} />
                <Text style={styles.saveBtnText}>Save Changes</Text>
              </TouchableOpacity>
            )}

            {/* Primary Action Button: Toggle Complete */}
            <TouchableOpacity
              style={[styles.toggleBtn, isCompleted && styles.toggleBtnReopen]}
              onPress={() => {
                onToggleComplete(action.id);
                onClose();
              }}
              activeOpacity={0.8}
            >
              <Check
                size={16}
                color={isCompleted ? colors.primaryBlue : colors.white}
                strokeWidth={2.5}
              />
              <Text style={[styles.toggleBtnText, isCompleted && styles.toggleBtnTextReopen]}>
                {isCompleted ? 'Mark as Incomplete' : 'Mark as Completed'}
              </Text>
            </TouchableOpacity>

            {/* Delete Action Button */}
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={handleDelete}
              activeOpacity={0.7}
            >
              <Trash2 size={14} color={colors.danger} />
              <Text style={styles.deleteBtnText}>Delete Action</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    maxHeight: '85%',
    paddingBottom: spacing.xl,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  badgeRow: {
    flexDirection: 'row',
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radii.full,
  },
  statusBadgePending: {
    backgroundColor: colors.blueSoft,
  },
  statusBadgeDone: {
    backgroundColor: colors.successLight,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: typography.weights.bold,
  },
  statusBadgeTextPending: {
    color: colors.primaryBlue,
  },
  statusBadgeTextDone: {
    color: colors.success,
  },
  closeBtn: {
    padding: spacing.xs,
  },
  scrollContent: {
    padding: spacing.base,
    gap: spacing.md,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: colors.textMuted,
    letterSpacing: 0.8,
  },
  titleInput: {
    fontSize: 16,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    backgroundColor: colors.background,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    minHeight: 56,
  },
  typeSelectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  typeChipText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  dateInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  dateInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
  },
  sourceContainer: {
    gap: spacing.xs,
  },
  sourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  sourceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  sourceIconBox: {
    width: 32,
    height: 32,
    borderRadius: radii.sm,
    backgroundColor: colors.blueSoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sourceTitle: {
    fontSize: 13,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  sourceSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primaryBlue,
    borderRadius: radii.md,
    paddingVertical: 12,
    marginTop: spacing.xs,
  },
  saveBtnText: {
    color: colors.white,
    fontWeight: typography.weights.bold,
    fontSize: 14,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.success,
    borderRadius: radii.md,
    paddingVertical: 13,
  },
  toggleBtnReopen: {
    backgroundColor: colors.blueSoft,
    borderWidth: 1,
    borderColor: colors.primaryBlue,
  },
  toggleBtnText: {
    color: colors.white,
    fontWeight: typography.weights.bold,
    fontSize: 14,
  },
  toggleBtnTextReopen: {
    color: colors.primaryBlue,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
  deleteBtnText: {
    fontSize: 12,
    color: colors.danger,
    fontWeight: typography.weights.medium,
  },
});

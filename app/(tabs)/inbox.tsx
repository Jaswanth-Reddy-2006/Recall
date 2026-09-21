import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Plus,
  CheckCircle2,
  Clock,
  Hourglass,
  Calendar,
  X,
} from 'lucide-react-native';
import { colors, typography, radii, spacing } from '../../src/constants/theme';
import { useMemoryStore } from '../../src/store/useMemoryStore';
import { TaskCard } from '../../src/components/inbox/TaskCard';
import { ActionDetailModal } from '../../src/components/inbox/ActionDetailModal';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { Action, ActionType } from '../../src/types';

type FilterTab = 'all' | 'task' | 'deadline' | 'follow_up' | 'waiting';

export default function InboxScreen() {
  const {
    actions,
    toggleActionComplete,
    addAction,
    updateAction,
    deleteAction,
    updateActionStatus,
  } = useMemoryStore();

  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [showAddWaitingModal, setShowAddWaitingModal] = useState(false);
  const [waitingTitle, setWaitingTitle] = useState('');
  const [waitingPerson, setWaitingPerson] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);

  // Dedicated Action Detail Inspection
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);

  // Undo Toast state
  const [undoToast, setUndoToast] = useState<{ actionId: string; title: string } | null>(null);
  const undoTimeoutRef = React.useRef<any>(null);

  const handleToggleComplete = (action: Action) => {
    const willBeCompleted = action.status !== 'completed';
    toggleActionComplete(action.id);

    if (willBeCompleted) {
      if (undoTimeoutRef.current) {
        clearTimeout(undoTimeoutRef.current);
      }
      setUndoToast({ actionId: action.id, title: action.title });
      undoTimeoutRef.current = setTimeout(() => {
        setUndoToast(null);
      }, 4000);
    } else {
      if (undoToast?.actionId === action.id) {
        setUndoToast(null);
      }
    }
  };

  const handleUndo = () => {
    if (undoToast) {
      toggleActionComplete(undoToast.actionId);
      if (undoTimeoutRef.current) {
        clearTimeout(undoTimeoutRef.current);
      }
      setUndoToast(null);
    }
  };

  // Filtered actions
  const filteredActions = useMemo(() => {
    return actions.filter((act) => {
      const matchesTab = activeTab === 'all' || act.type === activeTab;
      const matchesStatus = showCompleted ? true : act.status === 'pending';
      return matchesTab && matchesStatus;
    });
  }, [actions, activeTab, showCompleted]);

  const counts = useMemo(() => {
    const pending = actions.filter((a) => a.status === 'pending');
    return {
      all: pending.length,
      task: pending.filter((a) => a.type === 'task').length,
      deadline: pending.filter((a) => a.type === 'deadline').length,
      follow_up: pending.filter((a) => a.type === 'follow_up').length,
      waiting: pending.filter((a) => a.type === 'waiting').length,
    };
  }, [actions]);

  const handleCreateWaiting = async () => {
    if (!waitingTitle.trim()) {
      Alert.alert('Please describe what you are waiting for');
      return;
    }

    const titleFormatted = waitingPerson.trim()
      ? `Waiting for ${waitingPerson.trim()}: ${waitingTitle.trim()}`
      : `Waiting for: ${waitingTitle.trim()}`;

    const newAction: Action = {
      id: `act-${Date.now()}`,
      title: titleFormatted,
      type: 'waiting',
      status: 'pending',
      dueDate: 'Follow up tomorrow',
      sourceMemoryId: '',
      sourceTitle: 'Manual Waiting Item',
      sourceType: 'note',
      createdAt: new Date().toISOString(),
    };

    await addAction(newAction);
    setWaitingTitle('');
    setWaitingPerson('');
    setShowAddWaitingModal(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Inbox Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Inbox</Text>
          <Text style={styles.subtitle}>Things that need your attention.</Text>
        </View>
        <TouchableOpacity
          style={styles.addWaitingBtn}
          onPress={() => setShowAddWaitingModal(true)}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Add waiting for item"
        >
          <Plus size={15} color={colors.white} strokeWidth={2.5} />
          <Text style={styles.addWaitingBtnText}>Waiting For</Text>
        </TouchableOpacity>
      </View>

      {/* Differentiated Status Filter Pills: Pink, Blue, Amber, Violet */}
      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScroll}
        >
          {/* All */}
          <TouchableOpacity
            style={[styles.tabChip, activeTab === 'all' && styles.tabChipAllActive]}
            onPress={() => setActiveTab('all')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabChipText, activeTab === 'all' && styles.tabChipTextWhite]}>
              All ({counts.all})
            </Text>
          </TouchableOpacity>

          {/* Deadlines -> Pink */}
          <TouchableOpacity
            style={[styles.tabChip, activeTab === 'deadline' && styles.tabChipDeadlineActive]}
            onPress={() => setActiveTab('deadline')}
            activeOpacity={0.7}
          >
            <Calendar
              size={12}
              color={activeTab === 'deadline' ? colors.white : colors.brandPink}
            />
            <Text style={[styles.tabChipText, activeTab === 'deadline' && styles.tabChipTextWhite]}>
              Deadlines ({counts.deadline})
            </Text>
          </TouchableOpacity>

          {/* Tasks -> Blue */}
          <TouchableOpacity
            style={[styles.tabChip, activeTab === 'task' && styles.tabChipTaskActive]}
            onPress={() => setActiveTab('task')}
            activeOpacity={0.7}
          >
            <CheckCircle2
              size={12}
              color={activeTab === 'task' ? colors.white : colors.primaryBlue}
            />
            <Text style={[styles.tabChipText, activeTab === 'task' && styles.tabChipTextWhite]}>
              Tasks ({counts.task})
            </Text>
          </TouchableOpacity>

          {/* Waiting -> Amber */}
          <TouchableOpacity
            style={[styles.tabChip, activeTab === 'waiting' && styles.tabChipWaitingActive]}
            onPress={() => setActiveTab('waiting')}
            activeOpacity={0.7}
          >
            <Hourglass
              size={12}
              color={activeTab === 'waiting' ? colors.white : colors.warning}
            />
            <Text style={[styles.tabChipText, activeTab === 'waiting' && styles.tabChipTextWhite]}>
              Waiting ({counts.waiting})
            </Text>
          </TouchableOpacity>

          {/* Follow-ups -> Purple/Pink */}
          <TouchableOpacity
            style={[styles.tabChip, activeTab === 'follow_up' && styles.tabChipFollowUpActive]}
            onPress={() => setActiveTab('follow_up')}
            activeOpacity={0.7}
          >
            <Clock
              size={12}
              color={activeTab === 'follow_up' ? colors.white : '#7C3AED'}
            />
            <Text style={[styles.tabChipText, activeTab === 'follow_up' && styles.tabChipTextWhite]}>
              Follow-ups ({counts.follow_up})
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Showing / Completed Toggle Row */}
      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>
          {activeTab === 'all' ? 'PENDING ACTIONS' : `${activeTab.toUpperCase()}S`}
        </Text>
        <TouchableOpacity
          onPress={() => setShowCompleted(!showCompleted)}
          activeOpacity={0.7}
        >
          <Text style={styles.toggleBtnText}>
            {showCompleted ? 'Hide completed' : 'Show completed'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Action Items List */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredActions.length === 0 ? (
          <EmptyState
            icon="inbox"
            title="Nothing needs your attention."
            description="When Recall detects a task, deadline, or commitment from your saved items, it appears here."
          />
        ) : (
          filteredActions.map((action) => (
            <TaskCard
              key={action.id}
              action={action}
              onToggleComplete={() => handleToggleComplete(action)}
              onPress={() => setSelectedAction(action)}
              onSnooze={() => updateActionStatus(action.id, 'snoozed')}
            />
          ))
        )}
      </ScrollView>

      {/* Undo Toast Snackbar */}
      {undoToast && (
        <View style={styles.undoToast}>
          <View style={styles.undoToastLeft}>
            <CheckCircle2 size={16} color={colors.white} />
            <Text style={styles.undoToastText} numberOfLines={1}>
              Completed: {undoToast.title}
            </Text>
          </View>
          <TouchableOpacity style={styles.undoBtn} onPress={handleUndo} activeOpacity={0.8}>
            <Text style={styles.undoBtnText}>UNDO</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Action Detail Inspection Modal */}
      <ActionDetailModal
        visible={!!selectedAction}
        action={selectedAction}
        onClose={() => setSelectedAction(null)}
        onUpdate={async (updated) => {
          await updateAction(updated);
          setSelectedAction(updated);
        }}
        onDelete={async (id) => {
          await deleteAction(id);
          setSelectedAction(null);
        }}
        onToggleComplete={(id) => {
          const target = actions.find((a) => a.id === id);
          if (target) {
            handleToggleComplete(target);
          }
        }}
      />

      {/* Lightweight Waiting For Entry Sheet */}
      <Modal
        visible={showAddWaitingModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddWaitingModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New "Waiting For"</Text>
              <TouchableOpacity onPress={() => setShowAddWaitingModal(false)}>
                <X size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>WHO ARE YOU WAITING FOR?</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Ravi, Professor Miller, Alex"
              placeholderTextColor={colors.textMuted}
              value={waitingPerson}
              onChangeText={setWaitingPerson}
            />

            <Text style={styles.inputLabel}>WHAT ARE YOU WAITING FOR?</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              placeholder="e.g. Staging credentials, Assignment feedback"
              placeholderTextColor={colors.textMuted}
              value={waitingTitle}
              onChangeText={setWaitingTitle}
              multiline
              numberOfLines={2}
            />

            <TouchableOpacity
              style={styles.saveWaitingBtn}
              onPress={handleCreateWaiting}
              activeOpacity={0.8}
            >
              <Text style={styles.saveWaitingBtnText}>Add to Waiting For</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
    paddingBottom: spacing.xs,
  },
  title: {
    fontSize: typography.sizes.screenTitle,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: typography.sizes.secondary,
    color: colors.textSecondary,
    marginTop: 2,
  },
  addWaitingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryBlue,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: radii.sm,
  },
  addWaitingBtnText: {
    color: colors.white,
    fontSize: typography.sizes.secondary,
    fontWeight: typography.weights.semibold,
  },
  tabsContainer: {
    marginTop: spacing.sm,
  },
  tabsScroll: {
    paddingHorizontal: spacing.base,
    gap: spacing.xs,
  },
  tabChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radii.full,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabChipAllActive: {
    backgroundColor: colors.textPrimary,
    borderColor: colors.textPrimary,
  },
  tabChipDeadlineActive: {
    backgroundColor: colors.brandPink,
    borderColor: colors.brandPink,
  },
  tabChipTaskActive: {
    backgroundColor: colors.primaryBlue,
    borderColor: colors.primaryBlue,
  },
  tabChipWaitingActive: {
    backgroundColor: colors.warning,
    borderColor: colors.warning,
  },
  tabChipFollowUpActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  tabChipText: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
  },
  tabChipTextWhite: {
    color: colors.white,
    fontWeight: typography.weights.semibold,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  toggleLabel: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.semibold,
    color: colors.textMuted,
    letterSpacing: 0.6,
  },
  toggleBtnText: {
    fontSize: typography.sizes.caption,
    color: colors.primaryBlue,
    fontWeight: typography.weights.medium,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(23, 32, 51, 0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    padding: spacing.base,
    paddingBottom: spacing.xxl,
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  modalTitle: {
    fontSize: typography.sizes.section,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  inputLabel: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.semibold,
    color: colors.textMuted,
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
    letterSpacing: 0.6,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: typography.sizes.body,
    color: colors.textPrimary,
  },
  inputMultiline: {
    height: 64,
    textAlignVertical: 'top',
  },
  saveWaitingBtn: {
    backgroundColor: colors.primaryBlue,
    borderRadius: radii.sm,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  saveWaitingBtnText: {
    color: colors.white,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.semibold,
  },
  undoToast: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.base,
    right: spacing.base,
    backgroundColor: '#1E293B',
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 999,
  },
  undoToastLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  undoToastText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: typography.weights.medium,
    flex: 1,
  },
  undoBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: radii.xs,
    marginLeft: spacing.sm,
  },
  undoBtnText: {
    color: colors.brandPink,
    fontSize: 12,
    fontWeight: typography.weights.bold,
    letterSpacing: 0.5,
  },
});

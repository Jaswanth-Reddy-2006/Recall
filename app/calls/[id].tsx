import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  PhoneCall,
  Clock,
  Users,
  Check,
  X,
  Trash2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react-native';
import { colors, typography, radii, spacing } from '../../src/constants/theme';
import { useMemoryStore } from '../../src/store/useMemoryStore';
import { searchService } from '../../src/services/search/SearchService';
import { mediaRepository } from '../../src/services/storage/MediaRepository';
import { CallAnalysis, CallDecision, CallTask } from '../../src/types';

export default function CallInspectorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { memories, deleteMemory, confirmCallTask } = useMemoryStore();

  const [transcriptExpanded, setTranscriptExpanded] = useState(false);

  const call = React.useMemo(() => {
    return memories.find((m) => m.id === id);
  }, [memories, id]);

  const relatedMemories = React.useMemo(() => {
    if (!call) return [];
    return searchService.getRelatedMemories(call, memories);
  }, [call, memories]);

  if (!call) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <PhoneCall size={36} color={colors.textMuted} style={{ marginBottom: 12 }} />
          <Text style={styles.errorTitle}>Call unavailable</Text>
          <Text style={styles.errorSubtitle}>
            This conversation record could not be found or was previously removed.
          </Text>
          <View style={styles.errorActionsRow}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => router.replace('/(tabs)')}
              activeOpacity={0.8}
            >
              <Text style={styles.backBtnText}>Return Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.backBtn, styles.backBtnSecondary]}
              onPress={() => router.replace('/calls')}
              activeOpacity={0.8}
            >
              <Text style={[styles.backBtnText, { color: colors.primaryBlue }]}>All Calls</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const analysis: CallAnalysis = call.callAnalysis || {
    title: call.title,
    summary: call.summary || call.content || 'Conversation transcript recorded.',
    participants: [],
    decisions: [],
    tasks: [],
    deadlines: [],
    followUps: [],
    importantPoints: [],
  };
  const duration = mediaRepository.formatDuration(call.metadata?.audioDurationSec);

  const handleDeleteCall = () => {
    Alert.alert(
      'Delete Call Recording',
      'This will remove this conversation transcript and all associated analysis from your memory.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteMemory(call.id);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Block */}
        <View style={styles.card}>
          <View style={styles.headerTop}>
            <View style={styles.callIconBox}>
              <PhoneCall size={20} color={colors.brandPink} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.callTitle}>{call.title}</Text>
              <View style={styles.metaRow}>
                <Clock size={12} color={colors.textMuted} />
                <Text style={styles.metaText}>
                  {new Date(call.createdAt).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
                {call.metadata?.audioDurationSec ? (
                  <>
                    <Text style={styles.metaDot}>•</Text>
                    <Text style={styles.metaText}>{duration}</Text>
                  </>
                ) : null}
              </View>
            </View>
          </View>

          {/* Participants row */}
          {analysis.participants.length > 0 && (
            <View style={styles.participantsRow}>
              <Users size={13} color={colors.primaryBlue} />
              <Text style={styles.participantsLabel}>Participants:</Text>
              <Text style={styles.participantsText}>{analysis.participants.join(', ')}</Text>
            </View>
          )}
        </View>

        {/* Executive Summary */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Sparkles size={14} color={colors.brandPink} />
            <Text style={styles.sectionTitle}>EXECUTIVE SUMMARY</Text>
          </View>
          <Text style={styles.summaryText}>{analysis.summary}</Text>
        </View>

        {/* Key Decisions */}
        {analysis.decisions.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>KEY DECISIONS ({analysis.decisions.length})</Text>
            {analysis.decisions.map((dec: CallDecision) => (
              <View key={dec.id} style={styles.decisionItem}>
                <Text style={styles.decisionBullet}>•</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.decisionText}>{dec.decision}</Text>
                  {dec.context ? (
                    <Text style={styles.decisionContext}>{dec.context}</Text>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Extracted Tasks with Evidence */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>ACTIONABLE COMMITMENTS ({analysis.tasks.length})</Text>
          <Text style={styles.sectionSubtitle}>
            Tasks confirmed below are synchronized directly to your Action Inbox.
          </Text>

          {analysis.tasks.map((task: CallTask) => {
            const isConfirmed = !!task.confirmed;
            return (
              <View
                key={task.id}
                style={[styles.taskItem, isConfirmed && styles.taskItemConfirmed]}
              >
                <View style={styles.taskTopRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.taskTitle}>{task.task}</Text>
                    <View style={styles.taskBadgesRow}>
                      {task.deadline && (
                        <View style={styles.deadlineBadge}>
                          <Clock size={10} color={colors.brandPink} />
                          <Text style={styles.deadlineText}>{task.deadline}</Text>
                        </View>
                      )}
                      {task.assignedTo && (
                        <Text style={styles.assignedToText}>To: {task.assignedTo}</Text>
                      )}
                      {task.mentionedBy && (
                        <Text style={styles.assignedToText}>By: {task.mentionedBy}</Text>
                      )}
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.taskToggleBtn,
                      isConfirmed ? styles.taskToggleActive : styles.taskToggleInactive,
                    ]}
                    onPress={() => confirmCallTask(call.id, task, !isConfirmed)}
                    activeOpacity={0.7}
                  >
                    {isConfirmed ? (
                      <>
                        <Check size={12} color={colors.white} />
                        <Text style={styles.taskToggleTextActive}>In Inbox</Text>
                      </>
                    ) : (
                      <>
                        <Text style={styles.taskToggleTextInactive}>+ Add to Inbox</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>

                {/* Verbatim Evidence Box */}
                <View style={styles.evidenceBox}>
                  <Text style={styles.evidenceLabel}>VERBATIM EVIDENCE FROM CALL:</Text>
                  <Text style={styles.evidenceText}>"{task.evidence}"</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Full Transcript Accordion */}
        {call.originalContent && (
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.accordionHeader}
              onPress={() => setTranscriptExpanded(!transcriptExpanded)}
              activeOpacity={0.7}
            >
              <Text style={styles.sectionTitle}>FULL CONVERSATION TRANSCRIPT</Text>
              {transcriptExpanded ? (
                <ChevronUp size={16} color={colors.textMuted} />
              ) : (
                <ChevronDown size={16} color={colors.textMuted} />
              )}
            </TouchableOpacity>

            {transcriptExpanded && (
              <View style={styles.transcriptBox}>
                <Text style={styles.transcriptText}>{call.originalContent}</Text>
              </View>
            )}
          </View>
        )}

        {/* Connected Related Memories */}
        {relatedMemories.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>CONNECTED CONTEXT</Text>
            <View style={styles.relatedList}>
              {relatedMemories.map((m) => (
                <TouchableOpacity
                  key={m.id}
                  style={styles.relatedItem}
                  onPress={() => router.push(`/memory/${m.id}` as any)}
                  activeOpacity={0.7}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.relatedTitle} numberOfLines={1}>
                      {m.title}
                    </Text>
                    <Text style={styles.relatedMeta}>
                      {m.category} • {m.tags.slice(0, 2).join(', ')}
                    </Text>
                  </View>
                  <ArrowRight size={14} color={colors.primaryBlue} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Danger zone / Delete */}
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={handleDeleteCall}
          activeOpacity={0.7}
        >
          <Trash2 size={16} color={colors.danger} />
          <Text style={styles.deleteBtnText}>Delete Call Recording</Text>
        </TouchableOpacity>
      </ScrollView>
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
    padding: spacing.base,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  errorTitle: {
    fontSize: typography.sizes.section,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: 6,
  },
  errorSubtitle: {
    fontSize: typography.sizes.secondary,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    maxWidth: 280,
  },
  errorActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  backBtn: {
    paddingHorizontal: spacing.base,
    paddingVertical: 10,
    backgroundColor: colors.primaryBlue,
    borderRadius: radii.pill,
  },
  backBtnSecondary: {
    backgroundColor: colors.blueSoft,
    borderWidth: 1,
    borderColor: colors.primaryBlue,
  },
  backBtnText: {
    color: colors.white,
    fontWeight: typography.weights.semibold,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  callIconBox: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    backgroundColor: colors.pinkSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callTitle: {
    fontSize: typography.sizes.section,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  metaText: {
    fontSize: typography.sizes.caption,
    color: colors.textMuted,
  },
  metaDot: {
    fontSize: typography.sizes.caption,
    color: colors.textMuted,
  },
  participantsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#F3F5F9',
    marginTop: spacing.xs,
  },
  participantsLabel: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.bold,
    color: colors.textMuted,
  },
  participantsText: {
    fontSize: typography.sizes.caption,
    color: colors.textPrimary,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: typography.weights.bold,
    letterSpacing: 0.8,
    color: colors.textMuted,
  },
  sectionSubtitle: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  summaryText: {
    fontSize: typography.sizes.body,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  decisionItem: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  decisionBullet: {
    fontSize: 16,
    color: colors.primaryBlue,
    lineHeight: 20,
  },
  decisionText: {
    fontSize: typography.sizes.secondary,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  decisionContext: {
    fontSize: typography.sizes.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  taskItem: {
    backgroundColor: colors.background,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  taskItemConfirmed: {
    borderColor: colors.primaryBlue,
    backgroundColor: '#F8FAFF',
  },
  taskTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  taskTitle: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  taskBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: 4,
  },
  deadlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.pinkSoft,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radii.xs,
  },
  deadlineText: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: colors.brandPink,
  },
  assignedToText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  taskToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radii.pill,
  },
  taskToggleActive: {
    backgroundColor: colors.primaryBlue,
  },
  taskToggleInactive: {
    backgroundColor: '#E5E7EB',
  },
  taskToggleTextActive: {
    fontSize: 11,
    fontWeight: typography.weights.bold,
    color: colors.white,
  },
  taskToggleTextInactive: {
    fontSize: 11,
    fontWeight: typography.weights.semibold,
    color: colors.textMuted,
  },
  evidenceBox: {
    marginTop: spacing.sm,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: '#EEF1F6',
  },
  evidenceLabel: {
    fontSize: 9,
    fontWeight: typography.weights.bold,
    letterSpacing: 0.6,
    color: colors.textMuted,
    marginBottom: 2,
  },
  evidenceText: {
    fontSize: typography.sizes.caption,
    fontStyle: 'italic',
    color: colors.textSecondary,
    lineHeight: 18,
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  transcriptBox: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.background,
    borderRadius: radii.sm,
  },
  transcriptText: {
    fontSize: typography.sizes.secondary,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  relatedList: {
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  relatedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  relatedTitle: {
    fontSize: typography.sizes.secondary,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
  },
  relatedMeta: {
    fontSize: typography.sizes.caption,
    color: colors.textMuted,
    marginTop: 1,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FFE4E6',
    borderRadius: radii.md,
    marginTop: spacing.sm,
  },
  deleteBtnText: {
    fontSize: typography.sizes.secondary,
    fontWeight: typography.weights.bold,
    color: colors.danger,
  },
});

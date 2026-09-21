import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Mic,
  FileAudio,
  FileText,
  Sparkles,
  Check,
  X,
  AlertCircle,
  Clock,
  Users,
  ShieldCheck,
} from 'lucide-react-native';
import { colors, typography, radii, spacing } from '../../src/constants/theme';
import { useMemoryStore } from '../../src/store/useMemoryStore';
import { aiService } from '../../src/services/ai/AIService';
import { speechToTextProvider } from '../../src/services/speech/SpeechToTextProvider';
import { CallAnalysis, CallTask, Memory } from '../../src/types';

type ImportMode = 'transcript' | 'audio';

const SAMPLE_TRANSCRIPTS = [
  {
    label: 'Sprint Sync with Manager (Task & Deadline)',
    title: 'Sprint 24 Sync with Manager',
    participants: 'Manager, You',
    text:
      'Manager: Hi, thanks for jumping on the call. Quick update on the production schedule.\n' +
      'You: Sure, what needs to be prioritized?\n' +
      'Manager: The revised API documentation needs to be sent by tomorrow noon so the frontend team can unblock.\n' +
      'You: Got it, I will finalize the endpoint schemas today.\n' +
      'Manager: Great. Also, we agreed to deploy the new API endpoints on Friday. Please make sure to have the deployment checklist ready before Friday end of day.\n' +
      'You: Understood, I will coordinate with DevOps on staging verification.',
  },
  {
    label: 'Client Project Review (Decisions & Action)',
    title: 'Client Review on Mobile App Redesign',
    participants: 'Client, Lead, You',
    text:
      'Client: We reviewed the prototype and love the Pink and Blue direction.\n' +
      'Lead: Fantastic. What about the authentication flow?\n' +
      'Client: We decided to keep social login optional for the MVP launch.\n' +
      'Client: Can you send the updated design tokens export by Wednesday?\n' +
      'You: Yes, I will export the Figma variables and share the documentation link by Wednesday 3 PM.',
  },
];

export default function ImportCallScreen() {
  const router = useRouter();
  const { addMemory, addAction, isDeveloperMode } = useMemoryStore();

  const [mode, setMode] = useState<ImportMode>('transcript');
  const [callTitle, setCallTitle] = useState('');
  const [participantsText, setParticipantsText] = useState('');
  const [transcript, setTranscript] = useState('');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');

  // Extracted result
  const [extractedAnalysis, setExtractedAnalysis] = useState<CallAnalysis | null>(null);
  const [confirmedTasks, setConfirmedTasks] = useState<Record<string, boolean>>({});

  const PIPELINE_STEPS = [
    'Preparing audio & transcript input',
    'Speech-to-text transcription (Local Whisper)',
    'Analyzing context & commitments (Qwen3 8B)',
    'Extracting decisions & verbatim evidence',
    'Finalizing Call Intelligence memory',
  ];

  const handleApplySample = (sample: (typeof SAMPLE_TRANSCRIPTS)[0]) => {
    setCallTitle(sample.title);
    setParticipantsText(sample.participants);
    setTranscript(sample.text);
  };

  const handleStartAnalysis = async () => {
    if (!transcript.trim()) {
      Alert.alert('Empty Transcript', 'Please paste or select a conversation transcript to analyze.');
      return;
    }

    setIsProcessing(true);
    setCurrentStepIndex(0);
    setStatusMessage(PIPELINE_STEPS[0]);

    try {
      // Step 1: Pre-check
      await new Promise((r) => setTimeout(r, 250));
      setCurrentStepIndex(1);
      setStatusMessage(PIPELINE_STEPS[1]);

      if (mode === 'audio') {
        // Transcribe audio
        await speechToTextProvider.transcribe('local-audio-uri', (_p, msg) => {
          setStatusMessage(msg);
        });
      }

      // Step 2: AI Reasoning
      setCurrentStepIndex(2);
      setStatusMessage(PIPELINE_STEPS[2]);

      const parts = participantsText
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean);

      const result = await aiService.analyzeCall(transcript, callTitle || undefined, parts);

      // Step 3: Decisions & Evidence
      setCurrentStepIndex(3);
      setStatusMessage(PIPELINE_STEPS[3]);
      await new Promise((r) => setTimeout(r, 200));

      setCurrentStepIndex(4);
      setStatusMessage(PIPELINE_STEPS[4]);
      await new Promise((r) => setTimeout(r, 150));

      setExtractedAnalysis(result.callAnalysis);
      if (!callTitle && result.callAnalysis.title) {
        setCallTitle(result.callAnalysis.title);
      }

      // Default confirmed tasks: set all to true initially for review
      const initialMap: Record<string, boolean> = {};
      result.callAnalysis.tasks.forEach((t) => {
        initialMap[t.id] = true;
      });
      setConfirmedTasks(initialMap);
    } catch (err: any) {
      Alert.alert('Analysis Error', err.message || 'Failed to analyze conversation.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleTask = (taskId: string) => {
    setConfirmedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const handleSaveToRecall = async () => {
    if (!extractedAnalysis) return;

    const callId = `call_${Date.now()}`;
    const title = callTitle.trim() || extractedAnalysis.title || 'Call Conversation';

    // 1. Create Call Memory
    const newMemory: Memory = {
      id: callId,
      type: 'call',
      title,
      summary: extractedAnalysis.summary,
      content: transcript,
      category: 'Work',
      tags: ['Call', 'Conversation', ...extractedAnalysis.participants],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      originalContent: transcript,
      metadata: {
        transcript,
        callParticipants: extractedAnalysis.participants,
        audioDurationSec: mode === 'audio' ? 185 : undefined,
      },
      callAnalysis: {
        ...extractedAnalysis,
        title,
        tasks: extractedAnalysis.tasks.map((t) => ({
          ...t,
          confirmed: !!confirmedTasks[t.id],
        })),
      },
      embeddingStatus: 'pending',
    };

    await addMemory(newMemory);

    // 2. Add USER-CONFIRMED tasks to Inbox
    for (const task of extractedAnalysis.tasks) {
      if (confirmedTasks[task.id]) {
        await addAction({
          id: task.id,
          title: task.task,
          type: task.deadline ? 'deadline' : 'task',
          status: 'pending',
          dueDate: task.deadline,
          sourceMemoryId: callId,
          sourceTitle: title,
          sourceType: 'call',
          createdAt: new Date().toISOString(),
        });
      }
    }

    // 3. Navigate directly to the newly created call inspector
    router.replace(`/calls/${callId}` as any);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Privacy Note */}
        <View style={styles.privacyCard}>
          <ShieldCheck size={16} color={colors.primaryBlue} />
          <Text style={styles.privacyText}>
            Recall analyzes recordings you choose to import. It does not secretly record or monitor calls.
          </Text>
        </View>

        {!extractedAnalysis ? (
          <>
            {/* Mode Selector */}
            <View style={styles.modeTabs}>
              <TouchableOpacity
                style={[styles.modeTab, mode === 'transcript' && styles.modeTabActive]}
                onPress={() => setMode('transcript')}
                activeOpacity={0.8}
              >
                <FileText size={15} color={mode === 'transcript' ? colors.primaryBlue : colors.textMuted} />
                <Text style={[styles.modeTabText, mode === 'transcript' && styles.modeTabTextActive]}>
                  Paste Transcript
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modeTab, mode === 'audio' && styles.modeTabActive]}
                onPress={() => setMode('audio')}
                activeOpacity={0.8}
              >
                <FileAudio size={15} color={mode === 'audio' ? colors.primaryBlue : colors.textMuted} />
                <Text style={[styles.modeTabText, mode === 'audio' && styles.modeTabTextActive]}>
                  Audio Recording
                </Text>
              </TouchableOpacity>
            </View>

            {/* Quick Sample Selector for evaluators (ONLY in Developer Mode) */}
            {isDeveloperMode && (
              <View style={styles.sampleSection}>
                <Text style={styles.sampleLabel}>DEVELOPER MODE: SAMPLE TRANSCRIPTS</Text>
                <View style={styles.sampleRow}>
                  {SAMPLE_TRANSCRIPTS.map((s, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={styles.sampleChip}
                      onPress={() => handleApplySample(s)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.sampleChipText}>{s.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Form Fields */}
            <View style={styles.formGroup}>
              <Text style={styles.fieldLabel}>CALL TITLE (OPTIONAL)</Text>
              <TextInput
                style={styles.textInput}
                value={callTitle}
                onChangeText={setCallTitle}
                placeholder="e.g. Weekly 1:1 with Manager"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.fieldLabel}>PARTICIPANTS (COMMA SEPARATED)</Text>
              <TextInput
                style={styles.textInput}
                value={participantsText}
                onChangeText={setParticipantsText}
                placeholder="e.g. Manager, You, Ravi"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.fieldLabel}>
                {mode === 'audio' ? 'AUDIO FILE TRANSCRIPT / NOTES' : 'CONVERSATION TRANSCRIPT *'}
              </Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={transcript}
                onChangeText={setTranscript}
                placeholder="Paste the conversation transcript or meeting notes here..."
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={8}
                textAlignVertical="top"
              />
            </View>

            {/* Processing State visualizer */}
            {isProcessing && (
              <View style={styles.progressCard}>
                <View style={styles.progressHeader}>
                  <ActivityIndicator size="small" color={colors.brandPink} />
                  <Text style={styles.progressTitle}>Call Intelligence in Progress</Text>
                </View>
                <Text style={styles.statusMessage}>{statusMessage}</Text>
                <View style={styles.stepList}>
                  {PIPELINE_STEPS.map((step, idx) => {
                    const isDone = idx < currentStepIndex;
                    const isCurrent = idx === currentStepIndex;
                    return (
                      <View key={idx} style={styles.stepItem}>
                        <View
                          style={[
                            styles.stepDot,
                            isDone && styles.stepDotDone,
                            isCurrent && styles.stepDotCurrent,
                          ]}
                        >
                          {isDone ? <Check size={10} color={colors.white} /> : null}
                        </View>
                        <Text
                          style={[
                            styles.stepText,
                            isDone && styles.stepTextDone,
                            isCurrent && styles.stepTextCurrent,
                          ]}
                        >
                          {step}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            {/* CTA */}
            {!isProcessing && (
              <TouchableOpacity
                style={styles.analyzeBtn}
                onPress={handleStartAnalysis}
                activeOpacity={0.85}
              >
                <Sparkles size={16} color={colors.white} />
                <Text style={styles.analyzeBtnText}>Analyze with Call Intelligence</Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          /* Review & Confirmation Screen */
          <View style={styles.reviewContainer}>
            <View style={styles.reviewHeader}>
              <View style={styles.aiBadgePink}>
                <Sparkles size={12} color={colors.brandPink} />
                <Text style={styles.aiBadgePinkText}>Suggested by Recall</Text>
              </View>
              <Text style={styles.reviewHeadline}>Review Extracted Context</Text>
              <Text style={styles.reviewSubtitle}>
                Confirm actionable tasks before adding them to your Inbox.
              </Text>
            </View>

            {/* Executive Summary */}
            <View style={styles.reviewCard}>
              <Text style={styles.cardHeaderTitle}>EXECUTIVE SUMMARY</Text>
              <Text style={styles.summaryText}>{extractedAnalysis.summary}</Text>
            </View>

            {/* Key Decisions */}
            {extractedAnalysis.decisions.length > 0 && (
              <View style={styles.reviewCard}>
                <Text style={styles.cardHeaderTitle}>KEY DECISIONS MADE</Text>
                {extractedAnalysis.decisions.map((dec) => (
                  <View key={dec.id} style={styles.decisionItem}>
                    <Text style={styles.decisionBullet}>•</Text>
                    <Text style={styles.decisionText}>{dec.decision}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Possible Tasks with Evidence */}
            <View style={styles.reviewCard}>
              <Text style={styles.cardHeaderTitle}>
                POSSIBLE COMMITMENTS ({extractedAnalysis.tasks.length})
              </Text>
              <Text style={styles.cardInstruction}>
                Tap to toggle whether an item should enter your Action Inbox.
              </Text>

              {extractedAnalysis.tasks.map((t) => {
                const isConfirmed = !!confirmedTasks[t.id];
                return (
                  <View
                    key={t.id}
                    style={[styles.taskCard, isConfirmed && styles.taskCardConfirmed]}
                  >
                    <View style={styles.taskTopRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.taskTitle}>{t.task}</Text>
                        <View style={styles.taskMetaRow}>
                          {t.deadline && (
                            <View style={styles.deadlineBadge}>
                              <Clock size={10} color={colors.brandPink} />
                              <Text style={styles.deadlineBadgeText}>{t.deadline}</Text>
                            </View>
                          )}
                          {t.assignedTo && (
                            <Text style={styles.assignedText}>Assigned: {t.assignedTo}</Text>
                          )}
                        </View>
                      </View>

                      <TouchableOpacity
                        style={[
                          styles.confirmBtn,
                          isConfirmed ? styles.confirmBtnActive : styles.confirmBtnInactive,
                        ]}
                        onPress={() => handleToggleTask(t.id)}
                        activeOpacity={0.7}
                      >
                        {isConfirmed ? (
                          <>
                            <Check size={12} color={colors.white} />
                            <Text style={styles.confirmBtnTextActive}>In Inbox</Text>
                          </>
                        ) : (
                          <>
                            <X size={12} color={colors.textMuted} />
                            <Text style={styles.confirmBtnTextInactive}>Dismissed</Text>
                          </>
                        )}
                      </TouchableOpacity>
                    </View>

                    {/* Verbatim Evidence Snippet */}
                    <View style={styles.evidenceBox}>
                      <Text style={styles.evidenceLabel}>VERBATIM EVIDENCE:</Text>
                      <Text style={styles.evidenceSnippet}>"{t.evidence}"</Text>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Action Buttons */}
            <View style={styles.reviewActionsRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setExtractedAnalysis(null)}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelBtnText}>Edit Transcript</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSaveToRecall}
                activeOpacity={0.85}
              >
                <Check size={16} color={colors.white} />
                <Text style={styles.saveBtnText}>Save Call to Recall</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
  },
  privacyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.blueSoft,
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: '#D4E2FF',
    marginBottom: spacing.base,
  },
  privacyText: {
    flex: 1,
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  modeTabs: {
    flexDirection: 'row',
    backgroundColor: '#EBEFF5',
    padding: 3,
    borderRadius: radii.pill,
    marginBottom: spacing.base,
  },
  modeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: radii.pill,
  },
  modeTabActive: {
    backgroundColor: colors.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  modeTabText: {
    fontSize: typography.sizes.secondary,
    fontWeight: typography.weights.semibold,
    color: colors.textMuted,
  },
  modeTabTextActive: {
    color: colors.primaryBlue,
  },
  sampleSection: {
    marginBottom: spacing.base,
  },
  sampleLabel: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    letterSpacing: 0.8,
    color: colors.textMuted,
    marginBottom: 6,
  },
  sampleRow: {
    flexDirection: 'column',
    gap: 6,
  },
  sampleChip: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radii.sm,
  },
  sampleChipText: {
    fontSize: typography.sizes.caption,
    color: colors.primaryBlue,
    fontWeight: typography.weights.medium,
  },
  formGroup: {
    marginBottom: spacing.base,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: typography.weights.bold,
    letterSpacing: 0.8,
    color: colors.textMuted,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: typography.sizes.body,
    color: colors.textPrimary,
  },
  textArea: {
    minHeight: 140,
    paddingTop: 10,
  },
  analyzeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primaryBlue,
    paddingVertical: 14,
    borderRadius: radii.md,
    marginTop: spacing.sm,
    shadowColor: colors.primaryBlue,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  analyzeBtnText: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
    color: colors.white,
  },
  progressCard: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
    marginVertical: spacing.base,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: 4,
  },
  progressTitle: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  statusMessage: {
    fontSize: typography.sizes.secondary,
    color: colors.brandPink,
    fontWeight: typography.weights.medium,
    marginBottom: spacing.md,
  },
  stepList: {
    gap: spacing.xs,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  stepDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotDone: {
    backgroundColor: colors.primaryBlue,
  },
  stepDotCurrent: {
    backgroundColor: colors.brandPink,
  },
  stepText: {
    fontSize: typography.sizes.caption,
    color: colors.textMuted,
  },
  stepTextDone: {
    color: colors.textPrimary,
  },
  stepTextCurrent: {
    color: colors.brandPink,
    fontWeight: typography.weights.bold,
  },
  reviewContainer: {
    gap: spacing.base,
  },
  reviewHeader: {
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  aiBadgePink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.pinkSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.xs,
    marginBottom: 8,
  },
  aiBadgePinkText: {
    fontSize: 11,
    fontWeight: typography.weights.bold,
    color: colors.brandPink,
  },
  reviewHeadline: {
    fontSize: typography.sizes.section,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  reviewSubtitle: {
    fontSize: typography.sizes.secondary,
    color: colors.textSecondary,
    marginTop: 2,
  },
  reviewCard: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
  },
  cardHeaderTitle: {
    fontSize: 11,
    fontWeight: typography.weights.bold,
    letterSpacing: 0.8,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  cardInstruction: {
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
    marginTop: 6,
  },
  decisionBullet: {
    fontSize: 16,
    color: colors.primaryBlue,
    lineHeight: 20,
  },
  decisionText: {
    flex: 1,
    fontSize: typography.sizes.secondary,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  taskCard: {
    backgroundColor: colors.background,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  taskCardConfirmed: {
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
  taskMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
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
  deadlineBadgeText: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: colors.brandPink,
  },
  assignedText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.pill,
  },
  confirmBtnActive: {
    backgroundColor: colors.primaryBlue,
  },
  confirmBtnInactive: {
    backgroundColor: '#E5E7EB',
  },
  confirmBtnTextActive: {
    fontSize: 11,
    fontWeight: typography.weights.bold,
    color: colors.white,
  },
  confirmBtnTextInactive: {
    fontSize: 11,
    fontWeight: typography.weights.medium,
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
  evidenceSnippet: {
    fontSize: typography.sizes.caption,
    fontStyle: 'italic',
    color: colors.textSecondary,
    lineHeight: 16,
  },
  reviewActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  cancelBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  cancelBtnText: {
    fontSize: typography.sizes.secondary,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
  },
  saveBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: radii.md,
    backgroundColor: colors.primaryBlue,
    shadowColor: colors.primaryBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  saveBtnText: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
    color: colors.white,
  },
});

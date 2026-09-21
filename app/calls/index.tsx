import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  PhoneCall,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  ChevronRight,
  FileText,
} from 'lucide-react-native';
import { colors, typography, radii, spacing } from '../../src/constants/theme';
import { useMemoryStore } from '../../src/store/useMemoryStore';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { mediaRepository } from '../../src/services/storage/MediaRepository';

export default function CallsDashboardScreen() {
  const router = useRouter();
  const memories = useMemoryStore((state) => state.memories);

  // Filter real call memories
  const calls = React.useMemo(() => {
    return memories.filter((m) => m.type === 'call');
  }, [memories]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Subtitle & Privacy Callout */}
        <View style={styles.privacyBanner}>
          <View style={styles.privacyTop}>
            <ShieldCheck size={16} color={colors.primaryBlue} />
            <Text style={styles.privacyTitle}>Zero-Surveillance Call Intelligence</Text>
          </View>
          <Text style={styles.privacyDesc}>
            Recall analyzes recordings and transcripts you choose to import. It does not secretly record or monitor phone calls in the background.
          </Text>
        </View>

        {/* Primary CTA Row */}
        <View style={styles.actionRow}>
          <View>
            <Text style={styles.sectionHeaderTitle}>ANALYZED CALLS</Text>
            <Text style={styles.sectionCountText}>
              {calls.length === 1 ? '1 conversation' : `${calls.length} conversations`}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.importBtn}
            onPress={() => router.push('/calls/import')}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Import Call"
          >
            <Plus size={16} color={colors.white} strokeWidth={2.4} />
            <Text style={styles.importBtnText}>Import Call</Text>
          </TouchableOpacity>
        </View>

        {/* Call Cards List */}
        {calls.length === 0 ? (
          <EmptyState
            title="No analyzed calls yet."
            description="Import an audio recording or paste a transcript to extract commitments, decisions, and deadlines."
            actionText="Import a call"
            onActionPress={() => router.push('/calls/import')}
          />
        ) : (
          <View style={styles.callsList}>
            {calls.map((call) => {
              const taskCount = call.callAnalysis?.tasks?.length || 0;
              const decisionCount = call.callAnalysis?.decisions?.length || 0;
              const deadlineCount = call.callAnalysis?.deadlines?.length || 0;
              const duration = mediaRepository.formatDuration(call.metadata?.audioDurationSec);

              return (
                <TouchableOpacity
                  key={call.id}
                  style={styles.callCard}
                  onPress={() => router.push(`/calls/${call.id}` as any)}
                  activeOpacity={0.7}
                >
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.callIconBox}>
                      <PhoneCall size={16} color={colors.brandPink} />
                    </View>
                    <View style={styles.callHeaderInfo}>
                      <Text style={styles.callTitle} numberOfLines={1}>
                        {call.title}
                      </Text>
                      <View style={styles.callMetaRow}>
                        <Clock size={11} color={colors.textMuted} />
                        <Text style={styles.callMetaText}>
                          {new Date(call.createdAt).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </Text>
                        {call.metadata?.audioDurationSec ? (
                          <>
                            <Text style={styles.metaDot}>•</Text>
                            <Text style={styles.callMetaText}>{duration}</Text>
                          </>
                        ) : null}
                      </View>
                    </View>

                    <View style={styles.aiBadge}>
                      <Sparkles size={11} color={colors.brandPink} />
                      <Text style={styles.aiBadgeText}>Analyzed</Text>
                    </View>
                  </View>

                  {/* Summary Snippet */}
                  {call.summary ? (
                    <Text style={styles.cardSummary} numberOfLines={2}>
                      {call.summary}
                    </Text>
                  ) : null}

                  {/* Extracted stats pill row */}
                  <View style={styles.statsRow}>
                    <View style={[styles.statPill, { backgroundColor: colors.pinkSoft }]}>
                      <Text style={[styles.statPillText, { color: colors.brandPink }]}>
                        {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
                      </Text>
                    </View>

                    {decisionCount > 0 && (
                      <View style={[styles.statPill, { backgroundColor: colors.blueSoft }]}>
                        <Text style={[styles.statPillText, { color: colors.primaryBlue }]}>
                          {decisionCount} {decisionCount === 1 ? 'decision' : 'decisions'}
                        </Text>
                      </View>
                    )}

                    {deadlineCount > 0 && (
                      <View style={[styles.statPill, { backgroundColor: '#F3E8FF' }]}>
                        <Text style={[styles.statPillText, { color: '#7C3AED' }]}>
                          {deadlineCount} {deadlineCount === 1 ? 'deadline' : 'deadlines'}
                        </Text>
                      </View>
                    )}

                    <View style={{ flex: 1 }} />
                    <ChevronRight size={14} color={colors.textMuted} />
                  </View>
                </TouchableOpacity>
              );
            })}
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
  privacyBanner: {
    backgroundColor: colors.blueSoft,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: '#D4E2FF',
    padding: spacing.md,
    marginBottom: spacing.base,
  },
  privacyTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: 4,
  },
  privacyTitle: {
    fontSize: typography.sizes.secondary,
    fontWeight: typography.weights.bold,
    color: colors.primaryBlue,
  },
  privacyDesc: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.base,
  },
  sectionHeaderTitle: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.bold,
    letterSpacing: 0.8,
    color: colors.textMuted,
  },
  sectionCountText: {
    fontSize: typography.sizes.secondary,
    color: colors.textSecondary,
    marginTop: 2,
  },
  importBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primaryBlue,
    paddingHorizontal: spacing.base,
    paddingVertical: 10,
    borderRadius: radii.pill,
    shadowColor: colors.primaryBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  importBtnText: {
    fontSize: typography.sizes.secondary,
    fontWeight: typography.weights.semibold,
    color: colors.white,
  },
  callsList: {
    gap: spacing.md,
  },
  callCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  callIconBox: {
    width: 36,
    height: 36,
    borderRadius: radii.sm,
    backgroundColor: colors.pinkSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callHeaderInfo: {
    flex: 1,
  },
  callTitle: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  callMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  callMetaText: {
    fontSize: typography.sizes.caption,
    color: colors.textMuted,
  },
  metaDot: {
    fontSize: typography.sizes.caption,
    color: colors.textMuted,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.pinkSoft,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: radii.xs,
  },
  aiBadgeText: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: colors.brandPink,
  },
  cardSummary: {
    fontSize: typography.sizes.secondary,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: '#F1F4F9',
  },
  statPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.pill,
  },
  statPillText: {
    fontSize: 11,
    fontWeight: typography.weights.semibold,
  },
});

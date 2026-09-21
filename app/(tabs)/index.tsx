import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Image as ImageIcon,
  Link2,
  FileText,
  PhoneCall,
  SlidersHorizontal,
  Sparkles,
  ArrowRight,
  Search,
  Share2,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, radii, spacing } from '../../src/constants/theme';
import { useMemoryStore } from '../../src/store/useMemoryStore';
import { RecallMark } from '../../src/components/ui/RecallLogo';
import { SectionHeader } from '../../src/components/ui/SectionHeader';
import { TaskCard } from '../../src/components/inbox/TaskCard';
import { MemoryCard } from '../../src/components/memory/MemoryCard';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { SettingsModal } from '../../src/components/ui/SettingsModal';

export default function HomeScreen() {
  const router = useRouter();
  const { memories, actions, toggleActionComplete, updateActionStatus, init } = useMemoryStore();
  const [refreshing, setRefreshing] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await init();
    setRefreshing(false);
  }, [init]);

  // Priority attention items (real pending actions only)
  const attentionItems = useMemo(() => {
    return actions.filter((a) => a.status === 'pending').slice(0, 3);
  }, [actions]);

  // Recent memories (real saved memories only)
  const recentMemories = useMemo(() => {
    return memories.slice(0, 5);
  }, [memories]);

  // Real dynamic topic connection detection
  const connectionInsight = useMemo(() => {
    if (memories.length < 2) return null;

    // Tally real tags and topics
    const topicCounts: Record<string, number> = {};
    memories.forEach((m) => {
      const allTokens = [...m.tags, ...(m.ai?.topics || [])];
      const unique = Array.from(new Set(allTokens));
      unique.forEach((t) => {
        const key = t.trim();
        if (key.length > 2) {
          topicCounts[key] = (topicCounts[key] || 0) + 1;
        }
      });
    });

    // Find topic shared by 2 or more memories
    const shared = Object.entries(topicCounts)
      .filter(([_, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1]);

    if (shared.length > 0) {
      const topTopic = shared[0][0];
      const count = shared[0][1];
      return {
        hasConnection: true,
        topic: topTopic,
        count,
      };
    }

    return null;
  }, [memories]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primaryBlue}
          />
        }
      >
        {/* Top Header: Clean Product Brand Header (No Greetings) */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.brandTitleRow}>
              <RecallMark size={26} />
              <Text style={styles.brandTitle}>RECALL</Text>
              <View style={styles.brandDot} />
            </View>
            <Text style={styles.brandSubtitle}>Your memory is organized.</Text>
          </View>
          <TouchableOpacity
            style={styles.settingsBtn}
            onPress={() => setSettingsOpen(true)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Open settings and permissions"
          >
            <SlidersHorizontal size={17} color={colors.primaryBlue} />
          </TouchableOpacity>
        </View>

        {/* Hero Search Bar */}
        <TouchableOpacity
          style={styles.searchHero}
          onPress={() => router.push('/(tabs)/search')}
          activeOpacity={0.9}
          accessibilityRole="search"
          accessibilityLabel="Ask Recall anything"
        >
          <Search size={18} color={colors.primaryBlue} style={styles.searchIcon} />
          <Text style={styles.searchPlaceholder}>Ask Recall anything...</Text>
          <View style={styles.searchAIBadge}>
            <Sparkles size={12} color={colors.brandPink} />
            <Text style={styles.searchAIBadgeText}>Context</Text>
          </View>
        </TouchableOpacity>

        {/* Capture Quick Action Row */}
        <View style={styles.captureSection}>
          <View style={styles.captureSectionHeader}>
            <Text style={styles.sectionLabel}>CAPTURE SOMETHING</Text>
            <TouchableOpacity
              style={styles.shareTargetHint}
              onPress={() => router.push('/capture/shared')}
              activeOpacity={0.7}
            >
              <Share2 size={11} color={colors.primaryBlue} />
              <Text style={styles.shareTargetHintText}>Simulate OS Share</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.quickRow}>
            {/* Screenshot: Pink Accent */}
            <TouchableOpacity
              style={[styles.quickBtn, styles.quickBtnPink]}
              onPress={() => router.push('/capture/screenshot')}
              activeOpacity={0.75}
            >
              <View style={[styles.quickIconBox, { backgroundColor: colors.pinkSoft }]}>
                <ImageIcon size={16} color={colors.brandPink} />
              </View>
              <Text style={styles.quickBtnText}>Screenshot</Text>
            </TouchableOpacity>

            {/* Link: Blue Accent */}
            <TouchableOpacity
              style={[styles.quickBtn, styles.quickBtnBlue]}
              onPress={() => router.push('/capture/link')}
              activeOpacity={0.75}
            >
              <View style={[styles.quickIconBox, { backgroundColor: colors.blueSoft }]}>
                <Link2 size={16} color={colors.primaryBlue} />
              </View>
              <Text style={styles.quickBtnText}>Link</Text>
            </TouchableOpacity>

            {/* Note: Soft Violet Accent */}
            <TouchableOpacity
              style={[styles.quickBtn, styles.quickBtnViolet]}
              onPress={() => router.push('/capture/note')}
              activeOpacity={0.75}
            >
              <View style={[styles.quickIconBox, { backgroundColor: '#F3E8FF' }]}>
                <FileText size={16} color="#7C3AED" />
              </View>
              <Text style={styles.quickBtnText}>Note</Text>
            </TouchableOpacity>

            {/* Calls: Call Intelligence Accent */}
            <TouchableOpacity
              style={[styles.quickBtn, styles.quickBtnPink]}
              onPress={() => router.push('/calls/index')}
              activeOpacity={0.75}
            >
              <View style={[styles.quickIconBox, { backgroundColor: colors.pinkSoft }]}>
                <PhoneCall size={16} color={colors.brandPink} />
              </View>
              <Text style={styles.quickBtnText}>Calls</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Needs Your Attention Section (Real Pending Actions Only) */}
        {attentionItems.length > 0 && (
          <View style={styles.section}>
            <SectionHeader
              title="Needs your attention"
              count={attentionItems.length}
              actionText="View all"
              onActionPress={() => router.push('/(tabs)/inbox')}
            />
            {attentionItems.map((action) => (
              <TaskCard
                key={action.id}
                action={action}
                onToggleComplete={() => toggleActionComplete(action.id)}
                onSnooze={() => updateActionStatus(action.id, 'snoozed')}
              />
            ))}
          </View>
        )}

        {/* Dynamic Context Connection Card: Only Shown When Real Connections Exist */}
        <View style={styles.suggestedContainer}>
          <LinearGradient
            colors={['#FFF4F9', '#EEF4FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.suggestedGradientCard}
          >
            <View style={styles.suggestedTopline}>
              <View style={styles.suggestedSparkleIcon}>
                <Sparkles size={12} color={colors.brandPink} />
              </View>
              <Text style={styles.suggestedHeadline}>
                {connectionInsight
                  ? 'RECALL FOUND A CONNECTION'
                  : 'PERSONAL CONTEXT ENGINE'}
              </Text>
            </View>

            {connectionInsight ? (
              <>
                <Text style={styles.suggestedBody}>
                  You saved {connectionInsight.count} interconnected memories about{' '}
                  <Text style={styles.suggestedHighlight}>{connectionInsight.topic}</Text>.
                </Text>
                <TouchableOpacity
                  style={styles.suggestedCTA}
                  onPress={() => router.push('/(tabs)/search')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.suggestedCTAText}>Explore topic connection</Text>
                  <ArrowRight size={13} color={colors.primaryBlue} />
                </TouchableOpacity>
              </>
            ) : (
              <Text style={styles.suggestedBodyEmpty}>
                Save a few screenshots, notes, links, or conversations and Recall will start finding connections automatically.
              </Text>
            )}
          </LinearGradient>
        </View>

        {/* Recently Remembered Section (Real Saved Memories) */}
        <View style={styles.section}>
          <SectionHeader
            title="Recently remembered"
            count={memories.length}
            actionText="Library"
            onActionPress={() => router.push('/(tabs)/library')}
          />

          {recentMemories.length === 0 ? (
            <EmptyState
              title="Your memory starts here."
              description="Capture a screenshot, link, note, or conversation and Recall will organize the context for you."
              actionText="Capture something"
              onActionPress={() => router.push('/capture/modal')}
            />
          ) : (
            recentMemories.map((memory) => (
              <MemoryCard key={memory.id} memory={memory} />
            ))
          )}
        </View>
      </ScrollView>

      {/* Settings & Permissions Control Center */}
      <SettingsModal
        visible={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.base,
  },
  headerLeft: {
    gap: 3,
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: colors.textPrimary,
  },
  brandDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.brandPink,
  },
  brandSubtitle: {
    fontSize: typography.sizes.secondary,
    color: colors.textSecondary,
  },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchHero: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.pill,
    borderWidth: 1.5,
    borderColor: '#3B5BDB22',
    paddingHorizontal: spacing.base,
    paddingVertical: 12,
    marginBottom: spacing.base,
    shadowColor: colors.primaryBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: typography.sizes.body,
    color: colors.textMuted,
  },
  searchAIBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.pinkSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.pill,
  },
  searchAIBadgeText: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: colors.brandPink,
  },
  captureSection: {
    marginBottom: spacing.base,
  },
  captureSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    letterSpacing: 0.8,
    color: colors.textMuted,
  },
  shareTargetHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  shareTargetHintText: {
    fontSize: 11,
    color: colors.primaryBlue,
    fontWeight: typography.weights.semibold,
  },
  quickRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  quickBtn: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 4,
    gap: 6,
  },
  quickBtnPink: {
    borderColor: '#E83E8C25',
  },
  quickBtnBlue: {
    borderColor: '#3B5BDB25',
  },
  quickBtnViolet: {
    borderColor: '#7C3AED25',
  },
  quickIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickBtnText: {
    fontSize: 11,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  section: {
    marginBottom: spacing.base,
  },
  suggestedContainer: {
    marginBottom: spacing.base,
  },
  suggestedGradientCard: {
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: '#F1D6E5',
    padding: spacing.base,
  },
  suggestedTopline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  suggestedSparkleIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.pinkSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestedHeadline: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    letterSpacing: 0.8,
    color: colors.brandPink,
  },
  suggestedBody: {
    fontSize: typography.sizes.body,
    color: colors.textPrimary,
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  suggestedBodyEmpty: {
    fontSize: typography.sizes.secondary,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  suggestedHighlight: {
    fontWeight: typography.weights.bold,
    color: colors.primaryBlue,
  },
  suggestedCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
  },
  suggestedCTAText: {
    fontSize: typography.sizes.secondary,
    fontWeight: typography.weights.bold,
    color: colors.primaryBlue,
  },
});

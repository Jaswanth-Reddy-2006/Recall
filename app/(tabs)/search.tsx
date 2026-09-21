import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Search,
  Sparkles,
  ArrowRight,
  History,
  X,
  Tag,
} from 'lucide-react-native';
import { colors, typography, radii, spacing } from '../../src/constants/theme';
import { useMemoryStore } from '../../src/store/useMemoryStore';
import { searchService } from '../../src/services/search/SearchService';
import { MemoryCard } from '../../src/components/memory/MemoryCard';
import { TaskCard } from '../../src/components/inbox/TaskCard';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { SearchResult } from '../../src/types';

export default function SearchScreen() {
  const { memories, actions, toggleActionComplete, updateActionStatus } = useMemoryStore();
  const [query, setQuery] = useState('');
  const [hybridResults, setHybridResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Extract dynamic topics from real memories
  const dynamicTopics = useMemo(() => {
    const allTags = memories.flatMap((m) => [...m.tags, ...(m.ai?.topics || [])]);
    const unique = Array.from(new Set(allTags.filter((t) => t.trim().length > 1)));
    return unique.slice(0, 6);
  }, [memories]);

  // Hybrid search with vector cosine similarity and keyword fallback
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setHybridResults([]);
      setIsSearching(false);
      return;
    }

    let isCurrent = true;
    setIsSearching(true);

    const timer = setTimeout(async () => {
      try {
        const results = await searchService.searchHybrid(trimmed, memories);
        if (isCurrent) {
          setHybridResults(results);
          setIsSearching(false);
        }
      } catch {
        if (isCurrent) {
          setHybridResults(searchService.search(trimmed, memories));
          setIsSearching(false);
        }
      }
    }, 180);

    return () => {
      isCurrent = false;
      clearTimeout(timer);
    };
  }, [query, memories]);

  // Actions matching the query
  const matchedActions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return actions.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        (a.sourceTitle && a.sourceTitle.toLowerCase().includes(q))
    );
  }, [query, actions]);

  // Section 1: Most Relevant (Top 2 matches)
  const mostRelevant = useMemo(() => {
    return hybridResults.slice(0, 2);
  }, [hybridResults]);

  // Section 2: Related Context (remaining matches)
  const relatedContext = useMemo(() => {
    if (hybridResults.length > 2) {
      return hybridResults.slice(2);
    }
    if (mostRelevant.length > 0) {
      const topMem = mostRelevant[0].memory;
      const related = searchService.getRelatedMemories(topMem, memories);
      return related.map((m) => ({
        memoryId: m.id,
        memory: m,
        reason: `Related to ${topMem.category} context`,
        matchedTopics: m.tags.slice(0, 2),
      }));
    }
    return [];
  }, [hybridResults, mostRelevant, memories]);

  const totalCount = hybridResults.length + matchedActions.length;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Search your memory</Text>
        <Text style={styles.subtitle}>
          Ask Recall anything about what you've saved.
        </Text>
      </View>

      {/* Hero Search Bar */}
      <View style={styles.searchBarContainer}>
        <Search size={18} color={colors.primaryBlue} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Ask anything..."
          placeholderTextColor={colors.textMuted}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityRole="search"
          accessibilityLabel="Search memory"
        />
        {query.length > 0 && (
          <TouchableOpacity
            onPress={() => setQuery('')}
            style={styles.clearBtn}
            accessibilityLabel="Clear search"
          >
            <X size={15} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {query.trim().length === 0 ? (
          memories.length === 0 ? (
            <EmptyState
              title="No memories yet."
              description="Capture a screenshot, link, note, or conversation and Recall will make it searchable."
            />
          ) : (
            <View style={styles.idleContainer}>
              {/* Dynamic Topic Filters */}
              {dynamicTopics.length > 0 && (
                <View style={styles.idleSection}>
                  <View style={styles.sectionHeaderRow}>
                    <Tag size={13} color={colors.textSecondary} />
                    <Text style={styles.sectionLabel}>TOPICS IN YOUR MEMORY</Text>
                  </View>
                  <View style={styles.recentPillsRow}>
                    {dynamicTopics.map((topic, idx) => (
                      <TouchableOpacity
                        key={idx}
                        style={styles.recentPill}
                        onPress={() => setQuery(topic)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.recentPillText}>{topic}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Dynamic Suggestions based on real memories */}
              <View style={styles.idleSection}>
                <View style={styles.sectionHeaderRow}>
                  <Sparkles size={13} color={colors.brandPink} />
                  <Text style={[styles.sectionLabel, { color: colors.brandPink }]}>
                    EXPLORE CONTEXT
                  </Text>
                </View>

                <View style={styles.promptsList}>
                  {memories.slice(0, 4).map((m, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={styles.promptItem}
                      onPress={() => setQuery(m.title)}
                      activeOpacity={0.75}
                    >
                      <Search size={14} color={colors.primaryBlue} />
                      <Text style={styles.promptText} numberOfLines={1}>
                        {m.title}
                      </Text>
                      <ArrowRight size={13} color={colors.textMuted} />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          )
        ) : totalCount === 0 ? (
          <EmptyState
            title="No memories matched this context."
            description="Try searching by a broader keyword, category, or topic."
          />
        ) : (
          /* Structured Result Hierarchy: MOST RELEVANT -> RELATED CONTEXT -> ACTIONS */
          <View style={styles.resultsWrapper}>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsSummary}>
                "{query}" • {totalCount} {totalCount === 1 ? 'result' : 'results'}
              </Text>
              {hybridResults.some((r) => r.isSemanticMatch) ? (
                <View style={styles.semanticBadge}>
                  <Sparkles size={11} color={colors.primaryBlue} />
                  <Text style={styles.semanticBadgeText}>Vector AI Match</Text>
                </View>
              ) : (
                <View style={styles.keywordBadge}>
                  <Text style={styles.keywordBadgeText}>Keyword Match</Text>
                </View>
              )}
            </View>

            {/* 1. MOST RELEVANT */}
            {mostRelevant.length > 0 && (
              <View style={styles.resultGroup}>
                <View style={styles.groupHeader}>
                  <Text style={styles.groupLabel}>MOST RELEVANT</Text>
                </View>
                {mostRelevant.map((r) => (
                  <MemoryCard
                    key={r.memoryId}
                    memory={r.memory}
                    searchReason={r.reason}
                  />
                ))}
              </View>
            )}

            {/* 2. RELATED CONTEXT */}
            {relatedContext.length > 0 && (
              <View style={styles.resultGroup}>
                <View style={styles.groupHeader}>
                  <Text style={styles.groupLabel}>RELATED CONTEXT</Text>
                  <Text style={styles.groupSub}>Connected through shared topics</Text>
                </View>
                {relatedContext.map((r) => (
                  <MemoryCard
                    key={`rel-${r.memoryId}`}
                    memory={r.memory}
                    searchReason={r.reason}
                  />
                ))}
              </View>
            )}

            {/* 3. ACTIONS */}
            {matchedActions.length > 0 && (
              <View style={styles.resultGroup}>
                <View style={styles.groupHeader}>
                  <Text style={styles.groupLabel}>ACTIONS</Text>
                </View>
                {matchedActions.map((act) => (
                  <TaskCard
                    key={act.id}
                    action={act}
                    onToggleComplete={() => toggleActionComplete(act.id)}
                    onSnooze={() => updateActionStatus(act.id, 'snoozed')}
                  />
                ))}
              </View>
            )}
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
    paddingBottom: spacing.xxl,
  },
  header: {
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
    marginBottom: spacing.xs,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: '#3B5BDB33',
    paddingHorizontal: spacing.md,
    height: 48,
    marginHorizontal: spacing.base,
    shadowColor: '#3B5BDB',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.sizes.body,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  clearBtn: {
    padding: spacing.xs,
  },
  idleContainer: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
    gap: spacing.lg,
  },
  idleSection: {
    gap: spacing.sm,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  sectionLabel: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.bold,
    color: colors.textMuted,
    letterSpacing: 0.8,
  },
  recentPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  recentPill: {
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  recentPillText: {
    fontSize: typography.sizes.secondary,
    color: colors.textPrimary,
    fontWeight: typography.weights.medium,
  },
  promptsList: {
    gap: spacing.xs,
  },
  promptItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.card,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  promptText: {
    flex: 1,
    fontSize: typography.sizes.secondary,
    color: colors.textPrimary,
    fontWeight: typography.weights.medium,
  },
  resultsWrapper: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
  },
  resultsHeader: {
    marginBottom: spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  resultsSummary: {
    fontSize: typography.sizes.secondary,
    fontWeight: typography.weights.bold,
    color: colors.primaryBlue,
  },
  semanticBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.blueSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.full,
  },
  semanticBadgeText: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: colors.primaryBlue,
  },
  keywordBadge: {
    backgroundColor: colors.card,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  keywordBadgeText: {
    fontSize: 10,
    fontWeight: typography.weights.medium,
    color: colors.textMuted,
  },
  resultGroup: {
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  groupHeader: {
    marginBottom: 4,
  },
  groupLabel: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.bold,
    color: colors.textMuted,
    letterSpacing: 0.8,
  },
  groupSub: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    marginTop: 1,
  },
});

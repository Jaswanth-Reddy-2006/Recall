import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Layers,
  Image as ImageIcon,
  Link2,
  FileText,
  PhoneCall,
  Search,
  X,
} from 'lucide-react-native';
import { colors, typography, radii, spacing } from '../../src/constants/theme';
import { useMemoryStore } from '../../src/store/useMemoryStore';
import { MemoryCard } from '../../src/components/memory/MemoryCard';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { MemoryType, CategoryType } from '../../src/types';

const CATEGORIES: CategoryType[] = [
  'All',
  'College',
  'Development',
  'Learning',
  'Work',
  'Personal',
  'Travel',
  'Finance',
  'Health',
  'Other',
];

export default function LibraryScreen() {
  const router = useRouter();
  const memories = useMemoryStore((state) => state.memories);
  const [selectedType, setSelectedType] = useState<'all' | MemoryType>('all');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
  const [filterQuery, setFilterQuery] = useState('');

  const filteredMemories = useMemo(() => {
    return memories.filter((m) => {
      const matchesType = selectedType === 'all' || m.type === selectedType;
      const matchesCat = selectedCategory === 'All' || m.category === selectedCategory;
      const matchesFilter =
        !filterQuery.trim() ||
        m.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
        m.tags.some((t) => t.toLowerCase().includes(filterQuery.toLowerCase()));

      return matchesType && matchesCat && matchesFilter;
    });
  }, [memories, selectedType, selectedCategory, filterQuery]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Your memory</Text>
          <Text style={styles.subtitle}>
            {memories.length === 0
              ? 'No saved memories yet'
              : `${memories.length} saved ${memories.length === 1 ? 'memory' : 'memories'} connected in context`}
          </Text>
        </View>
      </View>

      {/* Filter / Search Input */}
      <View style={styles.searchBar}>
        <Search size={16} color={colors.primaryBlue} style={{ marginRight: spacing.sm }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Filter by title or tag..."
          placeholderTextColor={colors.textMuted}
          value={filterQuery}
          onChangeText={setFilterQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {filterQuery.length > 0 && (
          <TouchableOpacity onPress={() => setFilterQuery('')}>
            <X size={15} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Segmented Content Type Filter */}
      <View style={styles.filterSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.typeScroll}
        >
          <TouchableOpacity
            style={[styles.typePill, selectedType === 'all' && styles.typePillActive]}
            onPress={() => setSelectedType('all')}
            activeOpacity={0.7}
          >
            <Layers
              size={12}
              color={selectedType === 'all' ? colors.white : colors.textSecondary}
            />
            <Text style={[styles.typeText, selectedType === 'all' && styles.typeTextActive]}>
              All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.typePill, selectedType === 'screenshot' && styles.typePillPinkActive]}
            onPress={() => setSelectedType('screenshot')}
            activeOpacity={0.7}
          >
            <ImageIcon
              size={12}
              color={selectedType === 'screenshot' ? colors.white : colors.brandPink}
            />
            <Text style={[styles.typeText, selectedType === 'screenshot' && styles.typeTextActive]}>
              Screenshots
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.typePill, selectedType === 'link' && styles.typePillBlueActive]}
            onPress={() => setSelectedType('link')}
            activeOpacity={0.7}
          >
            <Link2
              size={12}
              color={selectedType === 'link' ? colors.white : colors.primaryBlue}
            />
            <Text style={[styles.typeText, selectedType === 'link' && styles.typeTextActive]}>
              Links
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.typePill, selectedType === 'note' && styles.typePillVioletActive]}
            onPress={() => setSelectedType('note')}
            activeOpacity={0.7}
          >
            <FileText
              size={12}
              color={selectedType === 'note' ? colors.white : '#7C3AED'}
            />
            <Text style={[styles.typeText, selectedType === 'note' && styles.typeTextActive]}>
              Notes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.typePill, selectedType === 'call' && styles.typePillPinkActive]}
            onPress={() => setSelectedType('call')}
            activeOpacity={0.7}
          >
            <PhoneCall
              size={12}
              color={selectedType === 'call' ? colors.white : colors.brandPink}
            />
            <Text style={[styles.typeText, selectedType === 'call' && styles.typeTextActive]}>
              Calls
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Category Pills */}
      <View style={styles.categorySection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                selectedCategory === cat && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(cat)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat && styles.categoryTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Count Indicator */}
      <View style={styles.countRow}>
        <Text style={styles.countText}>
          SHOWING {filteredMemories.length} {filteredMemories.length === 1 ? 'ITEM' : 'ITEMS'}
        </Text>
      </View>

      {/* Content List */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredMemories.length === 0 ? (
          <EmptyState
            title="Nothing saved yet."
            description={
              filterQuery || selectedType !== 'all' || selectedCategory !== 'All'
                ? 'Try adjusting your type or category filter.'
                : 'Capture screenshots, notes, links, or conversations to populate your memory.'
            }
            actionText="Capture something"
            onActionPress={() => router.push('/capture/modal')}
          />
        ) : (
          filteredMemories.map((memory) => (
            <MemoryCard key={memory.id} memory={memory} />
          ))
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
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 42,
    marginHorizontal: spacing.base,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.sizes.secondary,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  filterSection: {
    marginTop: spacing.xs,
  },
  typeScroll: {
    paddingHorizontal: spacing.base,
    gap: spacing.xs,
    paddingVertical: spacing.xs,
  },
  typePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radii.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typePillActive: {
    backgroundColor: colors.primaryBlue,
    borderColor: colors.primaryBlue,
  },
  typePillPinkActive: {
    backgroundColor: colors.brandPink,
    borderColor: colors.brandPink,
  },
  typePillBlueActive: {
    backgroundColor: colors.primaryBlue,
    borderColor: colors.primaryBlue,
  },
  typePillVioletActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  typeText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: typography.weights.semibold,
  },
  typeTextActive: {
    color: colors.white,
    fontWeight: typography.weights.bold,
  },
  categorySection: {
    marginTop: 2,
    marginBottom: spacing.xs,
  },
  categoryScroll: {
    paddingHorizontal: spacing.base,
    gap: 6,
    paddingVertical: 4,
  },
  categoryChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipActive: {
    backgroundColor: '#E8ECFA',
    borderColor: colors.primaryBlue,
  },
  categoryText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: typography.weights.medium,
  },
  categoryTextActive: {
    color: colors.primaryBlue,
    fontWeight: typography.weights.bold,
  },
  countRow: {
    paddingHorizontal: spacing.base,
    paddingVertical: 4,
  },
  countText: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    letterSpacing: 0.8,
    color: colors.textMuted,
  },
  listContainer: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xxl,
    gap: spacing.sm,
  },
});

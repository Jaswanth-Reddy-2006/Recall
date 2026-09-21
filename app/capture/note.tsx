import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Sparkles,
  Check,
  FileText,
  ChevronDown,
  X,
  AlertCircle,
  Calendar,
  ArrowRight,
} from 'lucide-react-native';
import { colors, typography, radii, spacing } from '../../src/constants/theme';
import { useMemoryStore } from '../../src/store/useMemoryStore';
import { aiService } from '../../src/services/ai/AIService';
import { Memory, Action, CategoryType } from '../../src/types';

const CATEGORIES: CategoryType[] = [
  'Work',
  'Personal',
  'College',
  'Development',
  'Learning',
  'Travel',
  'Finance',
  'Health',
  'Other',
];

const NOTE_PRESETS = [
  {
    title: 'Discussion with Ravi',
    text: 'Ask Ravi about deployment and update the API tomorrow',
    category: 'Work' as CategoryType,
  },
  {
    title: 'DBMS Assignment Follow-up',
    text: 'Review B+ Tree node splitting examples before the Friday submission deadline',
    category: 'College' as CategoryType,
  },
  {
    title: 'Redis Caching Optimization',
    text: 'Check cache hit ratio in production after implementing cache-aside TTL jitter',
    category: 'Development' as CategoryType,
  },
];

export default function NoteCaptureScreen() {
  const router = useRouter();
  const { addMemory, addAction } = useMemoryStore();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<CategoryType>('Work');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleApplyPreset = (presetText: string, presetCategory: CategoryType) => {
    setContent(presetText);
    setCategory(presetCategory);
  };

  const handleSave = async () => {
    if (!content.trim()) {
      Alert.alert('Note Content Required', 'Please enter your note text.');
      return;
    }

    setIsSaving(true);
    try {
      const memoryId = `mem-${Date.now()}`;
      const autoAnalysis = await aiService.analyzeNote(content);

      const finalTitle = title.trim() || autoAnalysis.title;
      const finalCategory = category || (autoAnalysis.category as CategoryType);

      const newMemory: Memory = {
        id: memoryId,
        type: 'note',
        title: finalTitle,
        content: content.trim(),
        source: 'Quick Note',
        category: finalCategory,
        tags: autoAnalysis.tags,
        summary: autoAnalysis.summary,
        originalContent: content.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ai: {
          confidence: 0.96,
          topics: autoAnalysis.tags,
          detectedDates: autoAnalysis.detectedAction?.dueDate
            ? [autoAnalysis.detectedAction.dueDate]
            : [],
          relevanceReason: `Recall indexed this note under ${finalCategory} (${autoAnalysis.tags.join(', ')}).`,
          processedLocally: true,
        },
        embeddingStatus: 'ready',
      };

      await addMemory(newMemory);

      // If AI detects an actionable commitment, prompt user confirmation with concrete date
      if (autoAnalysis.detectedAction) {
        setIsSaving(false);
        const actionTitle = autoAnalysis.detectedAction.title;
        const actionDue = autoAnalysis.detectedAction.dueDate || '22 September 2026';

        Alert.alert(
          'Action Item Detected',
          `"${actionTitle}"\nDue: ${actionDue}\n\nAdd this to your Action Inbox?`,
          [
            {
              text: 'Not a task',
              style: 'cancel',
              onPress: () => router.replace('/(tabs)/library'),
            },
            {
              text: 'Add to Inbox',
              onPress: async () => {
                await addAction({
                  id: `act-${Date.now()}`,
                  title: actionTitle,
                  type: autoAnalysis.detectedAction!.type,
                  status: 'pending',
                  dueDate: actionDue,
                  sourceMemoryId: memoryId,
                  sourceTitle: finalTitle,
                  sourceType: 'note',
                  createdAt: new Date().toISOString(),
                });
                router.replace('/(tabs)/inbox');
              },
            },
          ]
        );
        return;
      }

      setIsSaving(false);
      router.replace('/(tabs)/library');
    } catch {
      // Direct save fallback
      const memoryId = `mem-${Date.now()}`;
      const lines = content.trim().split('\n');
      const finalTitle = title.trim() || lines[0].slice(0, 48) || 'Quick Note';
      const newMemory: Memory = {
        id: memoryId,
        type: 'note',
        title: finalTitle,
        content: content.trim(),
        source: 'Quick Note',
        category,
        tags: [category, 'Note'],
        summary: content.trim().slice(0, 200),
        originalContent: content.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ai: {
          confidence: 0.9,
          topics: [category],
          relevanceReason: 'Quick note saved to personal memory.',
          processedLocally: true,
        },
        embeddingStatus: 'ready',
      };
      await addMemory(newMemory);
      setIsSaving(false);
      router.replace('/(tabs)/library');
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.heading}>Capture Note</Text>
      <Text style={styles.subheading}>
        Recall remembers your thoughts, understands why they matter, and surfaces actionable commitments.
      </Text>

      {/* Preset Suggestions for Quick Demo / Evaluation */}
      <View style={styles.presetSection}>
        <View style={styles.presetHeaderRow}>
          <Sparkles size={13} color={colors.brandPink} />
          <Text style={styles.presetHeading}>QUICK SUGGESTIONS</Text>
        </View>
        <View style={styles.presetList}>
          {NOTE_PRESETS.map((p, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.presetCard}
              onPress={() => handleApplyPreset(p.text, p.category)}
              activeOpacity={0.75}
            >
              <View style={styles.presetContent}>
                <Text style={styles.presetTitle}>{p.title}</Text>
                <Text style={styles.presetText} numberOfLines={1}>
                  "{p.text}"
                </Text>
              </View>
              <ArrowRight size={14} color={colors.primaryBlue} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Note Title */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>TITLE (OPTIONAL)</Text>
        <TextInput
          style={styles.titleInput}
          placeholder="Leave blank for automatic AI title"
          placeholderTextColor={colors.textMuted}
          value={title}
          onChangeText={setTitle}
        />
      </View>

      {/* Compact Category Selector */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>CATEGORY</Text>
        <View style={styles.categoryRow}>
          <View style={styles.activeCategoryPill}>
            <Text style={styles.activeCategoryText}>{category}</Text>
          </View>
          <TouchableOpacity
            style={styles.changeCategoryBtn}
            onPress={() => setShowCategoryModal(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.changeCategoryText}>Change</Text>
            <ChevronDown size={14} color={colors.primaryBlue} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Large Content Input */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>NOTE CONTENT</Text>
        <TextInput
          style={styles.contentInput}
          placeholder="e.g. Ask Ravi about deployment and update the API tomorrow"
          placeholderTextColor={colors.textMuted}
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
        />
      </View>

      {/* AI banner notice */}
      <View style={styles.aiHintBox}>
        <Sparkles size={14} color={colors.brandPink} />
        <Text style={styles.aiHintText}>
          Understood by Recall: Action items and dates are detected automatically.
        </Text>
      </View>

      {/* Save Button */}
      <TouchableOpacity
        style={styles.saveBtn}
        onPress={handleSave}
        disabled={isSaving}
        activeOpacity={0.88}
      >
        <LinearGradient
          colors={['#E83E8C', '#3B5BDB']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.saveGradient}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <>
              <Check size={18} color={colors.white} strokeWidth={2.5} />
              <Text style={styles.saveBtnText}>Save to Recall</Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>

      {/* CATEGORY SELECTOR MODAL */}
      <Modal
        visible={showCategoryModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCategoryModal(false)}
        >
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalCategoriesList}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.modalCategoryOption,
                    category === cat && styles.modalCategoryActive,
                  ]}
                  onPress={() => {
                    setCategory(cat);
                    setShowCategoryModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalCategoryText,
                      category === cat && styles.modalCategoryTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                  {category === cat && <Check size={16} color={colors.brandPink} />}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
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
  heading: {
    fontSize: typography.sizes.screenTitle,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    letterSpacing: -0.4,
  },
  subheading: {
    fontSize: typography.sizes.secondary,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: spacing.base,
    lineHeight: 20,
  },
  presetSection: {
    marginBottom: spacing.base,
  },
  presetHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.xs,
  },
  presetHeading: {
    fontSize: 11,
    fontWeight: typography.weights.bold,
    color: colors.brandPink,
    letterSpacing: 0.8,
  },
  presetList: {
    gap: spacing.xs,
  },
  presetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
  },
  presetContent: {
    flex: 1,
  },
  presetTitle: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  presetText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  fieldGroup: {
    marginBottom: spacing.base,
  },
  label: {
    fontSize: 10.5,
    fontWeight: typography.weights.bold,
    color: colors.textMuted,
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  titleInput: {
    fontSize: typography.sizes.primary,
    color: colors.textPrimary,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  activeCategoryPill: {
    backgroundColor: colors.pinkSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: '#E83E8C44',
  },
  activeCategoryText: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.bold,
    color: colors.brandPink,
  },
  changeCategoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceMuted,
  },
  changeCategoryText: {
    fontSize: 12,
    fontWeight: typography.weights.semibold,
    color: colors.primaryBlue,
  },
  contentInput: {
    height: 140,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    fontSize: typography.sizes.primary,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  aiHintBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.pinkSoft,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: '#E83E8C33',
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  aiHintText: {
    flex: 1,
    fontSize: 12,
    color: colors.brandPink,
    fontWeight: typography.weights.medium,
  },
  saveBtn: {
    borderRadius: radii.md,
    overflow: 'hidden',
  },
  saveGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: spacing.md,
  },
  saveBtnText: {
    fontSize: typography.sizes.primary,
    fontWeight: typography.weights.bold,
    color: colors.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.base,
  },
  modalCard: {
    width: '90%',
    maxWidth: 360,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.base,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.sm,
  },
  modalTitle: {
    fontSize: typography.sizes.primary,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  modalCategoriesList: {
    gap: 4,
  },
  modalCategoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: radii.sm,
  },
  modalCategoryActive: {
    backgroundColor: colors.pinkSoft,
  },
  modalCategoryText: {
    fontSize: typography.sizes.secondary,
    color: colors.textPrimary,
  },
  modalCategoryTextActive: {
    fontWeight: typography.weights.bold,
    color: colors.brandPink,
  },
});

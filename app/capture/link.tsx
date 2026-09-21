import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Link2,
  Sparkles,
  Check,
  Globe,
  ArrowRight,
  ChevronDown,
  X,
  ExternalLink,
} from 'lucide-react-native';
import { colors, typography, radii, spacing } from '../../src/constants/theme';
import { useMemoryStore } from '../../src/store/useMemoryStore';
import { aiService } from '../../src/services/ai/AIService';
import { LinkAnalysisResult } from '../../src/services/ai/AIProvider';
import { Memory, CategoryType } from '../../src/types';

const SAMPLE_LINKS = [
  {
    title: 'ByteByteGo Rate Limiter Architecture',
    url: 'https://bytebytego.com/courses/system-design-interview/rate-limiter',
    domain: 'bytebytego.com',
  },
  {
    title: 'Redis In-Memory Key-Value Store',
    url: 'https://github.com/redis/redis',
    domain: 'github.com',
  },
  {
    title: 'React 19 Release Notes',
    url: 'https://react.dev/blog/2024/04/25/react-19',
    domain: 'react.dev',
  },
];

const CATEGORIES: CategoryType[] = [
  'Learning',
  'Development',
  'Work',
  'Personal',
  'College',
  'Travel',
  'Finance',
  'Health',
  'Other',
];

export default function LinkCaptureScreen() {
  const router = useRouter();
  const { addMemory } = useMemoryStore();

  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<LinkAnalysisResult | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('Learning');
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const handleAnalyze = async (targetUrl?: string) => {
    const finalUrl = (targetUrl || url).trim();
    if (!finalUrl) {
      Alert.alert('URL Required', 'Please enter a valid link address.');
      return;
    }

    setUrl(finalUrl);
    setIsAnalyzing(true);
    try {
      const res = await aiService.analyzeLink(finalUrl);
      setAnalysis(res);
      setSelectedCategory((res.category as CategoryType) || 'Learning');
    } catch {
      let domain = 'Web Resource';
      try {
        domain = new URL(
          finalUrl.startsWith('http') ? finalUrl : `https://${finalUrl}`
        ).hostname.replace(/^www\./, '');
      } catch {}

      setAnalysis({
        title: `${domain} Resource`,
        source: domain,
        category: 'Learning',
        tags: [domain, 'Reference'],
        summary: `Saved article and technical documentation from ${domain}.`,
        topics: [domain, 'Reference'],
        possibleAction: `Read saved resource from ${domain}`,
        processedLocally: true,
      });
      setSelectedCategory('Learning');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (!analysis) return;

    const memoryId = `mem-${Date.now()}`;
    const newMemory: Memory = {
      id: memoryId,
      type: 'link',
      title: analysis.title,
      content: analysis.summary,
      source: analysis.source,
      category: selectedCategory,
      tags: analysis.tags,
      summary: analysis.summary,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: {
        url,
        domain: analysis.source,
      },
      ai: {
        confidence: 0.99,
        topics: analysis.topics,
        relevanceReason: `Recall connected this resource to ${selectedCategory} and ${analysis.topics.slice(0, 2).join(', ')}.`,
        processedLocally: true,
      },
      embeddingStatus: 'ready',
    };

    await addMemory(newMemory);
    router.replace('/(tabs)/library');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.heading}>Save Link</Text>
      <Text style={styles.subheading}>
        Recall extracts source metadata, topics, and an AI summary automatically.
      </Text>

      {/* Input row */}
      <View style={styles.inputCard}>
        <Link2 size={18} color={colors.primaryBlue} />
        <TextInput
          style={styles.input}
          placeholder="Paste URL (e.g. https://github.com/...)"
          placeholderTextColor={colors.textMuted}
          value={url}
          onChangeText={setUrl}
          autoCapitalize="none"
          keyboardType="url"
          returnKeyType="go"
          onSubmitEditing={() => handleAnalyze()}
        />
        <TouchableOpacity
          style={styles.analyzeBtn}
          onPress={() => handleAnalyze()}
          disabled={isAnalyzing}
          activeOpacity={0.8}
        >
          {isAnalyzing ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <ArrowRight size={16} color={colors.white} />
          )}
        </TouchableOpacity>
      </View>

      {/* Sample Links for Quick Evaluation */}
      {!analysis && (
        <View style={styles.sampleSection}>
          <View style={styles.sampleHeader}>
            <Sparkles size={13} color={colors.brandPink} />
            <Text style={styles.sampleLabel}>TRY SAMPLE LINKS</Text>
          </View>
          <View style={styles.sampleList}>
            {SAMPLE_LINKS.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.sampleCard}
                onPress={() => handleAnalyze(item.url)}
                activeOpacity={0.75}
              >
                <View style={styles.sampleIconBox}>
                  <Globe size={16} color={colors.primaryBlue} />
                </View>
                <View style={styles.sampleTextContainer}>
                  <Text style={styles.sampleTitle}>{item.title}</Text>
                  <Text style={styles.sampleUrl} numberOfLines={1}>
                    {item.domain}
                  </Text>
                </View>
                <ArrowRight size={14} color={colors.brandPink} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* UNDERSTOOD BY RECALL CARD */}
      {analysis && (
        <View style={styles.understoodCard}>
          <LinearGradient
            colors={['#E83E8C', '#3B5BDB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardBanner}
          >
            <View style={styles.bannerHeader}>
              <Sparkles size={16} color={colors.white} />
              <Text style={styles.bannerTitle}>LINK UNDERSTOOD BY RECALL</Text>
            </View>
            <Text style={styles.bannerSub}>
              Source parsed & indexed into personal knowledge base
            </Text>
          </LinearGradient>

          <View style={styles.cardContent}>
            {/* Domain & Source Row */}
            <View style={styles.domainRow}>
              <Globe size={14} color={colors.primaryBlue} />
              <Text style={styles.domainText}>{analysis.source}</Text>
            </View>

            {/* Title */}
            <Text style={styles.resultTitle}>{analysis.title}</Text>

            {/* Category with Compact [Change] button */}
            <View style={styles.categoryRow}>
              <View style={styles.activeCategoryPill}>
                <Text style={styles.activeCategoryText}>{selectedCategory}</Text>
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

            {/* Summary */}
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionLabel}>SUMMARY</Text>
              <Text style={styles.summaryText}>{analysis.summary}</Text>
            </View>

            {/* Topics */}
            {analysis.topics.length > 0 && (
              <View style={styles.sectionBlock}>
                <Text style={styles.sectionLabel}>TOPICS</Text>
                <View style={styles.topicsRow}>
                  {analysis.topics.map((t, idx) => (
                    <View key={idx} style={styles.topicPill}>
                      <Text style={styles.topicText}>#{t}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Action suggestion if any */}
            {analysis.possibleAction && (
              <View style={styles.actionBlock}>
                <Sparkles size={14} color={colors.brandPink} />
                <Text style={styles.actionNoticeText}>
                  Suggested action: {analysis.possibleAction}
                </Text>
              </View>
            )}

            {/* Save Button */}
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleSave}
              activeOpacity={0.88}
            >
              <LinearGradient
                colors={['#E83E8C', '#3B5BDB']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.saveGradient}
              >
                <Check size={18} color={colors.white} strokeWidth={2.5} />
                <Text style={styles.saveBtnText}>Save Memory</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      )}

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
                    selectedCategory === cat && styles.modalCategoryActive,
                  ]}
                  onPress={() => {
                    setSelectedCategory(cat);
                    setShowCategoryModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalCategoryText,
                      selectedCategory === cat && styles.modalCategoryTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                  {selectedCategory === cat && <Check size={16} color={colors.brandPink} />}
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
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: colors.blueBorder,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    marginBottom: spacing.base,
  },
  input: {
    flex: 1,
    fontSize: typography.sizes.primary,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
    paddingVertical: 8,
  },
  analyzeBtn: {
    backgroundColor: colors.brandPink,
    width: 34,
    height: 34,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sampleSection: {
    marginTop: spacing.sm,
  },
  sampleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.sm,
  },
  sampleLabel: {
    fontSize: 11,
    fontWeight: typography.weights.bold,
    color: colors.brandPink,
    letterSpacing: 0.8,
  },
  sampleList: {
    gap: spacing.sm,
  },
  sampleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  sampleIconBox: {
    width: 36,
    height: 36,
    borderRadius: radii.sm,
    backgroundColor: colors.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  sampleTextContainer: {
    flex: 1,
  },
  sampleTitle: {
    fontSize: typography.sizes.secondary,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  sampleUrl: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  understoodCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.blueBorder,
    overflow: 'hidden',
    marginTop: spacing.sm,
    shadowColor: colors.primaryBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  cardBanner: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  bannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bannerTitle: {
    fontSize: 13,
    fontWeight: typography.weights.bold,
    color: colors.white,
    letterSpacing: 1,
  },
  bannerSub: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.88)',
    marginTop: 2,
  },
  cardContent: {
    padding: spacing.base,
    gap: spacing.md,
  },
  domainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  domainText: {
    fontSize: 12,
    fontWeight: typography.weights.semibold,
    color: colors.primaryBlue,
  },
  resultTitle: {
    fontSize: typography.sizes.primary,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
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
  sectionBlock: {
    gap: 4,
  },
  sectionLabel: {
    fontSize: 10.5,
    fontWeight: typography.weights.bold,
    color: colors.textMuted,
    letterSpacing: 0.6,
  },
  summaryText: {
    fontSize: typography.sizes.secondary,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  topicsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  topicPill: {
    backgroundColor: colors.blueSoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.full,
  },
  topicText: {
    fontSize: 11,
    fontWeight: typography.weights.medium,
    color: colors.primaryBlue,
  },
  actionBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.pinkSoft,
    padding: spacing.sm,
    borderRadius: radii.sm,
  },
  actionNoticeText: {
    fontSize: 12,
    fontWeight: typography.weights.semibold,
    color: colors.brandPink,
    flex: 1,
  },
  saveBtn: {
    borderRadius: radii.md,
    overflow: 'hidden',
    marginTop: spacing.xs,
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

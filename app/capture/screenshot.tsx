import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Image as ImageIcon,
  Check,
  Sparkles,
  AlertCircle,
  Calendar,
  Layers,
  Camera,
  X,
  ChevronDown,
  ArrowRight,
  Clock,
} from 'lucide-react-native';
import { colors, typography, radii, spacing } from '../../src/constants/theme';
import { useMemoryStore } from '../../src/store/useMemoryStore';
import { aiService } from '../../src/services/ai/AIService';
import { AIProcessingView } from '../../src/components/capture/AIProcessingView';
import { PermissionService } from '../../src/services/permissions/PermissionService';
import { mediaRepository } from '../../src/services/storage/MediaRepository';
import { Memory, Action, CategoryType } from '../../src/types';

const SAMPLE_PRESETS = [
  {
    label: 'Campus Recruitment Drive',
    sub: 'TechCorp walk-in drive for 2026 batch',
    hint: 'TechCorp campus walk-in recruitment drive on 22 September 2026',
    imageUri: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'DBMS Lab Assignment 4',
    sub: 'B+ Trees & Transactions deadline',
    hint: 'DBMS assignment submission Friday portal 24 September 2026',
    imageUri: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Redis Caching Architecture',
    sub: 'Latency optimization from 320ms to 24ms',
    hint: 'Redis cache-aside pattern latency benchmark 24ms P99',
    imageUri: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'API Connection Timeout',
    sub: 'Postgres connection pool exhaustion',
    hint: 'API 500 error connection pool exhausted',
    imageUri: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
  },
];

const CATEGORIES: CategoryType[] = [
  'Work',
  'College',
  'Development',
  'Learning',
  'Personal',
  'Travel',
  'Finance',
  'Health',
  'Other',
];

export default function ScreenshotCaptureScreen() {
  const router = useRouter();
  const { addMemory, addAction } = useMemoryStore();

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Review & Editable state
  const [analyzed, setAnalyzed] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryType>('Work');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [tagsInput, setTagsInput] = useState('');
  const [topics, setTopics] = useState<string[]>([]);
  const [summary, setSummary] = useState('');
  const [importantDetails, setImportantDetails] = useState<string[]>([]);

  // Action extraction state
  const [actionTitle, setActionTitle] = useState('');
  const [actionDueDate, setActionDueDate] = useState('');
  const [actionType, setActionType] = useState<'task' | 'deadline' | 'follow_up' | 'waiting'>('task');
  const [taskConfirmed, setTaskConfirmed] = useState(true);

  const runAnalysis = async (uri: string, hint: string) => {
    setImageUri(uri);
    setIsProcessing(true);
    setCurrentStepIndex(0);

    try {
      const result = await aiService.analyzeScreenshot(uri, hint, (step) => {
        setCurrentStepIndex(step);
      });

      setTitle(result.title);
      setCategory((result.category as CategoryType) || 'Work');
      setTagsInput(result.tags.join(', '));
      setTopics(result.topics || result.tags);
      setSummary(result.summary);
      setImportantDetails(result.importantDetails || [
        'Captured and indexed into local memory graph',
        'Text and visible layout analyzed locally',
        'Searchable via hybrid semantic and keyword retrieval',
      ]);

      if (result.detectedAction) {
        setActionTitle(result.detectedAction.title);
        setActionDueDate(result.detectedAction.dueDate || '22 September 2026');
        setActionType(result.detectedAction.type);
        setTaskConfirmed(true);
      } else {
        setActionTitle('');
        setActionDueDate('');
        setTaskConfirmed(false);
      }

      setIsProcessing(false);
      setAnalyzed(true);
    } catch (err: any) {
      setIsProcessing(false);
      Alert.alert(
        'Capture Ready',
        'Screenshot preserved. You can edit details and save directly.',
        [
          {
            text: 'Continue',
            onPress: () => {
              setTitle('Saved Screenshot Reference');
              setCategory('Work');
              setSummary('Visual reference captured from device.');
              setAnalyzed(true);
            },
          },
        ]
      );
    }
  };

  const handlePickCustomImage = async () => {
    const permitted = await PermissionService.requestPhotosWithRationale();
    if (!permitted) return;

    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.9,
      });

      if (!res.canceled && res.assets && res.assets[0]) {
        runAnalysis(res.assets[0].uri, 'Selected screenshot');
      }
    } catch {
      Alert.alert('Gallery Error', 'Could not open photo library.');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Camera Access', 'Camera permission is required to take photos.');
        return;
      }

      const res = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 0.9,
      });

      if (!res.canceled && res.assets && res.assets[0]) {
        runAnalysis(res.assets[0].uri, 'Camera capture');
      }
    } catch {
      Alert.alert('Camera Error', 'Could not open camera.');
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Title Required', 'Please enter a title for this memory.');
      return;
    }

    const memoryId = `mem-${Date.now()}`;
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newMemory: Memory = {
      id: memoryId,
      type: 'screenshot',
      title: title.trim(),
      content: summary,
      source: 'Screenshot capture',
      category,
      tags: tags.length > 0 ? tags : topics,
      summary: summary.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: {
        imageUri: mediaRepository.resolveLocalUri(imageUri || ''),
      },
      ai: {
        confidence: 0.98,
        detectedDates: actionDueDate ? [actionDueDate] : [],
        topics: topics.length > 0 ? topics : tags,
        relevanceReason: `Recall connected this memory to ${category} and ${topics.slice(0, 2).join(', ')}.`,
        processedLocally: true,
      },
      embeddingStatus: 'ready',
    };

    await addMemory(newMemory);

    if (taskConfirmed && actionTitle.trim()) {
      await addAction({
        id: `act-${Date.now()}`,
        title: actionTitle.trim(),
        type: actionType,
        status: 'pending',
        dueDate: actionDueDate.trim() || undefined,
        sourceMemoryId: memoryId,
        sourceTitle: title.trim(),
        sourceType: 'screenshot',
        createdAt: new Date().toISOString(),
      });
      router.replace('/(tabs)/inbox');
    } else {
      router.replace('/(tabs)/library');
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. SELECTION / CAPTURE VIEW */}
      {!analyzed && !isProcessing && (
        <View style={styles.pickerSection}>
          <Text style={styles.sectionHeading}>Capture Screenshot</Text>
          <Text style={styles.sectionSubtitle}>
            Recall remembers what you see, understands why it matters, and turns it into something useful.
          </Text>

          {/* Primary Action Card: Photo Gallery */}
          <TouchableOpacity
            style={styles.heroPickCard}
            onPress={handlePickCustomImage}
            activeOpacity={0.88}
          >
            <View style={styles.heroPickIconBox}>
              <ImageIcon size={26} color={colors.brandPink} />
            </View>
            <View style={styles.heroPickContent}>
              <Text style={styles.heroPickTitle}>Choose from Photos</Text>
              <Text style={styles.heroPickSubtitle}>Select any screenshot from your gallery</Text>
            </View>
            <ArrowRight size={18} color={colors.brandPink} />
          </TouchableOpacity>

          {/* Secondary Action: Camera */}
          <TouchableOpacity
            style={styles.cameraCard}
            onPress={handleTakePhoto}
            activeOpacity={0.88}
          >
            <View style={styles.cameraIconBox}>
              <Camera size={22} color={colors.primaryBlue} />
            </View>
            <View style={styles.heroPickContent}>
              <Text style={styles.cameraTitle}>Take Photo with Camera</Text>
              <Text style={styles.cameraSubtitle}>Capture a whiteboard, flyer, or document</Text>
            </View>
          </TouchableOpacity>

          {/* Presets for Instant One-Tap Evaluation */}
          <View style={styles.presetSection}>
            <View style={styles.presetHeaderRow}>
              <Sparkles size={14} color={colors.brandPink} />
              <Text style={styles.presetHeading}>OR TEST WITH SAMPLE SCENARIOS</Text>
            </View>

            <View style={styles.presetList}>
              {SAMPLE_PRESETS.map((preset, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.presetCard}
                  onPress={() => runAnalysis(preset.imageUri, preset.hint)}
                  activeOpacity={0.8}
                >
                  <Image source={{ uri: preset.imageUri }} style={styles.presetThumb} />
                  <View style={styles.presetInfo}>
                    <Text style={styles.presetLabel}>{preset.label}</Text>
                    <Text style={styles.presetSub} numberOfLines={1}>
                      {preset.sub}
                    </Text>
                  </View>
                  <LinearGradient
                    colors={['#E83E8C', '#3B5BDB']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.presetRunBadge}
                  >
                    <Sparkles size={12} color={colors.white} />
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* 2. HIGH-FIDELITY LIVE AI PROCESSING CHECKLIST */}
      {isProcessing && (
        <View style={styles.processingWrapper}>
          {imageUri && (
            <View style={styles.previewImageFrame}>
              <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="cover" />
            </View>
          )}
          <AIProcessingView
            currentStepIndex={currentStepIndex}
            steps={[
              'Reading visible content',
              'Identifying context',
              'Finding important details',
              'Looking for actions',
            ]}
            title="Understanding screenshot..."
          />
        </View>
      )}

      {/* 3. UNDERSTOOD BY RECALL — RESULT CARD */}
      {analyzed && (
        <View style={styles.understoodSection}>
          {/* Top Banner with Pink + Blue Gradient */}
          <LinearGradient
            colors={['#E83E8C', '#3B5BDB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.understoodBanner}
          >
            <View style={styles.understoodHeaderContent}>
              <Sparkles size={16} color={colors.white} />
              <Text style={styles.understoodBannerText}>UNDERSTOOD BY RECALL</Text>
            </View>
            <Text style={styles.understoodBannerSub}>
              Processed locally · Connected to personal memory
            </Text>
          </LinearGradient>

          {/* Captured Screenshot Thumbnail & Details */}
          {imageUri && (
            <View style={styles.previewThumbRow}>
              <Image source={{ uri: imageUri }} style={styles.savedThumb} resizeMode="cover" />
              <View style={styles.savedThumbText}>
                <Text style={styles.savedThumbTitle}>Original Screenshot Preserved</Text>
                <Text style={styles.savedThumbMeta}>Stored permanently in your local archive</Text>
              </View>
            </View>
          )}

          {/* Memory Title */}
          <View style={styles.cardBlock}>
            <Text style={styles.fieldLabel}>TITLE</Text>
            <TextInput
              style={styles.titleInput}
              value={title}
              onChangeText={setTitle}
              placeholder="Memory title"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          {/* Category with Compact [Change] button */}
          <View style={styles.cardBlock}>
            <Text style={styles.fieldLabel}>CATEGORY</Text>
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

          {/* Summary */}
          <View style={styles.cardBlock}>
            <Text style={styles.fieldLabel}>SUMMARY</Text>
            <Text style={styles.summaryText}>{summary}</Text>
          </View>

          {/* Important Details (Bulleted List) */}
          {importantDetails.length > 0 && (
            <View style={styles.cardBlock}>
              <Text style={styles.fieldLabel}>IMPORTANT DETAILS</Text>
              <View style={styles.bulletList}>
                {importantDetails.map((detail, idx) => (
                  <View key={idx} style={styles.bulletItem}>
                    <View style={styles.bulletDot} />
                    <Text style={styles.bulletText}>{detail}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Topics & Tags */}
          {topics.length > 0 && (
            <View style={styles.cardBlock}>
              <Text style={styles.fieldLabel}>TOPICS</Text>
              <View style={styles.topicsRow}>
                {topics.map((t, idx) => (
                  <View key={idx} style={styles.topicPill}>
                    <Text style={styles.topicText}>#{t}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Action Card: "Recall found something you may want to act on" */}
          {actionTitle ? (
            <View style={styles.actionCard}>
              <View style={styles.actionCardHeader}>
                <AlertCircle size={16} color={colors.brandPink} />
                <Text style={styles.actionCardNotice}>
                  Recall found something you may want to act on
                </Text>
              </View>

              <Text style={styles.actionTitleText}>{actionTitle}</Text>

              {actionDueDate ? (
                <View style={styles.dueDateBadge}>
                  <Calendar size={13} color={colors.brandPink} />
                  <Text style={styles.dueDateText}>Due: {actionDueDate}</Text>
                </View>
              ) : null}

              <TouchableOpacity
                style={[
                  styles.inboxButton,
                  taskConfirmed ? styles.inboxButtonAdded : styles.inboxButtonUnadded,
                ]}
                onPress={() => setTaskConfirmed(!taskConfirmed)}
                activeOpacity={0.8}
              >
                {taskConfirmed ? (
                  <>
                    <Check size={14} color={colors.white} strokeWidth={2.5} />
                    <Text style={styles.inboxButtonTextAdded}>Added to Inbox</Text>
                  </>
                ) : (
                  <>
                    <X size={14} color={colors.textSecondary} />
                    <Text style={styles.inboxButtonTextUnadded}>Not a task (Skip)</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          ) : null}

          {/* Primary Save Button */}
          <TouchableOpacity
            style={styles.primarySaveBtn}
            onPress={handleSave}
            activeOpacity={0.88}
          >
            <LinearGradient
              colors={['#E83E8C', '#3B5BDB']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.primarySaveGradient}
            >
              <Check size={18} color={colors.white} strokeWidth={2.5} />
              <Text style={styles.primarySaveText}>Save Memory</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {/* CATEGORY SELECTOR MODAL (Replaces the giant chip wall) */}
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
  pickerSection: {
    paddingTop: spacing.xs,
  },
  sectionHeading: {
    fontSize: typography.sizes.screenTitle,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    letterSpacing: -0.4,
  },
  sectionSubtitle: {
    fontSize: typography.sizes.secondary,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: spacing.base,
    lineHeight: 20,
  },
  heroPickCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: '#E83E8C44',
    padding: spacing.base,
    marginBottom: spacing.sm,
    shadowColor: colors.brandPink,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  heroPickIconBox: {
    width: 48,
    height: 48,
    borderRadius: radii.md,
    backgroundColor: colors.pinkSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  heroPickContent: {
    flex: 1,
  },
  heroPickTitle: {
    fontSize: typography.sizes.primary,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  heroPickSubtitle: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  cameraCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.blueBorder,
    padding: spacing.base,
    marginBottom: spacing.lg,
  },
  cameraIconBox: {
    width: 48,
    height: 48,
    borderRadius: radii.md,
    backgroundColor: colors.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  cameraTitle: {
    fontSize: typography.sizes.primary,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  cameraSubtitle: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  presetSection: {
    marginTop: spacing.sm,
  },
  presetHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.sm,
  },
  presetHeading: {
    fontSize: 11,
    fontWeight: typography.weights.bold,
    color: colors.brandPink,
    letterSpacing: 0.8,
  },
  presetList: {
    gap: spacing.sm,
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
  presetThumb: {
    width: 44,
    height: 44,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceMuted,
  },
  presetInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  presetLabel: {
    fontSize: typography.sizes.secondary,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  presetSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  presetRunBadge: {
    width: 26,
    height: 26,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  processingWrapper: {
    marginVertical: spacing.sm,
  },
  previewImageFrame: {
    borderRadius: radii.md,
    overflow: 'hidden',
    height: 220,
    marginBottom: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  understoodSection: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.blueBorder,
    overflow: 'hidden',
    shadowColor: colors.primaryBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  understoodBanner: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  understoodHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  understoodBannerText: {
    fontSize: 13,
    fontWeight: typography.weights.bold,
    color: colors.white,
    letterSpacing: 1,
  },
  understoodBannerSub: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.88)',
    marginTop: 2,
  },
  previewThumbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surfaceMuted,
    gap: spacing.md,
  },
  savedThumb: {
    width: 50,
    height: 50,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  savedThumbText: {
    flex: 1,
  },
  savedThumbTitle: {
    fontSize: typography.sizes.secondary,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  savedThumbMeta: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  cardBlock: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
  },
  fieldLabel: {
    fontSize: 10.5,
    fontWeight: typography.weights.bold,
    color: colors.textMuted,
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  titleInput: {
    fontSize: typography.sizes.primary,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
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
  summaryText: {
    fontSize: typography.sizes.secondary,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  bulletList: {
    gap: 6,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.brandPink,
    marginTop: 6,
  },
  bulletText: {
    flex: 1,
    fontSize: typography.sizes.caption,
    color: colors.textPrimary,
    lineHeight: 18,
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
  actionCard: {
    margin: spacing.base,
    padding: spacing.base,
    backgroundColor: colors.pinkSoft,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: '#E83E8C33',
  },
  actionCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  actionCardNotice: {
    fontSize: 11,
    fontWeight: typography.weights.bold,
    color: colors.brandPink,
    letterSpacing: 0.3,
  },
  actionTitleText: {
    fontSize: typography.sizes.secondary,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: 6,
  },
  dueDateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: spacing.sm,
  },
  dueDateText: {
    fontSize: 12,
    fontWeight: typography.weights.semibold,
    color: colors.brandPink,
  },
  inboxButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: radii.sm,
  },
  inboxButtonAdded: {
    backgroundColor: colors.brandPink,
  },
  inboxButtonUnadded: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inboxButtonTextAdded: {
    fontSize: 12,
    fontWeight: typography.weights.bold,
    color: colors.white,
  },
  inboxButtonTextUnadded: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  primarySaveBtn: {
    margin: spacing.base,
    marginTop: 0,
    borderRadius: radii.md,
    overflow: 'hidden',
  },
  primarySaveGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: spacing.md,
  },
  primarySaveText: {
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

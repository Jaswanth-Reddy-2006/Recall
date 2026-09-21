import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Share2,
  Sparkles,
  Check,
  X,
  Globe,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  Send,
  Navigation,
} from 'lucide-react-native';
import { colors, typography, radii, spacing } from '../../src/constants/theme';
import { useMemoryStore } from '../../src/store/useMemoryStore';
import { aiService } from '../../src/services/ai/AIService';
import { incomingCaptureService } from '../../src/services/capture/IncomingCaptureService';
import { IncomingCapture } from '../../src/types/capture';
import { AIProcessingView } from '../../src/components/capture/AIProcessingView';
import { Memory, Action, CategoryType } from '../../src/types';

const CATEGORIES: CategoryType[] = ['College', 'Development', 'Learning', 'Work', 'Personal'];

const SIMULATED_SHARES = [
  {
    label: 'WhatsApp Message',
    sourceApp: 'WhatsApp',
    text: 'Please review the DBMS lab assignment submission notice before Friday.',
    type: 'text' as const,
  },
  {
    label: 'Chrome Browser',
    sourceApp: 'Google Chrome',
    url: 'https://github.com/redis/redis',
    type: 'url' as const,
  },
  {
    label: 'Gallery Screenshot',
    sourceApp: 'Photo Gallery',
    imageUri: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&auto=format&fit=crop&q=80',
    text: 'DBMS Assignment 4 submission deadline Friday.',
    type: 'image' as const,
  },
  {
    label: 'Rapido / Ola Receipt',
    sourceApp: 'Rapido Bike Taxi',
    text: 'Ride to Campus Lab completed. Total: ₹142. Submit for hackathon travel reimbursement by Monday.',
    type: 'text' as const,
  },
];

export default function SharedCaptureScreen() {
  const router = useRouter();
  const addMemory = useMemoryStore((state) => state.addMemory);

  const [capture, setCapture] = useState<IncomingCapture | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Review states
  const [analyzed, setAnalyzed] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryType>('Personal');
  const [tagsInput, setTagsInput] = useState('');
  const [actionTitle, setActionTitle] = useState('');
  const [actionDueDate, setActionDueDate] = useState('');
  const [summary, setSummary] = useState('');

  useEffect(() => {
    // Check if there is an active incoming capture
    const existing = incomingCaptureService.getIncomingCapture();
    if (existing) {
      processIncoming(existing);
    } else {
      // Default to WhatsApp sample if accessed directly
      const defaultSample = incomingCaptureService.receiveRaw({
        sourceApp: 'WhatsApp',
        text: 'Please send the staging API credentials tomorrow noon.',
      });
      processIncoming(defaultSample);
    }
  }, []);

  const processIncoming = async (item: IncomingCapture) => {
    setCapture(item);
    setIsProcessing(true);
    setAnalyzed(false);
    setCurrentStepIndex(0);

    try {
      if (item.imageUri) {
        const res = await aiService.analyzeScreenshot(item.imageUri, item.text || 'Shared Screenshot', (step) => {
          setCurrentStepIndex(step);
        });
        setTitle(res.title);
        setCategory(res.category as CategoryType);
        setTagsInput(res.tags.join(', '));
        setSummary(res.summary);
        if (res.detectedAction) {
          setActionTitle(res.detectedAction.title);
          setActionDueDate(res.detectedAction.dueDate || 'Friday');
        }
      } else if (item.url) {
        const res = await aiService.analyzeLink(item.url);
        setTitle(res.title);
        setCategory(res.category as CategoryType);
        setTagsInput(res.tags.join(', '));
        setSummary(res.summary);
        if (res.possibleAction) {
          setActionTitle(res.possibleAction);
          setActionDueDate('Soon');
        }
      } else {
        const res = await aiService.analyzeNote(item.text || '');
        setTitle(res.title);
        setCategory(res.category as CategoryType);
        setTagsInput(res.tags.join(', '));
        setSummary(res.summary);
        if (res.detectedAction) {
          setActionTitle(res.detectedAction.title);
          setActionDueDate(res.detectedAction.dueDate || 'Upcoming');
        }
      }

      setIsProcessing(false);
      setAnalyzed(true);
    } catch {
      setIsProcessing(false);
      Alert.alert('Analysis Failed', 'Could not process shared content.');
    }
  };

  const handleSimulate = (sample: typeof SIMULATED_SHARES[0]) => {
    const raw = incomingCaptureService.receiveRaw({
      sourceApp: sample.sourceApp,
      text: sample.text,
      url: sample.url,
      imageUri: sample.imageUri,
    });
    processIncoming(raw);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Please specify a title');
      return;
    }

    const memoryId = `mem-${Date.now()}`;
    const detectedActions: Action[] = [];

    if (actionTitle.trim()) {
      detectedActions.push({
        id: `act-${Date.now()}`,
        title: actionTitle.trim(),
        type: 'task',
        status: 'pending',
        dueDate: actionDueDate.trim() || undefined,
        sourceMemoryId: memoryId,
        sourceTitle: title.trim(),
        sourceType: capture?.type === 'image' ? 'screenshot' : capture?.type === 'url' ? 'link' : 'note',
        createdAt: new Date().toISOString(),
      });
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newMemory: Memory = {
      id: memoryId,
      type: capture?.type === 'image' ? 'screenshot' : capture?.type === 'url' ? 'link' : 'note',
      title: title.trim(),
      content: capture?.text || summary,
      source: capture?.sourceApp || 'Shared from another app',
      category,
      tags,
      summary: summary.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: {
        imageUri: capture?.imageUri,
        url: capture?.url,
      },
      ai: {
        confidence: 0.98,
        detectedActions,
        topics: tags,
        relevanceReason: `Matched because: ${tags.slice(0, 3).join(' · ')}`,
      },
    };

    await addMemory(newMemory);
    incomingCaptureService.clear();

    if (detectedActions.length > 0) {
      router.replace('/(tabs)/inbox');
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.badge}>
            <Share2 size={13} color={colors.primaryBlue} />
            <Text style={styles.badgeText}>OS SHARE TARGET</Text>
          </View>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
            <X size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>New capture</Text>
        <Text style={styles.subtitle}>
          Shared from: <Text style={styles.sourceHighlight}>{capture?.sourceApp || 'Another app'}</Text>
        </Text>
      </View>

      {/* Simulator Presets for Evaluator Testing */}
      <View style={styles.simulatorCard}>
        <Text style={styles.simulatorHeading}>SIMULATE SHARE FROM APPS:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.simScroll}>
          {SIMULATED_SHARES.map((s, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.simBtn}
              onPress={() => handleSimulate(s)}
              activeOpacity={0.7}
            >
              <Text style={styles.simBtnText}>{s.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Incoming Content Preview */}
      <View style={styles.previewContainer}>
        {capture?.imageUri ? (
          <Image source={{ uri: capture.imageUri }} style={styles.imageThumb} resizeMode="cover" />
        ) : null}

        {capture?.url ? (
          <View style={styles.urlPreview}>
            <Globe size={16} color={colors.primaryBlue} />
            <Text style={styles.urlText} numberOfLines={1}>{capture.url}</Text>
          </View>
        ) : null}

        {capture?.text ? (
          <View style={styles.textPreview}>
            <Text style={styles.rawText}>"{capture.text}"</Text>
          </View>
        ) : null}
      </View>

      {/* Live AI Processing Step Indicator */}
      {isProcessing && (
        <AIProcessingView
          currentStepIndex={currentStepIndex}
          title="Recall is understanding this..."
        />
      )}

      {/* Editable Review Screen */}
      {analyzed && (
        <View style={styles.reviewSection}>
          <View style={styles.suggestedBanner}>
            <Sparkles size={13} color={colors.brandPink} />
            <Text style={styles.suggestedBannerText}>
              Suggested by Recall. All fields are editable.
            </Text>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>TITLE</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Memory title"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>CATEGORY</Text>
            <View style={styles.catChipsRow}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.catChip, category === cat && styles.catChipActive]}
                  onPress={() => setCategory(cat)}
                >
                  <Text style={[styles.catChipText, category === cat && styles.catChipTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>TAGS & TOPICS</Text>
            <TextInput
              style={styles.input}
              value={tagsInput}
              onChangeText={setTagsInput}
              placeholder="e.g. WhatsApp, Assignment, Credentials"
            />
          </View>

          {/* Action Detected Callout */}
          <View style={styles.actionBox}>
            <View style={styles.actionBoxHeader}>
              <AlertCircle size={14} color={colors.primaryBlue} />
              <Text style={styles.actionBoxTitle}>DETECTED ACTION</Text>
            </View>

            <Text style={styles.label}>TASK TITLE</Text>
            <TextInput
              style={styles.actionInput}
              value={actionTitle}
              onChangeText={setActionTitle}
              placeholder="e.g. Send API credentials"
            />

            <View style={styles.dueRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>DEADLINE / DUE</Text>
                <TextInput
                  style={styles.actionInput}
                  value={actionDueDate}
                  onChangeText={setActionDueDate}
                  placeholder="e.g. Tomorrow noon"
                />
              </View>
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>AI SUMMARY</Text>
            <TextInput
              style={[styles.input, styles.summaryInput]}
              value={summary}
              onChangeText={setSummary}
              multiline
            />
          </View>

          {/* Actions */}
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleSave}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Save to Recall"
          >
            <Check size={18} color={colors.white} strokeWidth={2.5} />
            <Text style={styles.saveBtnText}>Save to Recall</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.discardBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={styles.discardBtnText}>Discard</Text>
          </TouchableOpacity>
        </View>
      )}
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
  header: {
    marginBottom: spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.blueSoft,
    borderWidth: 1,
    borderColor: colors.blueBorder,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.xs,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: colors.primaryBlue,
    letterSpacing: 0.6,
  },
  closeBtn: {
    padding: spacing.xs,
  },
  title: {
    fontSize: typography.sizes.screenTitle,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: typography.sizes.secondary,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sourceHighlight: {
    color: colors.primaryBlue,
    fontWeight: typography.weights.semibold,
  },
  simulatorCard: {
    backgroundColor: colors.card,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  simulatorHeading: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: colors.textMuted,
    letterSpacing: 0.6,
    marginBottom: spacing.xs,
  },
  simScroll: {
    gap: spacing.xs,
  },
  simBtn: {
    backgroundColor: colors.blueSoft,
    borderWidth: 1,
    borderColor: colors.blueBorder,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 5,
    borderRadius: radii.xs,
  },
  simBtnText: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.medium,
    color: colors.primaryBlue,
  },
  previewContainer: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  imageThumb: {
    width: '100%',
    height: 140,
    borderRadius: radii.sm,
  },
  urlPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  urlText: {
    fontSize: typography.sizes.secondary,
    color: colors.primaryBlue,
    flex: 1,
  },
  textPreview: {
    backgroundColor: colors.background,
    padding: spacing.sm,
    borderRadius: radii.xs,
  },
  rawText: {
    fontSize: typography.sizes.secondary,
    color: colors.textPrimary,
    fontStyle: 'italic',
  },
  reviewSection: {
    gap: spacing.md,
  },
  suggestedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.pinkVerySoft,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.pinkBorder,
  },
  suggestedBannerText: {
    fontSize: typography.sizes.caption,
    color: colors.pinkDark,
    fontWeight: typography.weights.medium,
  },
  fieldGroup: {
    gap: spacing.xs,
  },
  label: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.semibold,
    color: colors.textMuted,
    letterSpacing: 0.6,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: typography.sizes.body,
    color: colors.textPrimary,
  },
  summaryInput: {
    height: 64,
    textAlignVertical: 'top',
  },
  catChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  catChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radii.sm,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  catChipActive: {
    backgroundColor: colors.primaryBlue,
    borderColor: colors.primaryBlue,
  },
  catChipText: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  catChipTextActive: {
    color: colors.white,
    fontWeight: typography.weights.semibold,
  },
  actionBox: {
    backgroundColor: colors.blueSoft,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.blueBorder,
    padding: spacing.md,
    gap: spacing.xs,
  },
  actionBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  actionBoxTitle: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.bold,
    color: colors.primaryBlue,
    letterSpacing: 0.6,
  },
  actionInput: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.blueBorder,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.sizes.body,
    color: colors.textPrimary,
  },
  dueRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryBlue,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  saveBtnText: {
    color: colors.white,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
  },
  discardBtn: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  discardBtnText: {
    fontSize: typography.sizes.secondary,
    color: colors.textSecondary,
  },
});

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Sparkles,
  ArrowRight,
  Check,
  Globe,
  Share2,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, radii, spacing } from '../src/constants/theme';
import { RecallLogo } from '../src/components/ui/RecallLogo';

const SLIDES = [
  {
    step: 'STEP 1 OF 3',
    heading: 'RECALL',
    tagline: 'Your personal memory for everything you save.',
    body: 'Scatter no more. Screenshots, links, notes, and messages turn into an intelligent, permanent personal memory layer.',
    preview: {
      type: 'card',
      title: 'DBMS Assignment Notice',
      category: 'College',
      subtitle: 'Classroom portal screenshot',
      action: 'Submit DBMS assignment (Due Friday)',
    },
  },
  {
    step: 'STEP 2 OF 3',
    heading: 'CAPTURE',
    tagline: 'Screenshots, links and notes.',
    body: 'Share directly into Recall from WhatsApp, Chrome, or your gallery. Recall extracts text and detects commitments automatically.',
    preview: {
      type: 'pipeline',
      steps: [
        '✓ Reading text from image',
        '✓ Identifying topic & category',
        '✓ Detecting actionable commitments',
        '● Connecting with your memory',
      ],
    },
  },
  {
    step: 'STEP 3 OF 3',
    heading: 'REMEMBER',
    tagline: 'Find the context whenever you need it.',
    body: 'Ask natural questions like "Everything about Redis" and recover original screenshots, notes, and tasks in context.',
    preview: {
      type: 'search',
      query: 'Everything about Redis',
      matched: 'Matched because: Redis · caching · backend',
    },
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      router.replace('/(tabs)');
    }
  };

  const slide = SLIDES[currentSlide];
  const isLast = currentSlide === SLIDES.length - 1;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <RecallLogo size="sm" />
        <TouchableOpacity
          onPress={() => router.replace('/(tabs)')}
          accessibilityRole="button"
          accessibilityLabel="Skip onboarding"
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      <View style={styles.centerContent}>
        <Text style={styles.stepBadge}>{slide.step}</Text>
        <Text style={styles.heading}>{slide.heading}</Text>
        <Text style={styles.tagline}>{slide.tagline}</Text>
        <Text style={styles.body}>{slide.body}</Text>

        {/* Product UI Preview Mockup */}
        <View style={styles.previewContainer}>
          {slide.preview.type === 'card' && (
            <View style={styles.mockCard}>
              <View style={styles.mockTopline}>
                <View style={styles.mockCategoryBadge}>
                  <Text style={styles.mockCategoryText}>{slide.preview.category}</Text>
                </View>
                <Text style={styles.mockSubtitle}>{slide.preview.subtitle}</Text>
              </View>
              <Text style={styles.mockTitle}>{slide.preview.title}</Text>
              <View style={styles.mockActionPill}>
                <View style={styles.mockActionDot} />
                <Text style={styles.mockActionText}>{slide.preview.action}</Text>
              </View>
            </View>
          )}

          {slide.preview.type === 'pipeline' && (
            <View style={styles.mockPipeline}>
              <Text style={styles.mockPipelineHeading}>UNDERSTANDING IN PROGRESS</Text>
              {slide.preview.steps?.map((stepStr, idx) => (
                <Text key={idx} style={styles.mockStepText}>
                  {stepStr}
                </Text>
              ))}
            </View>
          )}

          {slide.preview.type === 'search' && (
            <View style={styles.mockSearchBox}>
              <Text style={styles.mockQueryText}>Q: "{slide.preview.query}"</Text>
              <View style={styles.mockMatchBadge}>
                <Sparkles size={11} color={colors.brandPink} />
                <Text style={styles.mockMatchText}>{slide.preview.matched}</Text>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Footer Controls */}
      <View style={styles.footer}>
        <View style={styles.dotsRow}>
          {SLIDES.map((_, idx) => (
            <View
              key={idx}
              style={[styles.dot, currentSlide === idx && styles.dotActive]}
            />
          ))}
        </View>

        <TouchableOpacity
          onPress={handleNext}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel={isLast ? 'Get Started' : 'Next screen'}
        >
          <LinearGradient
            colors={['#E83E8C', '#3B5BDB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.actionBtn}
          >
            <Text style={styles.actionBtnText}>
              {isLast ? 'Get Started' : 'Next'}
            </Text>
            {isLast ? (
              <Check size={18} color={colors.white} strokeWidth={2.5} />
            ) : (
              <ArrowRight size={18} color={colors.white} strokeWidth={2.5} />
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skipText: {
    fontSize: typography.sizes.secondary,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  centerContent: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  stepBadge: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.bold,
    color: colors.brandPink,
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  heading: {
    fontSize: typography.sizes.display,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: spacing.xs,
  },
  tagline: {
    fontSize: typography.sizes.section,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.sm,
  },
  body: {
    fontSize: typography.sizes.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
    maxWidth: 320,
  },
  previewContainer: {
    width: '100%',
    maxWidth: 340,
  },
  mockCard: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    shadowColor: '#172033',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  mockTopline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  mockCategoryBadge: {
    backgroundColor: colors.blueSoft,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: radii.xs,
  },
  mockCategoryText: {
    fontSize: 10,
    fontWeight: typography.weights.semibold,
    color: colors.blueDeep,
  },
  mockSubtitle: {
    fontSize: typography.sizes.caption,
    color: colors.textMuted,
  },
  mockTitle: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  mockActionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.pinkVerySoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radii.xs,
    borderWidth: 1,
    borderColor: colors.pinkBorder,
    alignSelf: 'flex-start',
  },
  mockActionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.brandPink,
  },
  mockActionText: {
    fontSize: typography.sizes.caption,
    color: colors.pinkDark,
    fontWeight: typography.weights.medium,
  },
  mockPipeline: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.blueBorder,
    padding: spacing.md,
    gap: 8,
  },
  mockPipelineHeading: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: colors.primaryBlue,
    letterSpacing: 0.8,
  },
  mockStepText: {
    fontSize: typography.sizes.secondary,
    color: colors.textPrimary,
    fontWeight: typography.weights.medium,
  },
  mockSearchBox: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.xs,
  },
  mockQueryText: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  mockMatchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.pinkVerySoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radii.xs,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.pinkBorder,
  },
  mockMatchText: {
    fontSize: typography.sizes.caption,
    color: colors.pinkDark,
    fontWeight: typography.weights.medium,
  },
  footer: {
    gap: spacing.lg,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
  },
  dotActive: {
    width: 22,
    backgroundColor: colors.brandPink,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  actionBtnText: {
    color: colors.white,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
  },
});

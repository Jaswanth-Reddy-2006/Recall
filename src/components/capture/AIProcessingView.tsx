import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Check, Sparkles, Layers } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, radii, spacing } from '../../constants/theme';

interface Props {
  currentStepIndex: number;
  steps?: string[];
  title?: string;
}

const DEFAULT_STEPS = [
  'Reading text from image',
  'Identifying topic & category',
  'Detecting actionable commitments',
  'Finding dates & deadlines',
  'Building personal context',
];

export const AIProcessingView: React.FC<Props> = ({
  currentStepIndex,
  steps = DEFAULT_STEPS,
  title = 'Understanding your capture',
}) => {
  return (
    <View style={styles.card}>
      {/* Top Header with Pink->Blue gradient badge */}
      <View style={styles.header}>
        <LinearGradient
          colors={['#E83E8C', '#3B5BDB']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientIcon}
        >
          <Sparkles size={16} color={colors.white} />
        </LinearGradient>
        <View style={styles.headerText}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>Analyzing content and establishing memory links</Text>
        </View>
      </View>

      {/* Step Pipeline: completed = blue, current = pink, pending = gray */}
      <View style={styles.stepsContainer}>
        {steps.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <View key={idx} style={styles.stepRow}>
              <View
                style={[
                  styles.stepIndicator,
                  isDone && styles.stepDone,
                  isCurrent && styles.stepCurrent,
                ]}
              >
                {isDone ? (
                  <Check size={11} color={colors.white} strokeWidth={3} />
                ) : isCurrent ? (
                  <ActivityIndicator size="small" color={colors.brandPink} />
                ) : (
                  <View style={styles.stepPendingDot} />
                )}
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

      {/* Signature Hackathon Value Sentence */}
      <View style={styles.connectionNote}>
        <Layers size={13} color={colors.primaryBlue} />
        <Text style={styles.connectionNoteText}>
          Recall is connecting this with your existing memories.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.blueBorder,
    padding: spacing.base,
    marginVertical: spacing.sm,
    shadowColor: '#3B5BDB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.base,
  },
  gradientIcon: {
    width: 34,
    height: 34,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    marginTop: 1,
  },
  stepsContainer: {
    gap: spacing.sm + 2,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
  },
  stepIndicator: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  stepDone: {
    backgroundColor: colors.primaryBlue, // completed = blue
    borderColor: colors.primaryBlue,
  },
  stepCurrent: {
    backgroundColor: colors.pinkVerySoft,
    borderColor: colors.brandPink, // current = pink
  },
  stepPendingDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.textMuted,
  },
  stepText: {
    fontSize: typography.sizes.secondary,
    color: colors.textMuted,
  },
  stepTextDone: {
    color: colors.textPrimary,
    fontWeight: typography.weights.medium,
  },
  stepTextCurrent: {
    color: colors.brandPink,
    fontWeight: typography.weights.bold,
  },
  connectionNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.blueSoft,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.blueBorder,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    marginTop: spacing.md,
  },
  connectionNoteText: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.medium,
    color: colors.blueDeep,
    flex: 1,
  },
});

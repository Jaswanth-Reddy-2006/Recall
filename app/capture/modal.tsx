import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Image as ImageIcon,
  Link2,
  FileText,
  PhoneCall,
  X,
  Sparkles,
} from 'lucide-react-native';
import { colors, typography, radii, spacing } from '../../src/constants/theme';

export default function CaptureModal() {
  const router = useRouter();

  const handleSelect = (route: string) => {
    router.replace(route as any);
  };

  return (
    <View style={styles.overlay}>
      {/* Tap backdrop to dismiss */}
      <Pressable
        style={styles.backdrop}
        onPress={() => router.back()}
        accessibilityLabel="Dismiss capture sheet"
      />

      <View style={styles.sheet}>
        <View style={styles.sheetHandle} />

        <View style={styles.header}>
          <View>
            <Text style={styles.sheetTitle}>Capture</Text>
            <Text style={styles.sheetSubtitle}>
              Save anything — Recall organizes the context for you.
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.closeBtn}
            accessibilityRole="button"
            accessibilityLabel="Close"
          >
            <X size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Options */}
        <View style={styles.optionsList}>
          {/* Screenshot Option */}
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => handleSelect('/capture/screenshot')}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel="Screenshot: Save something from your screen"
          >
            <View style={[styles.iconBox, { backgroundColor: colors.pinkSoft }]}>
              <ImageIcon size={20} color={colors.brandPink} />
            </View>
            <View style={styles.optionContent}>
              <View style={styles.titleWithBadge}>
                <Text style={styles.optionTitle}>Screenshot</Text>
                <View style={styles.aiBadgePink}>
                  <Sparkles size={9} color={colors.brandPink} />
                  <Text style={styles.aiBadgePinkText}>Qwen2.5-VL</Text>
                </View>
              </View>
              <Text style={styles.optionDesc}>Save something from your screen</Text>
            </View>
          </TouchableOpacity>

          {/* Link Option */}
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => handleSelect('/capture/link')}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel="Link: Keep a useful page or resource"
          >
            <View style={[styles.iconBox, { backgroundColor: colors.blueSoft }]}>
              <Link2 size={20} color={colors.primaryBlue} />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Link</Text>
              <Text style={styles.optionDesc}>Keep a useful page or resource</Text>
            </View>
          </TouchableOpacity>

          {/* Note Option */}
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => handleSelect('/capture/note')}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel="Note: Capture a thought quickly"
          >
            <View style={[styles.iconBox, { backgroundColor: '#F3E8FF' }]}>
              <FileText size={20} color="#7C3AED" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Note</Text>
              <Text style={styles.optionDesc}>Capture a thought or meeting note quickly</Text>
            </View>
          </TouchableOpacity>

          {/* Call Intelligence Option */}
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => handleSelect('/calls/import')}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel="Call Intelligence: Analyze conversation transcript"
          >
            <View style={[styles.iconBox, { backgroundColor: colors.pinkSoft }]}>
              <PhoneCall size={20} color={colors.brandPink} />
            </View>
            <View style={styles.optionContent}>
              <View style={styles.titleWithBadge}>
                <Text style={styles.optionTitle}>Call Intelligence</Text>
                <View style={styles.aiBadgePink}>
                  <Sparkles size={9} color={colors.brandPink} />
                  <Text style={styles.aiBadgePinkText}>Qwen3</Text>
                </View>
              </View>
              <Text style={styles.optionDesc}>Analyze recordings for commitments & decisions</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(17, 19, 24, 0.45)',
  },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 6,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.base,
  },
  sheetTitle: {
    fontSize: typography.sizes.section,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  sheetSubtitle: {
    fontSize: typography.sizes.secondary,
    color: colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    padding: spacing.xs,
  },
  optionsList: {
    gap: spacing.sm,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.md,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionContent: {
    flex: 1,
  },
  titleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  optionTitle: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  aiBadgePink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.pinkSoft,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radii.xs,
  },
  aiBadgePinkText: {
    fontSize: 9,
    fontWeight: typography.weights.bold,
    color: colors.brandPink,
  },
  optionDesc: {
    fontSize: typography.sizes.secondary,
    color: colors.textSecondary,
    marginTop: 2,
  },
});

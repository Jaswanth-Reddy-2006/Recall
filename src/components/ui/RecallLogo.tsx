import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Path, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { colors, typography, spacing, radii } from '../../constants/theme';

interface LogoProps {
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

interface MarkProps {
  size?: number;
  monochrome?: boolean;
  color?: string;
}

/**
 * RecallMark: The standalone abstract looping memory path with two connected nodes.
 * Designed to be razor-sharp and immediately recognizable even at 24x24.
 */
export const RecallMark: React.FC<MarkProps> = ({ size = 28, monochrome = false, color = '#FFFFFF' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Defs>
        <SvgGradient id="recallMarkGradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#E83E8C" />
          <Stop offset="100%" stopColor="#3B5BDB" />
        </SvgGradient>
      </Defs>

      {/* Primary outer loop (Memory path) */}
      <Path
        d="M16 6C10.477 6 6 10.477 6 16C6 21.523 10.477 26 16 26C20.5 26 24.3 22.9 25.5 18.7"
        stroke={monochrome ? color : 'url(#recallMarkGradient)'}
        strokeWidth="3.2"
        strokeLinecap="round"
      />

      {/* Secondary inner return path (Connection loop) */}
      <Path
        d="M16 11C13.239 11 11 13.239 11 16C11 18.761 13.239 21 16 21C18.2 21 20 19.5 20.7 17.5"
        stroke={monochrome ? color : 'url(#recallMarkGradient)'}
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      {/* Synaptic Node 1 (Pink / Focus node) */}
      <Circle cx="24.5" cy="11.5" r="3.4" fill={monochrome ? color : '#E83E8C'} />
      <Circle cx="24.5" cy="11.5" r="1.5" fill="#FFFFFF" />

      {/* Synaptic Node 2 (Blue / Context anchor node) */}
      <Circle cx="16" cy="6" r="2.2" fill={monochrome ? color : '#3B5BDB'} />
      <Circle cx="16" cy="6" r="1" fill="#FFFFFF" />
    </Svg>
  );
};

/**
 * RecallAppIcon: Full squircle container with deep gradient background and illuminated loop.
 */
export const RecallAppIcon: React.FC<{ size?: number }> = ({ size = 64 }) => {
  const markSize = Math.round(size * 0.58);
  return (
    <View
      style={[
        styles.appIconContainer,
        {
          width: size,
          height: size,
          borderRadius: Math.round(size * 0.22),
        },
      ]}
    >
      <RecallMark size={markSize} monochrome={true} color="#FFFFFF" />
    </View>
  );
};

/**
 * RecallLogo: Full brand header with RecallMark, typographic wordmark, and optional tagline.
 */
export const RecallLogo: React.FC<LogoProps> = ({ showTagline = false, size = 'md' }) => {
  const markSize = size === 'lg' ? 34 : size === 'sm' ? 22 : 28;

  return (
    <View style={styles.wrapper}>
      <View style={styles.brandRow}>
        <View style={[styles.iconContainer, { width: markSize, height: markSize }]}>
          <RecallMark size={markSize} />
        </View>

        <View>
          <View style={styles.wordmarkRow}>
            <Text style={[styles.brandText, size === 'lg' && styles.brandTextLg, size === 'sm' && styles.brandTextSm]}>
              RECALL
            </Text>
            <View style={styles.brandDot} />
          </View>
          {showTagline && (
            <Text style={styles.tagline}>Capture anything. Never lose the context.</Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'flex-start',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordmarkRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  brandText: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: colors.textPrimary,
  },
  brandTextSm: {
    fontSize: 15,
    letterSpacing: 1.0,
  },
  brandTextLg: {
    fontSize: typography.sizes.screenTitle,
    letterSpacing: 1.5,
  },
  brandDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.brandPink,
  },
  tagline: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    marginTop: 1,
  },
  appIconContainer: {
    backgroundColor: colors.primaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primaryBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
});

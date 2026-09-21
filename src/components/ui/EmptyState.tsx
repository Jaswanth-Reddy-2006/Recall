import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Sparkles, Inbox, Search, Bookmark } from 'lucide-react-native';
import { colors, typography, radii, spacing } from '../../constants/theme';

interface Props {
  icon?: 'sparkles' | 'inbox' | 'search' | 'library';
  title: string;
  description: string;
  actionText?: string;
  onActionPress?: () => void;
}

export const EmptyState: React.FC<Props> = ({
  icon = 'sparkles',
  title,
  description,
  actionText,
  onActionPress,
}) => {
  const renderIcon = () => {
    const size = 32;
    const color = colors.primary;
    switch (icon) {
      case 'inbox':
        return <Inbox size={size} color={color} strokeWidth={1.5} />;
      case 'search':
        return <Search size={size} color={color} strokeWidth={1.5} />;
      case 'library':
        return <Bookmark size={size} color={color} strokeWidth={1.5} />;
      default:
        return <Sparkles size={size} color={color} strokeWidth={1.5} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>{renderIcon()}</View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionText && onActionPress ? (
        <TouchableOpacity style={styles.button} onPress={onActionPress} activeOpacity={0.8}>
          <Text style={styles.buttonText}>{actionText}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.base,
  },
  title: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.base,
    maxWidth: 280,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: radii.md,
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
  },
});

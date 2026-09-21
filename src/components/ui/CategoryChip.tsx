import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, radii, spacing } from '../../constants/theme';

interface Props {
  category: string;
  size?: 'sm' | 'md';
}

export const CategoryChip: React.FC<Props> = ({ category, size = 'md' }) => {
  const catKey = (category in colors.categories ? category : 'All') as keyof typeof colors.categories;
  const theme = colors.categories[catKey] || colors.categories.All;

  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.chip,
        { backgroundColor: theme.bg, borderColor: theme.border },
        isSmall && styles.chipSmall,
      ]}
    >
      <Text style={[styles.text, { color: theme.text }, isSmall && styles.textSmall]}>
        {category}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: radii.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  chipSmall: {
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 1,
  },
  text: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    letterSpacing: 0.2,
  },
  textSmall: {
    fontSize: 10,
  },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, radii, spacing } from '../../constants/theme';

interface Props {
  tag: string;
}

export const TagChip: React.FC<Props> = ({ tag }) => {
  return (
    <View style={styles.chip}>
      <Text style={styles.text}>#{tag}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    backgroundColor: colors.cardSubtle,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  text: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
});

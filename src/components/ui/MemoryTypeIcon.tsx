import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Image, Link2, FileText, CheckCircle2, PhoneCall, File } from 'lucide-react-native';
import { MemoryType } from '../../types';
import { colors } from '../../constants/theme';

interface Props {
  type: MemoryType | 'action';
  size?: number;
  color?: string;
}

export const MemoryTypeIcon: React.FC<Props> = ({ type, size = 16, color }) => {
  const defaultColor = color || colors.primary;

  switch (type) {
    case 'screenshot':
      return <Image size={size} color={defaultColor} />;
    case 'link':
      return <Link2 size={size} color={defaultColor} />;
    case 'note':
    case 'text':
      return <FileText size={size} color={defaultColor} />;
    case 'call':
      return <PhoneCall size={size} color={defaultColor} />;
    case 'file':
      return <File size={size} color={defaultColor} />;
    case 'action':
      return <CheckCircle2 size={size} color={defaultColor} />;
    default:
      return <FileText size={size} color={defaultColor} />;
  }
};

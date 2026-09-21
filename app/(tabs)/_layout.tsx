import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Platform } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { Home, Inbox, Search, Bookmark, Plus } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, radii, spacing } from '../../src/constants/theme';
import { useMemoryStore } from '../../src/store/useMemoryStore';

export default function TabLayout() {
  const router = useRouter();
  const actions = useMemoryStore((state) => state.actions);
  const pendingCount = actions.filter((a) => a.status === 'pending').length;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primaryBlue,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={20} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: 'Inbox',
          tabBarIcon: ({ color }) => (
            <View style={styles.iconContainer}>
              <Inbox size={20} color={color} strokeWidth={2} />
              {pendingCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {pendingCount > 9 ? '9+' : pendingCount}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      {/* Signature 54px Pink->Blue Gradient Capture Trigger */}
      <Tabs.Screen
        name="capture-trigger"
        options={{
          title: '',
          tabBarButton: () => (
            <TouchableOpacity
              style={styles.captureButtonContainer}
              onPress={() => router.push('/capture/modal')}
              activeOpacity={0.85}
              accessibilityLabel="Capture"
              accessibilityRole="button"
            >
              <LinearGradient
                colors={['#E83E8C', '#3B5BDB']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.captureButton}
              >
                <Plus size={26} color={colors.white} strokeWidth={2.6} />
              </LinearGradient>
            </TouchableOpacity>
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push('/capture/modal');
          },
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <Search size={20} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarIcon: ({ color }) => <Bookmark size={20} color={color} strokeWidth={2} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: Platform.OS === 'ios' ? 84 : 62,
    paddingBottom: Platform.OS === 'ios' ? 24 : 6,
    paddingTop: 6,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: typography.weights.medium,
    marginTop: 2,
  },
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonContainer: {
    top: -14,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
  },
  captureButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E83E8C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: colors.brandPink,
    borderRadius: radii.full,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: typography.weights.bold,
  },
});

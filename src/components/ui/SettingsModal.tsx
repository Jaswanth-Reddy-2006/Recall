import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  TextInput,
  Switch,
  ActivityIndicator,
  Share,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  X,
  RotateCcw,
  ShieldCheck,
  Image as ImageIcon,
  Bell,
  Camera,
  Mic,
  ExternalLink,
  Cpu,
  Database,
  Download,
  Trash2,
  Sparkles,
  PhoneCall,
  Info,
} from 'lucide-react-native';
import { colors, typography, radii, spacing } from '../../constants/theme';
import { useMemoryStore } from '../../store/useMemoryStore';
import { PermissionService, PermissionReport } from '../../services/permissions/PermissionService';
import { aiService } from '../../services/ai/AIService';
import {
  DEFAULT_AI_SERVER_URL,
  DEFAULT_LAN_SERVER_URL,
  getAutoDetectedServerUrl,
} from '../../services/ai/LocalOllamaProvider';
import { RecallLogo } from './RecallLogo';

const STORAGE_KEYS = {
  SERVER_URL: '@recall_ai_server_url',
};

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<Props> = ({ visible, onClose }) => {
  const router = useRouter();
  const {
    memories,
    actions,
    isDeveloperMode,
    setDeveloperMode,
    resetDemoData,
    clearAllData,
    exportData,
  } = useMemoryStore();

  const [permissions, setPermissions] = useState<PermissionReport>({
    photos: 'undetermined',
    notifications: 'undetermined',
    camera: 'undetermined',
    microphone: 'undetermined',
  });

  // AI Engine State
  const [serverUrl, setServerUrl] = useState(DEFAULT_AI_SERVER_URL);
  const [isTestingAi, setIsTestingAi] = useState(false);
  const [aiStatus, setAiStatus] = useState<'checking' | 'connected' | 'offline'>('checking');
  const [modelStatus, setModelStatus] = useState<{ text: boolean; vision: boolean; embedding: boolean }>({
    text: false,
    vision: false,
    embedding: false,
  });

  useEffect(() => {
    if (visible) {
      PermissionService.getPermissionReport().then(setPermissions);
      loadServerUrl();
      checkAiHealth();
    }
  }, [visible]);

  const loadServerUrl = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.SERVER_URL);
      if (stored?.trim()) {
        setServerUrl(stored.trim());
      } else {
        const auto = getAutoDetectedServerUrl();
        setServerUrl(auto);
      }
    } catch {
      setServerUrl(getAutoDetectedServerUrl());
    }
  };

  const handleApplyUrl = async (newUrl: string) => {
    await handleSaveServerUrl(newUrl);
    setTimeout(() => {
      checkAiHealth();
    }, 100);
  };

  const handleSaveServerUrl = async (newUrl: string) => {
    setServerUrl(newUrl);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SERVER_URL, newUrl.trim());
    } catch {}
  };

  const checkAiHealth = async () => {
    setIsTestingAi(true);
    setAiStatus('checking');
    try {
      const health = await aiService.checkHealth();
      setAiStatus(health.available ? 'connected' : 'offline');
      setModelStatus(health.models);
    } catch {
      setAiStatus('offline');
    } finally {
      setIsTestingAi(false);
    }
  };

  const handleExportData = async () => {
    try {
      const json = await exportData();
      await Share.share({
        title: 'Recall Data Export',
        message: json,
      });
    } catch (err) {
      Alert.alert('Export Error', 'Unable to export data.');
    }
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Local Memories',
      'This will permanently delete all your saved captures, commitments, and analyzed calls from this device.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All Data',
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
            Alert.alert('Memory Store Cleared', 'Your memory is completely clean.');
            onClose();
          },
        },
      ]
    );
  };

  const handleResetDemo = () => {
    Alert.alert(
      'Load Demo Dataset',
      'This will populate your store with 15 interconnected demo memories, assignments, and commitments for evaluation.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Load Demo Data',
          onPress: async () => {
            await resetDemoData();
            Alert.alert('Demo Data Loaded', 'Loaded 15 demo items.');
            onClose();
          },
        },
      ]
    );
  };

  const getStatusBadge = (status: 'granted' | 'denied' | 'undetermined' | 'unavailable') => {
    if (status === 'granted') {
      return { label: 'Allowed', bg: colors.successLight, text: colors.success };
    }
    if (status === 'denied') {
      return { label: 'Denied', bg: colors.dangerLight, text: colors.danger };
    }
    if (status === 'unavailable') {
      return { label: 'N/A on Expo Go', bg: colors.cardSubtle, text: colors.textMuted };
    }
    return { label: 'Not requested', bg: colors.cardSubtle, text: colors.textMuted };
  };

  const callsCount = memories.filter((m) => m.type === 'call').length;
  const pendingCount = actions.filter((a) => a.status === 'pending').length;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <RecallLogo size="sm" />
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Tagline Callout */}
            <View style={styles.visionCard}>
              <Text style={styles.visionTagline}>"Capture anything. Never lose the context."</Text>
              <Text style={styles.visionDesc}>
                Recall is your local-first personal context & action hub. Real captures, real intelligence, zero cloud lock-in.
              </Text>
            </View>

            {/* 1. LOCAL AI ENGINE */}
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.titleWithIcon}>
                  <Cpu size={14} color={colors.primaryBlue} />
                  <Text style={styles.sectionTitle}>LOCAL AI ENGINE</Text>
                </View>
                <TouchableOpacity onPress={checkAiHealth} disabled={isTestingAi} style={styles.testBtn}>
                  {isTestingAi ? (
                    <ActivityIndicator size="small" color={colors.primaryBlue} />
                  ) : (
                    <Text style={styles.testBtnText}>Test Connection</Text>
                  )}
                </TouchableOpacity>
              </View>

              {/* Status Pill Card */}
              <View style={styles.aiStatusCard}>
                <View style={styles.aiStatusRow}>
                  <View
                    style={[
                      styles.statusDot,
                      aiStatus === 'connected' ? styles.statusDotGreen : styles.statusDotRed,
                    ]}
                  />
                  <Text style={styles.aiStatusTitle}>
                    Local AI Gateway: {aiStatus === 'connected' ? 'Connected' : 'Offline'}
                  </Text>
                </View>
                <Text style={styles.aiStatusSub}>
                  {aiStatus === 'connected'
                    ? 'Qwen and Nomic models are actively serving inferences locally.'
                    : 'Server unreachable. Using local storage mode with deferred embedding.'}
                </Text>

                {/* Model badges */}
                <View style={styles.modelChipsRow}>
                  <View style={[styles.modelChip, modelStatus.vision && styles.modelChipActive]}>
                    <Text style={[styles.modelChipText, modelStatus.vision && styles.modelChipTextActive]}>
                      Qwen2.5-VL 3B {modelStatus.vision ? '✓' : ''}
                    </Text>
                  </View>
                  <View style={[styles.modelChip, modelStatus.text && styles.modelChipActive]}>
                    <Text style={[styles.modelChipText, modelStatus.text && styles.modelChipTextActive]}>
                      Qwen3 8B {modelStatus.text ? '✓' : ''}
                    </Text>
                  </View>
                  <View style={[styles.modelChip, modelStatus.embedding && styles.modelChipActive]}>
                    <Text style={[styles.modelChipText, modelStatus.embedding && styles.modelChipTextActive]}>
                      Nomic Embed {modelStatus.embedding ? '✓' : ''}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Server URL Input */}
              <View style={styles.urlInputGroup}>
                <Text style={styles.fieldLabel}>FASTAPI GATEWAY URL</Text>
                <TextInput
                  style={styles.urlInput}
                  value={serverUrl}
                  onChangeText={handleSaveServerUrl}
                  placeholder="http://localhost:8000"
                  placeholderTextColor={colors.textMuted}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <View style={styles.urlPresetsRow}>
                  <TouchableOpacity
                    style={[styles.urlPresetChip, serverUrl === DEFAULT_LAN_SERVER_URL && styles.urlPresetChipActive]}
                    onPress={() => handleApplyUrl(DEFAULT_LAN_SERVER_URL)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.urlPresetText, serverUrl === DEFAULT_LAN_SERVER_URL && styles.urlPresetTextActive]}>
                      PC LAN IP (192.168.1.2)
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.urlPresetChip, serverUrl === DEFAULT_AI_SERVER_URL && styles.urlPresetChipActive]}
                    onPress={() => handleApplyUrl(DEFAULT_AI_SERVER_URL)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.urlPresetText, serverUrl === DEFAULT_AI_SERVER_URL && styles.urlPresetTextActive]}>
                      Localhost (8000)
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.urlHint}>
                  Physical phone: Use PC LAN IP on same Wi-Fi, or run 'adb reverse tcp:8000 tcp:8000' over USB.
                </Text>
              </View>
            </View>

            {/* 2. LOCAL DATA STORAGE */}
            <View style={styles.section}>
              <View style={styles.titleWithIcon}>
                <Database size={14} color={colors.primaryBlue} />
                <Text style={styles.sectionTitle}>LOCAL DATA STORAGE</Text>
              </View>

              {/* Stats Box */}
              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>{memories.length}</Text>
                  <Text style={styles.statLabel}>Memories</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>{pendingCount}</Text>
                  <Text style={styles.statLabel}>Pending Tasks</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>{callsCount}</Text>
                  <Text style={styles.statLabel}>Calls</Text>
                </View>
              </View>

              {/* Export Data */}
              <TouchableOpacity style={styles.actionBtn} onPress={handleExportData} activeOpacity={0.7}>
                <Download size={15} color={colors.primaryBlue} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.actionBtnTitle}>Export My Data (JSON)</Text>
                  <Text style={styles.actionBtnSubtitle}>Download all captures, metadata, and actions</Text>
                </View>
              </TouchableOpacity>

              {/* Clear All */}
              <TouchableOpacity style={[styles.actionBtn, styles.clearBtn]} onPress={handleClearAll} activeOpacity={0.7}>
                <Trash2 size={15} color={colors.danger} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.actionBtnTitle, { color: colors.danger }]}>Clear All Memories</Text>
                  <Text style={styles.actionBtnSubtitle}>Delete all saved memories from this device</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* 3. PERMISSIONS CENTER */}
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.titleWithIcon}>
                  <ShieldCheck size={14} color={colors.primaryBlue} />
                  <Text style={styles.sectionTitle}>PERMISSIONS CENTER</Text>
                </View>
                <TouchableOpacity
                  style={styles.openSettingsLink}
                  onPress={() => PermissionService.openSettings()}
                  activeOpacity={0.7}
                >
                  <Text style={styles.openSettingsText}>System Settings</Text>
                  <ExternalLink size={12} color={colors.primaryBlue} />
                </TouchableOpacity>
              </View>

              {/* Photos */}
              <View style={styles.permRow}>
                <View style={styles.permLeft}>
                  <View style={[styles.permIconBox, { backgroundColor: colors.pinkSoft }]}>
                    <ImageIcon size={16} color={colors.brandPink} />
                  </View>
                  <View>
                    <Text style={styles.permName}>Photos & Screenshots</Text>
                    <Text style={styles.permDesc}>Required to import images for vision OCR</Text>
                  </View>
                </View>
                {(() => {
                  const b = getStatusBadge(permissions.photos);
                  return (
                    <View style={[styles.permBadge, { backgroundColor: b.bg }]}>
                      <Text style={[styles.permBadgeText, { color: b.text }]}>{b.label}</Text>
                    </View>
                  );
                })()}
              </View>

              {/* Notifications */}
              <View style={styles.permRow}>
                <View style={styles.permLeft}>
                  <View style={[styles.permIconBox, { backgroundColor: colors.blueSoft }]}>
                    <Bell size={16} color={colors.primaryBlue} />
                  </View>
                  <View>
                    <Text style={styles.permName}>Action Reminders</Text>
                    <Text style={styles.permDesc}>For commitment & deadline alerts</Text>
                  </View>
                </View>
                {(() => {
                  const b = getStatusBadge(permissions.notifications);
                  return (
                    <View style={[styles.permBadge, { backgroundColor: b.bg }]}>
                      <Text style={[styles.permBadgeText, { color: b.text }]}>{b.label}</Text>
                    </View>
                  );
                })()}
              </View>

              {/* Microphone */}
              <View style={styles.permRow}>
                <View style={styles.permLeft}>
                  <View style={[styles.permIconBox, { backgroundColor: '#F3E8FF' }]}>
                    <Mic size={16} color="#7C3AED" />
                  </View>
                  <View>
                    <Text style={styles.permName}>Microphone</Text>
                    <Text style={styles.permDesc}>Requested only if recording voice notes</Text>
                  </View>
                </View>
                {(() => {
                  const b = getStatusBadge(permissions.microphone);
                  return (
                    <View style={[styles.permBadge, { backgroundColor: b.bg }]}>
                      <Text style={[styles.permBadgeText, { color: b.text }]}>{b.label}</Text>
                    </View>
                  );
                })()}
              </View>
            </View>

            {/* 4. PRIVACY PRINCIPLE */}
            <View style={styles.section}>
              <View style={styles.titleWithIcon}>
                <Info size={14} color={colors.primaryBlue} />
                <Text style={styles.sectionTitle}>PRIVACY & SECURITY</Text>
              </View>
              <View style={styles.privacyCard}>
                <Text style={styles.privacyStatement}>
                  Recall operates strictly on user-initiated actions. It never runs background microphone surveillance, does not secretly record calls, and keeps all memories on your device.
                </Text>
              </View>
            </View>

            {/* 5. DEVELOPER MODE */}
            <View style={styles.section}>
              <View style={styles.devHeader}>
                <View style={styles.titleWithIcon}>
                  <Sparkles size={14} color={colors.brandPink} />
                  <Text style={styles.sectionTitle}>DEVELOPER MODE</Text>
                </View>
                <Switch
                  value={isDeveloperMode}
                  onValueChange={setDeveloperMode}
                  trackColor={{ false: '#E5E7EB', true: colors.primaryBlue }}
                  thumbColor={colors.white}
                />
              </View>

              {isDeveloperMode ? (
                <View style={styles.devPanel}>
                  <Text style={styles.devNotice}>
                    Developer Mode active. Allows loading demo datasets and simulating capture sources.
                  </Text>
                  <TouchableOpacity style={styles.demoLoadBtn} onPress={handleResetDemo} activeOpacity={0.8}>
                    <RotateCcw size={14} color={colors.primaryBlue} />
                    <Text style={styles.demoLoadBtnText}>Load 15 Demo Memories Dataset</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Text style={styles.devOffText}>
                  Developer Mode is OFF. Running exclusively in clean real-data mode.
                </Text>
              )}
            </View>

            {/* 6. MARKETING LANDING PAGE */}
            <View style={styles.section}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: colors.pinkSoft,
                  padding: spacing.md,
                  borderRadius: radii.md,
                  borderWidth: 1,
                  borderColor: '#E83E8C33',
                }}
                onPress={() => {
                  onClose();
                  router.push('/landing');
                }}
                activeOpacity={0.8}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Sparkles size={16} color={colors.brandPink} />
                  <Text style={{ fontSize: typography.sizes.secondary, fontWeight: '700', color: colors.brandPink }}>
                    View Product Landing Page
                  </Text>
                </View>
                <ExternalLink size={14} color={colors.brandPink} />
              </TouchableOpacity>
            </View>

            {/* 7. ABOUT */}
            <View style={styles.aboutSection}>
              <Text style={styles.aboutText}>Recall v1.0.0 • Local-First Personal Context Hub</Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
    maxHeight: '92%',
  },
  handle: {
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
  closeBtn: {
    padding: spacing.xs,
  },
  scrollContent: {
    gap: spacing.base,
    paddingBottom: spacing.xxl,
  },
  visionCard: {
    backgroundColor: colors.blueSoft,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: '#D4E2FF',
    padding: spacing.md,
  },
  visionTagline: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  visionDesc: {
    fontSize: typography.sizes.secondary,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  section: {
    gap: spacing.sm,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: colors.textMuted,
    letterSpacing: 0.8,
  },
  testBtn: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  testBtnText: {
    fontSize: 11,
    color: colors.primaryBlue,
    fontWeight: typography.weights.semibold,
  },
  aiStatusCard: {
    backgroundColor: colors.background,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: 6,
  },
  aiStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusDotGreen: {
    backgroundColor: colors.success,
  },
  statusDotRed: {
    backgroundColor: colors.danger,
  },
  aiStatusTitle: {
    fontSize: typography.sizes.secondary,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  aiStatusSub: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  modelChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  modelChip: {
    backgroundColor: colors.card,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modelChipActive: {
    borderColor: colors.success,
    backgroundColor: colors.successLight,
  },
  modelChipText: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: typography.weights.medium,
  },
  modelChipTextActive: {
    color: colors.success,
    fontWeight: typography.weights.bold,
  },
  urlInputGroup: {
    gap: 4,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: colors.textMuted,
    letterSpacing: 0.6,
  },
  urlInput: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    fontSize: typography.sizes.secondary,
    color: colors.textPrimary,
  },
  urlHint: {
    fontSize: 10,
    color: colors.textMuted,
  },
  urlPresetsRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 4,
  },
  urlPresetChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.xs,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  urlPresetChipActive: {
    borderColor: colors.primaryBlue,
    backgroundColor: colors.blueSoft,
  },
  urlPresetText: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  urlPresetTextActive: {
    color: colors.primaryBlue,
    fontWeight: typography.weights.bold,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: typography.sizes.section,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  clearBtn: {
    borderColor: '#FFE4E6',
    backgroundColor: '#FFF5F5',
  },
  actionBtnTitle: {
    fontSize: typography.sizes.secondary,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  actionBtnSubtitle: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 1,
  },
  openSettingsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  openSettingsText: {
    fontSize: typography.sizes.caption,
    color: colors.primaryBlue,
    fontWeight: typography.weights.medium,
  },
  permRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm + 2,
  },
  permLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  permIconBox: {
    width: 32,
    height: 32,
    borderRadius: radii.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  permName: {
    fontSize: typography.sizes.secondary,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  permDesc: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 1,
  },
  permBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.xs,
  },
  permBadgeText: {
    fontSize: 10,
    fontWeight: typography.weights.semibold,
  },
  privacyCard: {
    backgroundColor: colors.background,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  privacyStatement: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  devHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  devPanel: {
    backgroundColor: '#F8FAFF',
    borderWidth: 1,
    borderColor: '#D8E2FD',
    borderRadius: radii.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  devNotice: {
    fontSize: typography.sizes.caption,
    color: colors.primaryBlue,
    lineHeight: 16,
  },
  demoLoadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.primaryBlue,
    paddingVertical: 10,
    borderRadius: radii.sm,
  },
  demoLoadBtnText: {
    fontSize: typography.sizes.secondary,
    fontWeight: typography.weights.bold,
    color: colors.primaryBlue,
  },
  devOffText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  aboutSection: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  aboutText: {
    fontSize: 11,
    color: colors.textMuted,
  },
});

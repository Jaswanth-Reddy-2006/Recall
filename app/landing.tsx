import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Sparkles,
  ArrowRight,
  Check,
  Search,
  Shield,
  Layers,
  Calendar,
  Image as ImageIcon,
  Link2,
  FileText,
  PhoneCall,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Zap,
  Globe,
  Lock,
  ChevronRight,
} from 'lucide-react-native';
import { colors, typography, radii, spacing } from '../src/constants/theme';
import { RecallLogo, RecallMark } from '../src/components/ui/RecallLogo';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const isDesktop = width > 768;

type DemoTab = 'screenshot' | 'link' | 'note';

export default function LandingPage() {
  const router = useRouter();
  const [activeDemoTab, setActiveDemoTab] = useState<DemoTab>('screenshot');
  const [interactiveStep, setInteractiveStep] = useState(2); // 0=input, 1=processing, 2=understood

  const handleLaunchApp = () => {
    router.push('/(tabs)');
  };

  return (
    <ScrollView
      style={styles.pageContainer}
      contentContainerStyle={styles.pageContent}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. TOP NAVIGATION BAR */}
      <View style={styles.navBar}>
        <View style={styles.navBrand}>
          <RecallMark size={32} />
          <View style={styles.brandTextCol}>
            <Text style={styles.brandName}>RECALL</Text>
            <Text style={styles.brandTagline}>Personal Context & Action Hub</Text>
          </View>
        </View>

        <View style={styles.navActions}>
          <TouchableOpacity
            style={styles.navLaunchBtn}
            onPress={handleLaunchApp}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#E83E8C', '#3B5BDB']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.navLaunchGradient}
            >
              <Text style={styles.navLaunchText}>Launch App Demo</Text>
              <ArrowRight size={15} color={colors.white} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. HERO SECTION */}
      <View style={styles.heroSection}>
        <View style={styles.heroBadge}>
          <Sparkles size={14} color={colors.brandPink} />
          <Text style={styles.heroBadgeText}>AI-POWERED LOCAL CONTEXT & ACTION HUB</Text>
        </View>

        <Text style={styles.heroTitle}>
          Capture anything.{'\n'}
          <Text style={styles.heroTitleGradient}>Never lose the context.</Text>
        </Text>

        <Text style={styles.heroSubtitle}>
          Recall remembers what you see, understands why it matters, and turns visual noise
          into concrete actionable commitments. 100% private, local-first, and intelligent.
        </Text>

        <View style={styles.heroCtaRow}>
          <TouchableOpacity
            style={styles.primaryCtaBtn}
            onPress={handleLaunchApp}
            activeOpacity={0.88}
          >
            <LinearGradient
              colors={['#E83E8C', '#3B5BDB']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.primaryCtaGradient}
            >
              <Text style={styles.primaryCtaText}>Try Recall App</Text>
              <ArrowRight size={18} color={colors.white} />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryCtaBtn}
            onPress={() => setActiveDemoTab('screenshot')}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryCtaText}>Explore Interactive Demo</Text>
          </TouchableOpacity>
        </View>

        {/* HERO VISUAL: Realistic Phone Mockup */}
        <View style={styles.mockupContainer}>
          <View style={styles.phoneFrame}>
            <View style={styles.phoneSpeaker} />
            <View style={styles.phoneScreen}>
              {/* Mini App Header */}
              <View style={styles.phoneHeader}>
                <View style={styles.phoneHeaderBrand}>
                  <RecallMark size={20} />
                  <Text style={styles.phoneBrandText}>Recall</Text>
                </View>
                <View style={styles.phoneStatusBadge}>
                  <View style={styles.phoneStatusDot} />
                  <Text style={styles.phoneStatusText}>Local AI Ready</Text>
                </View>
              </View>

              {/* Understood By Recall Mockup Card */}
              <View style={styles.phoneCard}>
                <LinearGradient
                  colors={['#E83E8C', '#3B5BDB']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.phoneCardBanner}
                >
                  <Sparkles size={13} color={colors.white} />
                  <Text style={styles.phoneBannerTitle}>UNDERSTOOD BY RECALL</Text>
                </LinearGradient>

                <View style={styles.phoneCardBody}>
                  <Text style={styles.phoneCardTitle}>
                    Campus Recruitment Drive — Frontend Engineer
                  </Text>
                  <View style={styles.phoneTagRow}>
                    <View style={styles.phoneCatPill}>
                      <Text style={styles.phoneCatText}>Work</Text>
                    </View>
                    <View style={styles.phoneTopicPill}>
                      <Text style={styles.phoneTopicText}>#Recruitment</Text>
                    </View>
                    <View style={styles.phoneTopicPill}>
                      <Text style={styles.phoneTopicText}>#React</Text>
                    </View>
                  </View>

                  <Text style={styles.phoneCardSummary}>
                    TechCorp campus recruitment walk-in drive for Associate Frontend Engineer on 22 September 2026.
                  </Text>

                  {/* Detected Action Card */}
                  <View style={styles.phoneActionCard}>
                    <View style={styles.phoneActionHeader}>
                      <AlertCircle size={12} color={colors.brandPink} />
                      <Text style={styles.phoneActionNotice}>Recall found an action</Text>
                    </View>
                    <Text style={styles.phoneActionTitle}>
                      Review drive details & prepare resume
                    </Text>
                    <View style={styles.phoneActionDueRow}>
                      <Calendar size={11} color={colors.brandPink} />
                      <Text style={styles.phoneActionDue}>Due: 22 September 2026</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* 3. THE PROBLEM SECTION */}
      <View style={styles.section}>
        <Text style={styles.sectionEyebrow}>THE INFORMATION TRAP</Text>
        <Text style={styles.sectionTitle}>Why your current capture habits fail you</Text>
        <Text style={styles.sectionSubtitle}>
          We take hundreds of screenshots, save links, and write quick notes every week. Yet 95% of
          them are never looked at again.
        </Text>

        <View style={styles.problemGrid}>
          <View style={styles.problemCard}>
            <View style={[styles.problemIconBox, { backgroundColor: '#FFF0F6' }]}>
              <ImageIcon size={24} color={colors.brandPink} />
            </View>
            <Text style={styles.problemHeading}>The Screenshot Graveyard</Text>
            <Text style={styles.problemBody}>
              Thousands of photos of flyers, slides, and chats bury critical deadlines under memes
              and camera roll clutter.
            </Text>
          </View>

          <View style={styles.problemCard}>
            <View style={[styles.problemIconBox, { backgroundColor: '#EDF2FF' }]}>
              <Link2 size={24} color={colors.primaryBlue} />
            </View>
            <Text style={styles.problemHeading}>The Link Black Hole</Text>
            <Text style={styles.problemBody}>
              Articles, GitHub repositories, and tools saved to browser bookmarks or reading lists
              die silently in forgotten tabs.
            </Text>
          </View>

          <View style={styles.problemCard}>
            <View style={[styles.problemIconBox, { backgroundColor: '#F3F0FF' }]}>
              <FileText size={24} color="#7950F2" />
            </View>
            <Text style={styles.problemHeading}>Unstructured Notes</Text>
            <Text style={styles.problemBody}>
              Scattered thoughts written without deadlines or follow-ups. You know you wrote it
              somewhere, but can't find it.
            </Text>
          </View>

          <View style={styles.problemCard}>
            <View style={[styles.problemIconBox, { backgroundColor: '#FFF4E6' }]}>
              <Calendar size={24} color="#FD7E14" />
            </View>
            <Text style={styles.problemHeading}>Vanishing Commitments</Text>
            <Text style={styles.problemBody}>
              Promises like "I'll review this tomorrow" or "Submit by Friday" slip through the cracks
              because notes aren't tasks.
            </Text>
          </View>
        </View>
      </View>

      {/* 4. HOW RECALL WORKS */}
      <View style={[styles.section, styles.altSectionBg]}>
        <Text style={styles.sectionEyebrow}>HOW RECALL WORKS</Text>
        <Text style={styles.sectionTitle}>From visual noise to clear action</Text>
        <Text style={styles.sectionSubtitle}>
          A seamless 3-step pipeline powered by local multi-modal AI models.
        </Text>

        <View style={styles.workflowRow}>
          <View style={styles.workflowStep}>
            <View style={styles.workflowStepNum}>
              <Text style={styles.stepNumText}>1</Text>
            </View>
            <Text style={styles.workflowStepTitle}>CAPTURE</Text>
            <Text style={styles.workflowStepDesc}>
              Screenshot, link, note, whiteboard, or recorded phone call. Whatever you see or hear.
            </Text>
          </View>

          <View style={styles.workflowArrow}>
            <ArrowRight size={20} color={colors.brandPink} />
          </View>

          <View style={styles.workflowStep}>
            <View style={[styles.workflowStepNum, { backgroundColor: colors.primaryBlue }]}>
              <Text style={styles.stepNumText}>2</Text>
            </View>
            <Text style={styles.workflowStepTitle}>UNDERSTAND</Text>
            <Text style={styles.workflowStepDesc}>
              Local vision and language models extract visible text, context, facts, and deadlines.
            </Text>
          </View>

          <View style={styles.workflowArrow}>
            <ArrowRight size={20} color={colors.brandPink} />
          </View>

          <View style={styles.workflowStep}>
            <View style={[styles.workflowStepNum, { backgroundColor: '#10B981' }]}>
              <Text style={styles.stepNumText}>3</Text>
            </View>
            <Text style={styles.workflowStepTitle}>ACT & RECALL</Text>
            <Text style={styles.workflowStepDesc}>
              Commitments automatically route into your Action Inbox with concrete due dates.
            </Text>
          </View>
        </View>
      </View>

      {/* 5. SCREENSHOT INTELLIGENCE DEEP DIVE */}
      <View style={styles.section}>
        <View style={styles.featureSplit}>
          <View style={styles.featureTextCol}>
            <View style={styles.featureTag}>
              <ImageIcon size={14} color={colors.brandPink} />
              <Text style={styles.featureTagText}>SCREENSHOT INTELLIGENCE</Text>
            </View>
            <Text style={styles.featureHeading}>
              Recall doesn't store screenshots.{'\n'}It understands them.
            </Text>
            <Text style={styles.featureParagraph}>
              When you save a screenshot, Recall reads every visible line, categorizes the topic,
              bullet-points the critical takeaways, and checks for upcoming deadlines.
            </Text>
            <View style={styles.featureCheckList}>
              <View style={styles.checkItem}>
                <CheckCircle2 size={16} color={colors.brandPink} />
                <Text style={styles.checkText}>Reads schedules, dates, and venue requirements</Text>
              </View>
              <View style={styles.checkItem}>
                <CheckCircle2 size={16} color={colors.brandPink} />
                <Text style={styles.checkText}>Categorizes automatically (Work, College, Dev, etc.)</Text>
              </View>
              <View style={styles.checkItem}>
                <CheckCircle2 size={16} color={colors.brandPink} />
                <Text style={styles.checkText}>Preserves original high-res image permanently</Text>
              </View>
            </View>
          </View>

          <View style={styles.featureCardPreview}>
            <View style={styles.previewCardOuter}>
              <View style={styles.previewCardHeader}>
                <Text style={styles.previewCardHeaderTitle}>UNDERSTOOD BY RECALL</Text>
                <Sparkles size={14} color={colors.brandPink} />
              </View>
              <View style={styles.previewCardContent}>
                <Text style={styles.previewTitle}>DBMS Lab Assignment 4: B+ Trees</Text>
                <View style={styles.previewPillRow}>
                  <Text style={styles.previewCategory}>College</Text>
                  <Text style={styles.previewTopic}>#DBMS</Text>
                  <Text style={styles.previewTopic}>#Indexing</Text>
                </View>
                <Text style={styles.previewSummary}>
                  Department notice requiring submission of DBMS Lab Assignment 4 by 24 September 2026 midnight.
                </Text>
                <View style={styles.previewBullets}>
                  <Text style={styles.bulletLine}>• Submission deadline: 24 September 2026, 11:59 PM</Text>
                  <Text style={styles.bulletLine}>• Upload portal: University CSE Student Portal</Text>
                  <Text style={styles.bulletLine}>• Topics: Transactions & B+ Tree indexing</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* 6. ACTION INBOX */}
      <View style={[styles.section, styles.altSectionBg]}>
        <View style={styles.featureSplit}>
          <View style={styles.featureCardPreview}>
            <View style={styles.inboxPreviewBox}>
              <View style={styles.inboxCardRow}>
                <View style={styles.inboxCheckbox} />
                <View style={styles.inboxCardTextCol}>
                  <Text style={styles.inboxTaskTitle}>
                    Review campus recruitment drive details & prepare resume
                  </Text>
                  <View style={styles.inboxDateBadge}>
                    <Calendar size={11} color={colors.brandPink} />
                    <Text style={styles.inboxDateText}>22 September 2026</Text>
                    <Text style={styles.inboxSourceText}>• From Screenshot</Text>
                  </View>
                </View>
              </View>

              <View style={styles.inboxCardRow}>
                <View style={styles.inboxCheckbox} />
                <View style={styles.inboxCardTextCol}>
                  <Text style={styles.inboxTaskTitle}>
                    Ask Ravi about deployment and update the API
                  </Text>
                  <View style={styles.inboxDateBadge}>
                    <Calendar size={11} color={colors.brandPink} />
                    <Text style={styles.inboxDateText}>22 September 2026</Text>
                    <Text style={styles.inboxSourceText}>• From Quick Note</Text>
                  </View>
                </View>
              </View>

              <View style={styles.inboxCardRow}>
                <View style={styles.inboxCheckbox} />
                <View style={styles.inboxCardTextCol}>
                  <Text style={styles.inboxTaskTitle}>
                    Submit DBMS Lab Assignment 4 on portal
                  </Text>
                  <View style={styles.inboxDateBadge}>
                    <Calendar size={11} color={colors.brandPink} />
                    <Text style={styles.inboxDateText}>24 September 2026</Text>
                    <Text style={styles.inboxSourceText}>• From Portal Notice</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.featureTextCol}>
            <View style={styles.featureTag}>
              <Calendar size={14} color={colors.primaryBlue} />
              <Text style={[styles.featureTagText, { color: colors.primaryBlue }]}>
                ACTION INBOX
              </Text>
            </View>
            <Text style={styles.featureHeading}>
              Notes forget.{'\n'}Recall creates commitments.
            </Text>
            <Text style={styles.featureParagraph}>
              Every actionable item identified in your memories automatically enters your Action
              Inbox. No vague "Tomorrow" or "Later" dates: Recall calculates concrete calendar dates
              and links each task right back to the original source.
            </Text>
            <View style={styles.featureCheckList}>
              <View style={styles.checkItem}>
                <CheckCircle2 size={16} color={colors.primaryBlue} />
                <Text style={styles.checkText}>Concrete due dates: "22 September 2026"</Text>
              </View>
              <View style={styles.checkItem}>
                <CheckCircle2 size={16} color={colors.primaryBlue} />
                <Text style={styles.checkText}>Direct one-tap navigation to source memory</Text>
              </View>
              <View style={styles.checkItem}>
                <CheckCircle2 size={16} color={colors.primaryBlue} />
                <Text style={styles.checkText}>Classifications: Task, Deadline, Follow-up, Waiting</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* 7. PERSONAL CONTEXT SEARCH */}
      <View style={styles.section}>
        <View style={styles.centerHeading}>
          <View style={styles.featureTag}>
            <Search size={14} color={colors.brandPink} />
            <Text style={styles.featureTagText}>HYBRID AI SEARCH</Text>
          </View>
          <Text style={styles.sectionTitle}>Ask Recall anything about what you've saved</Text>
          <Text style={styles.sectionSubtitle}>
            Combines high-dimensional vector embeddings with local keyword indices. You don't need
            to remember exact words; search by concept, person, or context.
          </Text>
        </View>

        <View style={styles.searchVisualBox}>
          <View style={styles.searchBarFake}>
            <Search size={18} color={colors.primaryBlue} />
            <Text style={styles.searchBarFakeText}>"Redis caching performance"</Text>
            <View style={styles.vectorBadge}>
              <Sparkles size={12} color={colors.white} />
              <Text style={styles.vectorBadgeText}>Vector Match</Text>
            </View>
          </View>

          <View style={styles.searchResultFake}>
            <Text style={styles.searchResultReason}>
              "Recall connected these memories because they discuss caching, backend performance, and Redis."
            </Text>
            <Text style={styles.searchResultTitle}>
              Redis Cache-Aside Architecture & Latency Benchmark
            </Text>
            <Text style={styles.searchResultSnippet}>
              Reduced P99 response time from 320ms to 24ms. TTL set to 3600s with jitter.
            </Text>
          </View>
        </View>
      </View>

      {/* 8. CONNECTED MEMORY GRAPH */}
      <View style={[styles.section, styles.altSectionBg]}>
        <View style={styles.centerHeading}>
          <View style={styles.featureTag}>
            <Layers size={14} color={colors.primaryBlue} />
            <Text style={[styles.featureTagText, { color: colors.primaryBlue }]}>
              CONNECTED MEMORY GRAPH
            </Text>
          </View>
          <Text style={styles.sectionTitle}>Every capture finds its place in your graph</Text>
          <Text style={styles.sectionSubtitle}>
            Recall links memories through shared topics, projects, and entities.
          </Text>
        </View>

        <View style={styles.graphContainer}>
          <View style={styles.graphNodeCenter}>
            <Text style={styles.graphNodeCenterText}>Redis & Caching</Text>
          </View>

          <View style={styles.graphNodesRow}>
            <View style={styles.graphNodeItem}>
              <ImageIcon size={14} color={colors.brandPink} />
              <Text style={styles.graphNodeItemText}>Cache-Aside Benchmark</Text>
            </View>
            <View style={styles.graphNodeItem}>
              <Link2 size={14} color={colors.primaryBlue} />
              <Text style={styles.graphNodeItemText}>Rate Limiter Architecture</Text>
            </View>
            <View style={styles.graphNodeItem}>
              <PhoneCall size={14} color="#10B981" />
              <Text style={styles.graphNodeItemText}>Sprint Alignment Call</Text>
            </View>
            <View style={styles.graphNodeItem}>
              <FileText size={14} color="#7950F2" />
              <Text style={styles.graphNodeItemText}>Discussion with Ravi</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 9. CALL INTELLIGENCE */}
      <View style={styles.section}>
        <View style={styles.featureSplit}>
          <View style={styles.featureTextCol}>
            <View style={styles.featureTag}>
              <PhoneCall size={14} color="#10B981" />
              <Text style={[styles.featureTagText, { color: '#10B981' }]}>CALL INTELLIGENCE</Text>
            </View>
            <Text style={styles.featureHeading}>
              Transcribe meetings.{'\n'}Extract decisions & commitments.
            </Text>
            <Text style={styles.featureParagraph}>
              Audio recordings and call transcripts are analyzed for who agreed to what, key
              technical decisions, and next steps with assigned owners.
            </Text>
            <View style={styles.featureCheckList}>
              <View style={styles.checkItem}>
                <CheckCircle2 size={16} color="#10B981" />
                <Text style={styles.checkText}>Assigns tasks to specific speakers with quotes</Text>
              </View>
              <View style={styles.checkItem}>
                <CheckCircle2 size={16} color="#10B981" />
                <Text style={styles.checkText}>Captures architectural decisions and context</Text>
              </View>
              <View style={styles.checkItem}>
                <CheckCircle2 size={16} color="#10B981" />
                <Text style={styles.checkText}>Transfers action items directly into Action Inbox</Text>
              </View>
            </View>
          </View>

          <View style={styles.featureCardPreview}>
            <View style={styles.callCardMock}>
              <Text style={styles.callCardTitle}>Recall Architecture Sync (42 min)</Text>
              <Text style={styles.callParticipants}>
                Participants: Jaswanth Reddy, Ravi Kumar, Priya Sharma
              </Text>
              <View style={styles.callDecisionBadge}>
                <Text style={styles.callDecisionLabel}>DECISION</Text>
                <Text style={styles.callDecisionText}>
                  Adopt Token Bucket for API rate limiting with Redis counters
                </Text>
              </View>
              <View style={styles.callTaskItem}>
                <Text style={styles.callTaskName}>Finalize Redis cache invalidation</Text>
                <Text style={styles.callTaskMeta}>Assigned: Jaswanth • Due: 22 Sept 2026</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* 10. LOCAL-FIRST & PRIVACY */}
      <View style={[styles.section, styles.altSectionBg]}>
        <View style={styles.centerHeading}>
          <View style={styles.featureTag}>
            <Lock size={14} color={colors.brandPink} />
            <Text style={styles.featureTagText}>PRIVACY & LOCAL AI</Text>
          </View>
          <Text style={styles.sectionTitle}>Your data stays on your machine</Text>
          <Text style={styles.sectionSubtitle}>
            Recall is built local-first. We run vision, text, and embedding models directly on your
            hardware through Ollama or on-device engines.
          </Text>
        </View>

        <View style={styles.privacyGrid}>
          <View style={styles.privacyCard}>
            <Cpu size={26} color={colors.brandPink} />
            <Text style={styles.privacyCardTitle}>Local Vision & LLM</Text>
            <Text style={styles.privacyCardText}>
              Powered by Qwen2.5-VL and Qwen3. No server round-trips to proprietary cloud APIs.
            </Text>
          </View>

          <View style={styles.privacyCard}>
            <Shield size={26} color={colors.primaryBlue} />
            <Text style={styles.privacyCardTitle}>Zero Data Training</Text>
            <Text style={styles.privacyCardText}>
              Your screenshots, private notes, and chat transcripts never train external models.
            </Text>
          </View>

          <View style={styles.privacyCard}>
            <Zap size={26} color="#10B981" />
            <Text style={styles.privacyCardTitle}>Works Completely Offline</Text>
            <Text style={styles.privacyCardText}>
              Search, capture, and review your memories on a plane or subway without WiFi.
            </Text>
          </View>
        </View>
      </View>

      {/* 11. INTERACTIVE DEMO WIDGET */}
      <View style={styles.section}>
        <View style={styles.centerHeading}>
          <View style={styles.featureTag}>
            <Sparkles size={14} color={colors.brandPink} />
            <Text style={styles.featureTagText}>INTERACTIVE SIMULATOR</Text>
          </View>
          <Text style={styles.sectionTitle}>Try Recall Intelligence in real-time</Text>
          <Text style={styles.sectionSubtitle}>
            Tap between the 3 modes below to see how Recall parses input, identifies context, and
            extracts actionable commitments.
          </Text>
        </View>

        {/* Mode Switcher */}
        <View style={styles.demoTabRow}>
          <TouchableOpacity
            style={[styles.demoTabBtn, activeDemoTab === 'screenshot' && styles.demoTabBtnActive]}
            onPress={() => setActiveDemoTab('screenshot')}
            activeOpacity={0.8}
          >
            <ImageIcon
              size={16}
              color={activeDemoTab === 'screenshot' ? colors.white : colors.textPrimary}
            />
            <Text
              style={[
                styles.demoTabText,
                activeDemoTab === 'screenshot' && styles.demoTabTextActive,
              ]}
            >
              Screenshot
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.demoTabBtn, activeDemoTab === 'link' && styles.demoTabBtnActive]}
            onPress={() => setActiveDemoTab('link')}
            activeOpacity={0.8}
          >
            <Link2
              size={16}
              color={activeDemoTab === 'link' ? colors.white : colors.textPrimary}
            />
            <Text
              style={[
                styles.demoTabText,
                activeDemoTab === 'link' && styles.demoTabTextActive,
              ]}
            >
              Link
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.demoTabBtn, activeDemoTab === 'note' && styles.demoTabBtnActive]}
            onPress={() => setActiveDemoTab('note')}
            activeOpacity={0.8}
          >
            <FileText
              size={16}
              color={activeDemoTab === 'note' ? colors.white : colors.textPrimary}
            />
            <Text
              style={[
                styles.demoTabText,
                activeDemoTab === 'note' && styles.demoTabTextActive,
              ]}
            >
              Note
            </Text>
          </TouchableOpacity>
        </View>

        {/* Live Simulator View */}
        <View style={styles.demoSimulatorCard}>
          {activeDemoTab === 'screenshot' && (
            <View style={styles.demoSimContent}>
              <View style={styles.demoSimInput}>
                <Text style={styles.simInputLabel}>INPUT: SELECTED SCREENSHOT</Text>
                <View style={styles.simThumbRow}>
                  <Image
                    source={{
                      uri: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&auto=format&fit=crop&q=80',
                    }}
                    style={styles.simThumbImage}
                  />
                  <View style={styles.simThumbMeta}>
                    <Text style={styles.simThumbTitle}>Campus Placement Bulletin Flyer</Text>
                    <Text style={styles.simThumbSub}>
                      "TechCorp Walk-in Drive for 2026 Graduates. Associate Frontend Engineer..."
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.demoSimUnderstood}>
                <LinearGradient
                  colors={['#E83E8C', '#3B5BDB']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.simBanner}
                >
                  <Sparkles size={14} color={colors.white} />
                  <Text style={styles.simBannerText}>UNDERSTOOD BY RECALL</Text>
                </LinearGradient>

                <View style={styles.simBody}>
                  <Text style={styles.simTitle}>
                    Campus Recruitment Drive — Frontend Engineer
                  </Text>
                  <View style={styles.simBadgeRow}>
                    <Text style={styles.simCatBadge}>Work</Text>
                    <Text style={styles.simTopicBadge}>#Recruitment</Text>
                    <Text style={styles.simTopicBadge}>#React</Text>
                    <Text style={styles.simTopicBadge}>#Career</Text>
                  </View>
                  <Text style={styles.simSummary}>
                    TechCorp campus recruitment walk-in drive for Associate Frontend Engineer on 22 September 2026. Requires resume and college ID.
                  </Text>

                  <View style={styles.simActionBox}>
                    <AlertCircle size={14} color={colors.brandPink} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.simActionTitle}>
                        Review campus recruitment drive details & prepare resume
                      </Text>
                      <Text style={styles.simActionDate}>Due: 22 September 2026</Text>
                    </View>
                    <View style={styles.simAddedPill}>
                      <Check size={12} color={colors.white} />
                      <Text style={styles.simAddedText}>Inbox Ready</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}

          {activeDemoTab === 'link' && (
            <View style={styles.demoSimContent}>
              <View style={styles.demoSimInput}>
                <Text style={styles.simInputLabel}>INPUT: SAVED LINK</Text>
                <View style={styles.simUrlRow}>
                  <Link2 size={16} color={colors.primaryBlue} />
                  <Text style={styles.simUrlText}>
                    https://bytebytego.com/courses/system-design-interview/rate-limiter
                  </Text>
                </View>
              </View>

              <View style={styles.demoSimUnderstood}>
                <LinearGradient
                  colors={['#E83E8C', '#3B5BDB']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.simBanner}
                >
                  <Sparkles size={14} color={colors.white} />
                  <Text style={styles.simBannerText}>LINK UNDERSTOOD BY RECALL</Text>
                </LinearGradient>

                <View style={styles.simBody}>
                  <Text style={styles.simTitle}>
                    Designing a Scalable Rate Limiter — ByteByteGo
                  </Text>
                  <View style={styles.simBadgeRow}>
                    <Text style={styles.simCatBadge}>Learning</Text>
                    <Text style={styles.simTopicBadge}>#SystemDesign</Text>
                    <Text style={styles.simTopicBadge}>#Redis</Text>
                  </View>
                  <Text style={styles.simSummary}>
                    Comprehensive architectural breakdown of Token Bucket, Leaky Bucket, and Sliding Window algorithms with Redis distributed counters.
                  </Text>
                </View>
              </View>
            </View>
          )}

          {activeDemoTab === 'note' && (
            <View style={styles.demoSimContent}>
              <View style={styles.demoSimInput}>
                <Text style={styles.simInputLabel}>INPUT: QUICK THOUGHT</Text>
                <View style={styles.simNoteBox}>
                  <Text style={styles.simNoteText}>
                    "Ask Ravi about deployment and update the API tomorrow"
                  </Text>
                </View>
              </View>

              <View style={styles.demoSimUnderstood}>
                <LinearGradient
                  colors={['#E83E8C', '#3B5BDB']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.simBanner}
                >
                  <Sparkles size={14} color={colors.white} />
                  <Text style={styles.simBannerText}>NOTE UNDERSTOOD BY RECALL</Text>
                </LinearGradient>

                <View style={styles.simBody}>
                  <Text style={styles.simTitle}>
                    Discussion with Ravi regarding deployment & API updates
                  </Text>
                  <View style={styles.simBadgeRow}>
                    <Text style={styles.simCatBadge}>Work</Text>
                    <Text style={styles.simTopicBadge}>#Deployment</Text>
                    <Text style={styles.simTopicBadge}>#API</Text>
                    <Text style={styles.simTopicBadge}>#Ravi</Text>
                  </View>
                  <Text style={styles.simSummary}>
                    Follow-up note to verify production deployment readiness with Ravi and execute API endpoints upgrade.
                  </Text>

                  <View style={styles.simActionBox}>
                    <AlertCircle size={14} color={colors.brandPink} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.simActionTitle}>
                        Ask Ravi about deployment and update the API
                      </Text>
                      <Text style={styles.simActionDate}>Due: 22 September 2026</Text>
                    </View>
                    <View style={styles.simAddedPill}>
                      <Check size={12} color={colors.white} />
                      <Text style={styles.simAddedText}>Inbox Ready</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* 12. FINAL CALL TO ACTION */}
      <View style={styles.finalCtaSection}>
        <LinearGradient
          colors={['#E83E8C', '#3B5BDB']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.finalCtaCard}
        >
          <Text style={styles.finalCtaTitle}>Ready to never lose context again?</Text>
          <Text style={styles.finalCtaSubtitle}>
            Experience Recall now in your browser or on your mobile device.
          </Text>

          <TouchableOpacity
            style={styles.finalLaunchBtn}
            onPress={handleLaunchApp}
            activeOpacity={0.88}
          >
            <Text style={styles.finalLaunchText}>Launch Recall App Demo</Text>
            <ArrowRight size={18} color={colors.brandPink} />
          </TouchableOpacity>
        </LinearGradient>
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <View style={styles.footerBrand}>
            <RecallMark size={24} />
            <Text style={styles.footerBrandName}>RECALL</Text>
          </View>
          <Text style={styles.footerBuiltWith}>
            Built with Expo SDK 57 · React Native · TypeScript · Ollama Local AI
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#FAFBFD',
  },
  pageContent: {
    paddingBottom: spacing.xxl,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: isDesktop ? 60 : 20,
    paddingVertical: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    backgroundColor: colors.white,
  },
  navBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  brandTextCol: {
    gap: 1,
  },
  brandName: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: 1,
  },
  brandTagline: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  navActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navLaunchBtn: {
    borderRadius: radii.full,
    overflow: 'hidden',
  },
  navLaunchGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.base,
    paddingVertical: 10,
  },
  navLaunchText: {
    color: colors.white,
    fontWeight: typography.weights.bold,
    fontSize: 13,
  },
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: isDesktop ? 80 : 20,
    paddingTop: 48,
    paddingBottom: 40,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.pinkSoft,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: '#E83E8C33',
    marginBottom: spacing.base,
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.brandPink,
    letterSpacing: 0.8,
  },
  heroTitle: {
    fontSize: isDesktop ? 52 : 36,
    fontWeight: '900',
    textAlign: 'center',
    color: colors.textPrimary,
    lineHeight: isDesktop ? 62 : 44,
    letterSpacing: -1,
    marginBottom: spacing.base,
  },
  heroTitleGradient: {
    color: colors.brandPink,
  },
  heroSubtitle: {
    fontSize: isDesktop ? 18 : 15,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 680,
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  heroCtaRow: {
    flexDirection: isDesktop ? 'row' : 'column',
    alignItems: 'center',
    gap: spacing.base,
    marginBottom: 48,
  },
  primaryCtaBtn: {
    borderRadius: radii.full,
    overflow: 'hidden',
    shadowColor: colors.brandPink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryCtaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 28,
    paddingVertical: 16,
  },
  primaryCtaText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: typography.weights.bold,
  },
  secondaryCtaBtn: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: radii.full,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: '#D0D5DD',
  },
  secondaryCtaText: {
    fontSize: 15,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  mockupContainer: {
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
  },
  phoneFrame: {
    width: '100%',
    backgroundColor: '#0F172A',
    borderRadius: 40,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.2,
    shadowRadius: 32,
    elevation: 12,
  },
  phoneSpeaker: {
    width: 64,
    height: 5,
    backgroundColor: '#334155',
    borderRadius: radii.full,
    alignSelf: 'center',
    marginBottom: 10,
  },
  phoneScreen: {
    backgroundColor: colors.background,
    borderRadius: 28,
    padding: spacing.base,
    overflow: 'hidden',
  },
  phoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.base,
  },
  phoneHeaderBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  phoneBrandText: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  phoneStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#E6FCF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.full,
  },
  phoneStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  phoneStatusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0CA678',
  },
  phoneCard: {
    backgroundColor: colors.white,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.blueBorder,
    overflow: 'hidden',
  },
  phoneCardBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  phoneBannerTitle: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  phoneCardBody: {
    padding: 12,
    gap: 8,
  },
  phoneCardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  phoneTagRow: {
    flexDirection: 'row',
    gap: 6,
  },
  phoneCatPill: {
    backgroundColor: colors.pinkSoft,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: radii.full,
  },
  phoneCatText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.brandPink,
  },
  phoneTopicPill: {
    backgroundColor: colors.blueSoft,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: radii.full,
  },
  phoneTopicText: {
    fontSize: 10,
    color: colors.primaryBlue,
  },
  phoneCardSummary: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  phoneActionCard: {
    backgroundColor: colors.pinkSoft,
    borderRadius: radii.sm,
    padding: 10,
    gap: 4,
    borderWidth: 1,
    borderColor: '#E83E8C33',
  },
  phoneActionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  phoneActionNotice: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.brandPink,
  },
  phoneActionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  phoneActionDueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  phoneActionDue: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.brandPink,
  },
  section: {
    paddingHorizontal: isDesktop ? 80 : 20,
    paddingVertical: 56,
  },
  altSectionBg: {
    backgroundColor: colors.white,
  },
  sectionEyebrow: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.brandPink,
    letterSpacing: 1.2,
    textAlign: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: isDesktop ? 34 : 26,
    fontWeight: '900',
    color: colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.6,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 620,
    alignSelf: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  problemGrid: {
    flexDirection: isDesktop ? 'row' : 'column',
    gap: spacing.base,
  },
  problemCard: {
    flex: 1,
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: '#EAECF0',
    gap: 8,
  },
  problemIconBox: {
    width: 48,
    height: 48,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  problemHeading: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  problemBody: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  workflowRow: {
    flexDirection: isDesktop ? 'row' : 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  workflowStep: {
    flex: 1,
    maxWidth: 260,
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  workflowStepNum: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.brandPink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 16,
  },
  workflowStepTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  workflowStepDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  workflowArrow: {
    transform: [{ rotate: isDesktop ? '0deg' : '90deg' }],
  },
  featureSplit: {
    flexDirection: isDesktop ? 'row' : 'column',
    alignItems: 'center',
    gap: 40,
  },
  featureTextCol: {
    flex: 1,
    gap: spacing.base,
  },
  featureTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  featureTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.brandPink,
    letterSpacing: 1,
  },
  featureHeading: {
    fontSize: isDesktop ? 32 : 24,
    fontWeight: '900',
    color: colors.textPrimary,
    lineHeight: isDesktop ? 40 : 32,
    letterSpacing: -0.6,
  },
  featureParagraph: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  featureCheckList: {
    gap: 10,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  featureCardPreview: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  previewCardOuter: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.blueBorder,
    overflow: 'hidden',
    shadowColor: colors.primaryBlue,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  previewCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.pinkSoft,
    borderBottomWidth: 1,
    borderBottomColor: '#E83E8C22',
  },
  previewCardHeaderTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.brandPink,
    letterSpacing: 0.8,
  },
  previewCardContent: {
    padding: spacing.base,
    gap: 8,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  previewPillRow: {
    flexDirection: 'row',
    gap: 6,
  },
  previewCategory: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.brandPink,
    backgroundColor: colors.pinkSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.full,
  },
  previewTopic: {
    fontSize: 11,
    color: colors.primaryBlue,
    backgroundColor: colors.blueSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.full,
  },
  previewSummary: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  previewBullets: {
    gap: 4,
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  bulletLine: {
    fontSize: 12,
    color: colors.textPrimary,
  },
  inboxPreviewBox: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: '#EAECF0',
    padding: spacing.base,
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  inboxCardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 10,
    borderRadius: radii.md,
    backgroundColor: colors.background,
  },
  inboxCheckbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.brandPink,
    marginTop: 2,
  },
  inboxCardTextCol: {
    flex: 1,
    gap: 4,
  },
  inboxTaskTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  inboxDateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  inboxDateText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.brandPink,
  },
  inboxSourceText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  centerHeading: {
    alignItems: 'center',
    marginBottom: 32,
  },
  searchVisualBox: {
    maxWidth: 640,
    alignSelf: 'center',
    width: '100%',
    gap: spacing.base,
  },
  searchBarFake: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: colors.blueBorder,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  searchBarFakeText: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  vectorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.primaryBlue,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.full,
  },
  vectorBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.white,
  },
  searchResultFake: {
    backgroundColor: colors.white,
    borderRadius: radii.md,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  searchResultReason: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryBlue,
  },
  searchResultTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  searchResultSnippet: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  graphContainer: {
    alignItems: 'center',
    gap: 20,
  },
  graphNodeCenter: {
    backgroundColor: colors.brandPink,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: radii.full,
  },
  graphNodeCenterText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 15,
  },
  graphNodesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
    maxWidth: 600,
  },
  graphNodeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.card,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  graphNodeItemText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  callCardMock: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: '#D1FAE5',
    gap: 10,
  },
  callCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  callParticipants: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  callDecisionBadge: {
    backgroundColor: '#ECFDF5',
    borderRadius: radii.sm,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#10B981',
    gap: 3,
  },
  callDecisionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
  },
  callDecisionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  callTaskItem: {
    backgroundColor: colors.background,
    borderRadius: radii.sm,
    padding: 10,
    gap: 2,
  },
  callTaskName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  callTaskMeta: {
    fontSize: 11,
    color: colors.brandPink,
  },
  privacyGrid: {
    flexDirection: isDesktop ? 'row' : 'column',
    gap: spacing.base,
    maxWidth: 960,
    alignSelf: 'center',
    width: '100%',
  },
  privacyCard: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  privacyCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  privacyCardText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  demoTabRow: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: colors.surfaceMuted,
    padding: 4,
    borderRadius: radii.full,
    gap: 4,
    marginBottom: spacing.lg,
  },
  demoTabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: radii.full,
  },
  demoTabBtnActive: {
    backgroundColor: colors.brandPink,
  },
  demoTabText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  demoTabTextActive: {
    color: colors.white,
  },
  demoSimulatorCard: {
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.blueBorder,
    overflow: 'hidden',
    shadowColor: colors.primaryBlue,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 6,
  },
  demoSimContent: {
    padding: spacing.lg,
    gap: spacing.base,
  },
  demoSimInput: {
    backgroundColor: colors.background,
    borderRadius: radii.md,
    padding: spacing.base,
    gap: 8,
  },
  simInputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.8,
  },
  simThumbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  simThumbImage: {
    width: 56,
    height: 56,
    borderRadius: radii.sm,
  },
  simThumbMeta: {
    flex: 1,
  },
  simThumbTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  simThumbSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  simUrlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  simUrlText: {
    fontSize: 13,
    color: colors.primaryBlue,
    fontWeight: '600',
  },
  simNoteBox: {
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  simNoteText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: colors.textPrimary,
  },
  demoSimUnderstood: {
    backgroundColor: colors.white,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.blueBorder,
    overflow: 'hidden',
  },
  simBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  simBannerText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  simBody: {
    padding: spacing.base,
    gap: 8,
  },
  simTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  simBadgeRow: {
    flexDirection: 'row',
    gap: 6,
  },
  simCatBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.brandPink,
    backgroundColor: colors.pinkSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.full,
  },
  simTopicBadge: {
    fontSize: 11,
    color: colors.primaryBlue,
    backgroundColor: colors.blueSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.full,
  },
  simSummary: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  simActionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.pinkSoft,
    padding: 12,
    borderRadius: radii.sm,
    gap: 10,
    borderWidth: 1,
    borderColor: '#E83E8C33',
    marginTop: 4,
  },
  simActionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  simActionDate: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.brandPink,
  },
  simAddedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.brandPink,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.full,
  },
  simAddedText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '800',
  },
  finalCtaSection: {
    paddingHorizontal: isDesktop ? 80 : 20,
    paddingVertical: 40,
    alignItems: 'center',
  },
  finalCtaCard: {
    width: '100%',
    maxWidth: 820,
    borderRadius: radii.xl,
    padding: isDesktop ? 56 : 32,
    alignItems: 'center',
    gap: spacing.base,
    shadowColor: colors.brandPink,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 8,
  },
  finalCtaTitle: {
    fontSize: isDesktop ? 36 : 24,
    fontWeight: '900',
    color: colors.white,
    textAlign: 'center',
    letterSpacing: -0.6,
  },
  finalCtaSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    maxWidth: 500,
  },
  finalLaunchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.white,
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: radii.full,
    marginTop: 8,
  },
  finalLaunchText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.brandPink,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#EAECF0',
    paddingHorizontal: isDesktop ? 80 : 20,
    paddingVertical: spacing.lg,
    backgroundColor: colors.white,
  },
  footerRow: {
    flexDirection: isDesktop ? 'row' : 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  footerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerBrandName: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  footerBuiltWith: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

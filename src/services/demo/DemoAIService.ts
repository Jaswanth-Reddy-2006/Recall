import {
  AIProvider,
  ScreenshotAnalysisResult,
  LinkAnalysisResult,
  NoteAnalysisResult,
  CallAnalysisResult,
} from '../ai/AIProvider';

export class DemoAIService implements AIProvider {
  readonly name = 'Recall Demo Intelligence Engine';
  readonly isLocal = true;

  async checkHealth(): Promise<{
    available: boolean;
    models: { text: boolean; vision: boolean; embedding: boolean };
    latencyMs?: number;
  }> {
    return {
      available: true,
      models: { text: true, vision: true, embedding: true },
      latencyMs: 45,
    };
  }

  async analyzeScreenshot(
    imageUri: string,
    samplePromptHint?: string,
    onProgress?: (stepIndex: number, stageName: string) => void
  ): Promise<ScreenshotAnalysisResult> {
    const steps = [
      'Reading visible content',
      'Identifying context',
      'Finding important details',
      'Looking for actions',
    ];

    // Simulate animated pipeline progress for high-fidelity feel
    for (let i = 0; i < steps.length; i++) {
      if (onProgress) {
        onProgress(i, steps[i]);
      }
      await new Promise((res) => setTimeout(res, 220));
    }

    const hint = (samplePromptHint || '').toLowerCase();
    const uri = (imageUri || '').toLowerCase();

    // 1. Walk-in Drive / Recruitment
    if (
      hint.includes('walk-in') ||
      hint.includes('recruitment') ||
      hint.includes('techcorp') ||
      hint.includes('drive') ||
      hint.includes('job') ||
      hint.includes('interview') ||
      uri.includes('photo-1521737604893')
    ) {
      return {
        title: 'Campus Recruitment Drive — Frontend Engineer',
        category: 'Work',
        tags: ['Recruitment', 'Job', 'Frontend', 'React', 'Interview'],
        summary:
          'TechCorp campus recruitment walk-in drive for Associate Frontend Engineer on 22 September 2026. Requires resume and college ID.',
        importantDetails: [
          'Date: 22 September 2026 at Seminar Hall B',
          'Role: Associate Frontend Engineer (React/TypeScript)',
          'Eligibility: 7.0+ CGPA for 2026 batch',
          'Requirements: 2 hard copies of resume and college ID card',
          'Registration: Scan QR code before 9:00 AM',
        ],
        detectedAction: {
          title: 'Review campus recruitment drive details & prepare resume',
          type: 'deadline',
          dueDate: '22 September 2026',
        },
        detectedDates: ['22 September 2026'],
        topics: ['Recruitment', 'Frontend', 'Interview', 'Career'],
        processedLocally: true,
      };
    }

    // 2. DBMS Assignment Notice
    if (
      hint.includes('dbms') ||
      hint.includes('assignment') ||
      hint.includes('database') ||
      hint.includes('tree') ||
      uri.includes('photo-1517842645767')
    ) {
      return {
        title: 'DBMS Lab Assignment 4: B+ Trees & Transactions',
        category: 'College',
        tags: ['DBMS', 'Assignment', 'Database', 'College', 'Indexing'],
        summary:
          'Department notice requiring submission of DBMS Lab Assignment 4 by 24 September 2026 midnight.',
        importantDetails: [
          'Submission deadline: 24 September 2026, 11:59 PM',
          'Upload portal: University CSE Student Portal',
          'Covered topics: Transactions, Concurrency Control, and B+ Tree indexing',
          'Strict penalty: Zero marks awarded for submissions past deadline',
        ],
        detectedAction: {
          title: 'Submit DBMS Lab Assignment 4 on portal',
          type: 'deadline',
          dueDate: '24 September 2026',
        },
        detectedDates: ['24 September 2026'],
        topics: ['DBMS', 'Assignment', 'Transactions', 'College'],
        processedLocally: true,
      };
    }

    // 3. Redis Caching / Performance
    if (
      hint.includes('redis') ||
      hint.includes('cache') ||
      hint.includes('latency') ||
      hint.includes('benchmark') ||
      hint.includes('aside')
    ) {
      return {
        title: 'Redis Cache-Aside Architecture & Latency Benchmark',
        category: 'Development',
        tags: ['Redis', 'Caching', 'Backend', 'Performance', 'Node.js'],
        summary:
          'Architecture diagram and benchmarks showing 24ms P99 latency with Redis cache-aside.',
        importantDetails: [
          'P99 latency reduction: From 320ms down to 24ms',
          'Caching architecture: Cache-aside pattern in Node.js backend',
          'Key expiration TTL: Set to 3600 seconds with randomized jitter',
          'Prevents downstream database saturation and cache stampedes',
        ],
        detectedDates: [],
        topics: ['Redis', 'Caching', 'Backend', 'Performance'],
        processedLocally: true,
      };
    }

    // 4. API 500 Connection Timeout
    if (
      hint.includes('timeout') ||
      hint.includes('500') ||
      hint.includes('pool') ||
      hint.includes('connection') ||
      uri.includes('photo-1555066931')
    ) {
      return {
        title: 'Database Connection Pool Timeout Analysis',
        category: 'Development',
        tags: ['Database', 'Bug', 'Backend', 'Performance', 'Error'],
        summary:
          'Production error log showing Postgres connection pool exhaustion causing 500 timeouts.',
        importantDetails: [
          'Error code: 500 Connection Timeout in Postgres pool',
          'Max pool size of 20 connections saturated under load',
          'Recommended fix: Increase pool limits and audit idle client leakage',
        ],
        detectedAction: {
          title: 'Debug database connection pool timeout',
          type: 'follow_up',
          dueDate: '22 September 2026',
        },
        detectedDates: ['22 September 2026'],
        topics: ['Database', 'Postgres', 'Backend', 'Error'],
        processedLocally: true,
      };
    }

    // 5. Ravi Slack chat
    if (
      hint.includes('ravi') ||
      hint.includes('slack') ||
      hint.includes('credential') ||
      uri.includes('photo-1577563908')
    ) {
      return {
        title: 'Slack Conversation: Production API Credentials',
        category: 'Work',
        tags: ['Slack', 'Ravi', 'API', 'Backend', 'Credentials'],
        summary:
          'Message thread with Ravi discussing delivery of staging and production API credentials.',
        importantDetails: [
          'Participant: Ravi Kumar',
          'Topic: Delivery of staging & production environment keys',
          'Status: Waiting for verification on staging deployment',
        ],
        detectedAction: {
          title: 'Follow up with Ravi on production API credentials',
          type: 'waiting',
          dueDate: '22 September 2026',
        },
        detectedDates: ['22 September 2026'],
        topics: ['Slack', 'Ravi', 'API', 'Credentials'],
        processedLocally: true,
      };
    }

    // 6. Intelligent Fallback for any uploaded screenshot
    const cleanHint = samplePromptHint?.trim() || 'Visual Reference';
    return {
      title: cleanHint.length > 5 ? cleanHint : 'Captured Reference & Notes',
      category: 'Work',
      tags: ['Reference', 'Context', 'Visual'],
      summary:
        'Visual capture indexed by Recall. Context and key details parsed and stored locally.',
      importantDetails: [
        'Captured and indexed into local memory graph',
        'Text and visible layout analyzed locally',
        'Searchable via hybrid semantic and keyword retrieval',
      ],
      detectedDates: ['22 September 2026'],
      detectedAction: {
        title: `Review ${cleanHint}`,
        type: 'task',
        dueDate: '22 September 2026',
      },
      topics: ['Reference', 'Context'],
      processedLocally: true,
    };
  }

  async analyzeLink(url: string): Promise<LinkAnalysisResult> {
    const lowUrl = url.toLowerCase();

    if (lowUrl.includes('bytebytego') || lowUrl.includes('rate-limit')) {
      return {
        title: 'Designing a Scalable Rate Limiter — ByteByteGo',
        source: 'bytebytego.com',
        category: 'Learning',
        tags: ['SystemDesign', 'RateLimiter', 'Architecture', 'Redis'],
        summary:
          'Comprehensive architectural breakdown of Token Bucket, Leaky Bucket, and Sliding Window algorithms with Redis distributed counters.',
        topics: ['SystemDesign', 'RateLimiter', 'Architecture', 'Redis'],
        possibleAction: 'Review rate limiter architecture trade-offs',
        processedLocally: true,
      };
    }

    if (lowUrl.includes('redis')) {
      return {
        title: 'redis/redis: In-memory data structure store',
        source: 'github.com',
        category: 'Development',
        tags: ['Redis', 'Database', 'Backend', 'Caching', 'OpenSource'],
        summary:
          'Official GitHub repository for Redis in-memory key-value database, caching layer, and streaming engine.',
        topics: ['Redis', 'Database', 'Backend', 'Caching'],
        possibleAction: 'Explore Redis cache-aside documentation',
        processedLocally: true,
      };
    }

    if (lowUrl.includes('react.dev') || lowUrl.includes('react')) {
      return {
        title: 'React 19 Release Notes & Server Components',
        source: 'react.dev',
        category: 'Development',
        tags: ['React', 'Frontend', 'JavaScript', 'WebDev'],
        summary:
          'Official release documentation detailing React 19 features including Actions, Server Components, and Asset Loading.',
        topics: ['React', 'Frontend', 'WebDev'],
        possibleAction: 'Evaluate React 19 upgrade path',
        processedLocally: true,
      };
    }

    let domain = 'Web Resource';
    try {
      domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname.replace(/^www\./, '');
    } catch {}

    return {
      title: `${domain} Resource`,
      source: domain,
      category: 'Learning',
      tags: [domain, 'Reference', 'Link'],
      summary: `Saved article and technical documentation from ${domain}.`,
      topics: [domain, 'Reference'],
      possibleAction: `Read saved resource from ${domain}`,
      processedLocally: true,
    };
  }

  async analyzeNote(text: string): Promise<NoteAnalysisResult> {
    const low = text.toLowerCase();

    if (low.includes('ravi') || (low.includes('deployment') && low.includes('api'))) {
      return {
        title: 'Discussion with Ravi regarding deployment & API updates',
        category: 'Work',
        tags: ['Deployment', 'API', 'Ravi', 'Backend'],
        summary:
          'Follow-up note to verify production deployment readiness with Ravi and execute API endpoints upgrade.',
        detectedAction: {
          title: 'Ask Ravi about deployment and update the API',
          type: 'task',
          dueDate: '22 September 2026',
        },
        topics: ['Deployment', 'API', 'Ravi', 'Backend'],
        processedLocally: true,
      };
    }

    // Generic note parsing
    const lines = text.split('\n').filter((l) => l.trim().length > 0);
    const firstLine = lines[0] || 'Quick Note';
    const cleanTitle = firstLine.length > 50 ? firstLine.slice(0, 47) + '...' : firstLine;

    const hasTomorrow = low.includes('tomorrow');
    const hasNextWeek = low.includes('next week');
    const dueDate = hasTomorrow
      ? '22 September 2026'
      : hasNextWeek
      ? '28 September 2026'
      : undefined;

    return {
      title: cleanTitle,
      category: 'Personal',
      tags: ['Note', 'QuickCapture'],
      summary: text.slice(0, 150) + (text.length > 150 ? '...' : ''),
      detectedAction: dueDate
        ? {
            title: cleanTitle,
            type: 'task',
            dueDate,
          }
        : undefined,
      topics: ['Note'],
      processedLocally: true,
    };
  }

  async analyzeCall(
    transcript: string,
    callTitle?: string,
    participants?: string[]
  ): Promise<CallAnalysisResult> {
    return {
      callAnalysis: {
        title: callTitle || 'Recall Architecture & Sprint Alignment Call',
        participants: participants || ['Jaswanth Reddy', 'Ravi Kumar', 'Priya Sharma'],
        summary:
          '42-minute technical sync. Reviewed caching latency wins, decided on token bucket rate limiting, and agreed to deploy staging build tomorrow.',
        tasks: [
          {
            id: 'ctask-1',
            task: 'Finalize Redis cache invalidation strategy',
            assignedTo: 'Jaswanth Reddy',
            deadline: '22 September 2026',
            confidence: 0.95,
            evidence:
              "Jaswanth agreed: 'I will wrap up the Redis cache invalidation logic before tomorrow's staging release.'",
            confirmed: true,
          },
          {
            id: 'ctask-2',
            task: 'Deploy staging build to TestFlight',
            assignedTo: 'Ravi Kumar',
            deadline: '23 September 2026',
            confidence: 0.92,
            evidence: "Ravi mentioned: 'I can package and deploy the build to TestFlight by Wednesday.'",
            confirmed: true,
          },
        ],
        deadlines: ['22 September 2026', '23 September 2026'],
        decisions: [
          {
            id: 'cdec-1',
            decision: 'Adopt Token Bucket for API rate limiting with Redis counters',
            context: 'Token bucket handles sudden bursts much more gracefully than leaky bucket.',
          },
          {
            id: 'cdec-2',
            decision: 'Prioritize local AI intelligence with zero-lag fallback for offline usage',
            context: 'Ensures the app operates seamlessly regardless of network connectivity.',
          },
        ],
        followUps: [
          'Check in with Ravi tomorrow morning on staging environment credentials',
          'Verify P99 latency benchmarks in staging cluster',
        ],
        importantPoints: [
          'P99 latency dropped below 25ms after caching implementation',
          'App demo is scheduled for end of week',
        ],
      },
      processedLocally: true,
    };
  }

  async generateEmbedding(_text: string): Promise<number[] | null> {
    // Generate deterministic 384-dim pseudo-embedding
    const embedding: number[] = [];
    for (let i = 0; i < 384; i++) {
      embedding.push(Math.sin(i * 0.1));
    }
    return embedding;
  }
}

export const demoAIService = new DemoAIService();

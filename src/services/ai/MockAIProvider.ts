import {
  AIProvider,
  CallAnalysisResult,
  LinkAnalysisResult,
  NoteAnalysisResult,
  ScreenshotAnalysisResult,
} from './AIProvider';

export class MockAIProvider implements AIProvider {
  readonly name = 'Mock Intelligence (Fallback)';
  readonly isLocal = true;

  async checkHealth(): Promise<{
    available: boolean;
    models: { text: boolean; vision: boolean; embedding: boolean };
    latencyMs?: number;
  }> {
    return {
      available: true,
      models: { text: true, vision: true, embedding: true },
      latencyMs: 5,
    };
  }

  async analyzeScreenshot(
    imageUri: string,
    samplePromptHint?: string,
    onProgress?: (stepIndex: number, stageName: string) => void
  ): Promise<ScreenshotAnalysisResult> {
    const steps = [
      'Reading text from image',
      'Identifying topic & category',
      'Detecting actionable commitments',
      'Extracting dates and deadlines',
      'Synthesizing memory context',
    ];

    for (let i = 0; i < steps.length; i++) {
      onProgress?.(i, steps[i]);
      await new Promise((resolve) => setTimeout(resolve, 350));
    }

    const hintLower = (samplePromptHint || '').toLowerCase();

    if (hintLower.includes('dbms') || hintLower.includes('assignment') || hintLower.includes('friday')) {
      return {
        title: 'DBMS Assignment Submission Notice',
        category: 'College',
        tags: ['DBMS', 'Assignment', 'College', 'Database'],
        summary: 'DBMS Assignment 4 submission notice for transactions & B+ Trees due Friday.',
        detectedAction: {
          title: 'Submit DBMS assignment',
          type: 'deadline',
          dueDate: 'Friday, 11:59 PM',
        },
        detectedDates: ['Friday, 11:59 PM'],
        topics: ['DBMS', 'Transactions', 'College', 'Assignment'],
        processedLocally: false,
      };
    }

    if (hintLower.includes('api') || hintLower.includes('bug') || hintLower.includes('error')) {
      return {
        title: 'API Connection Pool Starvation Log',
        category: 'Development',
        tags: ['Backend', 'PostgreSQL', 'API', 'Bug', 'Infrastructure'],
        summary: 'Production checkout endpoint failed due to pool exhaustion after 30s timeout.',
        detectedAction: {
          title: 'Increase connection pool limit and inspect active locks',
          type: 'task',
          dueDate: 'Today',
        },
        detectedDates: ['Today'],
        topics: ['PostgreSQL', 'Connection Pool', 'Backend', 'Bug'],
        processedLocally: false,
      };
    }

    if (hintLower.includes('ravi') || hintLower.includes('waiting') || hintLower.includes('whatsapp') || hintLower.includes('key')) {
      return {
        title: 'API Credentials Handoff from Ravi',
        category: 'Work',
        tags: ['WaitingFor', 'Credentials', 'API', 'Team'],
        summary: 'Ravi promised to send staging API credentials and secrets once approval passes.',
        detectedAction: {
          title: 'Waiting for Ravi to send API credentials',
          type: 'waiting',
          dueDate: 'Tomorrow noon',
        },
        detectedDates: ['Tomorrow noon'],
        topics: ['Credentials', 'Waiting For', 'API'],
        processedLocally: false,
      };
    }

    return {
      title: 'Captured Screenshot Document',
      category: 'Work',
      tags: ['Document', 'Screenshot', 'ActionItem'],
      summary: 'Automated extraction from captured screenshot with detected follow-up item.',
      detectedAction: {
        title: 'Review captured screenshot details',
        type: 'task',
        dueDate: 'Tomorrow',
      },
      detectedDates: ['Tomorrow'],
      topics: ['Document', 'Screenshot'],
      processedLocally: false,
    };
  }

  async analyzeLink(url: string): Promise<LinkAnalysisResult> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    let domain = 'web';
    try {
      const match = url.match(/https?:\/\/(?:www\.)?([^\/]+)/);
      if (match) domain = match[1];
    } catch {}

    const urlLower = url.toLowerCase();

    if (urlLower.includes('redis')) {
      return {
        title: 'redis/redis: In-Memory Data Structure Store',
        source: 'github.com',
        category: 'Development',
        tags: ['Redis', 'Database', 'Backend', 'Caching', 'OpenSource'],
        summary: 'Open-source in-memory data store commonly used for caching, pub/sub, and real-time operations.',
        possibleAction: 'Explore Redis caching architecture',
        topics: ['Redis', 'Database', 'Backend', 'Caching'],
        processedLocally: false,
      };
    }

    return {
      title: `Resource: ${domain}`,
      source: domain,
      category: 'Learning',
      tags: ['WebResource', domain.replace(/\.[a-z]+$/, '')],
      summary: `Saved link from ${domain} with contextual topics indexed for recall.`,
      possibleAction: 'Review saved resource',
      topics: [domain, 'Reference'],
      processedLocally: false,
    };
  }

  async analyzeNote(text: string): Promise<NoteAnalysisResult> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const lines = text.trim().split('\n').filter(Boolean);
    const title = lines[0]?.slice(0, 50) || 'Quick Note';
    const textLower = text.toLowerCase();

    let category = 'Personal';
    const tags: string[] = ['Note'];

    if (textLower.includes('exam') || textLower.includes('assignment') || textLower.includes('college')) {
      category = 'College';
      tags.push('College');
    } else if (textLower.includes('code') || textLower.includes('api') || textLower.includes('deploy')) {
      category = 'Development';
      tags.push('Development');
    } else if (textLower.includes('project') || textLower.includes('meeting') || textLower.includes('sync')) {
      category = 'Work';
      tags.push('Work');
    }

    let detectedAction: NoteAnalysisResult['detectedAction'];
    if (textLower.includes('todo') || textLower.includes('due') || textLower.includes('submit')) {
      detectedAction = {
        title: lines[0]?.replace(/^(TODO|Task|Action):\s*/i, '') || 'Complete note action item',
        type: textLower.includes('due') ? 'deadline' : 'task',
        dueDate: 'Upcoming',
      };
    }

    return {
      title,
      category,
      tags,
      summary: text.slice(0, 120) + (text.length > 120 ? '...' : ''),
      detectedAction,
      topics: tags,
      processedLocally: false,
    };
  }

  async analyzeCall(transcript: string, callTitle?: string, participants?: string[]): Promise<CallAnalysisResult> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    return {
      callAnalysis: {
        title: callTitle || 'Sprint Sync with Manager',
        participants: participants || ['Manager', 'You'],
        summary:
          'Discussion on project milestones and deployment requirements. Manager emphasized finalizing documentation and preparing release configurations.',
        tasks: [
          {
            id: `task_${Date.now()}_1`,
            task: 'Send revised API documentation',
            assignedTo: 'You',
            mentionedBy: 'Manager',
            deadline: 'Tomorrow noon',
            confidence: 0.94,
            evidence: 'The revised API documentation needs to be sent by tomorrow noon.',
            confirmed: false,
          },
          {
            id: `task_${Date.now()}_2`,
            task: 'Prepare deployment checklist report',
            assignedTo: 'You',
            mentionedBy: 'Manager',
            deadline: 'Friday 5 PM',
            confidence: 0.91,
            evidence: 'Make sure to have the deployment checklist ready before Friday end of day.',
            confirmed: false,
          },
        ],
        deadlines: ['Tomorrow noon', 'Friday 5 PM'],
        decisions: [
          {
            id: `dec_${Date.now()}_1`,
            decision: 'Deploy the new API endpoints on Friday',
            context: 'Agreed after validating test coverage',
          },
        ],
        followUps: ['Confirm staging access with DevOps team'],
        importantPoints: [
          'Production deploy scheduled for Friday',
          'Ravi will assist with infrastructure review',
        ],
      },
      processedLocally: false,
    };
  }

  async generateEmbedding(_text: string): Promise<number[] | null> {
    return null;
  }
}

export const mockAIProvider = new MockAIProvider();

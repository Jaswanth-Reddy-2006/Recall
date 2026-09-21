export interface DemoScenario {
  id: string;
  type: 'screenshot' | 'link' | 'note';
  tabTitle: string;
  input: {
    title: string;
    snippet: string;
    imageUri?: string;
    url?: string;
    noteText?: string;
  };
  output: {
    title: string;
    category: string;
    summary: string;
    topics: string[];
    importantDetails: string[];
    action: {
      title: string;
      dueDate: string;
      type: 'task' | 'deadline' | 'follow_up' | 'waiting';
    };
  };
}

export const DEMO_SCENARIOS: Record<'screenshot' | 'link' | 'note', DemoScenario> = {
  screenshot: {
    id: 'sim-screenshot',
    type: 'screenshot',
    tabTitle: 'Screenshot',
    input: {
      title: 'TechCorp On-Campus Recruitment Drive Poster',
      snippet: 'Associate Software Engineer • ₹18 LPA • Tuesday, September 22, 2026 at 10:00 AM • Main Auditorium 3 • Eligibility: 7.5+ CGPA.',
      imageUri: '/screenshots/screenshot-flyer.svg',
    },
    output: {
      title: 'TechCorp On-Campus Hiring Drive 2026',
      category: 'Placement',
      summary: 'TechCorp campus recruitment drive for Associate Software Engineer roles with ₹18 LPA compensation package. Strict portal registration deadline on Sep 22 at 09:00 AM.',
      topics: ['TechCorp', 'Placement', 'SoftwareEngineer', '18LPA'],
      importantDetails: [
        'Reporting: 09:30 AM • Pre-placement talk at 10:00 AM in Auditorium 3',
        'Compensation: ₹18.00 LPA (Base + Joining Bonus)',
        'Eligibility: 7.5+ CGPA, B.Tech CSE/IT/ECE with zero backlogs',
        'Requirements: 2 copies of resume and official college ID card',
      ],
      action: {
        title: 'Submit resume on placement portal before 09:00 AM',
        dueDate: '22 September 2026',
        type: 'deadline',
      },
    },
  },
  link: {
    id: 'sim-link',
    type: 'link',
    tabTitle: 'Link',
    input: {
      title: 'Redis Distributed Cache-Aside Architecture',
      snippet: 'Scaling session storage and rate limiting using Redis 7.2 cluster with atomic counters and sliding window TTLs.',
      url: 'https://redis.io/docs/manual/patterns/distributed-caching/',
    },
    output: {
      title: 'Redis Distributed Cache Architecture & Latency RFC',
      category: 'Engineering',
      summary: 'Technical guide on implementing Redis cache-aside patterns to eliminate database lock contention and slash response latencies under 25ms.',
      topics: ['Redis', 'DistributedSystems', 'Caching', 'Architecture'],
      importantDetails: [
        'Pattern: Cache-aside with Redis cluster replication',
        'Performance: Reduced P99 response latency from 280ms to 18ms',
        'State invalidation: Event-driven pub/sub on model mutations',
      ],
      action: {
        title: 'Review Redis cache invalidation RFC with Sarah',
        dueDate: '25 September 2026',
        type: 'task',
      },
    },
  },
  note: {
    id: 'sim-note',
    type: 'note',
    tabTitle: 'Note',
    input: {
      title: 'Quick Scratchpad',
      snippet: 'Submit DBMS Assignment 3 on B+ Trees before Thursday midnight',
      noteText: 'Submit DBMS Assignment 3 on B+ Trees before Thursday midnight',
    },
    output: {
      title: 'DBMS Assignment 3: B+ Trees & Indexing Submission',
      category: 'Academic',
      summary: 'Academic assignment submission requirement for DBMS Lab covering B+ Tree index structures and 3NF normalization.',
      topics: ['DBMS', 'BPlusTrees', 'Indexing', 'Academic'],
      importantDetails: [
        'Course: Database Management Systems (CS301)',
        'Scope: Index balancing algorithms and SQL normalization scripts',
        'Submission portal: College academic LMS before 11:59 PM',
      ],
      action: {
        title: 'Upload DBMS B+ Tree assignment report to college portal',
        dueDate: '24 September 2026',
        type: 'deadline',
      },
    },
  },
};

export const INBOX_TASKS = [
  {
    id: 'inbox-1',
    title: 'Submit resume on campus placement portal',
    category: 'Placement',
    dueDate: '22 September 2026, 09:00 AM',
    source: 'TechCorp Screenshot',
    type: 'deadline',
  },
  {
    id: 'inbox-2',
    title: 'Attend Pre-Placement Talk in Auditorium 3',
    category: 'Placement',
    dueDate: '22 September 2026, 10:00 AM',
    source: 'TechCorp Screenshot',
    type: 'task',
  },
  {
    id: 'inbox-3',
    title: 'Complete DBMS B+ Tree Normalization Lab',
    category: 'Academic',
    dueDate: '24 September 2026, 11:59 PM',
    source: 'Department Portal',
    type: 'deadline',
  },
  {
    id: 'inbox-4',
    title: 'Review Redis caching schema with Sarah',
    category: 'Engineering',
    dueDate: '25 September 2026, 03:00 PM',
    source: 'Sprint Sync Call',
    type: 'follow_up',
  },
];

export const GALLERY_SCREENS = [
  {
    id: 'home',
    title: 'Home & Activity Dashboard',
    subtitle: 'Unified context feed with pending action cards, stats pills, and instant search',
    tag: 'Dashboard',
    image: '/screenshots/hero-home.svg',
  },
  {
    id: 'screenshot',
    title: 'Screenshot Intelligence',
    subtitle: 'On-device vision OCR, structured entity cards, and automated action extraction',
    tag: 'Vision AI',
    image: '/screenshots/screenshot-analysis.svg',
  },
  {
    id: 'inbox',
    title: 'Action Inbox',
    subtitle: 'Deadlines with concrete verified dates, checkbox execution, and zero vague reminders',
    tag: 'Productivity',
    image: '/screenshots/inbox-screen.svg',
  },
  {
    id: 'search',
    title: 'Hybrid Semantic Search',
    subtitle: 'Natural language queries answered with vector cosine similarity and source evidence',
    tag: 'Search',
    image: '/screenshots/search-screen.svg',
  },
  {
    id: 'call',
    title: 'Call Intelligence',
    subtitle: 'Locally transcribed meetings with speaker attributions, decisions, and assigned follow-ups',
    tag: 'Audio AI',
    image: '/screenshots/call-intelligence.svg',
  },
];

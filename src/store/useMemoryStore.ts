import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Memory, Action, ActionStatus, CallTask } from '../types';
import { memoryRepository } from '../services/storage/MemoryRepository';
import { aiProcessingQueue } from '../services/ai/AIProcessingQueue';
import { aiService } from '../services/ai/AIService';

const DEV_MODE_KEY = '@recall_developer_mode_active';

interface MemoryState {
  memories: Memory[];
  actions: Action[];
  isLoading: boolean;
  hasInitialized: boolean;
  isDeveloperMode: boolean;

  // Actions
  init: () => Promise<void>;
  setDeveloperMode: (enabled: boolean) => Promise<void>;
  addMemory: (memory: Memory) => Promise<void>;
  deleteMemory: (id: string) => Promise<void>;
  addAction: (action: Action) => Promise<void>;
  updateAction: (action: Action) => Promise<void>;
  deleteAction: (actionId: string) => Promise<void>;
  updateActionStatus: (actionId: string, status: ActionStatus) => Promise<void>;
  toggleActionComplete: (actionId: string) => Promise<void>;
  confirmCallTask: (callId: string, task: CallTask, confirmed: boolean) => Promise<void>;
  getMemoryById: (id: string) => Memory | undefined;
  getActionById: (id: string) => Action | undefined;
  getCalls: () => Memory[];
  clearAllData: () => Promise<void>;
  exportData: () => Promise<string>;
  resetDemoData: () => Promise<void>;
}

export const useMemoryStore = create<MemoryState>((set, get) => ({
  memories: [],
  actions: [],
  isLoading: false,
  hasInitialized: false,
  isDeveloperMode: false,

  init: async () => {
    if (get().hasInitialized) return;
    set({ isLoading: true });
    try {
      const [memories, actions, devMode] = await Promise.all([
        memoryRepository.getMemories(),
        memoryRepository.getActions(),
        AsyncStorage.getItem(DEV_MODE_KEY),
      ]);
      const isDev = devMode === 'true';
      aiService.setDeveloperMode(isDev);

      set({
        memories,
        actions,
        isDeveloperMode: isDev,
        hasInitialized: true,
        isLoading: false,
      });
    } catch (err) {
      console.error('Failed to initialize memory store', err);
      set({ isLoading: false });
    }
  },

  setDeveloperMode: async (enabled: boolean) => {
    await AsyncStorage.setItem(DEV_MODE_KEY, enabled ? 'true' : 'false');
    aiService.setDeveloperMode(enabled);
    set({ isDeveloperMode: enabled });
  },

  addMemory: async (memory: Memory) => {
    // 1. Save memory immediately
    await memoryRepository.saveMemory(memory);

    set((state) => ({
      memories: [memory, ...state.memories.filter((m) => m.id !== memory.id)],
    }));

    // 2. Enqueue background embedding (non-blocking)
    aiProcessingQueue.enqueue(memory.id);

    // CRITICAL USER CONFIRMATION RULE:
    // AI tasks are NOT silently added to actions here.
    // They enter Inbox only after explicit user confirmation in the review/capture screen.
  },

  deleteMemory: async (id: string) => {
    await memoryRepository.deleteMemory(id);
    set((state) => ({
      memories: state.memories.filter((m) => m.id !== id),
      actions: state.actions.filter((a) => a.sourceMemoryId !== id),
    }));
  },

  addAction: async (action: Action) => {
    await memoryRepository.saveAction(action);
    set((state) => ({
      actions: [action, ...state.actions.filter((a) => a.id !== action.id)],
    }));
  },

  updateAction: async (action: Action) => {
    await memoryRepository.saveAction(action);
    set((state) => ({
      actions: state.actions.map((a) => (a.id === action.id ? action : a)),
    }));
  },

  deleteAction: async (actionId: string) => {
    await memoryRepository.deleteAction(actionId);
    set((state) => ({
      actions: state.actions.filter((a) => a.id !== actionId),
    }));
  },

  updateActionStatus: async (actionId: string, status: ActionStatus) => {
    await memoryRepository.updateActionStatus(actionId, status);
    set((state) => ({
      actions: state.actions.map((a) => (a.id === actionId ? { ...a, status } : a)),
    }));
  },

  toggleActionComplete: async (actionId: string) => {
    const action = get().actions.find((a) => a.id === actionId);
    if (!action) return;
    const newStatus: ActionStatus = action.status === 'completed' ? 'pending' : 'completed';
    await memoryRepository.updateActionStatus(actionId, newStatus);
    set((state) => ({
      actions: state.actions.map((a) =>
        a.id === actionId
          ? {
              ...a,
              status: newStatus,
              completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined,
            }
          : a
      ),
    }));
  },

  /**
   * User confirmation for Call Intelligence tasks:
   * When confirmed, marks task as confirmed and injects it into the Action Inbox.
   */
  confirmCallTask: async (callId: string, task: CallTask, confirmed: boolean) => {
    const mem = get().memories.find((m) => m.id === callId);
    if (!mem || !mem.callAnalysis) return;

    // Update task confirmation state in call memory
    const updatedTasks = mem.callAnalysis.tasks.map((t) =>
      t.id === task.id ? { ...t, confirmed } : t
    );
    const updatedMem: Memory = {
      ...mem,
      callAnalysis: {
        ...mem.callAnalysis,
        tasks: updatedTasks,
      },
    };
    await memoryRepository.saveMemory(updatedMem);

    if (confirmed) {
      // Add confirmed task to Action Inbox
      const newAction: Action = {
        id: task.id,
        title: task.task,
        type: task.deadline ? 'deadline' : 'task',
        status: 'pending',
        dueDate: task.deadline,
        sourceMemoryId: callId,
        sourceTitle: mem.title,
        sourceType: 'call',
        createdAt: new Date().toISOString(),
      };
      await memoryRepository.saveAction(newAction);
      set((state) => ({
        memories: state.memories.map((m) => (m.id === callId ? updatedMem : m)),
        actions: [newAction, ...state.actions.filter((a) => a.id !== task.id)],
      }));
    } else {
      // Remove unconfirmed task from Inbox
      await memoryRepository.deleteAction(task.id);
      set((state) => ({
        memories: state.memories.map((m) => (m.id === callId ? updatedMem : m)),
        actions: state.actions.filter((a) => a.id !== task.id),
      }));
    }
  },

  getMemoryById: (id: string) => {
    return get().memories.find((m) => m.id === id);
  },

  getActionById: (id: string) => {
    return get().actions.find((a) => a.id === id);
  },

  getCalls: () => {
    return get().memories.filter((m) => m.type === 'call');
  },

  clearAllData: async () => {
    set({ isLoading: true });
    await memoryRepository.clearAllData();
    set({ memories: [], actions: [], isLoading: false });
  },

  exportData: async () => {
    return memoryRepository.exportData();
  },

  resetDemoData: async () => {
    set({ isLoading: true });
    const { memories, actions } = await memoryRepository.resetToDemo();
    set({ memories, actions, isLoading: false });
  },
}));

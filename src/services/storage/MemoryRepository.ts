import AsyncStorage from '@react-native-async-storage/async-storage';
import { Memory, Action, ActionStatus } from '../../types';
import { DEMO_MEMORIES, DEMO_ACTIONS } from '../../data/demo';

const STORAGE_KEYS = {
  MEMORIES: '@recall_memories_v3',
  ACTIONS: '@recall_actions_v3',
  HAS_BOOTSTRAPPED: '@recall_has_bootstrapped_v3',
};

class MemoryRepository {
  private memoriesCache: Memory[] | null = null;
  private actionsCache: Action[] | null = null;

  /**
   * Loads memories from local storage.
   * On first launch, initializes with the clean, realistic demo dataset.
   */
  async getMemories(): Promise<Memory[]> {
    if (this.memoriesCache) {
      return this.memoriesCache;
    }
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.MEMORIES);
      if (stored) {
        this.memoriesCache = JSON.parse(stored);
        return this.memoriesCache || [];
      }
    } catch {
      // Fallback on error
    }

    // Default bootstrap state: Initial rich demo dataset
    this.memoriesCache = [...DEMO_MEMORIES];
    await this.persistMemories();
    return this.memoriesCache;
  }

  async getMemoryById(id: string): Promise<Memory | undefined> {
    const all = await this.getMemories();
    return all.find((m) => m.id === id);
  }

  async saveMemory(memory: Memory): Promise<void> {
    const all = await this.getMemories();
    const existingIndex = all.findIndex((m) => m.id === memory.id);
    if (existingIndex >= 0) {
      all[existingIndex] = { ...memory, updatedAt: new Date().toISOString() };
    } else {
      all.unshift(memory);
    }
    this.memoriesCache = [...all];
    await this.persistMemories();
  }

  async deleteMemory(id: string): Promise<void> {
    const all = await this.getMemories();
    this.memoriesCache = all.filter((m) => m.id !== id);
    await this.persistMemories();

    // Also delete associated actions
    const actions = await this.getActions();
    this.actionsCache = actions.filter((a) => a.sourceMemoryId !== id);
    await this.persistActions();
  }

  /**
   * Loads actions from local storage.
   * Defaults to empty array (zero fake actions).
   */
  async getActions(): Promise<Action[]> {
    if (this.actionsCache) {
      return this.actionsCache;
    }
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.ACTIONS);
      if (stored) {
        this.actionsCache = JSON.parse(stored);
        return this.actionsCache || [];
      }
    } catch {
      // Fallback
    }

    this.actionsCache = [...DEMO_ACTIONS];
    await this.persistActions();
    return this.actionsCache;
  }

  async saveAction(action: Action): Promise<void> {
    const all = await this.getActions();
    const existingIndex = all.findIndex((a) => a.id === action.id);
    if (existingIndex >= 0) {
      all[existingIndex] = action;
    } else {
      all.unshift(action);
    }
    this.actionsCache = [...all];
    await this.persistActions();
  }

  async updateActionStatus(actionId: string, status: ActionStatus): Promise<void> {
    const all = await this.getActions();
    const item = all.find((a) => a.id === actionId);
    if (item) {
      item.status = status;
      if (status === 'completed') {
        item.completedAt = new Date().toISOString();
      }
      this.actionsCache = [...all];
      await this.persistActions();
    }
  }

  async deleteAction(actionId: string): Promise<void> {
    const all = await this.getActions();
    this.actionsCache = all.filter((a) => a.id !== actionId);
    await this.persistActions();
  }

  /**
   * Resets data to the pristine, high-fidelity demo dataset.
   */
  async resetToDemo(): Promise<{ memories: Memory[]; actions: Action[] }> {
    this.memoriesCache = [...DEMO_MEMORIES];
    this.actionsCache = [...DEMO_ACTIONS];
    await this.persistMemories();
    await this.persistActions();
    return { memories: this.memoriesCache, actions: this.actionsCache };
  }

  /**
   * Completely clears all memories and actions.
   */
  async clearAllData(): Promise<void> {
    this.memoriesCache = [];
    this.actionsCache = [];
    await this.persistMemories();
    await this.persistActions();
  }

  /**
   * Exports all user data as a structured JSON object.
   */
  async exportData(): Promise<string> {
    const memories = await this.getMemories();
    const actions = await this.getActions();
    const payload = {
      app: 'Recall',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      counts: {
        memories: memories.length,
        actions: actions.length,
        calls: memories.filter((m) => m.type === 'call').length,
      },
      memories,
      actions,
    };
    return JSON.stringify(payload, null, 2);
  }

  private async persistMemories(): Promise<void> {
    if (this.memoriesCache) {
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(this.memoriesCache));
      } catch (err) {
        console.warn('Failed to persist memories', err);
      }
    }
  }

  private async persistActions(): Promise<void> {
    if (this.actionsCache) {
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.ACTIONS, JSON.stringify(this.actionsCache));
      } catch (err) {
        console.warn('Failed to persist actions', err);
      }
    }
  }
}

export const memoryRepository = new MemoryRepository();

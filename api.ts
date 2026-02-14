import { Slot } from './types';

// Hoja de cálculo vinculada: https://docs.google.com/spreadsheets/d/14KfjdaZHvJlBzjJkz4cw8j46LmqOWUE4G-6xpD5UnV4/edit
const API_URL = 'https://script.google.com/macros/s/AKfycbyGkroW4NnNLJCFlgNT0rmR4jGsrtpvcBcQCngEnhjZNJVFsiFkMnXA9hvjIurv45VR/exec'; 

export const api = {
  async getSlots(): Promise<Slot[]> {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error obteniendo horarios:", error);
      return [];
    }
  },

  async followUp(slotId: string, followUpDone: boolean, needsReinforcement: boolean, followUpStep?: string) {
    await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'followUp', slotId, followUpDone, needsReinforcement, followUpStep }),
    });
  },

  async addSlot(slot: Slot) {
    await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'add', ...slot }),
    });
  },

  async bookSlot(slotId: string, userName: string, reason: string) {
    await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'book', slotId, userName, reason }),
    });
  },

  async addSupport(slotId: string, supportLeader: string) {
    await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'addSupport', slotId, supportLeader }),
    });
  },

  async updateFollowUp(slotId: string, patch: { followUpDone?: boolean; needsReinforcement?: boolean; followUpStep?: string }) {
    await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'updateFollowUp', slotId, ...patch }),
    });
  },

  async deleteSlot(slotId: string) {
    await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'delete', slotId }),
    });
  }
};

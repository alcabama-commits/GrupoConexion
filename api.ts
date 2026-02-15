import { Slot } from './types';

// Hoja de cálculo vinculada: https://docs.google.com/spreadsheets/d/14KfjdaZHvJlBzjJkz4cw8j46LmqOWUE4G-6xpD5UnV4/edit
// Estructura de columnas:
// A: Responsable, B: Fecha, C: Hora, D: Usuario, E: Motivos, F: Apoyo, G: Seguimiento, H: Refuerzo, I: Paso, J: (Vacio), K: ID, L: StartTime, M: EndTime
const API_URL = 'https://script.google.com/macros/s/AKfycbxjhTTsuGDZw_VlpuiWZ1yB0m6GXFxDtuck14X63zmsk3smdYNuKYBm-dNQ7kgwckz0/exec'; 

export const api = {
  async getSlots(): Promise<Slot[]> {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      try {
        const raw = localStorage.getItem('slot_time_map');
        const map: Record<string, { startTime: string; endTime: string }> = raw ? JSON.parse(raw) : {};
        return (data as Slot[]).map(s => {
          const hasValid = s.startTime && !Number.isNaN(Date.parse(s.startTime));
          if (!hasValid && map[s.id]) {
            return { ...s, startTime: map[s.id].startTime, endTime: map[s.id].endTime };
          }
          return s;
        });
      } catch {
        return data;
      }
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

  async bookSlot(slotId: string, userName: string, reason: string, startTime?: string, endTime?: string) {
    await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'book', slotId, userName, reason, startTime, endTime }),
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

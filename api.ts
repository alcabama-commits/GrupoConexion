import { Slot } from './types';

// ¡IMPORTANTE! Reemplaza esta URL con la que copiaste de Google Apps Script
const API_URL = 'https://script.google.com/macros/s/AKfycbyrSXFpoFu6NafDfnI7znDoQJKx1GZ720WHSrll2bqz9tJNiHqTutPqsFrwGFpvucyH/exec'; 

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

  async deleteSlot(slotId: string) {
    await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'delete', slotId }),
    });
  }
};
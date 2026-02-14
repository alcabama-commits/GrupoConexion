
export interface Slot {
  id: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  isBooked: boolean;
  bookedBy?: string;
  reason?: string;
  ministerName: string;
  supportLeader?: string;
  followUpDone?: boolean;
  followUpNotes?: string;
  needsReinforcement?: boolean;
  taskAssigned?: boolean;
  taskText?: string;
}

export interface BookingRequest {
  slotId: string;
  userName: string;
  reason: string;
}

export enum AppMode {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export const MINISTERS = [
  'Camilo Martinez',
  'Willmer Chisco',
  'Jhon Botton',
  'Diana Acosta',
  'Andrea Acosta',
  'Mayerly Carrero'
] as const;

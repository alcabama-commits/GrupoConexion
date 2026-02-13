
export interface Slot {
  id: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  isBooked: boolean;
  bookedBy?: string;
  reason?: string;
  ministerName: string;
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

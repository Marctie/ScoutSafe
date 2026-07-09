import { Injectable } from '@angular/core';
import { ScoutSession } from '../models/session.model';

const STORAGE_KEY = 'scoutsafe_sessions';

@Injectable({ providedIn: 'root' })
export class SessionService {

  private readAll(): ScoutSession[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      return (JSON.parse(raw) as ScoutSession[]).map(s => ({
        ...s,
        createdAt: new Date(s.createdAt)
      }));
    } catch {
      return [];
    }
  }

  private writeAll(sessions: ScoutSession[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }

  async saveSession(session: Omit<ScoutSession, 'id'>): Promise<string> {
    const sessions = this.readAll();
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    sessions.push({ ...session, id });
    this.writeAll(sessions);
    return id;
  }

  async getUserSessions(userId: string): Promise<ScoutSession[]> {
    return this.readAll()
      .filter(s => s.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async deleteSession(id: string): Promise<void> {
    this.writeAll(this.readAll().filter(s => s.id !== id));
  }
}

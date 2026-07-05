import { Injectable } from '@angular/core';
import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore, collection, addDoc, getDocs, deleteDoc, doc,
  query, where, orderBy, Firestore, Timestamp
} from 'firebase/firestore';
import { environment } from '../../environments/environment';
import { ScoutSession } from '../models/session.model';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private db: Firestore;

  constructor() {
    const app = getApps().length > 0 ? getApps()[0] : initializeApp(environment.firebase);
    this.db = getFirestore(app);
  }

  async saveSession(session: Omit<ScoutSession, 'id'>): Promise<string> {
    const ref = await addDoc(collection(this.db, 'sessions'), {
      ...session,
      createdAt: Timestamp.fromDate(session.createdAt)
    });
    return ref.id;
  }

  async getUserSessions(userId: string): Promise<ScoutSession[]> {
    const q = query(
      collection(this.db, 'sessions'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => {
      const data = d.data();
      return {
        ...data,
        id: d.id,
        createdAt: (data['createdAt'] as Timestamp).toDate()
      } as ScoutSession;
    });
  }

  async deleteSession(id: string): Promise<void> {
    await deleteDoc(doc(this.db, 'sessions', id));
  }
}

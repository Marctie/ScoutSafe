import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface LocalUser {
  uid: string;
  email: string;
}

// Credenziali di accesso locali (nessun backend).
// ATTENZIONE: essendo il sito pubblico, chiunque può leggerle nel codice.
const VALID_CREDENTIALS = [
  { email: 'marcopeluso99@gmail.com', password: 'Dicembre99!' }
];

const STORAGE_KEY = 'scoutsafe_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<LocalUser | null>(this.restore());

  currentUser$: Observable<LocalUser | null> = this.currentUserSubject.asObservable();

  get currentUser(): LocalUser | null {
    return this.currentUserSubject.value;
  }

  private restore(): LocalUser | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) as LocalUser : null;
    } catch {
      return null;
    }
  }

  async login(email: string, password: string): Promise<LocalUser> {
    const match = VALID_CREDENTIALS.find(
      c => c.email.toLowerCase() === email.trim().toLowerCase() && c.password === password
    );
    if (!match) {
      throw { code: 'auth/wrong-password' };
    }
    const user: LocalUser = { uid: match.email, email: match.email };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
    return user;
  }

  async register(_email: string, _password: string): Promise<never> {
    throw { code: 'auth/registration-disabled' };
  }

  async logout(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY);
    this.currentUserSubject.next(null);
  }
}

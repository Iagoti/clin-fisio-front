import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { LoginResponse } from '../../models/login/LoginResponse';
import { environment } from '../../../environment';
import { LoginRequest } from '../../models/login/LoginRequest';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

function getJwtPayload(token: string): { exp?: number } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(json) as { exp?: number };
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string | null): boolean {
  if (!token) return true;
  const payload = getJwtPayload(token);
  if (!payload?.exp) return true;
  const nowSec = Math.floor(Date.now() / 1000);
  return payload.exp < nowSec;
}

export const TP_USUARIO_ADMIN = 1;

export interface AuthUser {
  tpUsuario: number;
  cdUsuario: number;
  nmUsuario: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private platformId = inject(PLATFORM_ID);

  isAuthenticated = signal<boolean>(false);

  constructor(private http: HttpClient) {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token && isTokenExpired(token)) {
        this.logout();
      } else {
        this.isAuthenticated.set(!!token);
      }
    }
  }

  private get storage(): Storage | null {
    return isPlatformBrowser(this.platformId) ? localStorage : null;
  }

  login(payload: LoginRequest) {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, payload).pipe(
      tap((res) => {
        this.storage?.setItem(TOKEN_KEY, res.token);
        this.storage?.setItem(USER_KEY, JSON.stringify({
          tpUsuario: res.tpUsuario,
          cdUsuario: res.cdUsuario,
          nmUsuario: res.nmUsuario,
        }));
        this.isAuthenticated.set(true);
      })
    );
  }

  logout() {
    this.storage?.removeItem(TOKEN_KEY);
    this.storage?.removeItem(USER_KEY);
    this.isAuthenticated.set(false);
  }

  getToken(): string | null {
    const token = this.storage?.getItem(TOKEN_KEY) ?? null;
    if (token && isTokenExpired(token)) {
      this.logout();
      return null;
    }
    return token;
  }

  getCurrentUser(): AuthUser | null {
    const raw = this.storage?.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.tpUsuario === TP_USUARIO_ADMIN;
  }
}
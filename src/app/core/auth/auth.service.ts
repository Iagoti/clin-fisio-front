import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { LoginResponse } from '../../models/login/LoginResponse';
import { environment } from '../../../environment';
import { LoginRequest } from '../../models/login/LoginRequest';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private platformId = inject(PLATFORM_ID);

  isAuthenticated = signal<boolean>(false);

  constructor(private http: HttpClient) {
    if (isPlatformBrowser(this.platformId)) {
      this.isAuthenticated.set(!!localStorage.getItem(TOKEN_KEY));
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
    return this.storage?.getItem(TOKEN_KEY) ?? null;
  }
}
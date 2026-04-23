import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, tap, catchError, of, delay } from 'rxjs';
import { User, LoginCredentials, RegisterCredentials, AuthResponse } from '../models/user.model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'tradeflow_auth_token';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private router: Router, private http: HttpClient) {
    this.loadUserFromToken();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    // Relaxed Login: Accept any credentials with password > 3 chars
    if (credentials.password && credentials.password.length >= 3) {
      const mockUser: User = { 
        id: 'u' + Math.random().toString(36).substr(2, 5), 
        email: credentials.email, 
        firstName: credentials.email.split('@')[0], 
        lastName: 'User' 
      };
      
      const exp = Math.floor(Date.now() / 1000) + (60 * 60); // 1 hour expiry
      const payloadStr = JSON.stringify({id:mockUser.id, email:mockUser.email, firstName:mockUser.firstName, exp: exp});
      
      const mockToken = btoa(JSON.stringify({alg:"HS256",typ:"JWT"})) + '.' + 
                        btoa(unescape(encodeURIComponent(payloadStr))) + '.signature';
      const response: AuthResponse = { token: mockToken, user: mockUser };
      
      return of(response).pipe(
        delay(800),
        tap(r => this.handleAuthentication(r.token, r.user))
      );
    } else {
      return of(null as any).pipe(
        delay(500),
        tap(() => { throw new Error('Password too short (min 3 chars)'); })
      );
    }
  }

  register(credentials: RegisterCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, credentials).pipe(
      tap(response => this.handleAuthentication(response.token, response.user))
    );
  }

  loginWithGoogle(): void {
    // Mock Google Login flow
    const mockUser: User = { id: 'g123', email: 'google.user@example.com', firstName: 'Google', lastName: 'User' };
    const mockToken = 'mock-jwt-google-tk987654';
    this.handleAuthentication(mockToken, mockUser);
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private handleAuthentication(token: string, user: User): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.currentUserSubject.next(user);
  }

  private loadUserFromToken(): void {
    const token = this.getToken();
    if (token) {
      try {
        const payloadStr = decodeURIComponent(escape(atob(token.split('.')[1])));
        const payload = JSON.parse(payloadStr);
        
        // Expiry check
        if (payload.exp && payload.exp < (Date.now() / 1000)) {
           throw new Error('Token expired');
        }

        const user: User = { id: payload.id, email: payload.email, firstName: payload.firstName || 'User', lastName: payload.lastName || '', role: 'user' };
        this.currentUserSubject.next(user);
      } catch (e) {
        this.logout();
      }
    }
  }
}

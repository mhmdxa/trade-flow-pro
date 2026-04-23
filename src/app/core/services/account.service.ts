import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface TradingAccount {
  id: string;
  name: string;
  balance: number;
  type: 'demo' | 'real' | 'funded';
  currency: string;
  isDefault: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private readonly STORAGE_KEY = 'tradeflow_accounts';
  private readonly ACTIVE_KEY = 'tradeflow_active_account_id';

  private defaultAccounts: TradingAccount[] = [
    { id: 'acc_1', name: 'Master Funded Account', balance: 100000, type: 'funded', currency: 'USD', isDefault: true },
    { id: 'acc_2', name: 'Personal Demo', balance: 50000, type: 'demo', currency: 'USD', isDefault: false }
  ];

  private accountsSubject = new BehaviorSubject<TradingAccount[]>(this.loadAccounts());
  public accounts$ = this.accountsSubject.asObservable();

  private activeAccountIdSubject = new BehaviorSubject<string>(localStorage.getItem(this.ACTIVE_KEY) || 'acc_1');
  public activeAccountId$ = this.activeAccountIdSubject.asObservable();

  constructor() {
    if (this.accountsSubject.value.length === 0) {
      this.saveAccounts(this.defaultAccounts);
    }
  }

  private loadAccounts(): TradingAccount[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private saveAccounts(accounts: TradingAccount[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(accounts));
    this.accountsSubject.next(accounts);
  }

  getAccounts(): Observable<TradingAccount[]> {
    return this.accounts$;
  }

  addAccount(account: Omit<TradingAccount, 'id'>): Observable<TradingAccount> {
    const accounts = this.accountsSubject.value;
    const newAccount = { ...account, id: 'acc_' + Math.random().toString(36).substr(2, 5) };
    const updated = [...accounts, newAccount];
    this.saveAccounts(updated);
    return of(newAccount).pipe(delay(300));
  }

  deleteAccount(id: string): Observable<boolean> {
    const accounts = this.accountsSubject.value;
    if (accounts.length <= 1) return of(false); // keep at least one
    const updated = accounts.filter(a => a.id !== id);
    this.saveAccounts(updated);
    if (this.activeAccountIdSubject.value === id) {
       this.setActiveAccount(updated[0].id);
    }
    return of(true).pipe(delay(300));
  }

  setActiveAccount(id: string): void {
    localStorage.setItem(this.ACTIVE_KEY, id);
    this.activeAccountIdSubject.next(id);
  }

  setCurrentAccount(id: string): void {
    this.setActiveAccount(id);
  }

  getActiveAccount(): TradingAccount | undefined {
    return this.accountsSubject.value.find(a => a.id === this.activeAccountIdSubject.value);
  }
}

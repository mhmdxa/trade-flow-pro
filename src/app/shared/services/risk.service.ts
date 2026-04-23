import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';

export interface RiskSettings {
  initialBalance: number;
  dailyLossLimitPercent: number;
  maxDrawdownLimitPercent: number;
  riskPerTradePercent: number;
  pointValue: number;
}

@Injectable({
  providedIn: 'root'
})
export class RiskService {
  private readonly STORAGE_KEY = 'tradeflow_risk_settings';
  
  private defaultSettings: RiskSettings = {
    initialBalance: 100000,
    dailyLossLimitPercent: 5,
    maxDrawdownLimitPercent: 10,
    riskPerTradePercent: 1,
    pointValue: 10
  };

  private settingsSubject = new BehaviorSubject<RiskSettings>(this.loadFromLocalStorage());
  public settings$ = this.settingsSubject.asObservable();

  constructor() {}

  private loadFromLocalStorage(): RiskSettings {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : this.defaultSettings;
  }

  private saveToLocalStorage(settings: RiskSettings): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
    this.settingsSubject.next(settings);
  }

  getSettings(): RiskSettings {
    return this.settingsSubject.value;
  }

  updateSettings(settings: RiskSettings): Observable<RiskSettings> {
    const updated = { ...this.settingsSubject.value, ...settings };
    this.saveToLocalStorage(updated);
    return of(updated).pipe(delay(200));
  }

  calculateLots(balance: number, stopLossPips: number): number {
    const settings = this.getSettings();
    const riskAmount = balance * (settings.riskPerTradePercent / 100);
    if (!stopLossPips || stopLossPips === 0 || !settings.pointValue) return 0;
    
    const lots = riskAmount / (stopLossPips * settings.pointValue);
    return Number(lots.toFixed(2));
  }

  resetToDefault(): void {
    this.saveToLocalStorage(this.defaultSettings);
  }
}

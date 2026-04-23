import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Strategy {
  id: string;
  name: string;
  type: 'Scalping' | 'Daytrading' | 'Swing';
  timeframe: string;
  indicators: string;
  entryRules: string;
  exitRules: string;
  riskReward?: string;
  winRate?: number;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StrategyService {
  private readonly STORAGE_KEY = 'tradeflow_strategies';

  private defaultStrategies: Strategy[] = [
    {
      id: 'strat_1',
      name: 'Golden Cross Breakout',
      type: 'Daytrading',
      timeframe: 'H1',
      indicators: 'EMA 50, EMA 200, RSI 14, Volume',
      entryRules: 'EMA 50 crosses above EMA 200, RSI > 50, Volume spike on candle close',
      exitRules: 'RSI > 70 or -1.5R stop loss hit',
      riskReward: '1:2',
      winRate: 62,
      notes: 'Best on London & NY sessions'
    },
    {
      id: 'strat_2',
      name: 'Structure Reversal',
      type: 'Swing',
      timeframe: 'H4',
      indicators: 'Support/Resistance, MACD, Fibonacci',
      entryRules: 'Price rejects key S/R level, MACD histogram turns positive, Fib 61.8% retracement',
      exitRules: 'Previous swing high/low target or -1R SL',
      riskReward: '1:3',
      winRate: 55,
      notes: 'Avoid during major news events'
    }
  ];

  private strategiesSubject = new BehaviorSubject<Strategy[]>(this.loadFromLocalStorage());
  public strategies$ = this.strategiesSubject.asObservable();

  constructor() {
    if (this.strategiesSubject.value.length === 0) {
      this.saveToLocalStorage(this.defaultStrategies);
    }
  }

  private loadFromLocalStorage(): Strategy[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private saveToLocalStorage(strategies: Strategy[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(strategies));
    this.strategiesSubject.next(strategies);
  }

  getStrategies(): Observable<Strategy[]> {
    return this.strategies$;
  }

  addStrategy(strategy: Partial<Strategy>): void {
    const strategies = this.strategiesSubject.value;
    const newStrategy: Strategy = {
      ...strategy as Strategy,
      id: 'strat_' + Math.random().toString(36).substr(2, 9)
    };
    this.saveToLocalStorage([...strategies, newStrategy]);
  }

  updateStrategy(id: string, updatedStrategy: Partial<Strategy>): void {
    const strategies = this.strategiesSubject.value;
    const index = strategies.findIndex(s => s.id === id);
    if (index > -1) {
      strategies[index] = { ...strategies[index], ...updatedStrategy, id };
      this.saveToLocalStorage([...strategies]);
    }
  }

  deleteStrategy(id: string): void {
    const strategies = this.strategiesSubject.value;
    this.saveToLocalStorage(strategies.filter(s => s.id !== id));
  }
}

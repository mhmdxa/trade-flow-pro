import { Injectable, SecurityContext } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { map, tap, delay } from 'rxjs/operators';
import { RiskService } from './risk.service';
import { DomSanitizer } from '@angular/platform-browser';

export interface Trade {
  id: string;
  date: string;
  symbol: string;
  type: 'Buy' | 'Sell';
  lots: number;
  entryPrice: number;
  exitPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
  pnl?: number;
  notes?: string;
  accountId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TradeService {
  private readonly STORAGE_KEY = 'tradeflow_trades';
  private tradesSubject = new BehaviorSubject<Trade[]>(this.loadFromLocalStorage());
  public trades$ = this.tradesSubject.asObservable();

  public currentBalance$: Observable<number>;
  public dailyLoss$: Observable<number>;
  public isDailyLossExceeded$: Observable<boolean>;
  public isDrawdownExceeded$: Observable<boolean>;
  public highestBalance = 0;

  constructor(private riskService: RiskService, private sanitizer: DomSanitizer) {
    this.currentBalance$ = this.trades$.pipe(
      map(trades => {
        const settings = this.riskService.getSettings();
        const initial = settings.initialBalance;
        const totalPnl = trades.reduce((sum, t) => sum + (t.pnl || 0), 0);
        const current = initial + totalPnl;
        if(current > this.highestBalance) this.highestBalance = current;
        return current;
      })
    );

    this.dailyLoss$ = this.trades$.pipe(
      map(trades => {
        const today = new Date().toDateString();
        return trades
           .filter(t => new Date(t.date).toDateString() === today && t.pnl !== undefined && t.pnl < 0)
           .reduce((sum, t) => sum + Math.abs(t.pnl!), 0);
      })
    );

    this.isDailyLossExceeded$ = combineLatest([this.dailyLoss$, this.riskService.settings$]).pipe(
      map(([loss, settings]) => {
        const allowedLoss = settings.initialBalance * (settings.dailyLossLimitPercent / 100);
        return loss >= allowedLoss;
      })
    );

    this.isDrawdownExceeded$ = combineLatest([this.currentBalance$, this.riskService.settings$]).pipe(
      map(([balance, settings]) => {
        const maxDdAmount = settings.initialBalance * (settings.maxDrawdownLimitPercent / 100);
        return (this.highestBalance - balance) >= maxDdAmount;
      })
    );
  }

  private loadFromLocalStorage(): Trade[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private saveToLocalStorage(trades: Trade[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trades));
    this.tradesSubject.next(trades);
  }

  getTrades(): Observable<Trade[]> {
    return this.trades$;
  }

  addTrade(trade: Trade): Observable<Trade> {
    const trades = this.tradesSubject.value;
    trade.id = Math.random().toString(36).substr(2, 9);
    trade.pnl = this.calculatePnl(trade);
    if (trade.notes) {
      trade.notes = this.sanitizer.sanitize(SecurityContext.HTML, trade.notes) || '';
    }
    const updated = [...trades, trade];
    this.saveToLocalStorage(updated);
    return of(trade).pipe(delay(200));
  }

  updateTrade(id: string, updatedData: Partial<Trade>): Observable<Trade> {
    const trades = this.tradesSubject.value;
    const index = trades.findIndex(t => t.id === id);
    if (index > -1) {
      if (updatedData.notes) {
        updatedData.notes = this.sanitizer.sanitize(SecurityContext.HTML, updatedData.notes) || '';
      }
      const updatedTrade = { ...trades[index], ...updatedData };
      updatedTrade.pnl = this.calculatePnl(updatedTrade);
      trades[index] = updatedTrade;
      this.saveToLocalStorage([...trades]);
      return of(updatedTrade).pipe(delay(200));
    }
    throw new Error('Trade not found');
  }

  deleteTrade(id: string): Observable<boolean> {
    const trades = this.tradesSubject.value;
    const filtered = trades.filter(t => t.id !== id);
    this.saveToLocalStorage(filtered);
    return of(true).pipe(delay(200));
  }

  importTrades(trades: Trade[]): void {
    const current = this.tradesSubject.value;
    this.saveToLocalStorage([...current, ...trades]);
  }

  clearAll(): void {
    this.saveToLocalStorage([]);
  }

  private calculatePnl(trade: Trade): number | undefined {
    if (trade.exitPrice === undefined || trade.exitPrice === null) return undefined;
    const multi = trade.symbol.includes('USD') && !trade.symbol.includes('XAU') && !trade.symbol.includes('BTC') && !trade.symbol.includes('US30') ? 100000 : 
                  trade.symbol.includes('XAU') ? 100 : 
                  trade.symbol.includes('BTC') ? 1 : 1;

    let pnl = 0;
    if (trade.type === 'Buy') {
      pnl = (trade.exitPrice - trade.entryPrice) * trade.lots * multi;
    } else {
      pnl = (trade.entryPrice - trade.exitPrice) * trade.lots * multi;
    }
    return Number(pnl.toFixed(2));
  }
}

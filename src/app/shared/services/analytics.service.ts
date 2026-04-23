import { Injectable } from '@angular/core';
import { TradeService, Trade } from './trade.service';
import { RiskService } from './risk.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  constructor(private tradeService: TradeService, private riskService: RiskService) {}

  getTradesWithPnl(): Observable<Trade[]> {
    return this.tradeService.trades$.pipe(
      map(trades => trades.filter(t => t.pnl !== undefined))
    );
  }

  getWinRate(): Observable<number> {
    return this.getTradesWithPnl().pipe(
      map(trades => {
        if (trades.length === 0) return 0;
        const wins = trades.filter(t => t.pnl! > 0).length;
        return (wins / trades.length) * 100;
      })
    );
  }

  getProfitFactor(): Observable<number> {
    return this.getTradesWithPnl().pipe(
      map(trades => {
        const grossProfit = trades.filter(t => t.pnl! > 0).reduce((sum, t) => sum + t.pnl!, 0);
        const grossLoss = Math.abs(trades.filter(t => t.pnl! < 0).reduce((sum, t) => sum + t.pnl!, 0));
        return grossLoss === 0 ? grossProfit : grossProfit / grossLoss;
      })
    );
  }

  getAverageWinLoss(): Observable<{avgWin: number, avgLoss: number}> {
    return this.getTradesWithPnl().pipe(
      map(trades => {
        const wins = trades.filter(t => t.pnl! > 0);
        const losses = trades.filter(t => t.pnl! < 0);
        const avgWin = wins.length > 0 ? wins.reduce((sum, t) => sum + t.pnl!, 0) / wins.length : 0;
        const avgLoss = losses.length > 0 ? Math.abs(losses.reduce((sum, t) => sum + t.pnl!, 0)) / losses.length : 0;
        return { avgWin, avgLoss };
      })
    );
  }

  getMaxConsecutiveLosses(): Observable<number> {
    return this.getTradesWithPnl().pipe(
      map(trades => {
        let maxConsLosses = 0;
        let currentConsLosses = 0;
        // Search chronologically (trades represent latest first, so reverse to read past to present)
        [...trades].reverse().forEach(t => {
          if (t.pnl! < 0) {
            currentConsLosses++;
            if (currentConsLosses > maxConsLosses) maxConsLosses = currentConsLosses;
          } else if (t.pnl! > 0) {
            currentConsLosses = 0;
          }
        });
        return maxConsLosses;
      })
    );
  }

  getSharpeRatio(): Observable<number> {
    return this.getTradesWithPnl().pipe(
      map(trades => {
        if (trades.length === 0) return 0;
        const returns = trades.map(t => t.pnl!);
        const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
        const variance = returns.reduce((sum, val) => sum + Math.pow(val - avgReturn, 2), 0) / returns.length;
        const stdev = Math.sqrt(variance);
        // Assuming Risk Free Rate = 0 for simplicity
        return stdev === 0 ? 0 : avgReturn / stdev;
      })
    );
  }

  getExpectancy(): Observable<number> {
    return this.getTradesWithPnl().pipe(
      map(trades => {
        if (trades.length === 0) return 0;
        const winProb = trades.filter(t => t.pnl! > 0).length / trades.length;
        const lossProb = trades.filter(t => t.pnl! < 0).length / trades.length;
        
        const wins = trades.filter(t => t.pnl! > 0);
        const avgWin = wins.length > 0 ? wins.reduce((sum, t) => sum + t.pnl!, 0) / wins.length : 0;
        
        const losses = trades.filter(t => t.pnl! < 0);
        const avgLoss = losses.length > 0 ? Math.abs(losses.reduce((sum, t) => sum + t.pnl!, 0)) / losses.length : 0;
        
        return (winProb * avgWin) - (lossProb * avgLoss);
      })
    );
  }

  getAverageRMultiple(): Observable<number> {
    // Mock mapping for Average R-Multiple (Assuming $100 risk per trade avg for mock purposes)
    return this.getTradesWithPnl().pipe(
      map(trades => {
        if (trades.length === 0) return 0;
        const initialBalance = this.riskService.getSettings().initialBalance;
        const riskPct = this.riskService.getSettings().riskPerTradePercent;
        const riskAmount = initialBalance * (riskPct / 100);
        
        const rMultiples = trades.map(t => t.pnl! / riskAmount);
        return rMultiples.reduce((a, b) => a + b, 0) / rMultiples.length;
      })
    );
  }

  getPerformanceByDayOfWeek(): Observable<{day: string, profit: number}[]> {
    return this.getTradesWithPnl().pipe(
      map(trades => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const result = days.map(d => ({day: d, profit: 0}));
        
        trades.forEach(t => {
          const date = new Date(t.date);
          result[date.getDay()].profit += t.pnl!;
        });
        
        return result.filter(d => d.day !== 'Sunday' && d.day !== 'Saturday'); // Usually focus on weekdays 
      })
    );
  }

  getPerformanceBySession(): Observable<{session: string, profit: number}[]> {
    return this.getTradesWithPnl().pipe(
      map(trades => {
        const result = { Asia: 0, London: 0, NewYork: 0 };
        
        trades.forEach(t => {
          const hours = new Date(t.date).getHours();
          if (hours >= 0 && hours < 8) result.Asia += t.pnl!;
          else if (hours >= 8 && hours < 13) result.London += t.pnl!;
          else result.NewYork += t.pnl!;
        });
        
        return [
          { session: 'Asia', profit: result.Asia },
          { session: 'London', profit: result.London },
          { session: 'New York', profit: result.NewYork }
        ];
      })
    );
  }

  getPerformanceBySymbol(): Observable<{symbol: string, profit: number}[]> {
    return this.getTradesWithPnl().pipe(
      map(trades => {
        const mapCount: Record<string, number> = {};
        trades.forEach(t => {
          mapCount[t.symbol] = (mapCount[t.symbol] || 0) + t.pnl!;
        });
        return Object.keys(mapCount).map(k => ({ symbol: k, profit: mapCount[k] }));
      })
    );
  }

  getBestWorstTrades(): Observable<{best: Trade[], worst: Trade[]}> {
    return this.getTradesWithPnl().pipe(
      map(trades => {
        const sorted = [...trades].sort((a, b) => b.pnl! - a.pnl!);
        return {
          best: sorted.slice(0, 5),
          worst: [...sorted].reverse().slice(0, 5)
        };
      })
    );
  }
}

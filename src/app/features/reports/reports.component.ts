import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService } from '../../shared/services/report.service';
import { TradeService, Trade } from '../../shared/services/trade.service';
import { AnalyticsService } from '../../shared/services/analytics.service';
import { LucideAngularModule, Download, FileText, FileSpreadsheet, Eye, Calendar } from 'lucide-angular';
import { Observable, BehaviorSubject, combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './reports.component.html'
})
export class ReportsComponent implements OnInit {
  trades: Trade[] = [];
  
  // Preview stats
  previewTrades$!: Observable<Trade[]>;
  stats$!: Observable<any>;
  
  filterType = new BehaviorSubject<'week'|'month'>('week');
  isGenerating = false;
  
  readonly icons = { Download, FileText, FileSpreadsheet, Eye, Calendar };

  constructor(
    private reportService: ReportService,
    private tradeService: TradeService,
    private analyticsService: AnalyticsService
  ) {
    this.tradeService.getTrades().subscribe(t => this.trades = t);
  }

  ngOnInit(): void {
    this.previewTrades$ = combineLatest([this.tradeService.getTrades(), this.filterType]).pipe(
      map(([trades, type]) => {
        const now = new Date();
        if (type === 'week') {
          const sunday = new Date(now);
          sunday.setDate(now.getDate() - now.getDay());
          sunday.setHours(0,0,0,0);
          return trades.filter(t => new Date(t.date) >= sunday);
        } else {
          return trades.filter(t => {
            const d = new Date(t.date);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
          });
        }
      })
    );

    this.stats$ = this.previewTrades$.pipe(
      map(trades => {
        const pnl = trades.reduce((sum, t) => sum + (t.pnl || 0), 0);
        const wins = trades.filter(t => (t.pnl || 0) > 0);
        const losses = trades.filter(t => (t.pnl || 0) < 0);
        
        const winRate = trades.length > 0 ? (wins.length / trades.length * 100) : 0;
        
        const grossProfit = wins.reduce((sum, t) => sum + (t.pnl || 0), 0);
        const grossLoss = Math.abs(losses.reduce((sum, t) => sum + (t.pnl || 0), 0));
        const pf = grossLoss === 0 ? grossProfit : grossProfit / grossLoss;

        return {
          count: trades.length,
          pnl,
          winRate,
          pf,
          grossProfit,
          grossLoss
        };
      })
    );
  }

  setFilter(type: 'week'|'month'): void {
    this.filterType.next(type);
  }

  async generateWeeklyPdf(): Promise<void> {
    this.isGenerating = true;
    const today = new Date();
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - today.getDay());
    sunday.setHours(0,0,0,0);
    
    try {
      const blob = await this.reportService.generateWeeklyReport(sunday, this.trades);
      this.downloadBlob(blob, 'TradeFlow_Weekly_Report.pdf');
    } finally {
      this.isGenerating = false;
    }
  }

  async generateMonthlyPdf(): Promise<void> {
    this.isGenerating = true;
    const today = new Date();
    try {
      const blob = await this.reportService.generateMonthlyReport(today.getMonth(), today.getFullYear(), this.trades);
      this.downloadBlob(blob, 'TradeFlow_Monthly_Report.pdf');
    } finally {
      this.isGenerating = false;
    }
  }

  exportAllDataExcel(): void {
    this.reportService.exportToExcel(this.trades);
  }

  private downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
